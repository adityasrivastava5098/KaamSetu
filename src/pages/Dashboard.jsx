import React from 'react';
import { useNavigate } from 'react-router-dom';
import { professions, badges } from '../data/mockData';
import { Award, BookOpen, ChevronRight, Zap, Hammer, Droplets, HardHat } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";

const iconMap = {
    Zap, Hammer, Droplets, HardHat
};

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="pb-20 bg-slate-50 min-h-screen">
            <header className="p-6 bg-white border-b sticky top-0 z-40 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Namaste, Ramesh</h1>
                    <p className="text-gray-500 font-medium">Ready to learn today?</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh" alt="Avatar" />
                </div>
            </header>

            <main className="p-6 space-y-8 max-w-lg mx-auto md:max-w-none md:px-12">
                {/* capsule  */}
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
                {/* Badges Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <Award className="text-orange-500" />
                            Latest Badges
                        </h3>
                        <button
                            onClick={() => navigate('/badges')}
                            className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl"
                        >
                            See All
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {badges.slice(0, 2).map((badge) => (
                            <motion.div
                                key={badge.id}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                                    {iconMap[badge.icon] && React.createElement(iconMap[badge.icon], { className: "text-orange-500 w-8 h-8" })}
                                </div>
                                <h4 className="font-black text-sm text-gray-800 leading-tight">{badge.title}</h4>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Recommended Courses */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <BookOpen className="text-blue-500" />
                            Recommended Skills
                        </h3>
                        <button
                            onClick={() => navigate('/learning')}
                            className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl"
                        >
                            Learn More
                        </button>
                    </div>
                    <div className="space-y-4">
                        {professions.map((prof) => (
                            <motion.div
                                key={prof.id}
                                whileHover={{ x: 5 }}
                                onClick={() => navigate('/learning')}
                                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 cursor-pointer hover:border-blue-200 transition-all"
                            >
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    {iconMap[prof.icon] && React.createElement(iconMap[prof.icon], { className: "text-blue-500 w-7 h-7" })}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800">{prof.title}</h4>
                                    <p className="text-sm text-gray-500 font-medium">{prof.modules.length} Modules</p>
                                </div>
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-gray-400">
                                    <ChevronRight size={20} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
