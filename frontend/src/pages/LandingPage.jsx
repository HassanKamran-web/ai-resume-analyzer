import React, { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import mammoth from "mammoth";
import Loader from '../components/Loader';

const LandingPage = () => {
    const [resume, setResume] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [docxHtml, setDocxHtml] = useState(null);
    const [jobdescription, setJobdescription] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const Submithandler = async (e) => {

        try {
            e.preventDefault();
            setLoading(true)
            if (!resume) {
                toast.error('Please upload a resume before analyzing.');
                return;
            }
            if (!jobdescription.trim()) {
                toast.error('Please enter a job description.');
                return;
            }

            const formData = new FormData();
            formData.append("resume", resume); 
            formData.append("jobdescription", jobdescription);

            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.status === 200) {
                try {
                    if (!response.data.resumeId) {
                        toast.error('Resume uploaded but failed to retrieve resume ID for analysis.');
                        return;
                    }
                    if (!jobdescription.trim()) {
                        toast.error('Job description is empty. Please provide a job description for analysis.');
                        return;
                    }
                    const analysisResponse = await axios.post(
                        `${import.meta.env.VITE_BASE_URL}/api/analyze/${response.data.resumeId}`,
                        {
                            jobdescription: jobdescription
                        }
                    );

                    if (analysisResponse.status === 200) {
                        toast.success('Resume analyzed successfully!');
                        navigate(`/result/${response.data.resumeId}`, { state: { analysisData: analysisResponse.data } });

                    }

                } catch (err) {
                    toast.error('Failed to analyze resume.');
                }
            }
            else {
                toast.error('Failed to upload resume. Please try again.');
            }
        } catch (err) {
            toast.error('Something went wrong while analyzing the resume. Please try again later.', err.message);
        } finally{
            setLoading(false);
        }
    }

    return (
        <section className=' w-full '>
            {loading && <Loader />}
            <div className="inter-uniquifier py-3 px-4 w-full flex flex-col gap-8 items-center justify-center  ">
                <h3 className='text-blue-500 uppercase font-bold text-sm lg:text-3xl select-none'>Resume Analyzer</h3>


                <div className='w-full flex lg:flex-row flex-col items-center p-6 gap-8 h-full  '>
                    <div className='flex flex-col lg:gap-6 gap-4 h-full lg:px-6 select-none'>
                        <h2 className='inter-uniquifer text-xl lg:text-4xl font-bold text-center lg:text-start '>AI-Powered Resume Analyzer for Smart Job Applications</h2>
                        <p className='inter-uniquifer max-w-3xl text-gray-400 text-xs text-center lg:text-start lg:text-xl'>Upload your resume and compare it instantly with any job description using advanced AI analysis. Get a detailed match score, discover missing skills, and receive actionable suggestions to improve your chances of getting hired.</p>

                    </div>

                    <form onSubmit={(e) => { Submithandler(e) }} className='flex flex-col w-fit items-center justify-center gap-5' action="">
                        <div className='w-fit flex max-h-80 select-none flex-col items-center justify-around gap-4 border-blue-500 border-2 rounded-lg py-5  px-4 backdrop-blur-sm bg-blue-500/10 font-uniquifier'>
                            {previewUrl && (
                                <div className="mt-6 overflow-hidden">
                                    <iframe
                                        src={`${previewUrl}#toolbar=0&navpanes=0`}
                                        title="PDF Preview"
                                        className="w-25 h-fit rounded-lg border"
                                    />
                                </div>
                            )}

                            {docxHtml && (
                                <div
                                    className="mt-6 w-25 h-25 bg-white p-4 rounded-lg border overflow-hidden"

                                >
                                    <img className='h-full w-full object-cover' src={docxHtml} alt="docx" />
                                </div>
                            )}
                            <p className='lg:text-sm text-xs text-gray-400'>Drop your resume here or choose a file PDF & DOCX only. Max 2MB file size.</p>
                            <input type="file" className="hidden" id="resume-upload" name='resume-upload' accept=".pdf,.docx" onChange={async (e) => {
                                const file = e.target.files[0];

                                if (!file) return;

                                if (file.size > 2097152) {
                                    toast.error('File size exceeds 2MB limit.');
                                    return;
                                }

                                if (
                                    file.type !== 'application/pdf' &&
                                    file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                ) {
                                    toast.error('Please provide pdf or docx file only.');
                                    return;
                                }

                                setResume(file);

                                if (file.type === "application/pdf") {
                                    const fileURL = URL.createObjectURL(file);
                                    setPreviewUrl(fileURL);
                                    setDocxHtml(null);
                                }

                                if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {

                                    setDocxHtml('./docx.png');
                                    setPreviewUrl(null);
                                }
                            }} />
                            <label htmlFor="resume-upload" className='cursor-pointer text-white bg-blue-500 rounded-lg hover:bg-blue-600 w-full text-sm lg:text-md inter-uniquifier py-2 px-4 transition-colors text-center '>Upload Resume</label>
                        </div>

                        <textarea value={jobdescription} onChange={(e) => setJobdescription(e.target.value)} rows="5" cols="40" className='border-2 border-gray-300 resize-none overflow-y-auto p-3 rouned-xl overflow-hidden w-full focus:outline-blue-500' name="jobDescription" id="jobDescription" placeholder="Paste job description here..."></textarea>
                        <button className='bg-blue-500 text-white w-full inter-uniquifier py-2 lg:text-lg text-sm px-4 rounded-lg hover:bg-blue-600 transition-colors'>Analyze Resume</button>

                    </form>


                </div>

            </div>
        </section>
    )
}

export default LandingPage