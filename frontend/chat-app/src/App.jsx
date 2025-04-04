import "./App.css";
import { AuthProvider } from "./features/authContext";
import AppContent from "./components/appContent";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent /> {/* Wrap everything inside AppContent */}
      </Router>
    </AuthProvider>
  );
}

export default App;
