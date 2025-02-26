import React, { useState, useEffect } from "react";
import Sparkle from "./Sparkle";
import "./Sparkles.css";

const Sparkles = ({ children, color }) => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const sparkle = {
        id: Date.now(),
        size: Math.random() * 10 + 5, // Random size
        x: Math.random() * 100, // Random horizontal position
        y: Math.random() * 100, // Random vertical position
      };
      setSparkles((prev) => [...prev, sparkle]);
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== sparkle.id));
      }, 1500); // Remove sparkle after 1.5 seconds
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          fontSize: "1.2rem",
          fontWeight: "bold",
          color: color,
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>
      <div
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {sparkles.map((sparkle) => (
          <Sparkle
            key={sparkle.id}
            size={sparkle.size}
            style={{
              top: `${sparkle.y}%`,
              left: `${sparkle.x}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Sparkles;
