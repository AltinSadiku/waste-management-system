import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from 'lucide-react';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('No verification token provided.');
    }
  }, [token]);

  // Auto-redirect to login after successful verification
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Email verified successfully! You can now log in.' 
          } 
        });
      }, 3000); // Redirect after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  const verifyEmail = async (verificationToken) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/auth/verify-email?token=${verificationToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Email verified successfully! You can now log in to your account.');
      } else {
        setStatus('error');
        setMessage(result.message || 'Failed to verify email. The token may be invalid or expired.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('An error occurred while verifying your email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    // This would need the user's email, which we don't have in this context
    // For now, redirect to login page where they can request resend
    navigate('/login?message=Please contact support to resend verification email.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              {status === 'verifying' && (
                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="w-8 h-8 text-green-600" />
              )}
              {status === 'error' && (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verification
            </h1>
            <p className="text-gray-600">
              {status === 'verifying' && 'Verifying your email address...'}
              {status === 'success' && 'Verification Complete!'}
              {status === 'error' && 'Verification Failed'}
            </p>
          </div>

          {/* Status Message */}
          <div className="mb-6">
            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-green-800 font-medium">
                    Email Verified Successfully!
                  </p>
                </div>
                <p className="text-green-700 text-sm mt-2">
                  {message}
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-800 font-medium">
                    Verification Failed
                  </p>
                </div>
                <p className="text-red-700 text-sm mt-2">
                  {message}
                </p>
              </div>
            )}

            {status === 'verifying' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 text-blue-600 mr-2 animate-spin" />
                  <p className="text-blue-800 font-medium">
                    Verifying Your Email...
                  </p>
                </div>
                <p className="text-blue-700 text-sm mt-2">
                  Please wait while we verify your email address.
                </p>
              </div>
            )}
          </div>

          {/* Next Steps */}
          {status === 'success' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  What's Next?
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• You can now log into your account</li>
                  <li>• Submit waste management reports</li>
                  <li>• Receive collection schedule notifications</li>
                  <li>• Track your reports and their status</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-blue-800 text-sm font-medium">
                  Redirecting to login page in 3 seconds...
                </p>
              </div>
              
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Go to Login Now
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Need Help?
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• The verification link may have expired</li>
                  <li>• Check if you clicked the correct link</li>
                  <li>• Contact support for assistance</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleResendVerification}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Get Help with Verification
                </button>
                
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Having trouble? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
