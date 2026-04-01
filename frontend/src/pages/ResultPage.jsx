import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CountUp from "react-countup";
import MatchDisplay from '../components/MatchDisplay';

const ResultPage = () => {
  const [score, setscore] = useState(70)
  const [resumeData, setResumeData] = useState(null)
  const [jobDescription, setJobDescription] = useState(null)
  const navigate = useNavigate()
  const location = useLocation();
  const { analysisData } = location.state || {};
  let color = "text-red-500"; // default low
  if (analysisData?.match >= 50 && analysisData?.match < 75) color = "text-yellow-500"; // medium
  if (analysisData?.match >= 75) color = "text-green-500"; // high
  return (
    <div className='p-4  bg-[#0a0a0a] inter-uniquifier '>
      <div className='flex items-center justify-start p-3'>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => navigate('/')}>Back</button>

      </div>
      <div className=' bg-[#0a0a0a] h-fit rounded-xl p-4 flex flex-col justify-center gap-4 '>
        <div className='grid lg:grid-cols-3 grid-cols-1 md:grid-cols-2 gap-4  '>
          <div className='p-4 shadow-md w-full min-h-64 h-full rounded-lg flex flex-col items-center  bg-zinc-900 '>
            <div>
              <h3 className='font-bold text-xl text-green-500'>Score</h3>
            </div>
            <MatchDisplay match={analysisData?.match || 0} />
          </div>

          <div className='p-4 shadow-md w-full min-h-64 h-full rounded-lg  bg-zinc-900 '>
            <div>
              <h3 className='font-bold text-xl mb-11 text-blue-500 '>Matching Skills{analysisData?.matchSkills?.length > 0 ? ` (${analysisData.matchSkills.length})` : ''}</h3>
            </div>
            <div className='px-4 text-sm h-full'>
              {
                analysisData?.matchSkills && analysisData.matchSkills.length > 0 ? (
                  <ul className='flex flex-wrap gap-3 list-decimal'>
                    {analysisData.matchSkills.map((skill, index) => (
                      <li className='text-gray-500 ml-5' key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No matching skills found.</p>
                )}

            </div>
          </div>

          <div className='p-4 shadow-md  w-full min-h-64 h-full rounded-lg bg-zinc-900 '>
            <div>
              <h3 className='font-bold text-xl mb-11 text-red-500 '>Missing Skills{analysisData?.missingSkills?.length > 0 ? ` (${analysisData.missingSkills.length})` : ''}</h3>
            </div>
            <div className='px-4 text-sm flex'>
              {
                analysisData?.missingSkills && analysisData.missingSkills.length > 0 ? (
                  <ul className='flex flex-wrap gap-4 list-decimal'>
                    {analysisData.missingSkills.map((skill, index) => (
                      <li className=" text-gray-500 ml-5" key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No missing skills found.</p>
                )}

            </div>
          </div>
        </div>

        <div className='p-4 shadow-md  min-h-64 h-full rounded-lg bg-zinc-900 '>
          <h3 className='font-bold text-white text-2xl mb-6'>AI Suggestion for Optimize Resume</h3>
          <div className="space-y-3">
            {analysisData?.suggestions && analysisData.suggestions.length > 0 ? (
              analysisData.suggestions.map((item, index) => (
                <p key={index} className="text-gray-400 text-lg flex items-start gap-2">
                  <span className="text-blue-500 mt-1.5">•</span> {item}
                </p>
              ))
            ) : (
              <p className="text-gray-500 text-lg italic">No suggestions available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultPage