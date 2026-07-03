import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, ArrowRight, User as UserIcon } from 'lucide-react';
import { refreshUserData, currentUser } from '../data';

export function AuthView({ onLogin }: { onLogin: () => void; key?: string }) {
  const [step, setStep] = useState<'options' | 'register' | 'register-pin' | 'login-pin' | 'recover-start' | 'recover-otp' | 'recover-security' | 'recover-password' | 'recover-pin'>('options');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  
  // Recovery states
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePinInput = async (num: string) => {
    if (pin.length < 6 && !isLoading) {
      const newPin = pin + num;
      setPin(newPin);
      setErrorMessage('');

      if (newPin.length === 6) {
        setIsLoading(true);
        try {
          if (step === 'register-pin') {
            // Register a new profile (non-custodial account + wallet on server)
            const response = await fetch('/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, pin: newPin })
            });
            const data = await response.json();
            if (response.ok) {
              await refreshUserData();
              setTimeout(onLogin, 300);
            } else {
              setErrorMessage(data.error || 'Registration failed');
              setPin('');
            }
          } else if (step === 'recover-pin') {
            const response = await fetch('/api/recover/finalize', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ identifier: recoveryIdentifier, newPassword, newPin })
            });
            const data = await response.json();
            if (response.ok) {
              await refreshUserData();
              setTimeout(onLogin, 300);
            } else {
              setErrorMessage(data.error || 'Recovery failed');
              setPin('');
            }
          } else {
            // Login with security PIN
            const response = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pin: newPin })
            });
            const data = await response.json();
            if (response.ok) {
              await refreshUserData();
              setTimeout(onLogin, 300);
            } else {
              setErrorMessage(data.error || 'Authentication failed');
              setPin('');
            }
          }
        } catch (err: any) {
          setErrorMessage('Network error. Check connection.');
          setPin('');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white/40 relative h-full">
      <AnimatePresence mode="wait">
        {step === 'options' ? (
          <motion.div
            key="options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full flex flex-col items-center max-w-sm"
          >
            <div className="w-16 h-16 glass-panel border border-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-md">
              <span className="text-gray-900 font-bold text-3xl tracking-tighter">V</span>
            </div>
            <h1 className="text-3xl font-semibold mb-2 text-gray-900">Vaulta</h1>
            <p className="text-gray-500 text-center mb-12">The invisible blockchain bank.</p>

            <div className="w-full space-y-4">
              <button 
                onClick={() => setStep('register')}
                className="w-full flex items-center justify-between glass-panel hover:bg-white/40 p-4 rounded-2xl transition-colors shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <UserIcon className="text-emerald-600 w-6 h-6" />
                  <span className="font-medium text-gray-900">Create New Account</span>
                </div>
                <ArrowRight className="text-gray-400 w-5 h-5" />
              </button>

              <button 
                onClick={() => setStep('login-pin')}
                className="w-full flex items-center justify-between glass-panel hover:bg-white/40 p-4 rounded-2xl transition-colors shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <Fingerprint className="text-gray-700 w-6 h-6" />
                  <span className="font-medium text-gray-900">Login</span>
                </div>
                <ArrowRight className="text-gray-400 w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={() => setStep('recover-start')}
              className="mt-6 text-gray-500 hover:text-gray-900 font-medium text-sm transition-colors"
            >
              Forgot Password / Recover Account
            </button>
            
            <p className="text-gray-500 text-sm mt-8 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy. A secure non-custodial Solana wallet is created automatically.
            </p>
          </motion.div>
        ) : step === 'register' ? (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full flex flex-col items-center max-w-sm"
          >
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Create Profile</h2>
            <p className="text-gray-500 text-center mb-8">Enter your name to get started.</p>
            
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full glass-panel border border-gray-200 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow text-gray-900"
            />
            
            <button 
              disabled={!name.trim()}
              onClick={() => setStep('register-pin')}
              className="w-full glass-panel border border-gray-200 text-gray-900 font-semibold py-3.5 rounded-xl disabled:opacity-50 transition-opacity"
            >
              Continue
            </button>
            
            <button 
              onClick={() => setStep('options')}
              className="mt-4 text-gray-500 font-medium text-sm"
            >
              Back
            </button>
          </motion.div>
        ) : step === 'recover-start' ? (
          <motion.div
            key="recover-start"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full flex flex-col items-center max-w-sm"
          >
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Recover Account</h2>
            <p className="text-gray-500 text-center mb-8">Enter your registered email or phone number.</p>
            
            <input 
              type="text" 
              value={recoveryIdentifier}
              onChange={(e) => setRecoveryIdentifier(e.target.value)}
              placeholder="Email or Phone Number"
              className="w-full glass-panel border border-gray-200 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow text-gray-900"
            />
            
            <button 
              disabled={!recoveryIdentifier.trim()}
              onClick={async () => {
                setIsLoading(true);
                // Simulate sending OTP
                await new Promise(r => setTimeout(r, 1000));
                setIsLoading(false);
                setStep('recover-otp');
              }}
              className="w-full glass-panel border border-gray-200 text-gray-900 font-semibold py-3.5 rounded-xl disabled:opacity-50 transition-opacity"
            >
              Send OTP
            </button>
            
            <button 
              onClick={() => setStep('options')}
              className="mt-4 text-gray-500 font-medium text-sm"
            >
              Cancel
            </button>
          </motion.div>
        ) : step === 'recover-otp' ? (
          <motion.div
            key="recover-otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full flex flex-col items-center max-w-sm"
          >
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Verify OTP</h2>
            <p className="text-gray-500 text-center mb-8">Enter the 6-digit code sent to you.</p>
            
            <input 
              type="text" 
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              className="w-full glass-panel border border-gray-200 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow text-gray-900 text-center tracking-[0.5em] font-mono text-xl"
            />
            
            <button 
              disabled={otp.length !== 6 || isLoading}
              onClick={async () => {
                setIsLoading(true);
                // Simulate OTP verification
                await new Promise(r => setTimeout(r, 1000));
                setIsLoading(false);
                setStep('recover-security');
              }}
              className="w-full glass-panel border border-gray-200 text-gray-900 font-semibold py-3.5 rounded-xl disabled:opacity-50 transition-opacity"
            >
              Verify Code
            </button>
            
            <button 
              onClick={() => setStep('recover-start')}
              className="mt-4 text-gray-500 font-medium text-sm"
            >
              Back
            </button>
          </motion.div>
        ) : step === 'recover-security' ? (
           <motion.div
            key="recover-security"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full flex flex-col items-center max-w-sm"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Fingerprint className="text-blue-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Security Verification</h2>
            <p className="text-gray-500 text-center mb-8 text-sm">
              We detected a high-risk recovery attempt. Please complete biometric verification or trusted device confirmation to proceed.
            </p>
            
            <button 
              disabled={isLoading}
              onClick={async () => {
                setIsLoading(true);
                // Simulate verification
                await new Promise(r => setTimeout(r, 1500));
                setIsLoading(false);
                setStep('recover-password');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Verifying...' : 'Complete Verification'}
            </button>
            
            <button 
              onClick={() => setStep('options')}
              className="mt-4 text-gray-500 font-medium text-sm"
            >
              Cancel Recovery
            </button>
          </motion.div>
        ) : step === 'recover-password' ? (
          <motion.div
            key="recover-password"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full flex flex-col items-center max-w-sm"
          >
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Set New Password</h2>
            <p className="text-gray-500 text-center mb-8 text-sm">
              Create a strong password to re-protect your encrypted wallet.
            </p>
            
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full glass-panel border border-gray-200 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow text-gray-900"
            />
            
            <button 
              disabled={newPassword.length < 8}
              onClick={() => setStep('recover-pin')}
              className="w-full glass-panel border border-gray-200 text-gray-900 font-semibold py-3.5 rounded-xl disabled:opacity-50 transition-opacity"
            >
              Next Step
            </button>
          </motion.div>
        ) : (step === 'register-pin' || step === 'login-pin' || step === 'recover-pin') ? (
          <motion.div
            key="pin"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col items-center mt-12"
          >
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">
              {step === 'register-pin' ? 'Set security PIN' : step === 'recover-pin' ? 'Set New PIN' : 'Enter PIN'}
            </h2>
            <p className="text-sm text-gray-500 mb-8 text-center max-w-xs">
              {step === 'register-pin' ? 'Create a 6-digit PIN to authorize transfers' : step === 'recover-pin' ? 'Create a new 6-digit PIN to finalize account recovery' : 'Authenticate your secure session'}
            </p>
            
            {errorMessage && (
              <div className="mb-4 bg-red-50 text-red-600 text-xs font-semibold px-4 py-2 rounded-lg border border-red-100">
                {errorMessage}
              </div>
            )}

            <div className="flex gap-4 mb-16">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-4 h-4 rounded-full ${isLoading ? 'animate-pulse bg-emerald-500' : i < pin.length ? 'bg-gray-800' : 'bg-gray-200'}`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full max-w-[280px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handlePinInput(num.toString())}
                  disabled={isLoading}
                  className="w-16 h-16 sm:w-16 sm:h-16 rounded-full glass-panel shadow-sm border border-gray-200 flex items-center justify-center text-2xl font-medium active:bg-white/40 mx-auto text-gray-900 transition-colors disabled:opacity-50"
                >
                  {num}
                </button>
              ))}
              <div />
              <button
                onClick={() => handlePinInput('0')}
                disabled={isLoading}
                className="w-16 h-16 sm:w-16 sm:h-16 rounded-full glass-panel shadow-sm border border-gray-200 flex items-center justify-center text-2xl font-medium active:bg-white/40 mx-auto text-gray-900 transition-colors disabled:opacity-50"
              >
                0
              </button>
              <button
                onClick={() => setPin(prev => prev.slice(0, -1))}
                disabled={isLoading || pin.length === 0}
                className="w-16 h-16 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-gray-500 active:text-gray-900 mx-auto font-medium transition-colors disabled:opacity-50"
              >
                Del
              </button>
            </div>
            
            <button 
              onClick={() => {
                setPin('');
                setErrorMessage('');
                setStep(step === 'register-pin' ? 'register' : 'options');
              }}
              className="mt-12 text-gray-500 font-medium text-sm"
              disabled={isLoading}
            >
              Cancel
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
