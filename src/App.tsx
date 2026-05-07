import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HotelPage from "./pages/HotelPage";
import ShadowPage from "./pages/ShadowPage";
import LuxuryBarber from "./pages/LuxuryBarber";
import SpaPage from "./pages/SpaPage";
import ParlourPage from "./pages/ParlourPage";
import GymPage from "./pages/GymPage";
import FunctionPage from "./pages/FunctionPage";
import FuneralPage from "./pages/FuneralPage";

export function App() {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hotel" element={<HotelPage />} />
        <Route path="/shadow" element={<ShadowPage />} />
        <Route 
          path="/barber" 
          element={
            <LuxuryBarber 
              user={user} 
              setUser={setUser} 
              points={points} 
              setPoints={setPoints} 
            />
          } 
        />
        <Route 
          path="/spa" 
          element={
            <SpaPage 
              user={user} 
              setUser={setUser} 
              points={points} 
              setPoints={setPoints} 
            />
          } 
        />
        <Route 
          path="/parlour" 
          element={
            <ParlourPage 
              user={user} 
              setUser={setUser} 
              points={points} 
              setPoints={setPoints} 
            />
          } 
        />
        <Route 
          path="/gym" 
          element={
            <GymPage 
              user={user} 
              setUser={setUser} 
              points={points} 
              setPoints={setPoints} 
            />
          } 
        />
        <Route 
          path="/function" 
          element={
            <FunctionPage 
              user={user} 
              setUser={setUser} 
              points={points} 
              setPoints={setPoints} 
            />
          } 
        />
        <Route 
          path="/funeral" 
          element={
            <FuneralPage 
              user={user} 
              setUser={setUser} 
              points={points} 
              setPoints={setPoints} 
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
