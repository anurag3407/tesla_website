'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  className?: string;
}

export function TypewriterText({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000,
  className = '',
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleTyping = () => {
      const currentFullText = texts[currentIndex];

      if (!isDeleting) {
        setDisplayText((prev) => currentFullText.substring(0, prev.length + 1));
        
        if (displayText === currentFullText) {
          timeout = setTimeout(() => setIsDeleting(true), pauseTime);
          return;
        }
        timeout = setTimeout(handleTyping, typingSpeed);
      } else {
        setDisplayText((prev) => currentFullText.substring(0, prev.length - 1));
        
        if (displayText === '') {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
          timeout = setTimeout(handleTyping, typingSpeed);
          return;
        }
        timeout = setTimeout(handleTyping, deletingSpeed);
      }
    };

    timeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, texts, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle"
      />
    </span>
  );
}
