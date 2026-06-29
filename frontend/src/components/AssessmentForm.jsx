import React from 'react';
import { ChevronLeft, SlidersHorizontal } from 'lucide-react';
import { t } from '../translations';

export default function AssessmentForm({ 
  setCurrentView, 
  formData, 
  setFormData, 
  handleSliderChange, 
  handleFetchRecommendations, 
  language 
}) {
  const text = t[language];

  // Map the translated slider labels to the matching backend state keys
  const metricsMap = [
    { label: text.m_placement, key: "placement_score" },
    { label: text.m_coding, key: "coding_env_score" },
    { label: text.m_higher, key: "higher_study_score" },
    { label: text.m_gov, key: "gov_exam_score" },
    { label: text.m_faculty, key: "faculty_score" },
    { label: text.m_life, key: "college_life_score" },
    { label: text.m_sports, key: "sports_score" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => setCurrentView('landing')} 
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-medium"
        >
          <ChevronLeft size={20} /> {text.back_home}
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
            <SlidersHorizontal className="text-indigo-600" size={24} />
            <div>
              <h2 className="text-2xl font-bold">{text.form_title}</h2>
              <p className="text-slate-500">{text.form_subtitle}</p>
            </div>
          </div>

          <form onSubmit={handleFetchRecommendations} className="space-y-8">
            
            {/* Input Row: Rank & Branch Dropdown Side by Side on Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Rank Number Input */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {text.form_rank_label}
                </label>
                <input 
                  type="number" 
                  placeholder={text.form_rank_placeholder} 
                  value={formData.rank}
                  onChange={(e) => setFormData({...formData, rank: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none"
                  required
                />
              </div>

              {/* Engineering Branch Selector */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {text.form_branch_label}
                </label>
                <select 
                  value={formData.branch}
                  onChange={(e) => setFormData({...formData, branch: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none bg-white cursor-pointer font-medium text-slate-700"
                >
                  <option value="cs">Computer Science (CS)</option>
                  <option value="it">Information Technology (IT)</option>
                  <option value="entc">Electronics & Telecom (ENTC)</option>
                  <option value="mech">Mechanical Engineering</option>
                  <option value="civil">Civil Engineering</option>
                </select>
              </div>
            </div>

            {/* Render Calibrated Preference Sliders (1 to 5) */}
            <div className="space-y-6 pt-4">
              {metricsMap.map(({ label, key }) => (
                <div key={key} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between mb-2">
                    <label className="font-semibold text-slate-700">{label}</label>
                    <span className="font-bold text-indigo-600">{formData.preferences[key]} / 5</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={formData.preferences[key]}
                    onChange={(e) => handleSliderChange(key, e.target.value)}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl transition-colors shadow-md text-center"
            >
              {text.form_submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}