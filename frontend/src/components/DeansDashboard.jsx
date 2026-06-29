import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, Building, TrendingDown, TrendingUp, Users, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DeansDashboard({ setCurrentView }) {
  const [data, setData] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/dashboard');
        if (response.data.status === 'success') {
          setData(response.data.data);
          // Default to the first college in the list
          setSelectedCollege(response.data.data.colleges[0].college_name);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (isLoading || !data) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading University Data...</div>;
  }

  // Find the currently selected college data
  const collegeData = data.colleges.find(c => c.college_name === selectedCollege);

  // Format data for the Recharts BarChart
  const labels = {
    placement_score: "Placements", coding_env_score: "Coding",
    higher_study_score: "Higher Studies", gov_exam_score: "Govt Exams",
    faculty_score: "Faculty", college_life_score: "Campus Life", sports_score: "Sports"
  };

  const chartData = Object.keys(labels).map(key => ({
    metric: labels[key],
    "Your Campus": collegeData[key],
    "State Average": data.global_average[key]
  }));

  // Calculate an overall competitive score
  const yourAvg = Object.keys(labels).reduce((sum, key) => sum + collegeData[key], 0) / 7;
  const stateAvg = Object.keys(labels).reduce((sum, key) => sum + data.global_average[key], 0) / 7;
  const isAboveAverage = yourAvg >= stateAvg;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-10 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3 text-indigo-400">
            <Building size={32} />
            <span className="text-2xl font-bold text-white tracking-tight">University Analytics Portal</span>
          </div>
          <button onClick={() => setCurrentView('landing')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft size={20} /> Exit to Student Portal
          </button>
        </div>

        {/* Controls */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Select Campus to Analyze</label>
          <select 
            value={selectedCollege} 
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="w-full md:w-1/2 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {data.colleges.map((c, i) => (
              <option key={i} value={c.college_name}>{c.college_name}</option>
            ))}
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Competitor Benchmark</p>
                <h3 className="text-3xl font-black text-white">{yourAvg.toFixed(1)} <span className="text-lg text-slate-500 font-medium">/ 10</span></h3>
              </div>
              {isAboveAverage ? <TrendingUp className="text-emerald-400" size={28}/> : <TrendingDown className="text-rose-400" size={28}/>}
            </div>
            <p className={`text-sm font-medium ${isAboveAverage ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isAboveAverage ? "+ Above" : "- Below"} State Average ({stateAvg.toFixed(1)})
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Student Data Points</p>
                <h3 className="text-3xl font-black text-white">{collegeData.response_count}</h3>
              </div>
              <Users className="text-blue-400" size={28}/>
            </div>
            <p className="text-sm font-medium text-slate-400">Verified campus reviews collected</p>
          </div>

          <div className="bg-indigo-600 p-6 rounded-xl border border-indigo-500 shadow-lg shadow-indigo-900/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-1">Actionable Insight</p>
                <h3 className="text-xl font-bold text-white leading-tight">
                  {chartData.sort((a,b) => (a["Your Campus"] - a["State Average"]) - (b["Your Campus"] - b["State Average"]))[0].metric}
                </h3>
              </div>
              <Activity className="text-white" size={28}/>
            </div>
            <p className="text-sm font-medium text-indigo-100 mt-2">
              This is your weakest metric compared to competitors. Focus marketing and campus improvements here to attract more students.
            </p>
          </div>
        </div>

        {/* The Bar Chart */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-6">Campus Offerings vs. State Average</h3>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="metric" stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                <Bar dataKey="Your Campus" fill="#818cf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="State Average" fill="#475569" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}