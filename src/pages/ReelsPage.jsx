import React, { useRef, useState, useEffect } from 'react';
import { reels } from '../data/mockData';
import { Heart, MessageCircle, Share2, Play, Bookmark, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ReelsPage = () => {
    const navigate = useNavigate();
    const [activeReel, setActiveReel] = useState(0);
    const scrollRef = useRef(null);

    const handleScroll = (e) => {
        const scrollPos = e.target.scrollTop;
        const itemHeight = e.target.clientHeight;
        const index = Math.round(scrollPos / itemHeight);
        setActiveReel(index);
    };

    return (
        <div className="h-screen bg-black overflow-hidden relative">
            <header className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between text-white pointer-events-none">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-xl hover:bg-white/20 active:scale-95 transition-all pointer-events-auto"
                >
                    <ChevronLeft size={24} />
                </button>
                <span className="text-xl font-black font-sans tracking-wide pointer-events-auto">SkillReels</span>
                <div className="w-12 pointer-events-auto" />
            </header>

            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar relative"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {reels.map((reel, idx) => (
                    <div key={reel.id} className="h-full w-full snap-start relative flex flex-col justify-end bg-gradient-to-t from-black via-transparent to-transparent">
                        {/* Video Placeholder */}
                        <div className="absolute inset-0 z-0">
                            <img src={`https://picsum.photos/seed/${reel.id}/1080/1920`} className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 flex items-center justify-center group pointer-events-none">
                                <Play size={80} className="text-white fill-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>

                        {/* Reel Content */}
                        <div className="relative z-10 p-8 pb-32 flex justify-between items-end gap-6 max-w-lg mx-auto md:max-w-none md:p-12 md:pb-40">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 bg-blue-100 p-1">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh" alt="Avatar" />
                                    </div>
                                    <h4 className="text-lg font-black text-white drop-shadow-md">Ramesh Kumar</h4>
                                    <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Follow</button>
                                </div>
                                <h3 className="text-2xl font-black text-white leading-tight drop-shadow-md">{reel.title}</h3>
                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black text-white uppercase tracking-widest">
                                    <span className="bg-white text-black px-2 py-0.5 rounded-md mr-1">#{reel.profession}</span>
                                    {reel.profession} Skill
                                </div>
                            </div>

                            {/* Right Side Actions */}
                            <div className="flex flex-col gap-8 pb-2">
                                <ReelAction icon={Heart} label={reel.likes} active />
                                <ReelAction icon={MessageCircle} label="45" />
                                <ReelAction icon={Bookmark} label="Save" />
                                <ReelAction icon={Share2} label="Share" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ReelAction = ({ icon: Icon, label, active = false }) => (
    <div className="flex flex-col items-center gap-2 group cursor-pointer active:scale-75 transition-transform duration-200">
        <div className={`w-14 h-14 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all ${active ? 'bg-red-500/20 text-red-500' : 'text-white'}`}>
            <Icon size={24} className={active ? 'fill-red-500 stroke-red-500' : ''} />
        </div>
        <span className="text-xs font-black text-white drop-shadow-md">{label}</span>
    </div>
);

export default ReelsPage;
