import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const TERMINAL_LINES_EN = [
  '🧠 INITIALIZING EXAMINER PSYCHOLOGY MATRIX...',
  '📊 ANALYZING 15-YEAR TREND PATTERNS...',
  '🔄 IDENTIFYING DORMANT TOPICS (Due for 2027)...',
  '✅ MAPPING EVERGREEN TOPICS (High Probability)...',
  '🎯 PLACING TRAP QUESTIONS STRATEGICALLY...',
  '📝 GENERATING COMPETENCY-BASED QUESTIONS...',
  '📋 CREATING CASE STUDIES (NEP 2020)...',
  '⚖️ APPLYING 30-50-20 DIFFICULTY RULE...',
  '🎓 SIMULATING SENIOR EXAMINER BIAS...',
  '✨ GENERATING 95% CONFIDENCE BOARD PAPER...',
];

const TERMINAL_LINES_HI = [
  '🧠 परीक्षक मनोविज्ञान मैट्रिक्स प्रारंभ कर रहे हैं...',
  '📊 15-वर्ष के रुझान विश्लेषण का विश्लेषण कर रहे हैं...',
  '🔄 निष्क्रिय विषयों की पहचान कर रहे हैं (2027 के लिए)...',
  '✅ सदैव-हरी विषयों को मैप कर रहे हैं (उच्च संभावना)...',
  '🎯 रणनीतिक रूप से प्रश्नों को रख रहे हैं...',
  '📝 कम्पिटेंसी-आधारित प्रश्न उत्पन्न कर रहे हैं...',
  '📋 केस स्टडी बना रहे हैं (NEP 2020)...',
  '⚖️ 30-50-20 कठिनाई नियम लागू कर रहे हैं...',
  '🎓 वरिष्ठ परीक्षक पूर्वाग्रह का अनुकरण कर रहे हैं...',
  '✨ 95% विश्वास बोर्ड पेपर उत्पन्न कर रहे हैं...',
];

export default function TerminalLoader({ isActive, subject, language = 'en' }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const TERMINAL_LINES = language === 'hi' ? TERMINAL_LINES_HI : TERMINAL_LINES_EN;

  useEffect(() => {
    if (!isActive) {
      setVisibleLines([]);
      setCurrentIndex(0);
      return;
    }

    const interval = setInterval(() => {
      if (currentIndex < TERMINAL_LINES.length) {
        const line = TERMINAL_LINES[currentIndex].replace('[SUBJECT]', subject || 'CBSE');
        setVisibleLines(prev => [...prev, line]);
        setCurrentIndex(prev => prev + 1);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isActive, currentIndex, subject, TERMINAL_LINES]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-[#0B0C10]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-hidden"
        >
          {/* Scanning Line Animation overlay */}
          <motion.div 
            animate={{ top: ['-10%', '110%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#66FCF1]/10 to-transparent pointer-events-none"
          />

          <div className="w-full max-w-2xl relative z-10">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-[#00E676] shadow-[0_0_10px_rgba(0,230,118,0.5)]" />
              <span className="ml-4 text-[#66FCF1]/70 text-xs font-mono font-bold tracking-widest uppercase">
                Intelligence Engine Core
              </span>
            </div>

            <div className="bg-[#1f2833]/80 backdrop-blur-xl border border-[#66FCF1]/20 rounded-2xl p-6 font-mono text-sm sm:text-base min-h-[350px] shadow-[0_0_50px_rgba(102,252,241,0.15)] relative overflow-hidden">
               {/* Internal Grid Pattern */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

              <div className="relative z-10 space-y-1">
                {visibleLines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-3 py-1"
                  >
                    <span className="text-[#66FCF1] mt-0.5 font-bold">›</span>
                    <span className="text-[#66FCF1] font-medium drop-shadow-[0_0_8px_rgba(102,252,241,0.5)]">{line}</span>
                    {index === visibleLines.length - 1 && (
                      <span className="text-[#00E676] cursor-blink drop-shadow-[0_0_8px_rgba(0,230,118,0.8)]">_</span>
                    )}
                  </motion.div>
                ))}

                {currentIndex < TERMINAL_LINES.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="flex items-start gap-3 py-1 mt-2"
                  >
                    <span className="text-[#66FCF1] mt-0.5">›</span>
                    <span className="text-[#66FCF1]/50 italic">Synthesizing 15 years of data...</span>
                    <span className="text-[#00E676] cursor-blink">_</span>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center text-[#66FCF1]/60 text-xs font-mono px-2">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_8px_rgba(0,230,118,0.8)]" />
                SYSTEM OPERATION: NOMINAL
              </span>
              <span className="font-bold text-[#00E676] tracking-widest">{Math.round((visibleLines.length / TERMINAL_LINES.length) * 100)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}