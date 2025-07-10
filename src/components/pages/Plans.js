import React, { useEffect, useState, useRef } from 'react';
import Main from "../partials/Main.js";
import { Helmet } from 'react-helmet-async';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { useConfig } from '../../ConfigContext';

function Plans() {
	const navigate = useNavigate();
  const userString = Cookies.get("user");
  const user = userString ? JSON.parse(userString) : null;
  const user_id = user?.id ?? null;
  const [CurrentPlan, setCurrentPlan] = useState(null);
  const apiCalledRef = useRef(false);
  const context = useConfig();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (context?.currentUser?.payment_details?.length > 0) {
      const latestPayment = [...context.currentUser.payment_details].sort(
        (a, b) => new Date(b.payment_date) - new Date(a.payment_date)
      )[0];

      if (latestPayment?.transaction_status === 'completed') {
        setCurrentPlan(latestPayment);
      }
    }
  }, [context]);

  const savePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}save-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id ?? '',
          payer_email: user?.email ?? '',
          plan_type: 'Free',
          plan_amount: '0',
          transaction_id: '',
          transaction_status: '',
          payment_date: '',
          payer_id: '',
          payer_name: '',
          gateway: '',
          currency: '',
          raw_response: ''
        })
      });

      const result = await response.json();
      
      navigate('/');
    } catch (err) {
      console.error("Error saving payment:", err);
      navigate('/');
    }
  };


  const plans = [
    {
      title: "Free",
      price: "0",
      features: [
        "10 total conversions (monthly)",
        "Basic tools access",
        "Community support",
        "File retention: 30 minutes"
      ],
    },
    {
      title: "Standard",
      price: "5",
      features: [
        "100 conversions per month",
        "Access to all tools",
        "Email support",
        "File retention: 24 hours",
      ],
    },
    {
      title: "Premium",
      price: "20",
      features: [
        "Unlimited conversions per month",
        "Access to all tools",
        "Priority Email support",
        "File retention: Anytime",
      ],
    }
  ];

  return (
    <>
      <Helmet>
        <title>Plans | My PDF Tools</title>
        <meta name="description" content="Our pricing plans for My PDF Tools." />
      </Helmet>

      <Main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800">Plans & Pricing</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-16">
            {plans.map((plan, index) => (
              <div key={index} className="p-6 bg-white border rounded-lg shadow">
                <h5 className="mb-4 text-xl font-medium text-gray-500">{plan.title}</h5>

                <div className="flex items-baseline mb-6 text-gray-900">
                  <span className="text-3xl font-semibold">$</span>
                  <span className="text-5xl font-extrabold">{plan.price}</span>
                  <span className="ms-1 text-xl font-normal text-gray-500">/month</span>
                </div>

                <ul className="space-y-4 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-500">
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                      </svg>
                      <span className="ml-3">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.price === "0" ? (
                  
                    <button onClick={savePayment} className="w-full text-white bg-red-500 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5">
                      Start for Free
                    </button>
                  
                ) : CurrentPlan?.plan_type === plan.title && CurrentPlan?.transaction_status === 'completed' ? (
                  <button
                    disabled
                    className="w-full bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 cursor-default"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/payment', { state: { plan } })}
                    className="w-full text-white bg-red-500 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5"
                  >
                    Choose Plan
                  </button>
                )}
              </div>
            ))}

          </div>
        </div>
      </Main>
    </>
  );
}

export default Plans;
