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
  const { config, gateways } = useConfig();

  const googleGateway = gateways.find(
    (g) => g.name.toLowerCase() === 'google' && g.client_id
  );

  const paypalGateway = gateways.find(
    (g) => g.name.toLowerCase() === 'paypal' && g.client_id
  );

  const googleClientId = googleGateway?.client_id ?? config?.googleClientId ?? '';
  const paypalClientId = paypalGateway?.client_id ?? config?.paypalClientId ?? '';

  const hasGoogle = !!googleClientId;
  const hasPaypal = !!paypalClientId;

  if (!hasGoogle && !hasPaypal) {
    return <div>Missing gateway credentials.</div>;
  }

  const AppTree = (
    <AuthProvider>
      <App />
    </AuthProvider>
  );

  if (hasGoogle && hasPaypal) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <PayPalScriptProvider options={{ 'client-id': paypalClientId }}>
          {AppTree}
        </PayPalScriptProvider>
      </GoogleOAuthProvider>
    );
  }

  if (hasGoogle) {
    return <GoogleOAuthProvider clientId={googleClientId}>{AppTree}</GoogleOAuthProvider>;
  }

  if (hasPaypal) {
    return <PayPalScriptProvider options={{ 'client-id': paypalClientId }}>{AppTree}</PayPalScriptProvider>;
  }

  return AppTree;
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
