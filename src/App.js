import React, { useState, useEffect } from 'react';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const apiUrl = process.env.NODE_ENV === 'development' 
          ? `http://localhost:${process.env.REACT_APP_API_PORT || '3001'}/api/schedule`
          : '/api/schedule';
          
        console.log('Fetching from:', apiUrl);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        setScheduleData(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading schedule data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="App">
      {scheduleData && <Dashboard data={scheduleData} />}
    </div>
  );
}

export default App;