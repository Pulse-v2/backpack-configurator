import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import BackpackViewer from './components/BackpackViewer';
import Controls from './components/Controls';
import ARPopup from './components/ARPopup';

// Global styles
const GlobalStyle = createGlobalStyle`
  model-viewer {
    --poster-color: transparent;
    --progress-bar-color: #007bff;
    --progress-bar-height: 2px;
  }
`;

// Styled components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 2rem;
  flex: 1;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
`;

function App() {
  const [config, setConfig] = useState({
    material: 'denim',
    color: 'brown',
    hardware: 'silver'
  });
  const [showARPopup, setShowARPopup] = useState(false);

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AppContainer>
      <GlobalStyle />
      <MainContent>
        <Title>Backpack Configurator</Title>
        <BackpackViewer config={config} />
        <Controls 
          config={config} 
          onConfigChange={handleConfigChange}
          onARClick={() => setShowARPopup(true)}
        />
        {showARPopup && (
          <ARPopup 
            onClose={() => setShowARPopup(false)}
            config={config}
          />
        )}
      </MainContent>
    </AppContainer>
  );
}

export default App; 