import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Import the star GIFs
import starOne from './assets/star_one.gif';
import starTwo from './assets/star_two.gif';
import starThree from './assets/star_three.gif';

function* generateStars(starCount) {
  const starGifs = [starOne, starTwo, starThree]; // Array of GIFs

  for (let i = 0; i < starCount; i++) {
    const randomGif = starGifs[Math.floor(Math.random() * starGifs.length)]; // Pick a random GIF
    yield {
      top: `${Math.random() * 100}vh`, // Random vertical position
      left: `${Math.random() * 100}vw`, // Random horizontal position
      size: `${Math.random() * 3 + 1}px`, // Random size (between 1px and 4px)
      opacity: `${Math.random() * 0.6 + 0.4}`, // Random opacity (between 40% and 100%)
      filter: `brightness(${Math.random() * 4 + 4})`, // Random brightness (between 4 and 8)
      backgroundImage: `url(${randomGif})`, // Set the random GIF as the background
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
      starArray.push({
        ...star,
        originalPosition: { left: star.left, top: star.top },
        isFleeing: false,
      });
    }
    setStars(starArray);
  }, [starCount]);

  const handleMouseMove = useCallback(
    (event) => {
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
    return Math.sqrt(dx * dx + dy * dy);
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

    if (distance <= 100 && !star.isFleeing) {
      const { newStarX, newStarY } = moveStarAway(starXInPixels, starYInPixels, mousePosition.x, mousePosition.y);

      const newStarLeft = (newStarX / window.innerWidth) * 100;
      const newStarTop = (newStarY / window.innerHeight) * 100;

      return {
        left: `${newStarLeft}%`,
        top: `${newStarTop}%`,
        isFleeing: true,
      };
    }

    return {
      left: star.originalPosition.left,
      top: star.originalPosition.top,
      isFleeing: false,
    };
  }, [calculateDistance, moveStarAway, mousePosition]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStars((prevStars) =>
        prevStars.map((star) => {
          if (star.isFleeing) {
            return {
              ...star,
              left: star.originalPosition.left,
              top: star.originalPosition.top,
              isFleeing: false,
            };
          }
          return star;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      {stars.map((star, index) => {
        const { left, top } = getStarPosition(star);

        return (
          <div
            key={index}
            className="star"
            style={{
              position: 'absolute',
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              filter: star.filter,
              backgroundImage: star.backgroundImage, // Use the randomly selected GIF
              backgroundSize: 'cover', // Optional: ensure GIF fills the div
              transition: 'left 1s ease, top 1s ease',
              left: left,
              top: top,
            }}
          ></div>
        );
      })}
    </div>
  );
}

export default App;
