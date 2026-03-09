import React, { useState } from 'react';
import { Send, User, Bot, Sparkles, ChevronLeft, MoreVertical, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ChatbotPage = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { id: 1, text: 'Namaste! I am your Skill AI Assistant. How can I help you today?', sender: 'bot' },
        { id: 2, text: 'I want to know about basic electrician tools.', sender: 'user' },
        { id: 3, text: 'Sure! For basic electrical work, you need a screwdriver set, wire stripper, voltage tester, and pliers. Would you like to see a video of these tools?', sender: 'bot' },
    ]);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newUserMsg = { id: messages.length + 1, text: inputText, sender: 'user' };
        setMessages([...messages, newUserMsg]);
        setInputText('');

        // Simple bot response simulation
        setTimeout(() => {
            const botMsg = { id: messages.length + 2, text: "Gajab! That's a great question. Let me find that information for you...", sender: 'bot' };
            setMessages((prev) => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 font-sans">
            <header className="p-6 bg-white border-b sticky top-0 z-40 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-gray-700 shadow-sm border border-gray-100 hover:bg-slate-100"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            Skill AI <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">Global</span>
                        </h1>
                        <p className="text-xs text-green-500 font-black flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
                        </p>
                    </div>
                </div>
                <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">
                    <MoreVertical size={20} />
                </button>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-6 max-w-3xl mx-auto w-full md:p-8">
                <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`flex items-end gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md ${msg.sender === 'bot' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}>
                                {msg.sender === 'bot' ? <Sparkles size={20} /> : <User size={20} />}
                            </div>
                            <div className={`p-5 rounded-3xl max-w-[85%] shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}>
                                <p className="text-base font-medium leading-relaxed">{msg.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </main>

            <footer className="p-4 bg-white border-t pb-24 md:pb-6">
                <div className="max-w-3xl mx-auto flex gap-4 bg-slate-50 p-2 rounded-[2rem] border border-gray-100 shadow-inner group-focus-within:border-blue-200 transition-all">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Puchhiye apne sawal..."
                        className="flex-1 bg-transparent px-6 py-4 outline-none text-gray-700 font-medium placeholder:text-gray-400 text-lg"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        className="w-14 h-14 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-90 transition-all transform disabled:bg-gray-300 disabled:shadow-none"
                    >
                        <Send size={24} />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ChatbotPage;
