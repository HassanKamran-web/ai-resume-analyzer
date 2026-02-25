import React, { useState, useEffect } from "react";

const MatchDisplay = ({ match = 0 }) => {
  const [current, setCurrent] = useState(0);

  // Decide color based on current value
  const getColor = (value) => {
    if (value < 50) return "text-red-500";
    if (value < 75) return "text-yellow-500";
    return "text-green-500";
  };

  useEffect(() => {
    let start = 0;
    const end = match;
    if (start === end) return;

    const duration = 1500; // total animation duration in ms
    const increment = end / (duration / 20); // update every 20ms
    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(interval);
      }
      setCurrent(Math.round(start));
    }, 20);

    return () => clearInterval(interval);
  }, [match]);

  return (
    <h4 className={`font-bold flex items-center w-full justify-center text-6xl h-full ${getColor(current)}`}>
      {current}/100
    </h4>
  );
};

export default MatchDisplay;