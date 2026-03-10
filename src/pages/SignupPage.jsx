import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, Lock, Camera, MapPin, UserPlus, ArrowRight, Eye, EyeOff, CheckCircle, Upload, X, ImagePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const fileInputRef = useRef(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        pin: '',
        confirmPin: '',
        profile_photo_url: '',
        latitude: 0,
        longitude: 0,
    });
    const [showPin, setShowPin] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationFetched, setLocationFetched] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    // Image upload state
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadDone, setUploadDone] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleFileSelect = (file) => {
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please select an image file (JPG, PNG, GIF, WebP, SVG)');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be smaller than 5MB');
            return;
        }

        setSelectedFile(file);
        setUploadDone(false);
        setError('');

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleFileInputChange = (e) => {
        handleFileSelect(e.target.files[0]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const removeImage = () => {
        setSelectedFile(null);
        setImagePreview(null);
        setUploadDone(false);
        handleChange('profile_photo_url', '');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadImage = async () => {
        if (!selectedFile) return;
        setUploadLoading(true);
        setError('');
        try {
            const result = await api.uploadImage(selectedFile);
            handleChange('profile_photo_url', result.fullUrl);
            setUploadDone(true);
        } catch (err) {
            setError(err.message || 'Failed to upload image');
        } finally {
            setUploadLoading(false);
        }
    };

    const getLocation = () => {
        setLocationLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData((prev) => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }));
                    setLocationFetched(true);
                    setLocationLoading(false);
                },
                () => {
                    setError('Location access denied. Please enable location services.');
                    setLocationLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            setLocationLoading(false);
        }
    };

    const validateStep1 = () => {
        if (!formData.full_name.trim()) {
            setError('Please enter your full name');
            return false;
        }
        if (formData.phone_number.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (formData.pin.length !== 4) {
            setError('PIN must be exactly 4 digits');
            return false;
        }
        if (formData.pin !== formData.confirmPin) {
            setError('PINs do not match');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        setError('');
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2 && validateStep2()) {
            setStep(3);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!locationFetched) {
            setError('Please allow location access to continue');
            return;
        }

        // If an image is selected but not uploaded yet, upload it first
        if (selectedFile && !uploadDone) {
            setUploadLoading(true);
            try {
                const result = await api.uploadImage(selectedFile);
                formData.profile_photo_url = result.fullUrl;
                setUploadDone(true);
            } catch (err) {
                setError(err.message || 'Failed to upload image');
                setUploadLoading(false);
                return;
            }
            setUploadLoading(false);
        }

        const photoUrl = formData.profile_photo_url.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.full_name)}`;

        setLoading(true);
        try {
            await api.signup({
                full_name: formData.full_name.trim(),
                phone_number: formData.phone_number,
                pin: formData.pin,
                profile_photo_url: photoUrl,
                latitude: formData.latitude,
                longitude: formData.longitude,
            });

            // Auto-login after signup
            const userData = await api.login(formData.phone_number, formData.pin);
            login(userData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const stepIndicator = (
        <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${s < step
                            ? 'bg-green-500 text-white shadow-lg shadow-green-200/50'
                            : s === step
                                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200/50 scale-110'
                                : 'bg-gray-100 text-gray-400'
                        }`}>
                        {s < step ? <CheckCircle size={18} /> : s}
                    </div>
                    {s < 3 && (
                        <div className={`w-12 h-1 rounded-full transition-all duration-500 ${s < step ? 'bg-green-400' : 'bg-gray-100'
                            }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/40 flex flex-col">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <div className="relative z-10 pt-12 pb-4 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-indigo-200/50">
                        <UserPlus className="text-white w-9 h-9" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-500 font-medium text-lg">
                        {step === 1 && 'Tell us about yourself'}
                        {step === 2 && 'Set your secure PIN'}
                        {step === 3 && 'Almost done!'}
                    </p>
                </motion.div>
            </div>

            {/* Form */}
            <div className="relative z-10 flex-1 flex items-start justify-center px-6 pb-10 pt-2">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 border border-white/60 space-y-6">

                        {stepIndicator}

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

                        <AnimatePresence mode="wait">
                            {/* Step 1: Name & Phone */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                        <div className={`flex items-center bg-gray-50/80 rounded-2xl border-2 transition-all duration-300 ${focusedField === 'name' ? 'border-blue-400 bg-white shadow-lg shadow-blue-100/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <div className={`pl-4 pr-3 transition-colors duration-300 ${focusedField === 'name' ? 'text-blue-500' : 'text-gray-400'}`}>
                                                <User size={20} />
                                            </div>
                                            <input
                                                id="signup-name"
                                                type="text"
                                                value={formData.full_name}
                                                onChange={(e) => handleChange('full_name', e.target.value)}
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="Enter your full name"
                                                className="flex-1 py-4 pr-4 bg-transparent outline-none text-gray-800 font-semibold text-base placeholder:text-gray-300 placeholder:font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                                        <div className={`flex items-center bg-gray-50/80 rounded-2xl border-2 transition-all duration-300 ${focusedField === 'phone' ? 'border-blue-400 bg-white shadow-lg shadow-blue-100/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <div className={`pl-4 pr-2 transition-colors duration-300 ${focusedField === 'phone' ? 'text-blue-500' : 'text-gray-400'}`}>
                                                <Phone size={20} />
                                            </div>
                                            <span className={`text-base font-semibold pr-1 transition-colors duration-300 ${focusedField === 'phone' ? 'text-blue-600' : 'text-gray-400'}`}>+91</span>
                                            <input
                                                id="signup-phone"
                                                type="tel"
                                                maxLength={10}
                                                value={formData.phone_number}
                                                onChange={(e) => handleChange('phone_number', e.target.value.replace(/\D/g, ''))}
                                                onFocus={() => setFocusedField('phone')}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="Enter 10-digit number"
                                                className="flex-1 py-4 pr-4 bg-transparent outline-none text-gray-800 font-semibold text-base placeholder:text-gray-300 placeholder:font-medium"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: PIN */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Create 4-Digit PIN</label>
                                        <div className={`flex items-center bg-gray-50/80 rounded-2xl border-2 transition-all duration-300 ${focusedField === 'pin' ? 'border-blue-400 bg-white shadow-lg shadow-blue-100/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <div className={`pl-4 pr-3 transition-colors duration-300 ${focusedField === 'pin' ? 'text-blue-500' : 'text-gray-400'}`}>
                                                <Lock size={20} />
                                            </div>
                                            <input
                                                id="signup-pin"
                                                type={showPin ? 'text' : 'password'}
                                                maxLength={4}
                                                value={formData.pin}
                                                onChange={(e) => handleChange('pin', e.target.value.replace(/\D/g, ''))}
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

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Confirm PIN</label>
                                        <div className={`flex items-center bg-gray-50/80 rounded-2xl border-2 transition-all duration-300 ${focusedField === 'confirmPin' ? 'border-blue-400 bg-white shadow-lg shadow-blue-100/50' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <div className={`pl-4 pr-3 transition-colors duration-300 ${focusedField === 'confirmPin' ? 'text-blue-500' : 'text-gray-400'}`}>
                                                <Lock size={20} />
                                            </div>
                                            <input
                                                id="signup-confirm-pin"
                                                type={showPin ? 'text' : 'password'}
                                                maxLength={4}
                                                value={formData.confirmPin}
                                                onChange={(e) => handleChange('confirmPin', e.target.value.replace(/\D/g, ''))}
                                                onFocus={() => setFocusedField('confirmPin')}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="● ● ● ●"
                                                className="flex-1 py-4 bg-transparent outline-none text-gray-800 font-semibold text-base tracking-[0.3em] placeholder:text-gray-300 placeholder:tracking-[0.5em]"
                                            />
                                        </div>
                                    </div>

                                    {/* PIN match indicator */}
                                    {formData.pin.length === 4 && formData.confirmPin.length === 4 && (
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${formData.pin === formData.confirmPin
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-red-50 text-red-500'
                                            }`}>
                                            {formData.pin === formData.confirmPin ? (
                                                <><CheckCircle size={16} /> PINs match!</>
                                            ) : (
                                                <><span>✕</span> PINs do not match</>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Step 3: Photo Upload & Location */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    {/* Image Upload Section */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-gray-700 ml-1">
                                            Profile Photo <span className="text-gray-400 font-normal">(optional)</span>
                                        </label>

                                        {/* Hidden file input */}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                                            onChange={handleFileInputChange}
                                            className="hidden"
                                            id="signup-photo-upload"
                                        />

                                        {!imagePreview ? (
                                            /* Drop Zone / Upload Button */
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                                className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${isDragging
                                                        ? 'border-blue-400 bg-blue-50/80 shadow-lg shadow-blue-100/50 scale-[1.02]'
                                                        : 'border-gray-200 bg-gray-50/50 hover:border-blue-300 hover:bg-blue-50/30'
                                                    }`}
                                            >
                                                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragging
                                                        ? 'bg-blue-100 text-blue-500 scale-110'
                                                        : 'bg-gray-100 text-gray-400'
                                                    }`}>
                                                    <ImagePlus size={28} />
                                                </div>
                                                <p className="font-semibold text-gray-600 mb-1">
                                                    {isDragging ? 'Drop your image here!' : 'Tap to upload photo'}
                                                </p>
                                                <p className="text-xs text-gray-400 font-medium">
                                                    or drag & drop • JPG, PNG, WebP • Max 5MB
                                                </p>
                                            </div>
                                        ) : (
                                            /* Image Preview */
                                            <div className="relative">
                                                <div className="flex items-center gap-5 bg-gray-50/80 rounded-2xl border-2 border-gray-100 p-4">
                                                    {/* Preview thumbnail */}
                                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-lg flex-shrink-0">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    {/* File info & actions */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-800 text-sm truncate">
                                                            {selectedFile?.name}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            {(selectedFile?.size / 1024).toFixed(1)} KB
                                                        </p>

                                                        {/* Status */}
                                                        {uploadDone ? (
                                                            <div className="flex items-center gap-1.5 mt-2 text-green-600">
                                                                <CheckCircle size={14} />
                                                                <span className="text-xs font-bold">Uploaded!</span>
                                                            </div>
                                                        ) : uploadLoading ? (
                                                            <div className="flex items-center gap-2 mt-2 text-blue-500">
                                                                <div className="w-3.5 h-3.5 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                                                                <span className="text-xs font-bold">Uploading...</span>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={uploadImage}
                                                                className="mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1"
                                                            >
                                                                <Upload size={12} />
                                                                Upload Now
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Remove button */}
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="w-8 h-8 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition-all flex-shrink-0"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Or use auto-generated */}
                                        {!imagePreview && (
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-px bg-gray-200" />
                                                <span className="text-xs text-gray-400 font-medium">or skip for auto avatar</span>
                                                <div className="flex-1 h-px bg-gray-200" />
                                            </div>
                                        )}

                                        {/* Auto avatar preview (if no image selected) */}
                                        {!imagePreview && (
                                            <div className="flex justify-center">
                                                <div className="flex items-center gap-3 bg-gray-50/80 rounded-2xl px-5 py-3 border border-gray-100">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                                                        <img
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.full_name || 'Worker')}`}
                                                            alt="Auto Avatar"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-600">Auto-generated avatar</p>
                                                        <p className="text-xs text-gray-400">Used if no photo uploaded</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Your Location</label>
                                        <motion.button
                                            whileTap={{ scale: 0.97 }}
                                            type="button"
                                            onClick={getLocation}
                                            disabled={locationLoading || locationFetched}
                                            className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 border-2 ${locationFetched
                                                    ? 'bg-green-50 border-green-200 text-green-600'
                                                    : locationLoading
                                                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-blue-50/80 border-blue-100 text-blue-600 hover:bg-blue-100/80 hover:border-blue-200'
                                                }`}
                                        >
                                            {locationFetched ? (
                                                <>
                                                    <CheckCircle size={20} />
                                                    Location Captured!
                                                </>
                                            ) : locationLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                                                    Getting Location...
                                                </>
                                            ) : (
                                                <>
                                                    <MapPin size={20} />
                                                    Allow Location Access
                                                </>
                                            )}
                                        </motion.button>
                                        {locationFetched && (
                                            <p className="text-xs text-gray-400 text-center font-medium">
                                                📍 {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            {step > 1 && (
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    type="button"
                                    onClick={() => { setStep(step - 1); setError(''); }}
                                    className="px-6 py-4 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all text-base"
                                >
                                    Back
                                </motion.button>
                            )}

                            {step < 3 ? (
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    type="button"
                                    onClick={handleNext}
                                    className="flex-1 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-300/40 hover:shadow-blue-300/60 flex items-center justify-center gap-2 transition-all"
                                >
                                    Next
                                    <ArrowRight size={20} />
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    type="submit"
                                    disabled={loading || uploadLoading}
                                    className={`flex-1 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg ${loading || uploadLoading
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-300/40 hover:shadow-green-300/60'
                                        }`}
                                >
                                    {loading || uploadLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                                            {uploadLoading ? 'Uploading Photo...' : 'Creating Account...'}
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <CheckCircle size={20} />
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </div>

                        {/* Login link */}
                        <div className="text-center pt-2">
                            <span className="text-gray-400 text-sm font-medium">Already have an account? </span>
                            <Link to="/login" className="text-blue-600 font-bold text-sm hover:text-blue-700">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default SignupPage;
