import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

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

  const login = async (email, password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          const messages = Object.values(data.errors).flat();
          throw new Error(messages.join(" "));
        }

        throw new Error(data?.message || 'Login failed');
      }

      Cookies.set("access_token", data.access_token, { expires: 30 });
      localStorage.setItem("access_token", data.access_token);
      await fetchCurrentUser();

      return data.message || "Login successful";

    } catch (err) {
      console.error('Login failed:', err);
      throw err; // So component using it can show toast
    }
  };

   const register = async (name, email, password, confirm_password) => {

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation: confirm_password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 422 && typeof data === 'object') {
            const messages = Object.values(data).flat();
            console.log("🔥 Validation messages:", messages); // ⬅️ ADD THIS
            throw new Error(messages.join(" "));
          }

          throw new Error(data?.message || 'Registration failed');
        }

        return data.message || "Register successful";

      } catch (error) {
        console.error("Registration error:", error); // should show the error message
        throw error; // ⬅️ IMPORTANT
      }

  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          const messages = Object.values(data.errors).flat();
          throw new Error(messages.join(" "));
        }

        throw new Error(data?.message || 'Login failed');
      }

     Cookies.set("access_token", data.access_token, {
        expires: 1,            
        sameSite: "Lax",       
        secure: false,         
      });

    localStorage.setItem("access_token", data.access_token);

      console.log("OTP response user:", data?.user);
      await savePayment(data?.user);

      await fetchCurrentUser();

      return data?.message || 'OTP Verified successfully';

    } catch (error) {
      throw error;
    }
  };


  const fetchCurrentUser = async () => {
    const access_token = Cookies.get("access_token") || localStorage.getItem("access_token");

    if (!access_token) {
      console.warn("🚫 No access token found.");
      return null;
    }

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

        // ✅ Validate response
        if (!response.ok || typeof data?.user !== "object") {
          throw new Error("Invalid or expired token or bad user data");
        }

        // ✅ Safely store user
        const user = data.user;
        setCurrentUser(user);
        Cookies.set("current_user", JSON.stringify(user), {
          expires: 1,
          sameSite: 'Lax',  // ensure compatibility
        });

        Cookies.set('roles', user?.roles[0]?.name)

        return user;

    } catch (err) {
      console.log(err);
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

  const savePayment = async (user) => {
    if (!user) {
      console.log("❌ savePayment called with null user");
      return;
    }

    console.log("✅ savePayment called with:", user); // <-- Confirm it gets called

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}save-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          payer_email: user?.email,
          plan_type: 'Free',
          plan_amount: '0',
          transaction_id: '',
          transaction_status: '',
          payment_date: '',
          payer_id: '',
          payer_name: user?.name,
          gateway: '',
          currency: '',
          raw_response: ''
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.log("❌ Failed to save payment:", result);
      } else {
        console.log("✅ Payment saved successfully:", result);
      }

      Cookies.remove('current_user');
    } catch (err) {
      console.error("🔥 Error saving payment:", err);
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
    <ConfigContext.Provider value={{ config, gateways, currentUser, login, register, verifyOtp, savePayment, fetchCurrentUser }}>
      {children}
    </ConfigContext.Provider>
  );
};
