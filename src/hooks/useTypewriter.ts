import { useState, useEffect } from 'react';

export const useTypewriter = (
  text: string,
  speed: number = 50,
  delay: number = 0
) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Don't reset if text is empty (prevents flashing)
    if (!text) return;

    setDisplayText('');
    setIsComplete(false);
    setIsTyping(false);

    const startTimeout = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;

      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(prev => text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsComplete(true);
          setIsTyping(false);
          clearInterval(typeInterval);
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);

  return { displayText, isComplete, isTyping };
}; 