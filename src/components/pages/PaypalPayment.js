import React, { useState, useEffect, useRef} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalButtons } from "@paypal/react-paypal-js";
import Main from "../partials/Main.js";
import { Helmet } from 'react-helmet-async';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../Loader';

function PaypalPayment() {
  const location = useLocation();
  const plan = location.state?.plan;
  const userString = Cookies.get("user");
  const user = userString ? JSON.parse(userString) : null;
  const user_id = user?.id ?? null;
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState(null);
  const navigate = useNavigate();
  const apiCalledRef = useRef(false);
  const [gateways, setGateways] = useState([]);

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
      console.log("Result", result.data.data);
      setGateways(result?.data?.data);
    } catch (err) {
      console.log("Error occurred", err);
    }
  };

  const razorpayEnabled = gateways.find(gw => gw.name.toLowerCase() === 'razorpay' && gw.is_enabled);
  const paypalEnabled = gateways.find(gw => gw.name.toLowerCase() === 'paypal' && gw.is_enabled);



 useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    
    if(!apiCalledRef.current) {
      apiCalledRef.current = true;
      fetchPaymentGateway();
    }

    return () => {
      document.body.removeChild(script);
    };

  }, []);


  const closeModal = () => {
    setShowModal(false);
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
    } catch (err) {
      console.error("Error saving payment:", err);
      toast.error("Payment was successful.");
    }
  };

   const handleRazorpayPayment = async () => {
    const userString = Cookies.get("user");
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

  const handleSubmit = async () => {
    setShowModal(false);
    setLoading(true);
    if (!email.trim()) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: email,
          email: email,
          password: '12345678',
          password_confirmation: '12345678',
        })
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.set("user", JSON.stringify(data.user), { expires: 30 });
        Cookies.set("access_token", data.access_token, { expires: 30 });
        Cookies.set("user_email", email, { expires: 30 });

        setLoading(false);

        if (paymentGateway === "razorpay") {
          await startRazorpayPayment(data.user);
        } else if (paymentGateway === "paypal") {
          window.location.reload();
        }

      } else {
        const emailError = data?.email?.[0];
        if (emailError === "The email has already been taken.") {
          const loginResponse = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              email: email,
              password: '12345678',
            })
          });

          const loginData = await loginResponse.json();

          if (loginResponse.ok) {
            Cookies.set("user", JSON.stringify(loginData.user), { expires: 30 });
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
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setLoading(false);
      toast.error("An error occurred during registration.");
    }
  };


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
                <PayPalButtons
                  style={{ layout: "vertical", color: "blue", shape: "pill", label: "pay" }}
                  onClick={(data, actions) => {
                    const userString = Cookies.get("user");
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




      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Enter your email for continue the payment
            </h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      </Main>
    </>
  );
}

export default PaypalPayment;
