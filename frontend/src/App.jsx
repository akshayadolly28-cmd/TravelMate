import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Explore from './pages/Explore';
import Details from './pages/Details';
import Stays from './pages/Stays';
import Food from './pages/Food';
import Markets from './pages/Markets';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import Favorites from './pages/Favorites';
import Tools from './pages/Tools';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <div className="site-app-wrapper">
          <Navbar />

          <main className="site-main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/places/:id" element={<Details />} />
              <Route path="/stays" element={<Stays />} />
              <Route path="/stays/:id" element={<Stays />} />
              <Route path="/food" element={<Food />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Routes */}
              <Route
                path="/trips"
                element={
                  <ProtectedRoute>
                    <Trips />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips/:id"
                element={
                  <ProtectedRoute>
                    <TripDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </FavoritesProvider>
    </AuthProvider>
  );
}
