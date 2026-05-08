import { lazy, Suspense } from "react";
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
const AboutPage = lazy(() => import("./pages/AboutPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="size-8 border-2 border-[#D4AF37] border-t-transparent animate-spin rounded-full" />
  </div>
);

import { useLocation } from "react-router-dom";

// Layout wrapper to handle conditional background
function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className={!isHomePage ? "noir-background" : ""}>
      {children}
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AppLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hotel" element={<HotelPage />} />
            <Route path="/shadow" element={<ShadowPage />} />
            <Route path="/barber" element={<LuxuryBarber />} />
            <Route path="/spa" element={<SpaPage />} />
            <Route path="/parlour" element={<ParlourPage />} />
            <Route path="/gym" element={<GymPage />} />
            <Route path="/function" element={<FunctionPage />} />
            <Route path="/funeral" element={<FuneralPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </Router>
  );
}

export default App;
