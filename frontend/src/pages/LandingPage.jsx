import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Animations ke liye
import Loader from '../components/Loader';
import { FiUploadCloud, FiFileText, FiCheckCircle } from 'react-icons/fi'; // Icons use karein

const LandingPage = () => {
    const [resume, setResume] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [docxHtml, setDocxHtml] = useState(null);
    const [jobdescription, setJobdescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const navigate = useNavigate();

    // --- Logic Functions (Wahi hain jo tumhare paas thin) ---
    const handleFileProcessing = (file) => {
        if (!file) return;
        if (file.size > 2097152) {
            toast.error('File size exceeds 2MB limit.');
            return;
        }
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please provide PDF or DOCX file only.');
            return;
        }

        setResume(file);
        if (file.type === "application/pdf") {
            setPreviewUrl(URL.createObjectURL(file));
            setDocxHtml(null);
        } else {
            setDocxHtml('./docx.png');
            setPreviewUrl(null);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileProcessing(e.dataTransfer.files[0]);
        }
    };

    const Submithandler = async (e) => {
        e.preventDefault();
        if (!resume || !jobdescription.trim()) {
            toast.error('Please upload resume and enter job description.');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("resume", resume);
            formData.append("jobdescription", jobdescription);

            const uploadRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/upload`, formData);
            
            const analysisRes = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/analyze/${uploadRes.data.resumeId}`,
                { jobdescription }
            );

            toast.success('Analysis Complete!');
            navigate(`/result/${uploadRes.data.resumeId}`, { state: { analysisData: analysisRes.data } });
        } catch (err) {
            const msg = err.response?.data?.message || "Analysis failed. Please check your credits.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen w-full bg-[#0a0a0a] text-white overflow-x-hidden font-sans">
            {loading && <Loader />}

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 flex flex-col ">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16 flex flex-col items-center "
                >
                    <span className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider uppercase">
                        AI Resume Insights
                    </span>
                    <h1 className=" text-4xl lg:text-6xl font-extrabold tracking-tight bg-lineart-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Master Your Next <br /> Job Application
                    </h1>
                    <p className=" text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Instant AI analysis that compares your resume with job descriptions. 
                        Get match scores and actionable feedback in seconds.
                    </p>
                </motion.div>

                <div className="w-full grid lg:grid-cols-2 gap-12 items-start">
                    
                    {/* Left: Upload Area */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            className={`relative group cursor-pointer border-2 border-dashed transition-all duration-300 rounded-3xl p-10 flex flex-col items-center justify-center min-h-87.5
                                ${dragActive ? "border-blue-500 bg-blue-500/10 scale-95" : "border-gray-700 bg-gray-900/50 hover:border-gray-500"}`}
                        >
                            <input 
                                type="file" 
                                id="resume-upload" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => handleFileProcessing(e.target.files[0])}
                                accept=".pdf,.docx"
                            />
                            
                            <AnimatePresence mode="wait">
                                {resume ? (
                                    <motion.div 
                                        key="file-selected"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center text-center"
                                    >
                                        <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4">
                                            <FiCheckCircle className="text-green-400 text-4xl" />
                                        </div>
                                        <p className="font-semibold text-lg">{resume.name}</p>
                                        <p className="text-gray-500 text-sm mt-1">{(resume.size / 1024 / 1024).toFixed(2)} MB</p>
                                        <button className="mt-4 text-sm text-blue-400 hover:underline">Change File</button>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="empty"
                                        className="flex flex-col items-center text-center"
                                    >
                                        <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <FiUploadCloud className="text-blue-500 text-4xl" />
                                        </div>
                                        <h3 className="text-xl font-bold">Upload Resume</h3>
                                        <p className="text-gray-500 mt-2 max-w-62.5">
                                            Drag & drop your PDF or DOCX here (Max 2MB)
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Right: Input Area */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl backdrop-blur-md">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-4">
                                <FiFileText /> Job Description
                            </label>
                            <textarea 
                                value={jobdescription} 
                                onChange={(e) => setJobdescription(e.target.value)}
                                placeholder="Paste the job description you're targeting..."
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 outline-none resize-none min-h-50"
                            />
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={Submithandler}
                            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
                        >
                            Start AI Analysis
                        </motion.button>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default LandingPage;