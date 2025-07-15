import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { useConfig } from '../../ConfigContext';


function VerifyOtpModal({ email, onSuccess }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const context = useConfig();
  const verifyOtp = context?.verifyOtp;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const message = await verifyOtp(email, otp); // ✅ Correct usage
      toast.success(message || "OTP verified successfully");

      onSuccess?.(); // ✅ Notify parent
    } catch (error) {
      toast.error(error.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <ToastContainer />

        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl scrollbar-red overflow-y-auto max-h-screen">
            <div className='modal-header p-6'>
              <h2 className="text-4xl font-semibold text-center text-yellow-600 mb-1">
                Upgrade to Premium
              </h2>
            </div>
            <div className="bg-white p-8 w-full">
              <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Verify OTP</h2>

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">OTP</label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter the 6-digit OTP"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
            </div>
          </div>
        </div>

    </div>
  );
}

export default VerifyOtpModal;
