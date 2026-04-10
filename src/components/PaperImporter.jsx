import { useState, useEffect } from 'react';
import { FileText, RefreshCw, CheckCircle, AlertCircle, Database, BookOpen } from 'lucide-react';
import { getPaperStats } from '../lib/supabase';

export default function PaperImporter({ language = 'en' }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const labels = {
    title: language === 'hi' ? 'पेपर डेटाबेस' : 'Paper Database',
    total: language === 'hi' ? 'कुल पेपर' : 'Total Papers',
    bySubject: language === 'hi' ? 'विषय के अनुसार' : 'By Subject',
    import: language === 'hi' ? 'आयात करें' : 'Import',
    lastUpdated: language === 'hi' ? 'अंतिम अपडेट' : 'Last Updated',
    noData: language === 'hi' ? 'कोई पेपर नहीं मिला' : 'No papers found',
    clickToImport: language === 'hi' ? 'आयात करने के लिए npm run import-papers चलाएं' : 'Run "npm run import-papers" to import'
  };

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const paperStats = await getPaperStats();
      setStats(paperStats);
      const saved = localStorage.getItem('papersLastUpdated');
      if (saved) setLastUpdated(new Date(saved));
    } catch (error) {
      console.error('Failed to load stats:', error);
      setStats({ total: 0, bySubject: {} });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1f2833]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/10 mt-6 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#1f2833]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-[#66FCF1]/10 border border-[#66FCF1]/20 rounded-xl shadow-[0_0_15px_rgba(102,252,241,0.2)]">
          <Database className="w-5 h-5 text-[#66FCF1]" />
        </div>
        <h2 className="text-xl font-bold text-white">{labels.title}</h2>
      </div>

      {stats?.total > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0B0C10]/40 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#00E676]" />
              <span className="text-sm font-bold text-slate-300">{labels.total}</span>
            </div>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#66FCF1] to-[#00E676]">{stats.total}</span>
          </div>

          {lastUpdated && (
            <div className="text-xs text-slate-500">
              {labels.lastUpdated}: {lastUpdated.toLocaleDateString()}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#8A2BE2] uppercase tracking-wider mb-3">{labels.bySubject}</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(stats.bySubject).map(([subject, count]) => (
                <div key={subject} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-300 truncate">{subject}</span>
                  </div>
                  <span className="text-sm font-bold text-[#66FCF1]">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-2">{labels.noData}</p>
          <p className="text-xs text-slate-500">{labels.clickToImport}</p>
        </div>
      )}
    </div>
  );
}