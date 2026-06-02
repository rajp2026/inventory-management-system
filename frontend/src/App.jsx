import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Inventory Management System</h1>
        <Routes>
          <Route path="/" element={<div className="text-xl">Welcome to the Dashboard</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
