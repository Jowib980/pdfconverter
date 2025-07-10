import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gateways, setGateways] = useState([]);
  const apiCalledRef = useRef(false);
  const gatewayData = localStorage.getItem("gateway");

  const fetchPaymentGateway = async () => {

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}gateways`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      const result = await response.json();
      setGateways(result?.data || []);
      localStorage.setItem("gateway", JSON.stringify(result?.data || []));
    } catch (err) {
      console.log("Error occurred", err);
    }
  };


  useEffect(() => {

    if (!apiCalledRef.current && gateways.length === 0) {
      apiCalledRef.current = true;
      fetchPaymentGateway();
    }

    axios.get(`${process.env.REACT_APP_BACKEND_API_URL}config`)
      .then(response => {
        setConfig(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load config:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ConfigContext.Provider value={{ config, gateways }}>
      {children}
    </ConfigContext.Provider>
  );
};
