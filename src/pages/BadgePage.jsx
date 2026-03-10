import React, { useState, useEffect } from 'react';
import { Award, ChevronLeft, Share2, Zap, Hammer, Droplets, HardHat, Paintbrush, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const iconMap = { Zap, Hammer, Droplets, HardHat, Paintbrush };

const BadgePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [workerData, setWorkerData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesData, progressData] = await Promise.all([
                    api.getCourses(),
                    user?.id ? api.getWorkerProgress(user.id) : Promise.resolve(null),
                ]);
                setCourses(coursesData);
                setWorkerData(progressData);
            } catch (err) {
                console.error('Failed to load badges:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.id]);

    const earnedBadges = workerData?.badges || user?.badges || [];

    // Build all possible badges from courses, marking earned/locked
    const allBadges = courses.map((course) => ({
        skillname: course.skillname,
        cname: course.cname,
        icon: course.icon,
        earned: earnedBadges.includes(course.skillname),
    }));

    const earned = allBadges.filter((b) => b.earned);
    const locked = allBadges.filter((b) => !b.earned);

    return (
        <div className="pb-24 bg-slate-50 min-h-screen font-sans">
            <header className="p-6 bg-white border-b sticky top-0 z-40 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-gray-700 shadow-sm border border-gray-100 hover:bg-slate-100 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Your Achievements</h1>
                        <p className="text-sm text-gray-500 font-medium">
                            {earned.length}/{allBadges.length} badges earned
                        </p>
                    </div>
                </div>
            </header>

            <main className="p-6 max-w-lg mx-auto md:max-w-none md:p-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Loading badges...</p>
                    </div>
                ) : (
                    <>
                        {/* Earned Badges */}
                        {earned.length > 0 && (
                            <div className="mb-10">
                                <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                                    <Award className="text-orange-500" size={22} />
                                    Earned Badges
                                    <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                        {earned.length}
                                    </span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {earned.map((badge, idx) => {
                                        const Icon = iconMap[badge.icon];
                                        return (
                                            <motion.div
                                                key={badge.skillname}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                whileHover={{ y: -10 }}
                                                className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-blue-50/50 flex flex-col items-center text-center group cursor-pointer hover:border-orange-200 transition-all relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-50 to-transparent rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-150 transition-transform duration-700" />

                                                <div className="w-28 h-28 bg-orange-100 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner shadow-orange-200 group-hover:bg-orange-200 transition-colors">
                                                    {Icon ? <Icon className="text-orange-500 w-14 h-14 group-hover:scale-110 transition-transform" /> : <Award className="text-orange-500 w-14 h-14" />}
                                                </div>

                                                <h3 className="text-xl font-black text-gray-900 mb-2">{badge.skillname}</h3>
                                                <p className="text-gray-500 font-medium mb-6 text-sm">{badge.cname}</p>

                                                <div className="flex gap-3 w-full">
                                                    <button className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all">
                                                        <Share2 size={18} /> Share
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* No badges message */}
                        {earned.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center mb-10"
                            >
                                <Award className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-black text-gray-600 mb-2">No Badges Yet</h3>
                                <p className="text-gray-400 font-medium mb-6">
                                    Complete skill courses to earn professional badges!
                                </p>
                                <button
                                    onClick={() => navigate('/learning')}
                                    className="bg-blue-600 text-white font-bold px-8 py-3 rounded-2xl hover:bg-blue-700 transition-colors active:scale-95"
                                >
                                    Start Learning →
                                </button>
                            </motion.div>
                        )}

                        {/* Locked Badges */}
                        {locked.length > 0 && (
                            <div>
                                <h2 className="text-lg font-black text-gray-500 mb-6 flex items-center gap-2">
                                    <Lock size={18} />
                                    Locked Badges
                                    <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                        {locked.length}
                                    </span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {locked.map((badge, idx) => {
                                        const Icon = iconMap[badge.icon];
                                        return (
                                            <motion.div
                                                key={badge.skillname}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 0.5, y: 0 }}
                                                transition={{ delay: idx * 0.08 }}
                                                onClick={() => navigate('/learning')}
                                                className="bg-gray-50 p-10 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center text-center group cursor-pointer hover:border-blue-200 hover:opacity-70 transition-all grayscale hover:grayscale-0"
                                            >
                                                <div className="w-28 h-28 bg-gray-200 rounded-[2.5rem] flex items-center justify-center mb-6 relative">
                                                    {Icon ? <Icon className="text-gray-400 w-14 h-14" /> : <Award className="text-gray-400 w-14 h-14" />}
                                                    <div className="absolute -bottom-1 -right-1 bg-gray-300 rounded-full p-1.5">
                                                        <Lock size={14} className="text-white" />
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-black text-gray-400 mb-2">{badge.skillname}</h3>
                                                <p className="text-gray-400 font-medium text-sm">
                                                    Complete "{badge.cname}" to unlock
                                                </p>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default BadgePage;
