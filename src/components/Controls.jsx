import React from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: #333;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const ARButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

function Controls({ config, onConfigChange, onARClick }) {
  return (
    <ControlsContainer>
      <ControlGroup>
        <Label>Material</Label>
        <Select
          value={config.material}
          onChange={(e) => onConfigChange('material', e.target.value)}
        >
          <option value="denim">Denim</option>
          <option value="fabric">Fabric</option>
          <option value="leather">Leather</option>
        </Select>
      </ControlGroup>

      <ControlGroup>
        <Label>Color</Label>
        <Select
          value={config.color}
          onChange={(e) => onConfigChange('color', e.target.value)}
        >
          <option value="brown">Brown</option>
          <option value="black">Black</option>
          <option value="darkblue">Dark Blue</option>
        </Select>
      </ControlGroup>

      <ControlGroup>
        <Label>Hardware</Label>
        <Select
          value={config.hardware}
          onChange={(e) => onConfigChange('hardware', e.target.value)}
        >
          <option value="silver">Silver</option>
          <option value="black">Black</option>
          <option value="gold">Gold</option>
        </Select>
      </ControlGroup>

      <ARButton onClick={onARClick}>
        View in AR
      </ARButton>
    </ControlsContainer>
  );
}

export default Controls; 