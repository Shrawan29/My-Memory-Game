import { useState, useEffect } from 'react';

// Custom themed card sets with refined color palettes
const themes = {
  cosmic: {
    name: "Cosmic Journey",
    description: "Explore the wonders of space",
    background: "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900",
    cardBack: "bg-gradient-to-br from-indigo-800 to-slate-900",
    textColor: "text-slate-100",
    accentColor: "bg-indigo-600",
    hoverColor: "hover:bg-indigo-700",
    secondaryBg: "bg-slate-800",
    items: [
      { id: "planet", icon: "🪐", label: "Planet" },
      { id: "star", icon: "✨", label: "Star" },
      { id: "rocket", icon: "🚀", label: "Rocket" },
      { id: "galaxy", icon: "🌌", label: "Galaxy" },
      { id: "comet", icon: "☄️", label: "Comet" },
      { id: "alien", icon: "👽", label: "Alien" },
      { id: "astronaut", icon: "👨‍🚀", label: "Astronaut" },
      { id: "ufo", icon: "🛸", label: "UFO" }
    ]
  },
  nature: {
    name: "Natural Elegance",
    description: "Serene elements from the natural world",
    background: "bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900",
    cardBack: "bg-gradient-to-br from-emerald-800 to-slate-900",
    textColor: "text-slate-100",
    accentColor: "bg-emerald-600",
    hoverColor: "hover:bg-emerald-700",
    secondaryBg: "bg-slate-800",
    items: [
      { id: "mountain", icon: "⛰️", label: "Mountain" },
      { id: "tree", icon: "🌲", label: "Tree" },
      { id: "leaf", icon: "🍃", label: "Leaf" },
      { id: "flower", icon: "🌺", label: "Flower" },
      { id: "butterfly", icon: "🦋", label: "Butterfly" },
      { id: "deer", icon: "🦌", label: "Deer" },
      { id: "sun", icon: "☀️", label: "Sun" },
      { id: "water", icon: "💧", label: "Water" }
    ]
  },
  minimalist: {
    name: "Modern Minimalist",
    description: "Clean, crisp geometric design",
    background: "bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900",
    cardBack: "bg-gradient-to-br from-gray-700 to-slate-900",
    textColor: "text-gray-200",
    accentColor: "bg-gray-600",
    hoverColor: "hover:bg-gray-700",
    secondaryBg: "bg-gray-800",
    items: [
      { id: "circle", icon: "⭕", label: "Circle" },
      { id: "square", icon: "⬛", label: "Square" },
      { id: "triangle", icon: "🔺", label: "Triangle" },
      { id: "diamond", icon: "💠", label: "Diamond" },
      { id: "star", icon: "⭐", label: "Star" },
      { id: "heart", icon: "♥️", label: "Heart" },
      { id: "plus", icon: "➕", label: "Plus" },
      { id: "minus", icon: "➖", label: "Minus" }
    ]
  },
  ocean: {
    name: "Deep Blue",
    description: "Mysteries of the ocean depths",
    background: "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900",
    cardBack: "bg-gradient-to-br from-blue-800 to-slate-900",
    textColor: "text-slate-100",
    accentColor: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    secondaryBg: "bg-slate-800",
    items: [
      { id: "fish", icon: "🐠", label: "Tropical Fish" },
      { id: "whale", icon: "🐋", label: "Whale" },
      { id: "octopus", icon: "🐙", label: "Octopus" },
      { id: "coral", icon: "🪸", label: "Coral" },
      { id: "turtle", icon: "🐢", label: "Sea Turtle" },
      { id: "dolphin", icon: "🐬", label: "Dolphin" },
      { id: "shell", icon: "🐚", label: "Shell" },
      { id: "shark", icon: "🦈", label: "Shark" }
    ]
  }
};

