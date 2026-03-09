import React, { useState } from 'react';
import { professions } from '../data/mockData';
import { Play, ClipboardList, ChevronLeft, Zap, Hammer, Droplets, HardHat, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
    Zap, Hammer, Droplets, HardHat
};

const SkillLearning = () => {
    const [selectedProfession, setSelectedProfession] = useState(null);
    const navigate = useNavigate();

    return (
        <div className="pb-24 bg-slate-50 min-h-screen font-sans">
            <header className="p-6 bg-white border-b sticky top-0 z-40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => selectedProfession ? setSelectedProfession(null) : navigate('/dashboard')}
                        className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-gray-700 shadow-sm border border-gray-100 hover:bg-slate-100"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-black text-gray-900">
                        {selectedProfession ? selectedProfession.title : 'Professional Skills'}
                    </h1>
                </div>
            </header>

            <main className="p-6 max-w-lg mx-auto md:max-w-none md:px-12">
                <AnimatePresence mode="wait">
                    {!selectedProfession ? (
                        <motion.div
                            key="prof-list"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {professions.map((prof) => (
                                <motion.div
                                    key={prof.id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => setSelectedProfession(prof)}
                                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center cursor-pointer hover:shadow-2xl hover:shadow-blue-200/50 transition-all border-b-4 border-b-blue-100 hover:border-b-blue-600 group"
                                >
                                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {iconMap[prof.icon] && React.createElement(iconMap[prof.icon], { className: "text-blue-500 w-10 h-10" })}
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-800 mb-2 truncate group-hover:text-blue-600">{prof.title}</h3>
                                    <p className="text-gray-500 font-medium">{prof.modules.length} modules available</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="module-list"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            {selectedProfession.modules.map((module, idx) => (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden border-l-4 border-l-blue-600"
                                >
                                    {/* Video Placeholder */}
                                    <div className="aspect-video bg-slate-900 flex items-center justify-center group relative cursor-pointer">
                                        <img src={`https://img.youtube.com/vi/${module.id}/maxresdefault.jpg`} className="w-full h-full object-cover opacity-60" onError={(e) => e.target.style.display = 'none'} />
                                        <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Play className="text-white w-20 h-20 fill-white" />
                                        </div>
                                        {!module.thumbnail && (
                                            <div className="flex flex-col items-center text-gray-400">
                                                <Play size={64} className="mb-4 text-blue-500" />
                                                <span className="font-bold text-lg">Watch Module Video</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8">
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <span className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1 block">Module {idx + 1}</span>
                                                <h4 className="text-2xl font-black text-gray-900">{module.title}</h4>
                                            </div>
                                            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2">
                                                <CheckCircle2 size={16} /> Completed
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button className="flex-1 px-6 py-5 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all text-lg">
                                                <Play className="fill-white" size={20} /> Watch Video
                                            </button>
                                            <button
                                                onClick={() => navigate(`/quiz/${module.quizId}`)}
                                                className="px-6 py-5 bg-white border-2 border-gray-100 text-gray-900 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 active:scale-95 transition-all text-lg"
                                            >
                                                <ClipboardList size={20} /> Take Quiz
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default SkillLearning;
