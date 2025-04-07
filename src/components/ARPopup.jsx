import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import QRCode from 'qrcode.react';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 90%;
  width: 400px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
`;

const QRContainer = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: white;
  border-radius: 4px;
  display: inline-block;
`;

const Instructions = styled.p`
  margin: 1rem 0;
  color: #666;
`;

const ConfigInfo = styled.div`
  margin: 1rem 0;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #666;
`;

const ModelViewerContainer = styled.div`
  width: 100%;
  height: 400px;
  margin: 1rem 0;
`;

const ARButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 1rem;
  
  &:hover {
    background-color: #0056b3;
  }
`;

function ARPopup({ onClose, config }) {
  const [isMobile, setIsMobile] = useState(false);
  const modelViewerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return /android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    };
    setIsMobile(checkMobile());
  }, []);

  const handleARButtonClick = async () => {
    if (!modelViewerRef.current) return;
    
    try {
      // Перевіряємо чи підтримується AR
      if (modelViewerRef.current.canActivateAR) {
        await modelViewerRef.current.activateAR();
      } else {
        alert('AR не підтримується на вашому пристрої');
      }
    } catch (error) {
      console.error('Помилка при активації AR:', error);
      alert('Виникла помилка при спробі запустити AR');
    }
  };

  const currentUrl = window.location.origin;
  const arUrl = `${currentUrl}?ar=true&material=${config.material}&color=${config.color}&hardware=${config.hardware}`;

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>Перегляд в AR</h2>
        <ConfigInfo>
          Поточна конфігурація:
          <br />
          Матеріал: {config.material}
          <br />
          Колір: {config.color}
          <br />
          Фурнітура: {config.hardware}
        </ConfigInfo>
        
        {isMobile ? (
          <>
            <ModelViewerContainer>
              <model-viewer
                ref={modelViewerRef}
                src="/models/backpack.glb"
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                environment-image="neutral"
                shadow-intensity="1"
                exposure="1"
                auto-rotate
                style={{ width: '100%', height: '100%' }}
              >
                <ARButton 
                  slot="ar-button"
                  onClick={handleARButtonClick}
                >
                  Переглянути в AR
                </ARButton>
              </model-viewer>
            </ModelViewerContainer>
            <Instructions>
              Натисніть "Переглянути в AR" щоб побачити рюкзак у доповненій реальності
            </Instructions>
          </>
        ) : (
          <>
            <QRContainer>
              <QRCode 
                value={arUrl} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </QRContainer>
            <Instructions>
              Відскануйте QR-код мобільним пристроєм для перегляду в AR
            </Instructions>
          </>
        )}
      </PopupContent>
    </PopupOverlay>
  );
}

export default ARPopup; 