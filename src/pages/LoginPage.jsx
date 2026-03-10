import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, LogIn, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (phone.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }
        if (pin.length !== 4) {
            setError('Please enter a 4-digit PIN');
            return;
        }

        setLoading(true);
        try {
            const userData = await api.login(phone, pin);
            login(userData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-100/20 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <div className="relative z-10 pt-12 pb-6 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-200/50">
                        <LogIn className="text-white w-9 h-9" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back!</h1>
                    <p className="text-gray-500 font-medium text-lg">Sign in to continue learning</p>
                </motion.div>
            </div>

            {/* Form Card */}
            <div className="relative z-10 flex-1 flex items-start justify-center px-6 pb-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 border border-white/60 space-y-6">

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                    className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl text-sm font-medium flex items-center gap-3"
                                >
                                    <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-red-500 text-lg">!</span>
                                    </div>
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                            <div className={`relative flex items-center bg-gray-50/80 rounded-2xl border-2 transition-all duration-300 ${focusedField === 'phone' ? 'border-blue-400 bg-white shadow-lg shadow-blue-100/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                <div className={`pl-4 pr-2 transition-colors duration-300 ${focusedField === 'phone' ? 'text-blue-500' : 'text-gray-400'}`}>
                                    <Phone size={20} />
                                </div>
                                <span className={`text-base font-semibold pr-1 transition-colors duration-300 ${focusedField === 'phone' ? 'text-blue-600' : 'text-gray-400'}`}>+91</span>
                                <input
                                    id="login-phone"
                                    type="tel"
                                    maxLength={10}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                    onFocus={() => setFocusedField('phone')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter 10-digit number"
                                    className="flex-1 py-4 pr-4 bg-transparent outline-none text-gray-800 font-semibold text-base placeholder:text-gray-300 placeholder:font-medium"
                                />
                            </div>
                        </div>

                        {/* PIN */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">4-Digit PIN</label>
                            <div className={`relative flex items-center bg-gray-50/80 rounded-2xl border-2 transition-all duration-300 ${focusedField === 'pin' ? 'border-blue-400 bg-white shadow-lg shadow-blue-100/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                <div className={`pl-4 pr-3 transition-colors duration-300 ${focusedField === 'pin' ? 'text-blue-500' : 'text-gray-400'}`}>
                                    <Lock size={20} />
                                </div>
                                <input
                                    id="login-pin"
                                    type={showPin ? 'text' : 'password'}
                                    maxLength={4}
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                    onFocus={() => setFocusedField('pin')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="● ● ● ●"
                                    className="flex-1 py-4 bg-transparent outline-none text-gray-800 font-semibold text-base tracking-[0.3em] placeholder:text-gray-300 placeholder:tracking-[0.5em]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPin(!showPin)}
                                    className="pr-4 pl-2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4.5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg ${loading
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-300/40 hover:shadow-blue-300/60 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98]'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </motion.button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 py-1">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-sm text-gray-400 font-medium">New here?</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Sign Up Link */}
                        <Link
                            to="/signup"
                            className="block w-full py-4 rounded-2xl font-bold text-blue-600 bg-blue-50/80 hover:bg-blue-100/80 text-center transition-all text-base border-2 border-blue-100/60 hover:border-blue-200"
                        >
                            Create New Account
                        </Link>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-gray-400 text-sm mt-8 font-medium">
                        Empowering workers, one skill at a time ✨
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
