import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizzes } from '../data/mockData';
import { ChevronLeft, CheckCircle2, XCircle, ArrowRight, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const quiz = quizzes[quizId] || quizzes['q1']; // Default to q1 for demo

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const handleOptionSelect = (idx) => {
        if (selectedOption !== null) return;
        setSelectedOption(idx);
        if (idx === quiz.questions[currentQuestion].answer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion + 1 < quiz.questions.length) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
        } else {
            setShowResult(true);
        }
    };

    if (showResult) {
        return (
            <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center text-center max-w-lg mx-auto md:max-w-none md:p-12">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-32 h-32 bg-orange-100 rounded-3xl flex items-center justify-center mb-8 shadow-inner"
                >
                    <Award size={64} className="text-orange-500" />
                </motion.div>

                <h1 className="text-4xl font-black text-gray-900 mb-2">Quiz Completed!</h1>
                <p className="text-lg text-gray-500 font-medium mb-12 leading-relaxed">Great job, Ramesh! You're one step closer to your next badge.</p>

                <div className="bg-slate-50 p-10 rounded-3xl w-full border border-gray-100 mb-12">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Your Score</p>
                    <div className="text-6xl font-black text-blue-600 mb-4">{score} / {quiz.questions.length}</div>
                    <p className="text-sm font-bold text-blue-500">Amazing Performance!</p>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <button
                        onClick={() => navigate('/badges')}
                        className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all text-lg"
                    >
                        View Your Badges
                    </button>
                    <button
                        onClick={() => navigate('/learning')}
                        className="w-full py-5 text-blue-600 font-black rounded-2xl border-2 border-blue-50 hover:bg-blue-50/50 active:scale-95 transition-all text-lg"
                    >
                        Back to Learning
                    </button>
                </div>
            </div>
        );
    }

    const question = quiz.questions[currentQuestion];

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans">
            <header className="flex justify-between items-center mb-10 max-w-lg mx-auto md:max-w-none md:px-12">
                <button
                    onClick={() => navigate(-1)}
                    className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-700 shadow-sm border border-gray-100 hover:bg-slate-50 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="bg-white px-6 py-2 rounded-2xl shadow-sm border border-gray-100 text-sm font-black text-gray-600">
                    Question {currentQuestion + 1} of {quiz.questions.length}
                </div>
            </header>

            <main className="max-w-lg mx-auto md:max-w-3xl md:px-12">
                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full mb-12 overflow-hidden shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                        className="h-full bg-blue-600 rounded-full"
                    />
                </div>

                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-10"
                >
                    <h2 className="text-3xl font-black text-gray-900 mb-10 leading-tight">{question.text}</h2>

                    <div className="space-y-4">
                        {question.options.map((opt, idx) => {
                            const isSelected = selectedOption === idx;
                            const isCorrect = idx === question.answer;
                            const showResult = selectedOption !== null;

                            let bgColor = "bg-white";
                            let borderColor = "border-gray-100";
                            let icon = null;

                            if (showResult) {
                                if (isCorrect) {
                                    bgColor = "bg-green-50";
                                    borderColor = "border-green-500 shadow-md shadow-green-100";
                                    icon = <CheckCircle2 className="text-green-500" size={24} />;
                                } else if (isSelected) {
                                    bgColor = "bg-red-50";
                                    borderColor = "border-red-500 shadow-md shadow-red-100";
                                    icon = <XCircle className="text-red-500" size={24} />;
                                }
                            } else if (isSelected) {
                                borderColor = "border-blue-600 shadow-md shadow-blue-100";
                                bgColor = "bg-blue-50";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(idx)}
                                    disabled={showResult}
                                    className={`w-full p-6 text-left rounded-2xl border-2 ${borderColor} ${bgColor} transition-all flex items-center justify-between group active:scale-[0.98]`}
                                >
                                    <span className={`text-xl font-bold ${showResult && isCorrect ? 'text-green-700' : 'text-gray-700'} group-hover:text-blue-600 transition-colors`}>{opt}</span>
                                    {icon}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                <AnimatePresence>
                    {selectedOption !== null && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={handleNext}
                            className="w-full py-6 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 text-xl"
                        >
                            {currentQuestion + 1 === quiz.questions.length ? "Finish Quiz" : "Next Question"}
                            <ArrowRight size={24} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default QuizPage;
