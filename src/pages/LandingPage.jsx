import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Award, Briefcase, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 -left-1/4 w-[500px] h-[500px] bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
                <div className="absolute top-0 -right-1/4 w-[500px] h-[500px] bg-green-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-2xl px-4"
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                        Learn Skills. Get <span className="text-blue-600">Certified.</span> Find Work.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed font-medium">
                        Empowering migrant workers with practical job skills and connecting them to life-changing opportunities.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group transform active:scale-95"
                        >
                            Start Learning
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/jobs?role=provider')}
                            className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-2xl hover:border-blue-100 hover:bg-blue-50/10 transition-all transform active:scale-95 shadow-sm"
                        >
                            Find Workers
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="p-10 rounded-3xl bg-gray-50 border border-gray-100/50 hover:shadow-2xl hover:shadow-gray-200/50 transition-all"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-8 shadow-lg`}>
                                <feature.icon className="text-white w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

const features = [
    {
        title: "Skill Learning",
        description: "Practical video-based modules for various trades like electrician, plumbing, and more.",
        icon: BookOpen,
        color: "bg-blue-500"
    },
    {
        title: "Skill Badges",
        description: "Complete quizzes to earn verified digital badges and prove your expertise.",
        icon: Award,
        color: "bg-green-500"
    },
    {
        title: "Job Opportunities",
        description: "Connect directly with job providers looking for your specific skills and certifications.",
        icon: Briefcase,
        color: "bg-orange-500"
    }
];

export default LandingPage;
