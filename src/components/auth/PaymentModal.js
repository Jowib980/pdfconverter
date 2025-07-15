import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Helmet } from 'react-helmet-async';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

function PaymentModal({
  showPaymentModal,
  closePaymentModal,
}) {

	const navigate = useNavigate();

  const plans = [
    {
    	title: "Premium",
      price: "20",
    }
  ];
	
	return (
		<div className="content">
			{showPaymentModal && (
				<div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black bg-opacity-50">
		          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl scrollbar-red overflow-y-auto max-h-screen">
		            <div className='modal-header p-6'>
			            <button
			              className="absolute top-3 right-3 text-white hover:text-white text-4xl font-bold"
			              onClick={closePaymentModal}
			            >
			              &times;
			            </button>

			            <h2 className="text-4xl font-semibold text-center text-yellow-600 mb-1">
			              Upgrade to Premium
			            </h2>
			            
		            </div>

		            <div className="space-y-3 mb-4 p-6">
		              
		              <div className="flex flex-col px-4 md:px-16 items-center">
				            {plans.map((plan, index) => (
				            	<>
				              <div
											  key={index}
											  className="p-4 rounded-xl border-4 bg-[#f8f9ff] text-center w-40 h-28 flex flex-col items-center justify-center"
											  style={{
											    borderImage: 'linear-gradient(to bottom right, #fbbc05, #ff6b6b) 1',
											    borderStyle: 'solid',
											  }}
											>
											  <h5 className="text-md font-medium text-gray-600 mb-1">{plan.title}</h5>
											  <span className="text-2xl font-bold text-gray-800">${plan.price}/month</span>
											</div>

											<div className="p-4">
					            	<button
			                    onClick={() => navigate('/payment', { state: { plan } })}
			                    className="w-full text-white bg-red-500 hover:bg-red-700 font-medium rounded-lg text-sm px-6 py-4"
			                  >
			                    Go Premium
			                  </button>
					            </div>
					            </>
										))}
									</div>
		            </div>

		            
		          </div>
		        </div>
			)}
		</div>
	);
}

export default PaymentModal;