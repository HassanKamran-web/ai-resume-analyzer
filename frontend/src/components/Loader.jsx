import React, { useEffect, useState } from "react";

const Loader = ({ target = 100 }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // total animation duration in ms
    const intervalTime = 20; // update interval
    const increment = target / (duration / intervalTime);

    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setPercent(Math.round(start));
    }, intervalTime);

    return () => clearInterval(interval);
  }, [target]);

  return (
    <div className="fixed inset-0 bg-white/30 flex flex-col items-center justify-center z-50">
      <div className="relative w-32 h-32">
        {/* Circular background */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>

        {/* Animated top border */}
        <div
          className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-b-blue-500 animate-spin-slow"
          style={{ borderTopColor: "#3b82f6", borderBottomColor: "#3b82f6" }}
        ></div>

        {/* Percentage */}
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-blue-500">
          {percent}%
        </div>
      </div>
      <p className="mt-4 text-blue-500 font-medium animate-pulse">Analyzing Resume...</p>
    </div>
  );
};

export default Loader;