import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';

const rootElement = document.createElement('div');
rootElement.id = 'repeat-extension';
rootElement.style.position = 'fixed';
rootElement.style.right = '120px';
rootElement.style.top = '0';
rootElement.style.boxShadow = '0px 5px 10px 2px rgba(34, 60, 80, 0.2)';
rootElement.style.borderBottomRightRadius = '16px';
rootElement.style.borderBottomLeftRadius = '16px';
rootElement.style.width = '300px';
rootElement.style.height = '250px';
rootElement.style.padding = '16px';
rootElement.style.color = 'white';
rootElement.style.backgroundColor = '#2f2f2f';
rootElement.style.zIndex = '9999';
rootElement.style.display = 'none';
rootElement.dataset.show = 'false';
document.body.appendChild(rootElement);

const root = ReactDOM.createRoot(rootElement!)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);