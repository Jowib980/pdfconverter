import React, { useEffect, useState } from 'react';
import Main from "../partials/Main.js";
import { Helmet } from 'react-helmet-async';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

function Plans() {
	const navigate = useNavigate(); 

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
        <div className="py-12 bg-white">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800">Plans & Pricing</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-16">
            {plans.map((plan, index) => (
              <div key={index} className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">{plan.title}</h5>

                <div className="flex items-baseline text-gray-900 dark:text-white mb-6">
                  <span className="text-3xl font-semibold">$</span>
                  <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
                </div>

                <ul className="space-y-4 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="w-4 h-4 text-red-500 dark:text-red-200" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                      </svg>
                      <span className="ml-3 text-base text-gray-500 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.price === "0" ? (
				  <a href="/" className="w-full block">
				    <button className="w-full text-white bg-red-500 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
				      Start for Free
				    </button>
				  </a>
				) : (
				  <button
					  onClick={() => navigate('/payment', { state: { plan } })}
					  className="w-full text-white bg-red-500 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
