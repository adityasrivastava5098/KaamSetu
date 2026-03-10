import React, { useState, useEffect } from 'react';
import { Play, ChevronLeft, Zap, Hammer, Droplets, HardHat, Paintbrush, CheckCircle2, BookOpen, Loader2, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const iconMap = { Zap, Hammer, Droplets, HardHat, Paintbrush };

// Helper: extract YouTube video ID from URL
const getYouTubeId = (url) => {
    const match = url.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
};

const SkillLearning = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseDetail, setCourseDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [progress, setProgress] = useState(user?.progress || {});
    const [completedCourses, setCompletedCourses] = useState(user?.completed_courses || []);
    const [activeVideo, setActiveVideo] = useState(null);

    // Fetch all courses on mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await api.getCourses();
                setCourses(data);
            } catch (err) {
                console.error('Failed to fetch courses:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Fetch worker progress
    useEffect(() => {
        const fetchProgress = async () => {
            if (!user?.id) return;
            try {
                const data = await api.getWorkerProgress(user.id);
                setProgress(data.progress || {});
                setCompletedCourses(data.completed_courses || []);
            } catch (err) {
                console.error('Failed to fetch progress:', err);
            }
        };
        fetchProgress();
    }, [user?.id]);

    // Handle selecting a course → fetch full details
    const handleSelectCourse = async (course) => {
        setSelectedCourse(course);
        setDetailLoading(true);
        setActiveVideo(null);
        try {
            const detail = await api.getCourseDetail(course.cid);
            setCourseDetail(detail);
        } catch (err) {
            console.error('Failed to fetch course detail:', err);
        } finally {
            setDetailLoading(false);
        }
    };

    // Handle watching a module video → update progress
    const handleWatchModule = async (moduleKey, moduleIndex) => {
        setActiveVideo(moduleKey);

        if (!user?.id || !selectedCourse?.cid) return;

        try {
            await api.updateProgress(user.id, selectedCourse.cid, moduleIndex);
            setProgress((prev) => ({
                ...prev,
                [selectedCourse.cid]: Math.max(prev[selectedCourse.cid] || 0, moduleIndex),
            }));

            // Update user in AuthContext
            const updatedUser = {
                ...user,
                progress: { ...user.progress, [selectedCourse.cid]: Math.max(user.progress?.[selectedCourse.cid] || 0, moduleIndex) },
            };
            login(updatedUser);
        } catch (err) {
            console.error('Failed to update progress:', err);
        }
    };

    // Handle completing a course
    const handleCompleteCourse = async () => {
        if (!user?.id || !selectedCourse?.cid) return;

        try {
            const result = await api.completeCourse(user.id, selectedCourse.cid);
            setCompletedCourses(result.completed_courses);

            // Update user in AuthContext
            const updatedUser = {
                ...user,
                completed_courses: result.completed_courses,
                badges: result.badges,
            };
            login(updatedUser);

            alert(`🎉 Course completed! You earned the "${result.badge_added}" badge!`);
        } catch (err) {
            console.error('Failed to complete course:', err);
        }
    };

    const modules = courseDetail?.videolinks ? Object.entries(courseDetail.videolinks) : [];
    const courseProgress = selectedCourse ? (progress[selectedCourse.cid] || 0) : 0;
    const isCourseCompleted = selectedCourse ? completedCourses.includes(selectedCourse.cid) : false;
    const allModulesWatched = courseProgress >= modules.length;

    return (
        <div className="pb-24 bg-slate-50 min-h-screen font-sans">
            <header className="p-6 bg-white border-b sticky top-0 z-40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => selectedCourse ? (setSelectedCourse(null), setCourseDetail(null), setActiveVideo(null)) : navigate('/dashboard')}
                        className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-gray-700 shadow-sm border border-gray-100 hover:bg-slate-100"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">
                            {selectedCourse ? selectedCourse.cname : 'Skill Courses'}
                        </h1>
                        {selectedCourse && (
                            <p className="text-sm text-gray-500 font-medium">
                                {isCourseCompleted ? '✅ Completed' : `${courseProgress}/${modules.length} modules watched`}
                            </p>
                        )}
                    </div>
                </div>
            </header>

            <main className="p-6 max-w-lg mx-auto md:max-w-none md:px-12">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Loading courses...</p>
                        </motion.div>
                    ) : !selectedCourse ? (
                        /* ─── COURSE LIST ─────────────────────────────────────────── */
                        <motion.div
                            key="course-list"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {courses.map((course) => {
                                const Icon = iconMap[course.icon];
                                const isCompleted = completedCourses.includes(course.cid);
                                const prog = progress[course.cid] || 0;

                                return (
                                    <motion.div
                                        key={course.cid}
                                        whileHover={{ y: -5 }}
                                        onClick={() => handleSelectCourse(course)}
                                        className={`relative bg-white p-8 rounded-3xl border shadow-sm flex flex-col items-center text-center cursor-pointer hover:shadow-2xl hover:shadow-blue-200/50 transition-all group ${isCompleted
                                                ? 'border-green-200 border-b-4 border-b-green-500'
                                                : 'border-gray-100 border-b-4 border-b-blue-100 hover:border-b-blue-600'
                                            }`}
                                    >
                                        {/* Completed badge */}
                                        {isCompleted && (
                                            <div className="absolute top-4 right-4 bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                <CheckCircle2 size={12} /> Done
                                            </div>
                                        )}

                                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${isCompleted ? 'bg-green-50' : 'bg-blue-50'
                                            }`}>
                                            {Icon && <Icon className={`w-10 h-10 ${isCompleted ? 'text-green-500' : 'text-blue-500'}`} />}
                                        </div>

                                        <h3 className="text-xl font-black text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{course.cname}</h3>
                                        <p className="text-sm text-gray-500 font-medium mb-4">🏅 {course.skillname}</p>

                                        {/* Progress bar */}
                                        {!isCompleted && prog > 0 && (
                                            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${(prog / 3) * 100}%` }}
                                                />
                                            </div>
                                        )}
                                        <p className="text-gray-400 font-medium text-sm">
                                            {isCompleted ? 'All modules completed' : prog > 0 ? `${prog} modules watched` : '3 modules available'}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : detailLoading ? (
                        <motion.div
                            key="detail-loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">Loading course modules...</p>
                        </motion.div>
                    ) : (
                        /* ─── MODULE LIST WITH VIDEOS ────────────────────────────── */
                        <motion.div
                            key="module-list"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            {modules.map(([moduleKey, videoUrl], idx) => {
                                const moduleIndex = idx + 1;
                                const ytId = getYouTubeId(videoUrl);
                                const isWatched = courseProgress >= moduleIndex;
                                const isActive = activeVideo === moduleKey;

                                return (
                                    <motion.div
                                        key={moduleKey}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`bg-white rounded-3xl border shadow-sm overflow-hidden border-l-4 ${isWatched ? 'border-l-green-500 border-green-100' : 'border-l-blue-600 border-gray-100'
                                            }`}
                                    >
                                        {/* Video Embed or Thumbnail */}
                                        {isActive && ytId ? (
                                            <div className="aspect-video">
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                                                    title={moduleKey}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="w-full h-full"
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="aspect-video bg-slate-900 flex items-center justify-center group relative cursor-pointer"
                                                onClick={() => handleWatchModule(moduleKey, moduleIndex)}
                                            >
                                                {ytId && (
                                                    <img
                                                        src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                                                        className="w-full h-full object-cover opacity-70"
                                                        alt={moduleKey}
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Play className="text-white w-10 h-10 fill-white ml-1" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <span className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1 block">
                                                        Module {moduleIndex}
                                                    </span>
                                                    <h4 className="text-xl font-black text-gray-900 capitalize">
                                                        {moduleKey.replace(/module/i, 'Module ')}
                                                    </h4>
                                                </div>
                                                {isWatched && (
                                                    <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-xl text-sm font-black flex items-center gap-1.5">
                                                        <CheckCircle2 size={14} /> Watched
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleWatchModule(moduleKey, moduleIndex)}
                                                className={`w-full px-6 py-4 font-black rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all text-base ${isActive
                                                        ? 'bg-gray-100 text-gray-600'
                                                        : isWatched
                                                            ? 'bg-green-50 text-green-700 border-2 border-green-100'
                                                            : 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700'
                                                    }`}
                                            >
                                                <Play className={isActive ? '' : 'fill-current'} size={18} />
                                                {isActive ? 'Now Playing' : isWatched ? 'Watch Again' : 'Watch Video'}
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Course Completion Section */}
                            {allModulesWatched && !isCourseCompleted && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-center text-white shadow-xl"
                                >
                                    <Trophy className="w-16 h-16 mx-auto mb-4" />
                                    <h3 className="text-2xl font-black mb-2">All Modules Watched! 🎉</h3>
                                    <p className="text-green-100 mb-6 font-medium">
                                        Complete this course to earn the <strong>"{selectedCourse.skillname}"</strong> badge
                                    </p>
                                    <button
                                        onClick={handleCompleteCourse}
                                        className="bg-white text-green-600 font-black px-8 py-4 rounded-2xl text-lg hover:bg-green-50 active:scale-95 transition-all shadow-lg"
                                    >
                                        ✅ Complete Course & Earn Badge
                                    </button>
                                </motion.div>
                            )}

                            {isCourseCompleted && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-green-50 border-2 border-green-200 rounded-3xl p-8 text-center"
                                >
                                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                    <h3 className="text-xl font-black text-green-700 mb-1">Course Completed!</h3>
                                    <p className="text-green-600 font-medium">
                                        You've earned the <strong>"{selectedCourse.skillname}"</strong> badge 🏅
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default SkillLearning;
