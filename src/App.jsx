import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Brain, FileText, History, Settings, ChevronRight, Sparkles, Globe, Menu, ChevronDown, CheckCircle2 } from 'lucide-react';
import PaperGenerator from './components/PaperGenerator';
import PaperViewer from './components/PaperViewer';
import PaperImporter from './components/PaperImporter';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [paper, setPaper] = useState(null);
  const [isPaperOpen, setIsPaperOpen] = useState(false);
  const [language, setLanguage] = useState('en');

  const handleGenerate = (generatedPaper) => {
    setPaper(generatedPaper);
    setActiveTab('paper');
    setIsPaperOpen(true);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const tabs = [
    { id: 'generate', label: language === 'en' ? 'Generate' : 'जनरेट', icon: Sparkles },
    { id: 'paper', label: language === 'en' ? 'Paper' : 'पेपर', icon: FileText },
    { id: 'history', label: language === 'en' ? 'History' : 'इतिहास', icon: History },
    { id: 'settings', label: language === 'en' ? 'Settings' : 'सेटिंग्स', icon: Settings },
  ];

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <div className="min-h-[100dvh] bg-[#0B0C10] text-slate-100 font-sans selection:bg-[#66FCF1]/30 relative overflow-hidden">
      {/* Background Mesh Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#66FCF1]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#8A2BE2]/10 blur-[150px]" />
        
        {/* Animated Vector 3D Book Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.15] transform-gpu animate-pulse pointer-events-none" style={{ animationDuration: '8s' }}>
          <motion.svg 
            width="600" height="600" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
            animate={{ 
              rotateZ: [12, -5, 12],
              y: [0, -30, 0],
              x: [0, 20, 0]
            }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          >
            <path d="M40 140 L40 60 L100 40 L160 60 L160 140 L100 160 Z" stroke="#66FCF1" strokeWidth="2" strokeLinejoin="round" fill="rgba(102, 252, 241, 0.05)" />
            <path d="M100 40 L100 160" stroke="#66FCF1" strokeWidth="2" strokeLinejoin="round" />
            <path d="M40 60 L100 80 L160 60" stroke="#66FCF1" strokeWidth="2" strokeLinejoin="round" />
            <path d="M50 75 L90 90 M50 90 L90 105 M50 105 L90 120" stroke="#8A2BE2" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M150 75 L110 90 M150 90 L110 105 M150 105 L110 120" stroke="#8A2BE2" strokeWidth="1.5" strokeLinecap="round" />
          </motion.svg>
        </div>
      </div>

      {/* Floating Glassmorphic Bottom Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#1f2833]/80 backdrop-blur-2xl border border-white/10 rounded-full z-40 p-2 shadow-2xl shadow-[#0B0C10]/50 no-print">
        <div className="flex justify-between items-center px-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-full transition-all duration-300 ${
                  isActive ? 'text-[#66FCF1]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-[#66FCF1]/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon className={`w-6 h-6 z-10 transition-transform ${isActive ? 'fill-current scale-110' : ''}`} strokeWidth={isActive ? 2 : 1.5} />
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-[10px] font-semibold tracking-wider mt-1 z-10 uppercase"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pb-32 relative z-10">
        <motion.header 
          variants={{
            visible: { y: 0, scale: 1, opacity: 1 },
            hidden: { y: "-150%", scale: 0.95, opacity: 0 }
          }}
          animate={hidden ? "hidden" : "visible"}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="sticky top-4 z-50 px-4 w-full max-w-md mx-auto no-print"
        >
          <div className="bg-[#1f2833]/70 backdrop-blur-2xl border border-white/10 rounded-full px-4 py-3 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-[#66FCF1]/20 rounded-full shadow-[0_0_15px_rgba(102,252,241,0.3)]">
                <Brain className="w-5 h-5 text-[#66FCF1]" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-bold text-white tracking-tight leading-none">
                  Paperguru.ai
                </h1>
                <div className="flex items-center gap-1.5 mt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_8px_#00E676]" />
                   <span className="text-[10px] text-slate-300 font-medium">Data: 77+ CBSE Papers</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleLanguage}
                className="flex items-center justify-center p-2 rounded-full bg-slate-800/50 text-slate-300 hover:text-white transition-colors border border-white/5"
              >
                <Globe className="w-4 h-4 mr-1" />
                <span className="text-[10px] font-bold">{language === 'en' ? 'EN' : 'HI'}</span>
              </button>
              <button className="flex items-center justify-center p-2 rounded-full bg-slate-800/50 text-slate-300 hover:text-white transition-colors border border-white/5">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.header>

        <main className="max-w-md mx-auto px-4 py-6">
          {activeTab === 'generate' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="mb-8 mt-2 text-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#66FCF1]/10 border border-[#66FCF1]/20 text-[#66FCF1] text-[10px] font-bold tracking-widest uppercase mb-4"
                >
                  <Sparkles className="w-3 h-3" />
                  Supercharged by Claude 3.5
                </motion.div>
                <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                  {language === 'en' ? 'Predict Your' : 'अपना भविष्यवाणी करें'}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#66FCF1] to-[#00E676] drop-shadow-[0_0_15px_rgba(102,252,241,0.5)]">{language === 'en' ? 'Board Paper' : 'बोर्ड पेपर'}</span>
                </h2>
              </div>

              <PaperGenerator onGenerate={handleGenerate} language={language} />

              {paper && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => {
                    setActiveTab('paper');
                    setIsPaperOpen(true);
                  }}
                  className="w-full mt-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  View Generated Paper
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          )}

          {activeTab === 'paper' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {!paper ? (
                <div className="text-center py-16 px-4">
                  <div className="w-24 h-24 bg-[#1f2833]/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-[0_0_30px_rgba(102,252,241,0.1)]">
                    <FileText className="w-10 h-10 text-[#66FCF1]/50 mix-blend-screen" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Paper Ready</h3>
                  <p className="text-slate-400 text-sm mb-8">Generate a predictor paper to view it here.</p>
                  <button
                    onClick={() => setActiveTab('generate')}
                    className="px-6 py-3 bg-gradient-to-r from-[#66FCF1] to-[#00E676] text-[#0B0C10] rounded-full text-sm font-bold tracking-wide shadow-[0_0_20px_rgba(102,252,241,0.4)] hover:shadow-[0_0_30px_rgba(102,252,241,0.6)] transition-all"
                  >
                    Generate Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-[#1f2833]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white tracking-tight">{paper.subjectName}</h3>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] rounded-full text-xs font-bold font-mono">
                        <CheckCircle2 className="w-3 h-3" />
                        {paper.confidenceScore}% Confidence
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-slate-400">
                      <p>Questions: {paper.questions.length}</p>
                      <p>Generated: {new Date(paper.generatedAt).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => setIsPaperOpen(true)}
                      className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#66FCF1] to-[#00E676] text-[#0B0C10] rounded-xl font-bold hover:shadow-[0_0_20px_rgba(102,252,241,0.4)] transition-all"
                    >
                      View Full Paper
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center py-16 px-4">
                <div className="w-24 h-24 bg-[#1f2833]/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-[0_0_30px_rgba(102,252,241,0.1)]">
                  <History className="w-10 h-10 text-[#66FCF1]/50 mix-blend-screen" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No History Yet</h3>
                <p className="text-slate-400 text-sm">Your generated papers will securely appear here.</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-[#1f2833]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] space-y-6">
                <h3 className="text-xl font-bold text-white tracking-tight mb-4">Settings</h3>
                
                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors">
                  <span className="text-sm font-bold text-slate-300">Dark Mode</span>
                  <div className="w-12 h-6 bg-[#00E676] rounded-full relative shadow-[0_0_15px_rgba(0,230,118,0.3)]">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-[#0B0C10] rounded-full" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors">
                  <span className="text-sm font-bold text-slate-300">Notifications</span>
                  <div className="w-12 h-6 bg-[#0B0C10]/50 border border-white/10 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-slate-500 rounded-full" />
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-white/10">
                  <p className="text-xs font-bold text-[#66FCF1] tracking-wider uppercase">Paperguru.ai Intelligence Engine</p>
                  <p className="text-xs text-slate-500 mt-1 font-mono">v3.0.0-beta • Connected</p>
                </div>
              </div>

              <PaperImporter language={language} />
            </motion.div>
          )}
        </main>
      </div>

      <PaperViewer
        paper={paper}
        isOpen={isPaperOpen}
        onClose={() => setIsPaperOpen(false)}
        language={language}
      />
    </div>
  );
}

export default App;