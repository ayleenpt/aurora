import React from 'react';
import './App.css';

function* generateStars(starCount) {
  const getRandomBeigeColor = () => {
    const r = Math.floor(Math.random() * 80 + 170); // Shades of beige (light to white)
    const g = Math.floor(Math.random() * 80 + 170); // Shades of beige (light to white)
    const b = Math.floor(Math.random() * 80 + 170); // Shades of beige (light to white)
    return `rgb(${r}, ${g}, ${b})`;
  };

  for (let i = 0; i < starCount; i++) {
    yield {
      top: `${Math.random() * 100}vh`, // Random vertical position
      left: `${Math.random() * 100}vw`, // Random horizontal position
      animationDuration: `${Math.random() * 5 + 3}s`, // Random animation duration (3-8 seconds)
      size: `${Math.random() * 2 + 1}px`, // Random size (between 1px and 3px)
      opacity: `${Math.random() * 0.7 + 0.3}`, // Random opacity (between 30% and 100%)
      color: getRandomBeigeColor(), // Random color in shades of beige/white
    };
  }
}

function App() {
  const starCount = 6000;
  const stars = [];

  const starGenerator = generateStars(starCount);
  for (let star of starGenerator) {
    stars.push(star);
  }

  return (
    <div className="App">
      {stars.map((star, index) => (
        <div
          key={index}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            animationDuration: star.animationDuration,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            backgroundColor: star.color,
          }}
        ></div>
      ))}
    </div>
  );
}

export default App;
