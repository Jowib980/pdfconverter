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
import { ConfigProvider, useConfig } from './ConfigContext';

const WrappedApp = () => {
  const { config, gateways } = useConfig();

  const googleGateway = gateways.find(
    (g) => g.name.toLowerCase() === 'google' && g.client_id
  );

  const googleClientId = googleGateway?.client_id ?? config?.googleClientId ?? '';

  const hasGoogle = !!googleClientId;

  if (!hasGoogle) {
    console.log("Missing gateway credentials.");
  }

  const AppTree = (
    <AuthProvider>
      <App />
    </AuthProvider>
  );

  if (hasGoogle) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
          {AppTree}
      </GoogleOAuthProvider>
    );
  }

  if (hasGoogle) {
    return <GoogleOAuthProvider clientId={googleClientId}>{AppTree}</GoogleOAuthProvider>;
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
