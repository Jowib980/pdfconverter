import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalButtons } from "@paypal/react-paypal-js";
import Main from "../partials/Main.js";
import { Helmet } from 'react-helmet-async';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../Loader';
import { useConfig } from '../../ConfigContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import SignupModal from '../auth/SignupModal';
import LoginModal from '../auth/LoginModal';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function PaypalPayment() {
  const location = useLocation();
  const plan = location.state?.plan;
  const userString = Cookies.get("current_user");
  const user = userString ? JSON.parse(userString) : null;
  const user_id = user?.id ?? null;
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState(null);
  const navigate = useNavigate();
  const context = useConfig();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const gateways = context?.gateways ?? JSON.parse(localStorage.getItem("gateway") || "[]");

  const paypalGateway = context?.gateways.find(
    (g) => g.name.toLowerCase() === 'paypal' && g.client_id
  );

  const paypalClientId = paypalGateway?.client_id ?? context?.config?.paypalClientId ?? '';

  const hasPaypal = !!paypalClientId;
  
  const razorpayEnabled = gateways.find(gw => gw.name.toLowerCase() === 'razorpay' && gw.is_enabled);
  const paypalEnabled = gateways.find(gw => gw.name.toLowerCase() === 'paypal' && gw.is_enabled);


 useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };

  }, []);


  const closeModal = () => {
    setShowModal(false);
    setEmail('');
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setEmail('');
  };



  const savePayment = async (payload) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}save-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      toast.success("Payment successful.");
      navigate('/plans');
      Cookies.remove('current_user');
    } catch (err) {
      console.error("Error saving payment:", err);
      toast.error("Payment was successful.");
    }
  };

   const handleRazorpayPayment = async () => {
    const userString = Cookies.get("current_user");
    const user = userString ? JSON.parse(userString) : null;

    if (!user) {
      setPaymentGateway("razorpay");
      setShowModal(true);
      return;
    }

     await startRazorpayPayment(user);

  };

  const startRazorpayPayment = async (user) => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}create-razorpay-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: plan.price })
    });

    const data = await res.json();

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: plan.price * 100,
      currency: "USD",
      name: "My PDF Tools",
      description: `${plan.title} Plan`,
      order_id: data.order_id,
      handler: function (response) {
        const paymentPayload = {
          user_id: user.id,
          payer_email: user.email,
          plan_type: plan.title,
          plan_amount: plan.price,
          transaction_id: response.razorpay_payment_id,
          transaction_status: "completed",
          payment_date: new Date().toISOString(),
          payer_id: response.razorpay_order_id,
          payer_name: user.name ?? "User",
          gateway: "razorpay",
          currency: "USD",
          raw_response: JSON.stringify(response)
        };

        savePayment(paymentPayload);
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async () => {
    setShowModal(false);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.confirm_password,
        })
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.set("current_user", JSON.stringify(data?.user), { expires: 30 });
        Cookies.set("access_token", data?.access_token, { expires: 30 });
        Cookies.set("user_email", data?.user?.email, { expires: 30 });

        setLoading(false);

        if (paymentGateway === "razorpay") {
          await startRazorpayPayment(data.user);
          window.location.reload();
        } else if (paymentGateway === "paypal") {
          window.location.reload();
        }

      }
    } catch (error) {
      console.error("Registration error:", error);
      setLoading(false);
      toast.error("An error occurred during registration.");
    }
  };

  const handleLoginRedirect = () => {
    setShowModal(false);
    setShowLoginModal(true);
  }

  const handleSignupRedirect = () => {
    setShowModal(true);
    setShowLoginModal(false);
  }

  const handleLogin = async () => {
    setLoading(true);
    setShowLoginModal(false);
    try {
          const loginResponse = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              email: form.email,
              password: form.password,
            })
          });

          const loginData = await loginResponse.json();

          if (loginResponse.ok) {
            Cookies.set("current_user", JSON.stringify(loginData.user), { expires: 30 });
            Cookies.set("access_token", loginData.access_token, { expires: 30 });
            Cookies.set("user_email", email, { expires: 30 });

            setLoading(false);

            if (paymentGateway === "razorpay") {
              await startRazorpayPayment(loginData.user);
            } else if (paymentGateway === "paypal") {
              window.location.reload();
            }

          } else {
            setLoading(false);
            toast.error("Login failed. Try again later.");
          }
      } catch (error) {
        console.error("Registration error:", error);
        setLoading(false);
        toast.error("An error occurred during registration.");
    }
  }

  if (!plan) {
    return (
      <Main>
        <div className="p-6 text-red-500">No plan selected. Please go back and select a plan.</div>
      </Main>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment | My PDF Tools</title>
        <meta name="description" content={`Complete payment for ${plan.title} Plan`} />
      </Helmet>

      <Main>

      <ToastContainer />

      {loading && (
        <Loader />
      )}

      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 ">
         <div className="p-6 max-w-4xl mx-auto mt-6">
            <div className="bg-white shadow-xl rounded-2xl p-8">
            <div className="section-title text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Pay for <span className="text-indigo-600">{plan.title}</span> Plan
              </h2>
              <p className="text-lg text-gray-600">
                Amount: <span className="font-semibold text-indigo-500 mb-6">${plan.price}</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* PayPal Integration */}

              {paypalEnabled && (
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Pay with PayPal</h3>
                  <PayPalScriptProvider options={{ 'client-id': paypalClientId }}>
                    <PayPalButtons
                      style={{ layout: "vertical", color: "blue", shape: "pill", label: "pay" }}
                      onClick={(data, actions) => {
                        const userString = Cookies.get("current_user");
                        const user = userString ? JSON.parse(userString) : null;

                        if (!user) {
                          setPaymentGateway("paypal");
                          setShowModal(true);
                          return actions.reject();
                        }

                        return actions.resolve();
                      }}

                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [{
                            amount: { value: plan.price },
                            description: `${plan.title} Plan`
                          }]
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then(details => {
                          const paymentPayload = {
                            user_id: user_id,
                            payer_email: details.payer.email_address,
                            plan_type: plan.title,
                            plan_amount: plan.price,
                            transaction_id: details.id,
                            transaction_status: details.status,
                            payment_date: details.update_time,
                            payer_id: details.payer.payer_id,
                            payer_name: `${details.payer.name.given_name} ${details.payer.name.surname}`,
                            gateway: "paypal",
                            currency: details.purchase_units[0].amount.currency_code,
                            raw_response: JSON.stringify(details)
                          };
                          savePayment(paymentPayload);
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {/* Razorpay Integration */}

              {razorpayEnabled && (
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Pay with Razorpay</h3>
                    <p className="text-gray-500 mb-4">Secure payment via Razorpay gateway.</p>
                  </div>
                  <button
                    onClick={handleRazorpayPayment}
                    className="mt-auto w-full px-6 py-3 bg-indigo-600 text-white font-medium text-lg rounded-lg hover:bg-indigo-700 transition duration-200"
                  >
                    Pay with Razorpay
                  </button>
                </div>
              )}


              {!razorpayEnabled && !paypalEnabled && (
                <div className="text-center text-red-500">No payment gateways are enabled at the moment.</div>
              )}
            </div>
            </div>
          </div>
      </div>


      {showModal && (
        
        <SignupModal
          showModal={showModal}
          closeModal={closeModal}
          setForm={setForm}
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleLoginRedirect={handleLoginRedirect}
          paymentGateway={paymentGateway}
          startRazorpayPayment={startRazorpayPayment}
        />


      )}


      {showLoginModal && (
        <LoginModal
          showLoginModal={showLoginModal}
          closeLoginModal={closeLoginModal}
          setForm={setForm}
          form={form}
          handleChange={handleChange}
          handleLogin={handleLogin}
          handleSignupRedirect={handleSignupRedirect}
          paymentGateway={paymentGateway}
          startRazorpayPayment={startRazorpayPayment}
        />

      )}

      </Main>
    </>
  );
}

export default PaypalPayment;
