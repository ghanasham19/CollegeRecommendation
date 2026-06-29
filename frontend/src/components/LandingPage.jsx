import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight, BrainCircuit, Users, Building2, CheckCircle2, Globe, X, Database } from 'lucide-react';
import { t } from '../translations'; 

export default function LandingPage({ setCurrentView, language, setLanguage }) {
  const text = t[language];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); 
  const [collegeList, setCollegeList] = useState([]);
  
  const [reviewData, setReviewData] = useState({
    college_name: "", branch: "CS",
    placement_score: 3, higher_study_score: 3, gov_exam_score: 3,
    coding_env_score: 3, faculty_score: 3, college_life_score: 3, sports_score: 3,
    overall_satisfaction: 3, hostel_rating: 3
  });

  useEffect(() => {
    if (isModalOpen && collegeList.length === 0) {
      axios.get('http://localhost:5000/api/colleges')
        .then(res => {
          setCollegeList(res.data.data);
          if(res.data.data.length > 0) {
            setReviewData(prev => ({...prev, college_name: res.data.data[0]}));
          }
        })
        .catch(err => console.error("Error fetching colleges:", err));
    }
  }, [isModalOpen]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');
    try {
      await axios.post('http://localhost:5000/api/submit-review', reviewData);
      setSubmitStatus('success');
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitStatus(null);
        setReviewData(prev => ({
          ...prev, placement_score: 3, higher_study_score: 3, gov_exam_score: 3,
          coding_env_score: 3, faculty_score: 3, college_life_score: 3, sports_score: 3,
          overall_satisfaction: 3, hostel_rating: 3
        })); 
      }, 2500);
    } catch (error) {
      console.error("Error submitting review:", error);
      setSubmitStatus(null);
      alert("Error saving to database. Check your backend terminal.");
    }
  };

  const metrics = [
    { key: 'placement_score', label: 'Placements' },
    { key: 'coding_env_score', label: 'Coding Culture' },
    { key: 'faculty_score', label: 'Faculty Quality' },
    { key: 'higher_study_score', label: 'Higher Studies' },
    { key: 'gov_exam_score', label: 'Govt Exam Prep' },
    { key: 'college_life_score', label: 'Campus Life' },
    { key: 'sports_score', label: 'Sports Facilities' },
    { key: 'hostel_rating', label: 'Hostel Quality' },
    { key: 'overall_satisfaction', label: 'Overall Satisfaction' }
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* --- Premium Glassmorphism Background Blobs --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 pointer-events-none z-0"></div>

      {/* --- Floating Navbar --- */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0">
        <div className="flex items-center gap-3 text-indigo-600">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <BrainCircuit size={28} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">CollegeAI</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100/80 hover:bg-slate-200/80 transition-colors px-3 py-2 rounded-xl border border-slate-200">
            <Globe size={16} className="text-slate-500" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>

          <button 
            onClick={() => setCurrentView('dean_dashboard')}
            className="hidden md:block px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-all duration-300 border border-slate-200/80 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-sm"
          >
            {text.admin_btn || "Dean Dashboard"}
          </button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="relative z-10 max-w-6xl mx-auto px-8 pt-24 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white border border-indigo-100 shadow-sm text-indigo-700 text-sm font-bold tracking-wide">
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
            {text.badge}
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
            {text.title_start} 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 ml-3">
              {text.title_highlight}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
            {text.subtitle}
          </p>
          
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Premium Main Button */}
            <button 
              onClick={() => setCurrentView('assessment')}
              className="relative inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-lg px-10 py-5 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.3)] transition-all duration-300 hover:-translate-y-1 active:scale-95 border border-white/10"
            >
              {text.start_btn} <ArrowRight size={22} strokeWidth={2.5} />
            </button>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2"
            >
              {text.modal_btn || "Are you a student? Contribute Data"}
              <div className="h-px w-0 bg-indigo-600 group-hover:w-full transition-all duration-300 absolute bottom-0 left-0"></div>
            </button>
          </div>
        </div>

        {/* --- Premium Stats Footer --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {/* Card 1 */}
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-2">361</h3>
            <p className="text-slate-500 font-bold tracking-wide uppercase text-xs">{text.stat_reviews}</p>
          </div>
          
          {/* Card 2 */}
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <Building2 size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-2">60+</h3>
            <p className="text-slate-500 font-bold tracking-wide uppercase text-xs">{text.stat_colleges}</p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle2 size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-2">24</h3>
            <p className="text-slate-500 font-bold tracking-wide uppercase text-xs">{text.stat_metrics}</p>
          </div>
        </div>
      </main>

      {/* --- Massive Contribution Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 border border-slate-100">
            
            <div className="flex justify-between items-start mb-8 sticky top-0 bg-white/90 backdrop-blur-sm pt-2 pb-4 z-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{text.modal_title || "Share Your College Experience"}</h3>
                <p className="text-slate-500 font-medium mt-2">{text.modal_sub || "Rate your campus. We handle the cutoffs automatically."}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>

            {submitStatus === 'success' ? (
              <div className="flex flex-col items-center justify-center py-20 text-emerald-600 space-y-6">
                <div className="p-6 bg-emerald-50 rounded-full animate-bounce">
                  <CheckCircle2 size={72} strokeWidth={2.5} />
                </div>
                <h4 className="text-2xl font-black tracking-tight">{text.modal_success || "Success! Data added."}</h4>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-8">
                
                {/* Inputs Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select College</label>
                    <select 
                      required
                      value={reviewData.college_name} 
                      onChange={(e) => setReviewData({...reviewData, college_name: e.target.value})} 
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none text-slate-900 font-bold transition-all appearance-none cursor-pointer"
                    >
                      {collegeList.map(college => (
                        <option key={college} value={college}>{college}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Branch</label>
                    <select 
                      value={reviewData.branch} 
                      onChange={(e) => setReviewData({...reviewData, branch: e.target.value})} 
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none text-slate-900 font-bold transition-all appearance-none cursor-pointer"
                    >
                      <option value="CS">Computer Science (CSE/CS)</option>
                      <option value="IT">Information Tech (IT)</option>
                      <option value="ENTC">Electronics & Telecom (ENTC)</option>
                      <option value="Mech">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="AI & DS">AI & Data Science</option>
                    </select>
                  </div>
                </div>

                {/* Grid of Sliders */}
                <div className="bg-slate-50 p-8 rounded-[1.5rem] border border-slate-200/60">
                  <h4 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest text-center">Slide to rate out of 5</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {metrics.map(metric => (
                      <div key={metric.key} className="group">
                        <div className="flex justify-between items-center text-sm mb-3">
                          <span className="font-bold text-slate-600">{metric.label}</span>
                          <span className="font-black text-indigo-700 bg-indigo-100 px-3 py-1 rounded-lg shadow-sm">{reviewData[metric.key]}</span>
                        </div>
                        <input 
                          type="range" min="1" max="5" 
                          value={reviewData[metric.key]} 
                          onChange={(e) => setReviewData({...reviewData, [metric.key]: e.target.value})} 
                          className="w-full h-2.5 rounded-full appearance-none cursor-pointer accent-indigo-600 bg-slate-200 hover:bg-slate-300 transition-colors" 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={submitStatus === 'loading'} className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-5 rounded-2xl transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-3 text-lg">
                  <Database size={22} strokeWidth={2.5} /> 
                  {submitStatus === 'loading' ? 'Saving to ML Model...' : (text.modal_submit || "Submit Data")}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}