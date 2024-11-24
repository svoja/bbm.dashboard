import React from 'react';
import Dashboard from './components/dashboard/Dashboard';
import jsonData from './data_19-24.json';

function App() {
  return (
    <div className="App">
      <Dashboard data={jsonData} />
    </div>
  );
}

export default App;