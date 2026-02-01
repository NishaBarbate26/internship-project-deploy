import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getFriendlyErrorMessage = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "Invalid email format.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/user-not-found":
        return "User not found. Please sign up first.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/too-many-requests":
        return "Too many attempts. Try again later.";
      default:
        return "Failed to login. Please try again.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence,
      );
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(getFriendlyErrorMessage(err.code));
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[2rem] p-10 shadow-2xl max-w-md w-full mx-auto"
      role="main"
    >
      <h2 className="text-3xl font-black text-slate-900 text-center mb-2 tracking-tight">
        Welcome Back
      </h2>
      <p className="text-slate-700 text-center mb-8 text-sm font-medium">
        Please enter your details to login
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-widest mb-2 ml-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full rounded-xl bg-white/60 px-5 py-3 text-slate-900 placeholder-slate-400 border border-white/20 shadow-inner focus:bg-white focus:ring-2 focus:ring-blue-500/50 transition duration-300 outline-none"
          />
        </div>

        <div>
          <label className="flex justify-between items-center text-xs font-bold text-slate-800 uppercase tracking-widest mb-2 ml-1">
            Password
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl bg-white/60 px-5 py-3 text-slate-900 placeholder-slate-400 border border-white/20 shadow-inner focus:bg-white focus:ring-2 focus:ring-blue-500/50 transition duration-300 outline-none"
          />
        </div>

        <div className="flex items-center justify-between px-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-slate-800 text-xs font-bold uppercase tracking-tighter group-hover:text-black">
              Remember Me
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-2xl text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-blue-500/30
            ${
              loading
                ? "bg-slate-400"
                : "bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5"
            }
            transition duration-300`}
        >
          {loading ? "Authorizing..." : "Login"}
        </button>

        {error && (
          <p className="mt-4 text-center text-red-600 text-xs font-bold bg-red-50 py-2 rounded-lg border border-red-100 italic">
            {error}
          </p>
        )}
      </form>

      {/* Footer links */}
      <div className="mt-8 pt-6 border-t border-black/5 text-center space-y-2">
        <p className="text-slate-700 text-xs font-bold uppercase tracking-tighter">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Join Now
          </Link>
        </p>

        <Link
          to="/"
          className="block text-xs font-bold uppercase tracking-tighter text-slate-600 hover:text-slate-900"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
