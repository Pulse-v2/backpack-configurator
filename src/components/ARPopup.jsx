import React, { useState, useEffect } from 'react';
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
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return /android|iphone|ipad|ipod/i.test(userAgent);
    };
    setIsMobile(checkMobile());
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasCameraPermission(true);
      return true;
    } catch (error) {
      console.error('Помилка доступу до камери:', error);
      alert('Будь ласка, надайте дозвіл на використання камери для AR функціоналу');
      return false;
    }
  };

  const handleARClick = async () => {
    if (!isMobile) return;
    
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const modelViewer = document.querySelector('model-viewer');
    if (modelViewer) {
      modelViewer.activateAR();
    }
  };

  const currentUrl = window.location.origin;
  const arUrl = `${currentUrl}?ar=true&material=${config.material}&color=${config.color}&hardware=${config.hardware}`;

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>View in AR</h2>
        <ConfigInfo>
          Current configuration:
          <br />
          Material: {config.material}
          <br />
          Color: {config.color}
          <br />
          Hardware: {config.hardware}
        </ConfigInfo>
        
        {isMobile ? (
          <>
            <ModelViewerContainer>
              <model-viewer
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
                <ARButton slot="ar-button" onClick={handleARClick}>
                  View in your space
                </ARButton>
              </model-viewer>
            </ModelViewerContainer>
            {!hasCameraPermission && (
              <Instructions>
                Натисніть "View in your space" щоб отримати доступ до камери
              </Instructions>
            )}
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