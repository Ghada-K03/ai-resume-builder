import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgetPassword";
import Verify from "./pages/auth/Verify";
import ResetPassword from "./pages/auth/ResetPassword";

import Dashboard from "./pages/Dashboard";
import CreateCV from "./pages/CreateCV";
import CvEditor from "./pages/CvEditor";
import CvPreview from "./pages/CvPreview";
import AIAssistant from "./pages/AIAssistant";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#fff",
            color: "#333",
            padding: "14px 18px",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/resumes" element={<Dashboard resumesOnly />} />

        <Route path="/create-cv" element={<CreateCV />} />
        <Route path="/cv-editor" element={<CvEditor />} />
        <Route path="/cv/:id/edit" element={<CvEditor />} />
        <Route path="/cv/:id/preview" element={<CvPreview />} />

        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
