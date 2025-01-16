import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function* generateStars(starCount) {
  const getRandomPaleColor = () => {
    const r = Math.floor(Math.random() * 80 + 170);
    const g = Math.floor(Math.random() * 80 + 170);
    const b = Math.floor(Math.random() * 80 + 170);
    return `rgb(${r}, ${g}, ${b})`;
  };

  for (let i = 0; i < starCount; i++) {
    yield {
      top: `${Math.random() * 100}vh`, // Random vertical position
      left: `${Math.random() * 100}vw`, // Random horizontal position
      animationDuration: `${Math.random() * 5 + 3}s`, // Random animation duration (3-8 seconds)
      size: `${Math.random() * 2 + 1}px`, // Random size (between 1px and 3px)
      opacity: `${Math.random() * 0.7 + 0.3}`, // Random opacity (between 30% and 100%)
      color: getRandomPaleColor(),
    };
  }
}

function App() {
  const [stars, setStars] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const starCount = window.innerWidth * window.innerHeight / 260;

  useEffect(() => {
    const starGenerator = generateStars(starCount);
    const starArray = [];
    for (let star of starGenerator) {
      starArray.push(star);
    }
    setStars(starArray);
  }, [starCount]);

  const handleMouseMove = useCallback(
    (event) => {
      // Throttle mouse movement using requestAnimationFrame
      requestAnimationFrame(() => {
        setMousePosition({
          x: event.clientX,
          y: event.clientY,
        });
      });
    },
    []
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const calculateDistance = useCallback((starX, starY, mouseX, mouseY) => {
    const dx = starX - mouseX;
    const dy = starY - mouseY;
    return Math.sqrt(dx * dx + dy * dy); // Euclidean distance
  }, []);

  const moveStarAway = useCallback((starX, starY, mouseX, mouseY) => {
    const dx = starX - mouseX;
    const dy = starY - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const directionX = dx / distance;
    const directionY = dy / distance;

    const randomDistance = Math.floor(Math.random() * (75 - 5 + 1)) + 5;

    const newStarX = starX + directionX * randomDistance;
    const newStarY = starY + directionY * randomDistance;

    return { newStarX, newStarY };
  }, []);

  const getStarPosition = useCallback((star) => {
    const starX = parseFloat(star.left);
    const starY = parseFloat(star.top);

    const starXInPixels = (starX / 100) * window.innerWidth;
    const starYInPixels = (starY / 100) * window.innerHeight;

    const distance = calculateDistance(starXInPixels, starYInPixels, mousePosition.x, mousePosition.y);
    
    if (distance <= 100) {
      const { newStarX, newStarY } = moveStarAway(starXInPixels, starYInPixels, mousePosition.x, mousePosition.y);

      const newStarLeft = (newStarX / window.innerWidth) * 100;
      const newStarTop = (newStarY / window.innerHeight) * 100;

      return { left: `${newStarLeft}%`, top: `${newStarTop}%` };
    }

    return { left: star.left, top: star.top };
  }, [calculateDistance, moveStarAway, mousePosition]);

  return (
    <div className="App">
      {stars.map((star, index) => {
        const { left, top } = getStarPosition(star);

        return (
          <div
            key={index}
            className="star"
            style={{
              top: top,
              left: left,
              animationDuration: star.animationDuration,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              backgroundColor: star.color,
              transition: 'top 0.6s ease, left 0.6s ease',
            }}
          ></div>
        );
      })}
    </div>
  );
}

export default App;
