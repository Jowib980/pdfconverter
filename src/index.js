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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="750523072904-27m3kkrn8vqro5719m18l7t04l334652.apps.googleusercontent.com">
     <PayPalScriptProvider options={{ "client-id": "AY9hrv8wFMRsbhFgXxKhH-FbWxBB6D8Xpq7-5fFEYdN8DnIY1cld0H9K8wqBUeY9gTljpCSrMIJ__Hza" }}>
      <AuthProvider>
        <App />
      </AuthProvider>
     </PayPalScriptProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
