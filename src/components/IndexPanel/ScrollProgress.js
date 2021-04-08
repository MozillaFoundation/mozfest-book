import React, { useState, useEffect } from "react";

// ------------------------------------------------------------------------------------------------ //
// !! improve perfomance, maybe the scroll listener is called too often
function ScrollProgress(props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollStyle = (progress) => ({
    transform: `scaleX(${progress / 100})`
  });

  useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  let onScroll = () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    setScrollProgress(scrolled);
  };

  return (
    <div className="scroll-progress">
      <div className="scroll-progress__bar" style={scrollStyle(scrollProgress)}></div>
    </div>
  );
}

export default ScrollProgress;