// Main component
export default function EnhancedMemoryGame() {
  const [currentScreen, setCurrentScreen] = useState('welcome'); // welcome, themeSelect, game
  const [currentTheme, setCurrentTheme] = useState('cosmic');
  const [difficulty, setDifficulty] = useState('medium'); // easy, medium, hard
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bestScores, setBestScores] = useState(() => {
    const saved = localStorage.getItem('memoryGameBestScores');
    return saved ? JSON.parse(saved) : {};
  });

  // Get card items based on difficulty and theme
  const getCardItems = () => {
    const themeItems = themes[currentTheme].items;
    
    if (difficulty === 'easy') return themeItems.slice(0, 4);
    if (difficulty === 'hard') return themeItems;
    return themeItems.slice(0, 6); // medium difficulty
  };
  
  // Initialize game
  const initializeGame = () => {
    const selectedItems = getCardItems();
    
    // Create pairs of cards and shuffle them
    const cardPairs = [...selectedItems, ...selectedItems]
      .map(item => ({ 
        id: Math.random(), 
        value: item.id, 
        icon: item.icon,
        label: item.label
      }))
      .sort(() => Math.random() - 0.5);
      
    setCards(cardPairs);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setSeconds(0);
    setGameStarted(false);
    setGameCompleted(false);
    setShowConfetti(false);
  };
  
  // Reset the game completely
  const resetGame = () => {
    initializeGame();
    // Keep the user on the current game screen
  };
  
  // Hard reset (return to theme selection)
  const hardReset = () => {
    resetGame();
    setCurrentScreen('themeSelect');
  };
  
  // Start new game
  const startGame = () => {
    initializeGame();
    setCurrentScreen('game');
  };
  
  // Process flipped cards
  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsProcessing(true);
      const [firstIndex, secondIndex] = flippedIndices;
      
      // Check if indices are valid before comparing
      if (firstIndex >= 0 && secondIndex >= 0 && firstIndex < cards.length && secondIndex < cards.length) {
        if (cards[firstIndex].value === cards[secondIndex].value) {
          // Matched pair
          setTimeout(() => {
            setMatchedPairs(prev => [...prev, cards[firstIndex].value]);
            setFlippedIndices([]);
            setIsProcessing(false);
          }, 600);
        } else {
          // No match - flip back after delay
          setTimeout(() => {
            setFlippedIndices([]);
            setIsProcessing(false);
          }, 1000);
        }
        
        // Increment moves counter only when processing is complete
        setMoves(prevMoves => prevMoves + 1);
      } else {
        // Invalid indices, reset
        setFlippedIndices([]);
        setIsProcessing(false);
      }
    }
  }, [flippedIndices, cards]);
  
  // Timer effect
  useEffect(() => {
    let interval = null;
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameCompleted]);
  
  // Check for game completion
  useEffect(() => {
    if (gameStarted && matchedPairs.length > 0 && matchedPairs.length === getCardItems().length) {
      setGameCompleted(true);
      setShowConfetti(true);
      
      // Update best scores
      const scoreKey = `${currentTheme}-${difficulty}`;
      const currentScore = { moves, time: seconds };
      
      setBestScores(prev => {
        const newScores = {...prev};
        if (!prev[scoreKey] || moves < prev[scoreKey].moves || 
            (moves === prev[scoreKey].moves && seconds < prev[scoreKey].time)) {
          newScores[scoreKey] = currentScore;
          localStorage.setItem('memoryGameBestScores', JSON.stringify(newScores));
        }
        return newScores;
      });
    }
  }, [matchedPairs, gameStarted, currentTheme, difficulty, moves, seconds]);
  
  // Handle card click
  const handleCardClick = (index) => {
    if (
      isProcessing ||
      flippedIndices.includes(index) ||
      matchedPairs.includes(cards[index]?.value)
    ) {
      return;
    }
    
    // Start game on first card click
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    // Handle flipping
    if (flippedIndices.length < 2) {
      setFlippedIndices([...flippedIndices, index]);
    }
  };
  
  // Format time for display
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Get difficulty text
  const getDifficultyText = (diff) => {
    switch(diff) {
      case 'easy': return '4 Pairs - Easy';
      case 'hard': return '8 Pairs - Hard';
      default: return '6 Pairs - Medium';
    }
  };
  
  // Get best score for theme and difficulty
  const getBestScore = () => {
    const scoreKey = `${currentTheme}-${difficulty}`;
    return bestScores[scoreKey];
  };

  // Calculate grid layout based on difficulty and screen size
  const getGridLayout = () => {
    if (difficulty === 'easy') {
      return { cols: 'grid-cols-2 sm:grid-cols-4', rows: '2' };
    } else if (difficulty === 'hard') {
      return { cols: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4', rows: '4' };
    } else {
      return { cols: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4', rows: '3' }; // medium
    }
  };

  // Render header with stats and controls
  const renderGameHeader = () => {
    const theme = themes[currentTheme];
    
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4 md:mb-6 gap-2 sm:gap-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{theme.name}</h2>
        
        <div className="flex gap-2 sm:gap-4">
          <div className="bg-slate-800 bg-opacity-80 rounded-lg p-2 text-center min-w-16 sm:min-w-20 md:min-w-24">
            <div className="text-xs text-slate-400 font-medium">Time</div>
            <div className="text-base sm:text-lg md:text-xl font-bold">{formatTime(seconds)}</div>
          </div>
          <div className="bg-slate-800 bg-opacity-80 rounded-lg p-2 text-center min-w-16 sm:min-w-20 md:min-w-24">
            <div className="text-xs text-slate-400 font-medium">Moves</div>
            <div className="text-base sm:text-lg md:text-xl font-bold">{moves}</div>
          </div>
        </div>
      </div>
    );
  };

  // Render victory modal
  const renderVictoryModal = () => {
    const theme = themes[currentTheme];
    const isNewBestScore = getBestScore() && moves === getBestScore().moves && seconds === getBestScore().time;
    
    if (!gameCompleted) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm p-4">
        <div className={`${theme.background} w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl transform transition-all duration-500 scale-100 animate-bounce-in`}>
          <div className="text-center mb-4 sm:mb-6">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4">🎉</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Victory!</h2>
            <p className="text-base sm:text-lg text-slate-300">
              You completed the game with:
            </p>
          </div>
          
          <div className="flex justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className={`${theme.secondaryBg} rounded-lg p-2 sm:p-3 text-center min-w-16 sm:min-w-20 md:min-w-24`}>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Time</div>
              <div className="text-lg sm:text-xl font-bold">{formatTime(seconds)}</div>
            </div>
            <div className={`${theme.secondaryBg} rounded-lg p-2 sm:p-3 text-center min-w-16 sm:min-w-20 md:min-w-24`}>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Moves</div>
              <div className="text-lg sm:text-xl font-bold">{moves}</div>
            </div>
          </div>
          
          {isNewBestScore && (
            <div className="bg-yellow-900 bg-opacity-30 border border-yellow-500 rounded-lg p-2 sm:p-3 mb-4 sm:mb-6 text-center">
              <div className="text-xl sm:text-2xl mb-1">🏆</div>
              <p className="text-yellow-300 text-sm sm:text-base font-bold">New Best Score!</p>
            </div>
          )}
          
          <div className="flex flex-col gap-2 sm:gap-3">
            <button
              onClick={resetGame}
              className={`py-2 sm:py-3 px-4 sm:px-6 rounded-lg ${theme.accentColor} ${theme.hoverColor} font-bold text-base sm:text-lg transition`}
            >
              Play Again
            </button>
            <button
              onClick={() => setCurrentScreen('themeSelect')}
              className="py-2 sm:py-3 px-4 sm:px-6 rounded-lg bg-slate-700 hover:bg-slate-600 font-medium transition text-sm sm:text-base"
            >
              Change Theme
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render welcome screen
  const renderWelcomeScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900 text-white overflow-hidden">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-slate-800 bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-xl p-5 sm:p-6 md:p-8 shadow-xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-white">Memory Match</h1>
          <p className="text-base sm:text-lg text-slate-300">Challenge your memory with this elegant matching game</p>
        </div>
        
        <div className="flex flex-col gap-4 sm:gap-6">
          <button 
            onClick={() => setCurrentScreen('themeSelect')}
            className="py-3 sm:py-4 px-4 sm:px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base sm:text-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Play Game
          </button>
          
          <div className="mt-1 sm:mt-2 text-center">
            <p className="text-slate-400 text-xs sm:text-sm">
              Flip cards to find matching pairs and complete the board.
              <br />Choose your theme and difficulty in the next screen.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 sm:mt-8 text-slate-500 text-xs">
        © 2025 Memory Match Game
      </div>
    </div>
  );
  
  // Render theme selection screen with improved UI and responsiveness
  const renderThemeSelect = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900 text-white overflow-y-auto">
      <div className="w-full max-w-md sm:max-w-2xl md:max-w-4xl bg-slate-800 bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-8 shadow-xl">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-white">Choose Your Theme</h2>
          <p className="text-sm sm:text-base text-slate-300">Select a theme and difficulty level to begin</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          {Object.entries(themes).map(([themeKey, theme]) => (
            <div 
              key={themeKey}
              onClick={() => setCurrentTheme(themeKey)}
              className={`p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                currentTheme === themeKey 
                  ? `${theme.background} scale-105 shadow-lg ring-2 ring-white ring-opacity-30`
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-slate-700 bg-opacity-50 rounded-lg">
                  <span className="text-2xl sm:text-3xl">{theme.items[0].icon}</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold">{theme.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-400">{theme.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Difficulty</h3>
            <div className="flex flex-col gap-2 sm:gap-3">
              {['easy', 'medium', 'hard'].map(diff => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition ${
                    difficulty === diff
                      ? `${themes[currentTheme].accentColor} font-bold`
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {getDifficultyText(diff)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Best Score</h3>
            <div className="bg-slate-700 rounded-lg p-3 sm:p-4">
              {getBestScore() ? (
                <div>
                  <p className="text-sm sm:text-base text-slate-300">Theme: {themes[currentTheme].name}</p>
                  <p className="text-sm sm:text-base text-slate-300">Difficulty: {getDifficultyText(difficulty)}</p>
                  <p className="mt-1 sm:mt-2 font-bold text-base sm:text-lg">
                    {getBestScore().moves} moves in {formatTime(getBestScore().time)}
                  </p>
                </div>
              ) : (
                <p className="text-sm sm:text-base text-slate-400">No scores yet for this combination</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => setCurrentScreen('welcome')}
            className="py-2 sm:py-3 px-4 sm:px-6 rounded-lg bg-slate-700 hover:bg-slate-600 font-medium transition text-sm sm:text-base"
          >
            Back
          </button>
          <button
            onClick={startGame}
            className={`py-2 sm:py-3 px-6 sm:px-8 rounded-lg ${themes[currentTheme].accentColor} ${themes[currentTheme].hoverColor} font-bold text-sm sm:text-lg transition focus:outline-none focus:ring-2 focus:ring-opacity-50`}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
  
  // Render game controls with reset and moves tracking
  const renderGameControls = () => {
    const theme = themes[currentTheme];
    
    return (
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mt-3 sm:mt-4">
        <button
          onClick={() => setCurrentScreen('themeSelect')}
          className="py-2 px-3 sm:px-4 rounded-lg bg-slate-700 hover:bg-slate-600 font-medium transition text-xs sm:text-sm"
        >
          Change Theme
        </button>
        <button
          onClick={resetGame}
          className={`py-2 px-3 sm:px-4 rounded-lg ${theme.accentColor} ${theme.hoverColor} font-medium transition text-xs sm:text-sm`}
        >
          Reset Game
        </button>
       
      </div>
    );
  };
  
  // Render game screen with improved card sizing and animations
  const renderGameScreen = () => {
    const theme = themes[currentTheme];
    const { cols } = getGridLayout();
    
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 ${theme.background} ${theme.textColor} overflow-hidden`}>
        {/* Game container with better responsive sizing */}
        <div className="w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-2xl bg-slate-900 bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 shadow-xl">
          {renderGameHeader()}
          
          {/* Moves hint tooltip - hidden by default */}
          <div id="moves-hint" className="hidden bg-slate-800 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 text-center text-sm animate-fade-in">
            <p>Each pair of cards you flip counts as 1 move.<br/>Try to match all pairs in the fewest moves possible!</p>
          </div>
          
          {/* Card grid with consistent sizing and improved animations */}
          <div 
            className={`grid ${cols} gap-2 sm:gap-3 mb-3 sm:mb-4 mx-auto`} 
            style={{ maxWidth: '90%' }}
          >
            {cards.map((card, index) => (
              <div 
                key={card.id}
                onClick={() => handleCardClick(index)}
                className="card-container"
              >
                <div 
                  className={`aspect-square cursor-pointer perspective-1000 ${
                    matchedPairs.includes(card.value) || flippedIndices.includes(index) ? '' : 'hover:scale-105'
                  } transition-transform duration-200 w-full h-full`}
                >
                  <div className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ${
                    flippedIndices.includes(index) || matchedPairs.includes(card.value) ? 'rotate-y-180' : ''
                  }`}>
                    {/* Card Back */}
                    <div className={`absolute w-full h-full backface-hidden ${theme.cardBack} rounded-lg flex items-center justify-center shadow-md`}>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Card Front */}
                    <div className={`absolute w-full h-full backface-hidden bg-white bg-opacity-95 rounded-lg flex flex-col items-center justify-center shadow-lg rotate-y-180 ${
                      matchedPairs.includes(card.value) ? 'ring-2 ring-green-500 ring-opacity-70 animate-pulse-subtle' : ''
                    }`}>
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-1">{card.icon}</div>
                      <div className="text-xs sm:text-sm text-slate-700 font-medium">{card.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {renderGameControls()}
        </div>
        
        {/* Victory Modal */}
        {renderVictoryModal()}
        
        {/* Enhanced Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-40">
            {Array.from({ length: 150 }).map((_, i) => {
              const size = Math.random() * 10 + 5;
              const colors = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f97316", "#ec4899", "#6366f1"];
              const color = colors[Math.floor(Math.random() * colors.length)];
              const left = `${Math.random() * 100}%`;
              const animDuration = Math.random() * 3 + 2;
              const animDelay = Math.random() * 2;
              
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    borderRadius: '50%',
                    left,
                    top: '-20px',
                    animation: `fall ${animDuration}s linear ${animDelay}s forwards`,
                  }}
                />
              );
            })}
          </div>
        )}
        
        {/* Add global animations for confetti */}
        <style jsx global>{`
          @keyframes fall {
            0% {
              transform: translateY(-20px) rotate(0deg);
              opacity: 1;
            }
            80% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
          
          @keyframes bounce-in {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            70% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes pulse-subtle {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }
          
          @keyframes fade-in {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          
          .perspective-1000 {
            perspective: 1000px;
          }
          
          .transform-style-preserve-3d {
            transform-style: preserve-3d;
          }
          
          .backface-hidden {
            backface-visibility: hidden;
          }
          
          .rotate-y-180 {
            transform: rotateY(180deg);
          }
          
          .animate-bounce-in {
            animation: bounce-in 0.5s ease-out forwards;
          }
          
          .animate-pulse-subtle {
            animation: pulse-subtle 2s infinite;
          }
          
          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
        `}</style>
      </div>
    );
  };
  
  // Main render method based on current screen
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return renderWelcomeScreen();
      case 'themeSelect':
        return renderThemeSelect();
      case 'game':
        return renderGameScreen();
      default:
        return renderWelcomeScreen();
    }
  };
  
  return <div className="font-sans">{renderCurrentScreen()}</div>;
}