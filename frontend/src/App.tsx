import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from './components/ui';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import BatimentList from './components/batiments/BatimentList';
import AppartementList from './components/appartements/AppartementList';
import LocataireList from './components/locataires/LocataireList';
import LocationList from './components/locations/LocationList';
import PaiementList from './components/paiements/PaiementList';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <ToastContainer />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/batiments" element={<BatimentList />} />
            <Route path="/appartements" element={<AppartementList />} />
            <Route path="/locataires" element={<LocataireList />} />
            <Route path="/locations" element={<LocationList />} />
            <Route path="/paiements" element={<PaiementList />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 