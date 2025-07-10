import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gateways, setGateways] = useState([]);
  const apiCalledRef = useRef(false);
  const gatewayData = localStorage.getItem("gateway");
  const [currentPlan, setCurrentPlan] = useState([]);
  const userString = Cookies.get("user");
  const user = userString ? JSON.parse(userString) : null;
  const user_id = user?.id ?? null;
  const [currentUser, setCurrentUser] = useState([]);
  // const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    const access_token = Cookies.get("access_token");

    // Check if cached
    const cachedUser = Cookies.get("current_user");
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}current-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok || data?.message === "Invalid or expired token") {
        throw new Error("Invalid or expired token");
      }

      Cookies.set("current_user", JSON.stringify(data.user), { expires: 1 });
      setCurrentUser(data.user);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      Cookies.remove("access_token");
      Cookies.remove("user");
      Cookies.remove("current_user");

      // navigate("/login");
      return null;
    }
  }


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

    fetchCurrentUser();

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
    <ConfigContext.Provider value={{ config, gateways, currentUser }}>
      {children}
    </ConfigContext.Provider>
  );
};
