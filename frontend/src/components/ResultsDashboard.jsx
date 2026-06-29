import React, { useState } from 'react';
import axios from 'axios';
import { 
  ChevronLeft, Loader2, Sparkles, Award, BarChart3, CheckSquare, 
  Square, Scale, Target, Star, ShieldCheck, TrendingUp, MessageSquare, 
  Send, Users 
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip as RechartsTooltip, Legend 
} from 'recharts';
import { t } from '../translations';

export default function ResultsDashboard({
  setCurrentView, isLoading, recommendations, expandedCollegeIdx, 
  setExpandedCollegeIdx, compareList, toggleCompare, formatChartData,
  language
}) {
  const text = t[language]; 
  const [activeTab, setActiveTab] = useState('best_fit');
  const [chatHistories, setChatHistories] = useState({});
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const getChanceColors = (level) => {
    switch(level) {
      case 'safe': return { text: 'text-emerald-600', bg: 'bg-emerald-500' };
      case 'good': return { text: 'text-blue-600', bg: 'bg-blue-500' };
      case 'borderline': return { text: 'text-amber-500', bg: 'bg-amber-500' };
      default: return { text: 'text-red-500', bg: 'bg-red-500' };
    }
  };

  const getFilteredColleges = () => {
    let filtered = [];
    if (activeTab === 'best_fit') filtered = recommendations; 
    else if (activeTab === 'safe') filtered = recommendations.filter(c => c.admission_chance?.level === 'safe' || c.admission_chance?.level === 'good');
    else if (activeTab === 'reach') filtered = recommendations.filter(c => c.admission_chance?.level === 'reach' || c.admission_chance?.level === 'borderline');
    return filtered.slice(0, 5); 
  };

  const displayColleges = getFilteredColleges();

  const handleSendMessage = async (collegeName, idx) => {
    if (!chatInput.trim()) return;

    const newMsg = { role: 'user', text: chatInput };
    const greeting = language === 'mr' ? `नमस्ते! मी ${collegeName} च्या विद्यार्थ्यांच्या फीडबॅकवर प्रशिक्षित AI आहे. तुम्हाला काय विचारायचे आहे?` : 
                     language === 'hi' ? `नमस्ते! मैं ${collegeName} के छात्रों की प्रतिक्रिया पर प्रशिक्षित AI हूँ। आप क्या जानना चाहते हैं?` :
                     `Hi! I'm an AI trained on verified feedback from ${collegeName} students. What would you like to know?`;

    const history = chatHistories[idx] || [{ role: 'ai', text: greeting }];
    
    setChatHistories({ ...chatHistories, [idx]: [...history, newMsg] });
    setChatInput("");
    setIsTyping(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        college_name: collegeName,
        message: newMsg.text
      });
      
      if (response.data.status === 'success') {
        setChatHistories(prev => ({
          ...prev,
          [idx]: [...(prev[idx] || []), { role: 'ai', text: response.data.reply }]
        }));
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900 pb-24 font-sans">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => setCurrentView('assessment')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-medium" disabled={isLoading}>
          <ChevronLeft size={20} /> {text.rd_back}
        </button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center pt-32 space-y-4">
            <Loader2 size={48} className="text-indigo-600 animate-spin" />
            <h3 className="text-xl font-bold">{text.rd_loading}</h3>
            <p className="text-slate-500">{text.rd_loading_sub}</p>
          </div>
        ) : (
          <div>
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-sm inline-flex items-center gap-1.5 mb-3">
                  <Sparkles size={14} /> {text.rd_opt_complete}
                </span>
                <h2 className="text-3xl font-bold tracking-tight">{text.rd_title}</h2>
                <p className="text-slate-500">{text.rd_subtitle}</p>
              </div>

              <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
                <button onClick={() => setActiveTab('best_fit')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'best_fit' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}><Star size={16} /> {text.rd_tab_best}</button>
                <button onClick={() => setActiveTab('safe')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'safe' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}><ShieldCheck size={16} /> {text.rd_tab_safe}</button>
                <button onClick={() => setActiveTab('reach')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'reach' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}><TrendingUp size={16} /> {text.rd_tab_reach}</button>
              </div>
            </div>

            <div className="space-y-6">
              {displayColleges.length === 0 ? (
                <div className="bg-white p-8 rounded-xl text-center border border-slate-200">
                  <p className="text-slate-600 font-medium">{text.rd_no_matches}</p>
                </div>
              ) : (
                displayColleges.map((college, idx) => {
                  const isSelected = compareList.find(c => c.college_name === college.college_name);
                  const colors = getChanceColors(college.admission_chance?.level || 'reach');
                  
                  const greeting = language === 'mr' ? `नमस्ते! मी ${college.college_name} च्या विद्यार्थ्यांच्या फीडबॅकवर प्रशिक्षित AI आहे. तुम्हाला काय विचारायचे आहे?` : 
                     language === 'hi' ? `नमस्ते! मैं ${college.college_name} के छात्रों की प्रतिक्रिया पर प्रशिक्षित AI हूँ। आप क्या जानना चाहते हैं?` :
                     `Hi! I'm an AI trained on verified feedback from ${college.college_name} students. What would you like to know?`;
                     
                  const currentChat = chatHistories[idx] || [{ role: 'ai', text: greeting }];
                  
                  return (
                    <div key={idx} className={`bg-white rounded-xl shadow-sm border ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200'} overflow-hidden transition-all`}>
                      <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2 max-w-2xl flex-1">
                          
                          {/* UPDATED: College Name with Social Proof Badge */}
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center justify-center bg-indigo-50 text-indigo-700 font-bold h-7 w-7 rounded-md text-sm border border-indigo-100">#{idx + 1}</span>
                              <h3 className="text-xl font-bold text-slate-900">{college.college_name}</h3>
                            </div>
                            <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 shadow-sm">
                              <Users size={12} />
                              {college.response_count} {text.rd_reviews_badge}
                            </span>
                          </div>
                          
                          <div className="bg-indigo-50/50 border-l-4 border-indigo-500 p-4 rounded-r-lg my-3">
                            <p className="text-sm text-indigo-900 font-medium italic">"{college.explanation}"</p>
                          </div>

                          {college.admission_chance && (
                            <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
                              <div className="flex justify-between items-end mb-3">
                                <div className="flex items-center gap-2">
                                  <Target size={16} className="text-slate-400" />
                                  <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none mb-1">{text.rd_predictor}</span>
                                    <p className={`font-bold text-sm ${colors.text}`}>{college.admission_chance.label}</p>
                                  </div>
                                </div>
                                <span className="text-sm font-bold text-slate-700">{college.admission_chance.value}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div className={`${colors.bg} h-2 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${college.admission_chance.value}%` }}></div>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-4 mt-5">
                            <button onClick={() => setExpandedCollegeIdx(expandedCollegeIdx === idx ? null : idx)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-md transition-colors">
                              <BarChart3 size={16} /> {expandedCollegeIdx === idx ? text.rd_btn_hide : text.rd_btn_view}
                            </button>
                            <button onClick={() => toggleCompare(college)} className={`text-sm font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${isSelected ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                              {isSelected ? <CheckSquare size={16} /> : <Square size={16} />} {isSelected ? text.rd_btn_compare_rem : text.rd_btn_compare_add}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl min-w-[140px] justify-center mt-4 md:mt-0">
                          <Award className="text-amber-500" size={24} />
                          <div>
                            <div className="text-2xl font-black text-indigo-600">{college.match_score}%</div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{text.rd_match_score}</div>
                          </div>
                        </div>
                      </div>

                      {expandedCollegeIdx === idx && (
                        <div className="bg-slate-50 border-t border-slate-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-300">
                          
                          <div className="flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-200 pb-8 md:pb-0 md:pr-8">
                            <h4 className="text-sm font-bold text-slate-600 mb-4 uppercase tracking-wider">{text.rd_chart_title}</h4>
                            <div className="w-full h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formatChartData(college.metrics)}>
                                  <PolarGrid stroke="#e2e8f0" />
                                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                                  {/* UPDATED: Radar Chart domain is correctly set to 0-5 */}
                                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} />
                                  <Radar name="Your Ideal" dataKey="Your Ideal" stroke="#818cf8" fill="#818cf8" fillOpacity={0.3} />
                                  <Radar name="College Rating" dataKey="College Rating" stroke="#34d399" fill="#34d399" fillOpacity={0.5} />
                                  <Legend wrapperStyle={{fontSize: "12px"}}/>
                                  <RechartsTooltip />
                                </RadarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          <div className="flex flex-col h-full">
                            <h4 className="text-sm font-bold text-indigo-600 mb-4 flex items-center gap-2 uppercase tracking-wider">
                              <MessageSquare size={16} /> {text.rd_chat_title}
                            </h4>
                            
                            <div className="flex-1 bg-white border border-slate-200 rounded-lg p-4 h-56 overflow-y-auto mb-3 space-y-4">
                              {currentChat.map((msg, mIdx) => (
                                <div key={mIdx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`text-sm px-4 py-2 rounded-xl max-w-[85%] ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'}`}>
                                    {msg.text}
                                  </div>
                                </div>
                              ))}
                              {isTyping && (
                                <div className="flex justify-start">
                                  <div className="text-sm px-4 py-2 rounded-xl bg-slate-100 text-slate-500 rounded-tl-sm animate-pulse">
                                    {text.rd_chat_typing}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(college.college_name, idx)}
                                placeholder={text.rd_chat_placeholder} 
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                              />
                              <button 
                                onClick={() => handleSendMessage(college.college_name, idx)}
                                disabled={isTyping}
                                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                              >
                                <Send size={18} />
                              </button>
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.1)] p-4 z-50 animate-in slide-in-from-bottom-4">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 text-indigo-700 h-10 w-10 flex items-center justify-center rounded-full font-bold text-lg">{compareList.length}</div>
              <div><p className="font-bold text-slate-900">{text.rd_float_selected}</p><p className="text-xs text-slate-500">{text.rd_float_sub}</p></div>
            </div>
            <button onClick={() => setCurrentView('compare')} disabled={compareList.length < 2} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${compareList.length >= 2 ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:-translate-y-1' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
              <Scale size={20} /> {text.rd_float_btn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}