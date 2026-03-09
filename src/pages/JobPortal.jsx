import React, { useState } from 'react';
import { workers, jobs } from '../data/mockData';
import { Search, MapPin, Briefcase, Phone, ChevronLeft, User, Filter, ArrowRight, Star, ExternalLink } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const JobPortal = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [view, setView] = useState(searchParams.get('role') || 'worker'); // 'worker' view or 'provider' view
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="pb-24 bg-slate-50 min-h-screen font-sans">
            <header className="p-8 bg-blue-600 border-b sticky top-0 z-40 text-white shadow-xl shadow-blue-100">
                <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 shadow-md transform active:scale-95 transition-all"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-3xl font-black tracking-tight">{view === 'worker' ? 'Jobs for You' : 'Find Workers'}</h1>
                    </div>
                    <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-inner">
                        <button
                            onClick={() => setView('worker')}
                            className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${view === 'worker' ? 'bg-white text-blue-600 shadow-xl' : 'text-white'}`}
                        >
                            Worker
                        </button>
                        <button
                            onClick={() => setView('provider')}
                            className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${view === 'provider' ? 'bg-white text-blue-600 shadow-xl' : 'text-white'}`}
                        >
                            Provider
                        </button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors" size={24} />
                    <input
                        type="text"
                        placeholder={view === 'worker' ? "Search jobs by skill..." : "Search workers by skill..."}
                        className="w-full pl-16 pr-24 py-6 bg-white rounded-[2rem] text-gray-800 font-bold placeholder:text-gray-400 outline-none shadow-2xl shadow-blue-900/10 focus:ring-4 focus:ring-blue-100 placeholder:font-medium text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-slate-100 text-gray-500 rounded-2xl hover:bg-slate-200 transition-all border border-slate-200 shadow-sm">
                        <Filter size={20} />
                    </button>
                </div>
            </header>

            <main className="p-6 max-w-4xl mx-auto md:p-12">
                <AnimatePresence mode="wait">
                    {view === 'worker' ? (
                        <motion.div
                            key="worker-view"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-gray-900 border-l-4 border-l-blue-600 pl-4 py-1">Available Openings</h2>
                                <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">Matched 100%</span>
                            </div>
                            {jobs.map((job, idx) => (
                                <JobCard key={job.id} job={job} delay={idx * 0.1} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="provider-view"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-gray-900 border-l-4 border-l-orange-500 pl-4 py-1">Featured Workers</h2>
                                <span className="bg-orange-50 text-orange-600 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">Highly Rated</span>
                            </div>
                            {workers.map((worker, idx) => (
                                <WorkerCard key={worker.id} worker={worker} delay={idx * 0.1} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

const JobCard = ({ job, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-50/30 group hover:border-blue-200 transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start gap-6 relative overflow-hidden"
    >
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 group-hover:w-3 transition-all" />
        <div className="flex gap-6 items-center">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 flex-shrink-0 shadow-inner group-hover:bg-blue-100 group-hover:scale-105 transition-all">
                <Briefcase size={36} />
            </div>
            <div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                <p className="text-lg font-bold text-gray-600 mb-3 flex items-center gap-2">
                    <User size={18} className="text-blue-500" /> {job.company}
                </p>
                <div className="flex flex-wrap gap-3">
                    <span className="bg-slate-50 text-gray-500 px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 border border-gray-100">
                        <MapPin size={16} /> {job.location}
                    </span>
                    <span className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-sm font-black border border-green-100 shadow-sm">
                        {job.salary}
                    </span>
                </div>
            </div>
        </div>
        <button className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-gray-100 text-gray-900 font-black rounded-2xl hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 transform whitespace-nowrap text-lg flex items-center justify-center gap-3">
            Apply Now <ArrowRight size={20} />
        </button>
    </motion.div>
);

const WorkerCard = ({ worker, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-orange-50/30 group hover:border-orange-200 transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-center gap-8 text-center sm:text-left relative overflow-hidden"
    >
        <div className="absolute top-0 left-0 w-2 h-full bg-orange-500 group-hover:w-3 transition-all" />
        <div className="flex flex-col sm:flex-row gap-8 items-center flex-1">
            <div className="relative">
                <div className="w-32 h-32 bg-orange-50 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-all ring-4 ring-orange-50">
                    <img src={worker.avatar} alt={worker.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg ring-2 ring-green-100">
                    <Star size={18} fill="currentColor" />
                </div>
            </div>
            <div className="flex-1 w-full">
                <h3 className="text-3xl font-black text-gray-900 mb-2 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{worker.name}</h3>
                <p className="text-gray-500 font-black text-sm mb-4 flex items-center justify-center sm:justify-start gap-2 tracking-widest uppercase">
                    <span className="text-orange-500 flex items-center gap-1 font-black">
                        Exp: {worker.experience}
                    </span>
                    •
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-xs font-black shadow-sm ring-1 ring-green-200">{worker.status}</span>
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {worker.skills.map((skill, i) => (
                        <span key={i} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl text-xs font-black shadow-sm border border-blue-100 uppercase tracking-widest">{skill}</span>
                    ))}
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-4 w-full sm:w-auto">
            <button className="px-10 py-5 bg-orange-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-orange-200 hover:bg-orange-600 active:scale-95 transition-all text-lg group/btn">
                <Phone size={24} className="group-hover/btn:rotate-12 transition-transform" /> Contact
            </button>
            <button className="px-10 py-5 bg-white border-2 border-gray-100 text-gray-900 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 active:scale-95 transition-all text-lg border-b-4 border-b-gray-200">
                <User size={24} /> Profile
            </button>
        </div>
    </motion.div>
);

export default JobPortal;
