import React from 'react';
import { badges } from '../data/mockData';
import { Award, ChevronLeft, Share2, Zap, Hammer, Droplets, HardHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const iconMap = {
    Zap, Hammer, Droplets, HardHat
};

const BadgePage = () => {
    const navigate = useNavigate();

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
                    <h1 className="text-2xl font-black text-gray-900">Your Achievements</h1>
                </div>
            </header>

            <main className="p-6 max-w-lg mx-auto md:max-w-none md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {badges.map((badge, idx) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-blue-50/50 flex flex-col items-center text-center group cursor-pointer hover:border-blue-200 transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-150 transition-transform duration-700" />

                            <div className="w-32 h-32 bg-orange-100 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner shadow-orange-200 group-hover:bg-orange-200 transition-colors">
                                {iconMap[badge.icon] && React.createElement(iconMap[badge.icon], { className: "text-orange-500 w-16 h-16 group-hover:scale-110 transition-transform" })}
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 mb-4">{badge.title}</h3>
                            <p className="text-gray-500 font-medium mb-8 leading-relaxed px-4">{badge.description}</p>

                            <div className="flex gap-4 w-full">
                                <button className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all">
                                    <Share2 size={20} /> Share
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {/* Locked Badge (Placeholder) */}
                    <motion.div
                        initial={{ opacity: 0.5 }}
                        className="bg-gray-50 p-10 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center text-center group opacity-40 grayscale pointer-events-none"
                    >
                        <div className="w-32 h-32 bg-gray-200 rounded-[2.5rem] flex items-center justify-center mb-8 grayscale group-hover:grayscale-0 transition-all">
                            <Award size={64} className="text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-400 mb-4">Master Mason</h3>
                        <p className="text-gray-400 font-medium mb-8 leading-relaxed">Level up to unlock this badge!</p>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default BadgePage;
