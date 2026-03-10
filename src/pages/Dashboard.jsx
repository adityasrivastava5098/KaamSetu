import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Award, BookOpen, ChevronRight, Zap, Hammer, Droplets, HardHat, Paintbrush, LogOut, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const iconMap = { Zap, Hammer, Droplets, HardHat, Paintbrush };

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const userName = user?.full_name?.split(' ')[0] || 'Worker';
    const avatarUrl = user?.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`;

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
                console.error('Failed to load dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.id]);

    const badges = workerData?.badges || user?.badges || [];
    const completedCourses = workerData?.completed_courses || user?.completed_courses || [];
    const progress = workerData?.progress || user?.progress || {};

    // Map badge names to icons from courses
    const badgeIconMap = {};
    courses.forEach((c) => { badgeIconMap[c.skillname] = c.icon; });

    return (
        <div className="pb-20 bg-slate-50 min-h-screen">
            <header className="p-6 bg-white border-b sticky top-0 z-40 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Namaste, {userName}</h1>
                    <p className="text-gray-500 font-medium">Ready to learn today?</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-500 transition-all"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                        <img src={avatarUrl} alt="Avatar" />
                    </div>
                </div>
            </header>

            <main className="p-6 space-y-8 max-w-lg mx-auto md:max-w-none md:px-12">
                {/* Quick Access */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-8 text-white shadow-xl"
                >
                    <h2 className="text-lg font-semibold mb-6">Quick Access</h2>
                    <div className="grid grid-cols-3 gap-5">
                        <Link to="/dashboard">
                            <div className="bg-white/15 backdrop-blur-lg hover:bg-white/25 transition rounded-2xl p-5 text-center cursor-pointer">
                                <div className="text-3xl mb-2">📊</div>
                                <p className="font-medium">Dashboard</p>
                            </div>
                        </Link>
                        <Link to="/learning">
                            <div className="bg-white/15 hover:bg-white/25 transition rounded-2xl p-5 text-center cursor-pointer">
                                <div className="text-3xl mb-2">📚</div>
                                <p className="font-medium">Learn</p>
                            </div>
                        </Link>
                        <Link to="/badges">
                            <div className="bg-white/15 hover:bg-white/25 transition rounded-2xl p-5 text-center cursor-pointer">
                                <div className="text-3xl mb-2">🏆</div>
                                <p className="font-medium">Badges</p>
                            </div>
                        </Link>
                        <Link to="/chatbot">
                            <div className="bg-white/15 hover:bg-white/25 transition rounded-2xl p-5 text-center cursor-pointer">
                                <div className="text-3xl mb-2">🤖</div>
                                <p className="font-medium">AI Chat</p>
                            </div>
                        </Link>
                        <Link to="/jobs">
                            <div className="bg-white/15 hover:bg-white/25 transition rounded-2xl p-5 text-center cursor-pointer">
                                <div className="text-3xl mb-2">💼</div>
                                <p className="font-medium">Jobs</p>
                            </div>
                        </Link>
                        <Link to="/reels">
                            <div className="bg-white/15 hover:bg-white/25 transition rounded-2xl p-5 text-center cursor-pointer">
                                <div className="text-3xl mb-2">🎬</div>
                                <p className="font-medium">Reels</p>
                            </div>
                        </Link>
                    </div>
                </motion.div>

                {/* Earned Badges */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <Award className="text-orange-500" />
                            Your Badges
                            {badges.length > 0 && (
                                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {badges.length}
                                </span>
                            )}
                        </h3>
                        <button
                            onClick={() => navigate('/badges')}
                            className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl"
                        >
                            See All
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {badges.length > 0 ? (
                            badges.slice(0, 4).map((badge, idx) => {
                                const iconName = badgeIconMap[badge];
                                const Icon = iconMap[iconName];
                                return (
                                    <motion.div
                                        key={badge}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center"
                                    >
                                        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                                            {Icon ? <Icon className="text-orange-500 w-8 h-8" /> : <Award className="text-orange-500 w-8 h-8" />}
                                        </div>
                                        <h4 className="font-black text-sm text-gray-800 leading-tight">{badge}</h4>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="col-span-2 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-8 text-center">
                                <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-400 font-medium">No badges yet. Complete a course to earn your first badge!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Courses with Progress */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <BookOpen className="text-blue-500" />
                            Skill Courses
                        </h3>
                        <button
                            onClick={() => navigate('/learning')}
                            className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl"
                        >
                            Learn More
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {courses.map((course) => {
                                const Icon = iconMap[course.icon];
                                const isCompleted = completedCourses.includes(course.cid);
                                const prog = progress[course.cid] || 0;
                                const progressPercent = Math.round((prog / 3) * 100);

                                return (
                                    <motion.div
                                        key={course.cid}
                                        whileHover={{ x: 5 }}
                                        onClick={() => navigate('/learning')}
                                        className={`bg-white p-5 rounded-3xl border shadow-sm flex items-center gap-5 cursor-pointer hover:border-blue-200 transition-all ${isCompleted ? 'border-green-200' : 'border-gray-100'
                                            }`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-50' : 'bg-blue-50'
                                            }`}>
                                            {Icon && <Icon className={`w-7 h-7 ${isCompleted ? 'text-green-500' : 'text-blue-500'}`} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-800">{course.cname}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                {isCompleted ? (
                                                    <span className="text-sm text-green-600 font-bold">✅ Completed</span>
                                                ) : prog > 0 ? (
                                                    <>
                                                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                                            <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                                                        </div>
                                                        <span className="text-xs text-gray-500 font-medium">{prog}/3</span>
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-gray-500 font-medium">3 Modules</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-gray-400">
                                            <ChevronRight size={20} />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
