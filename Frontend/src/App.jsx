import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateItinerary from "./pages/CreateItinerary";
import ItineraryDetails from "./pages/ItineraryDetails"; // <-- import here
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/create-itinerary" element={<CreateItinerary />} />
        <Route
          path="/itinerary-details/:itinerary_id"
          element={<ItineraryDetails />}
        />{" "}
        {/* <-- new */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
