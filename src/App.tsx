import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import { TranslationProvider } from './lib/TranslationContext';

const App: React.FC = () => {
  return (
    <TranslationProvider>
      <BrowserRouter>
        <div className="app-container">
          <Routes />
        </div>
      </BrowserRouter>
    </TranslationProvider>
  );
};

export default App;
