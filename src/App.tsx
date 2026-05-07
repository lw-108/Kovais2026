import { useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazy load pages for performance
const HomePage = lazy(() => import("./pages/HomePage"));
const HotelPage = lazy(() => import("./pages/HotelPage"));
const ShadowPage = lazy(() => import("./pages/ShadowPage"));
const LuxuryBarber = lazy(() => import("./pages/LuxuryBarber"));
const SpaPage = lazy(() => import("./pages/SpaPage"));
const ParlourPage = lazy(() => import("./pages/ParlourPage"));
const GymPage = lazy(() => import("./pages/GymPage"));
const FunctionPage = lazy(() => import("./pages/FunctionPage"));
const FuneralPage = lazy(() => import("./pages/FuneralPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="size-8 border-2 border-[#D4AF37] border-t-transparent animate-spin rounded-full" />
  </div>
);

export function App() {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </Router>
  );
}

export default App;
