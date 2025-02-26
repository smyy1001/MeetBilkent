import React from "react";

const Sparkle = ({ size = 20, color = "gold", style = {} }) => {
  const sparkleStyle = {
    position: "absolute",
    fontSize: `${size}px`,
    color: color,
    animation: "sparkle 1.5s linear infinite",
    ...style,
  };

  return <div style={sparkleStyle}>★</div>; // Use the star symbol
};

export default Sparkle;
