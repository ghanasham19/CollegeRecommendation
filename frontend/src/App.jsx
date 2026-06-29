import React, { useState } from 'react';
import axios from 'axios';

// Import our clean components
import LandingPage from './components/LandingPage';
import AssessmentForm from './components/AssessmentForm';
import ResultsDashboard from './components/ResultsDashboard';
import ComparisonDashboard from './components/ComparisonDashboard';
import DeansDashboard from './components/DeansDashboard';

export default function App() {
  // Application State
  const [currentView, setCurrentView] = useState('landing');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [expandedCollegeIdx, setExpandedCollegeIdx] = useState(null);
  const [compareList, setCompareList] = useState([]);
  
  // NEW: Language State correctly initialized!
  const [language, setLanguage] = useState('en'); 
  
const [formData, setFormData] = useState({
    rank: '',
    branch: 'cs', // NEW: Default to Computer Science
    preferences: {
      placement_score: 3, coding_env_score: 3, higher_study_score: 3,
      gov_exam_score: 3, faculty_score: 3, college_life_score: 3, sports_score: 3
    }
  });

  // Helper Functions
  const handleSliderChange = (setting, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [setting]: parseInt(value) }
    }));
  };

  const handleFetchRecommendations = async (e) => {
    e.preventDefault();
    if (!formData.rank) return alert("Please enter your rank!");
    
    setIsLoading(true);
    setCurrentView('results');
    setExpandedCollegeIdx(null);
    setCompareList([]); 

    try {
      const response = await axios.post('http://localhost:5000/api/recommend', {
        rank: parseInt(formData.rank),
        branch: formData.branch,
        preferences: formData.preferences
      });

      if (response.data.status === 'success') {
        setRecommendations(response.data.data);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Could not connect to the ML engine. Make sure app.py is running!");
      setCurrentView('assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCompare = (college) => {
    const exists = compareList.find(c => c.college_name === college.college_name);
    if (exists) {
      setCompareList(compareList.filter(c => c.college_name !== college.college_name));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare up to 3 colleges at a time for the best view.");
        return;
      }
      setCompareList([...compareList, college]);
    }
  };

  const formatChartData = (collegeMetrics) => {
    const labels = {
      placement_score: "Placements", coding_env_score: "Coding",
      higher_study_score: "Higher Studies", gov_exam_score: "Govt Exams",
      faculty_score: "Faculty", college_life_score: "Campus Life", sports_score: "Sports"
    };
    return Object.keys(labels).map(key => ({
      subject: labels[key],
      "Your Ideal": formData.preferences[key],
      "College Rating": collegeMetrics[key],
      fullMark: 5,
    }));
  };

  // --- ROUTING ENGINE ---
  if (currentView === 'assessment') {
    return (
      <AssessmentForm 
        setCurrentView={setCurrentView}
        formData={formData}
        setFormData={setFormData}
        handleSliderChange={handleSliderChange}
        handleFetchRecommendations={handleFetchRecommendations}
        language={language}    // <--- ADD THIS LINE
      />
    );
  }
  if (currentView === 'landing') {
    // Notice how language and setLanguage are explicitly passed here!
    return (
      <LandingPage 
        setCurrentView={setCurrentView} 
        language={language} 
        setLanguage={setLanguage} 
      />
    );
  }

  if (currentView === 'dean_dashboard') {
    return <DeansDashboard setCurrentView={setCurrentView} />;
  }

  if (currentView === 'assessment') {
    return (
      <AssessmentForm 
        setCurrentView={setCurrentView}
        formData={formData}
        setFormData={setFormData}
        handleSliderChange={handleSliderChange}
        handleFetchRecommendations={handleFetchRecommendations}
      />
    );
  }

  if (currentView === 'compare') {
    return (
      <ComparisonDashboard 
        setCurrentView={setCurrentView}
        compareList={compareList}
      />
    );
  }

  // Default to results view
  return (
    <ResultsDashboard 
      setCurrentView={setCurrentView}
      isLoading={isLoading}
      recommendations={recommendations}
      expandedCollegeIdx={expandedCollegeIdx}
      setExpandedCollegeIdx={setExpandedCollegeIdx}
      compareList={compareList}
      toggleCompare={toggleCompare}
      formatChartData={formatChartData}
      language={language}
    />
  );
}