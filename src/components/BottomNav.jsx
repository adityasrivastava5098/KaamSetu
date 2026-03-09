import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Play, Award, MessageCircle, Briefcase } from 'lucide-react';

const BottomNav = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 glass bottom-nav-shadow px-4 py-2 flex justify-around items-center z-50 md:hidden">
            <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                    `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-primary' : 'text-gray-500'}`
                }
            >
                <Home size={24} />
                <span className="text-[10px] mt-1 font-medium">Home</span>
            </NavLink>
            <NavLink
                to="/reels"
                className={({ isActive }) =>
                    `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-primary' : 'text-gray-500'}`
                }
            >
                <Play size={24} />
                <span className="text-[10px] mt-1 font-medium">Reels</span>
            </NavLink>
            <NavLink
                to="/badges"
                className={({ isActive }) =>
                    `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-primary' : 'text-gray-500'}`
                }
            >
                <Award size={24} />
                <span className="text-[10px] mt-1 font-medium">Badges</span>
            </NavLink>
            <NavLink
                to="/chatbot"
                className={({ isActive }) =>
                    `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-primary' : 'text-gray-500'}`
                }
            >
                <MessageCircle size={24} />
                <span className="text-[10px] mt-1 font-medium">AI Helper</span>
            </NavLink>
            <NavLink
                to="/jobs"
                className={({ isActive }) =>
                    `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-primary' : 'text-gray-500'}`
                }
            >
                <Briefcase size={24} />
                <span className="text-[10px] mt-1 font-medium">Jobs</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
