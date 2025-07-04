import React from 'react';
import { useLocation } from 'react-router-dom';
import { PayPalButtons } from "@paypal/react-paypal-js";
import Main from "../partials/Main.js";
import { Helmet } from 'react-helmet-async';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

function PaypalPayment() {
  const location = useLocation();
  const plan = location.state?.plan;
  const userString = Cookies.get("user");
  const user = userString ? JSON.parse(userString) : null;
  const user_id = user?.id ?? null;

  if (!plan) {
    return (
      <Main>
        <div className="p-6 text-red-500">No plan selected. Please go back and select a plan.</div>
      </Main>
    );
  }


  const savePayment = async (payload) => {
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
      console.log("Saved to DB:", result);
      toast.success("Payment successful.");
    } catch (err) {
      console.error("Error saving payment:", err);
      toast.error("Payment was successful.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Payment | My PDF Tools</title>
        <meta name="description" content={`Complete payment for ${plan.title} Plan`} />
      </Helmet>

      <Main>

      <ToastContainer />

        <div className="p-6 max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Pay for {plan.title} Plan</h2>
          <p className="text-lg mb-6">Amount: ${plan.price}</p>

          {/* PayPal Integration */}
          <PayPalButtons
            style={{ layout: "vertical", color: "blue", shape: "pill", label: "pay" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: plan.price,
                  },
                  description: `${plan.title} Plan`
                }]
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then(details => {
                console.log('Transaction details:', details);

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

          {/* Razorpay Integration */}
          

        </div>
      </Main>
    </>
  );
}

export default PaypalPayment;
