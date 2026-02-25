import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import CountUp from "react-countup";
import MatchDisplay from '../components/MatchDisplay';

const ResultPage = () => {
  const [score, setscore] = useState(70)
  const [resumeData, setResumeData] = useState(null)
  const [jobDescription, setJobDescription] = useState(null)
  const location = useLocation();
    const { analysisData } = location.state || {};
      let color = "text-red-500"; // default low
  if (analysisData?.match >= 50 && analysisData?.match < 75) color = "text-yellow-500"; // medium
  if (analysisData?.match >= 75) color = "text-green-500"; // high
  return (
    <div className='p-4 bg-white inter-uniquifier '>
      <h1 className='text-blue-500 text-3xl text-center text-semibold mb-4'>Result Page</h1>
      <div className='bg-[#E3E9F5] h-fit rounded-xl p-4 flex flex-col justify-center gap-4 '>
        <div className='grid lg:grid-cols-3 grid-cols-1 md:grid-cols-2 gap-4  '>
          <div className='p-4 shadow-md w-full min-h-64 h-full rounded-lg flex flex-col items-center  bg-white '>
            <div>
              <h3 className='font-bold text-xl text-green-500'>Score</h3>
            </div>
            <MatchDisplay match={analysisData?.match || 0} />
          </div>

          <div className='p-4 shadow-md w-full min-h-64 h-full rounded-lg bg-white '>
            <div>
              <h3 className='font-bold text-xl mb-11 text-blue-500 '>Matching Skills{analysisData?.matchSkills?.length > 0 ? ` (${analysisData.matchSkills.length})` : ''}</h3>
            </div>
            <div className='px-4 text-sm h-full'>
              {
                analysisData?.matchSkills && analysisData.matchSkills.length > 0 ? (
                  <ul>
                    {analysisData.matchSkills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No matching skills found.</p>
                )}

            </div>
          </div>

          <div className='p-4 shadow-md  w-full min-h-64 h-full rounded-lg bg-white '>
            <div>
              <h3 className='font-bold text-xl mb-11 text-red-500 '>Missing Skills{analysisData?.missingSkills?.length > 0 ? ` (${analysisData.missingSkills.length})` : ''}</h3>
            </div>
            <div className='px-4 text-sm flex'>
              {
                analysisData?.missingSkills && analysisData.missingSkills.length > 0 ? (
                  <ul>
                    {analysisData.missingSkills.map((skill, index) => (
                      <li className="mb-1" key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No missing skills found.</p>
                )}

            </div>
          </div>
        </div>

        <div className='p-4 shadow-md  min-h-64 h-full rounded-lg bg-white '>
          <h3 className='font-bold text-2xl mb-6'>AI Suggestion for Optimize Resume</h3>
          <p className='text-gray-400 text-lg'>{analysisData?.suggestions || "No suggestions available."}</p>
        </div>
      </div>
    </div>
  )
}

export default ResultPage