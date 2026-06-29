import React from 'react';
import { ChevronLeft, Scale } from 'lucide-react';
import { t } from '../translations';

export default function ComparisonDashboard({ setCurrentView, compareList }) {
  const metrics = {
    placement_score: "Placement Opportunities",
    coding_env_score: "Coding Culture",
    higher_study_score: "Higher Studies Support",
    gov_exam_score: "Govt Exam Prep",
    faculty_score: "Faculty Quality",
    college_life_score: "Campus Life",
    sports_score: "Sports Facilities"
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900 pb-24">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => setCurrentView('results')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-medium">
          <ChevronLeft size={20} /> Back to Results
        </button>

        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-700 rounded-lg"><Scale size={28} /></div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Detailed Comparison</h2>
            <p className="text-slate-500">Side-by-side analysis of your selected colleges.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-6 border-b border-slate-200 bg-slate-50 w-1/4">Metric</th>
                {compareList.map((college, i) => (
                  <th key={i} className="p-6 border-b border-l border-slate-200 text-lg font-bold w-1/4 align-top">
                    <div className="flex flex-col h-full justify-between gap-4">
                      <span className="text-indigo-900 leading-tight">{college.college_name}</span>
                      <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-md w-fit">{college.match_score}% Match</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(metrics).map(([key, label]) => {
                const highestScore = Math.max(...compareList.map(c => c.metrics[key]));
                
                return (
                  <tr key={key} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 border-b border-slate-100 font-semibold text-slate-700">{label}</td>
                    {compareList.map((college, i) => {
                      const score = college.metrics[key];
                      const isWinner = score === highestScore && score > 0;
                      return (
                        <td key={i} className={`p-4 border-b border-l border-slate-100 text-center ${isWinner ? 'bg-emerald-50/50' : ''}`}>
                          <span className={`text-xl font-bold ${isWinner ? 'text-emerald-600' : 'text-slate-700'}`}>{score.toFixed(1)}</span>
                          {/* UPDATED: Now shows / 5 */}
                          <span className="text-slate-400 text-sm"> / 5</span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {compareList[0]?.extra_data && (
                <>
                  <tr><td colSpan={compareList.length + 1} className="p-4 bg-slate-800 text-white font-bold uppercase tracking-wider text-sm text-center">Additional Campus Insights</td></tr>
                  {Object.keys(compareList[0].extra_data).map((key) => (
                    <tr key={key} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 border-b border-slate-100 font-bold text-indigo-900 bg-indigo-50/30">{key}</td>
                      {compareList.map((college, i) => {
                        const val = college.extra_data[key];
                        const isRating = key.includes("Rating") || key.includes("Satisfaction");
                        return (
                          <td key={i} className="p-4 border-b border-l border-slate-100 text-center">
                            <span className="text-lg font-bold text-slate-700">{val === 0 && !isRating ? "N/A" : val}</span>
                            {/* UPDATED: Now shows / 5 for ratings */}
                            {isRating && <span className="text-slate-400 text-sm"> / 5</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </>
              )}

              <tr className="bg-slate-50/50">
                <td className="p-4 border-t-2 border-slate-200 font-bold text-slate-700">Data Confidence (Reviews)</td>
                {compareList.map((college, i) => (
                  <td key={i} className="p-4 border-t-2 border-l border-slate-200 text-center text-sm text-slate-600">
                    Based on <span className="font-bold text-slate-900">{college.response_count}</span> reviews
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}