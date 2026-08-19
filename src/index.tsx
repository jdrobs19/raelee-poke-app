import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {initializeApp} from 'firebase/app'
import { firebaseConfig } from './firebase/firebaseConfig';

initializeApp(firebaseConfig)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
