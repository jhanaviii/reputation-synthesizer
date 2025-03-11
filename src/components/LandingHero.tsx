
import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useFadeIn } from '../utils/animations';

export const LandingHero = () => {
  const { domRef, isVisible } = useFadeIn();
  const [typedText, setTypedText] = useState('');
  const phrases = [
    'Track relationships.',
    'Monitor online presence.',
    'Manage tasks seamlessly.',
    'Store financial details.',
    'Analyze conversations.',
  ];
  const phrasesRef = useRef(0);
  const charsRef = useRef(0);
  const typingSpeedRef = useRef(50);
  const deleteSpeedRef = useRef(30);
  const delayRef = useRef(2000);
  const isDeleting = useRef(false);
  
  useEffect(() => {
    const typeWriter = () => {
      const currentPhrase = phrases[phrasesRef.current];
      
      if (isDeleting.current) {
        setTypedText(currentPhrase.substring(0, charsRef.current - 1));
        charsRef.current -= 1;
        
        if (charsRef.current === 0) {
          isDeleting.current = false;
          phrasesRef.current = (phrasesRef.current + 1) % phrases.length;
        }
      } else {
        setTypedText(currentPhrase.substring(0, charsRef.current + 1));
        charsRef.current += 1;
        
        if (charsRef.current === currentPhrase.length) {
          isDeleting.current = true;
          setTimeout(() => {}, delayRef.current);
        }
      }
      
      const speed = isDeleting.current ? deleteSpeedRef.current : typingSpeedRef.current;
      setTimeout(typeWriter, speed);
    };
    
    const timer = setTimeout(typeWriter, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      ref={domRef}
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-20 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block px-3 py-1 mb-8 rounded-full bg-secondary text-sm font-semibold">
          Relationship management reimagined
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Intelligent insights for your personal & professional relationships
        </h1>
        
        <div className="h-20 flex items-center justify-center">
          <h2 className="text-xl md:text-3xl text-muted-foreground font-medium">
            <span>{typedText}</span>
            <span className="inline-block w-1 h-8 bg-primary ml-1 animate-pulse"></span>
          </h2>
        </div>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-primary/50">
            Get Started
          </button>
          
          <button className="px-8 py-3 rounded-full bg-secondary text-foreground font-medium transition-all flex items-center gap-2 hover:gap-3">
            <span>See how it works</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      
      <div className="w-full max-w-5xl mt-20 relative">
        <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl animate-float premium-card">
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 9H9.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 9H15.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium mb-2">Dashboard Preview</h3>
              <p className="text-muted-foreground text-sm">
                Your interactive relationship management workspace
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/4 w-32 h-32 rounded-full bg-primary/20 backdrop-blur-xl animate-pulse-subtle"></div>
        <div className="absolute bottom-0 right-0 transform translate-y-1/4 translate-x-1/4 w-40 h-40 rounded-full bg-accent/20 backdrop-blur-xl animate-pulse-subtle"></div>
      </div>
    </div>
  );
};

export default LandingHero;
