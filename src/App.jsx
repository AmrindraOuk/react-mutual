import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "react-hot-toast";

// Layout
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import Quote from "./pages/Quote";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Help from "./pages/Help";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Policies from "./pages/dashboard/Policies";
import Claims from "./pages/dashboard/Claims";
import Payments from "./pages/dashboard/Payments";
import Profile from "./pages/dashboard/Profile";

// Agent Pages
import AgentDashboard from "./pages/agent/AgentDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// Error Pages
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="quote" element={<Quote />} />
            <Route path="about" element={<About />} />
            <Route path="blog" element={<Blog />} />
            <Route path="contact" element={<Contact />} />
            <Route path="help" element={<Help />} />

            {/* Auth Routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Protected Customer Routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requiredRole="customer">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard/policies"
              element={
                <ProtectedRoute requiredRole="customer">
                  <Policies />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard/claims"
              element={
                <ProtectedRoute requiredRole="customer">
                  <Claims />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard/payments"
              element={
                <ProtectedRoute requiredRole="customer">
                  <Payments />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard/profile"
              element={
                <ProtectedRoute requiredRole="customer">
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Protected Agent Routes */}
            <Route
              path="agent"
              element={
                <ProtectedRoute requiredRole="agent">
                  <AgentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Error Routes */}
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10B981",
                secondary: "#fff",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#EF4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </Router>
    </Provider>
  );
}

export default App;
