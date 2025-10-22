import { Route, Routes, Navigate } from 'react-router-dom';
import GearSimulator from './components/gearRatioSimulator/GearSimulator';
import ThermodynamicsSimulator from './components/thermodynamics/ThermodynamicsSimulator';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gear-ratio-simulator" element={<GearSimulator />} />
        <Route path="/thermodynamics" element={<ThermodynamicsSimulator />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;