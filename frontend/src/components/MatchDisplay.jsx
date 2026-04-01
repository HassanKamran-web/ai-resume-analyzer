import React, { useState, useEffect } from "react";
import { motion, useSpring, useTransform, animate } from "framer-motion";

const MatchDisplay = ({ match = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Rang (Color) decide karne ka logic
  const getColor = (value) => {
    if (value < 50) return "#ef4444"; // Red
    if (value < 75) return "#eab308"; // Yellow
    return "#22c55e"; // Green
  };

  useEffect(() => {
    // 0 se target match score tak animation
    const controls = animate(0, match, {
      duration: 2,
      onUpdate: (value) => setDisplayValue(Math.round(value)),
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [match]);

  // Circular path calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayValue / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-48 h-48 lg:w-64 lg:h-64">
      {/* Background SVG Circle */}
      <svg className="w-full h-full transform -rotate-90">
        {/* Gray Track */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-gray-800"
        />
        {/* Animated Progress Circle */}
        <motion.circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={getColor(displayValue)}
          strokeWidth="12"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>

      {/* Center Text Area */}
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl lg:text-7xl font-black transition-colors duration-500"
          style={{ color: getColor(displayValue) }}
        >
          {displayValue}
        </motion.span>
        <span className="text-gray-500 font-semibold text-sm lg:text-lg uppercase tracking-widest mt-1">
          Match Score
        </span>
      </div>

      {/* Outer Glow Effect */}
      <div 
        className="absolute inset-0 rounded-full blur-3xl opacity-20 transition-colors duration-500"
        style={{ backgroundColor: getColor(displayValue) }}
      />
    </div>
  );
};

export default MatchDisplay;