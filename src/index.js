import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './assets/css/style.css';
import './assets/css/icon.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './AuthContext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ConfigProvider, useConfig } from './ConfigContext';

const WrappedApp = () => {
  const config = useConfig();

  return (
    <GoogleOAuthProvider clientId={config.googleClientId}>
      <PayPalScriptProvider options={{ "client-id": config.paypalClientId }}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </PayPalScriptProvider>
    </GoogleOAuthProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider>
    <WrappedApp />
  </ConfigProvider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
