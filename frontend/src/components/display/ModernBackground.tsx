import React from 'react';
import { ModernBackgroundProps } from './types';
import { DisplayBackground } from './DisplayBackground';

export const ModernBackground: React.FC<ModernBackgroundProps> = ({ children }) => {
  return (
    <DisplayBackground>
      {children}
    </DisplayBackground>
  );
};