import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getPasswordStrength = (pwd) => {
    if (pwd.length > 10) return "Strong";
    if (pwd.length > 5) return "Medium";
    if (pwd.length > 0) return "Weak";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Identity created! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email already registered.");
          break;
        default:
          setError("Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-2xl border border-white/50 rounded-[2rem] p-10 shadow-2xl max-w-md w-full mx-auto">
      <h2 className="text-3xl font-black text-slate-900 text-center mb-2 tracking-tight">
        Create Identity
      </h2>
      <p className="text-slate-700 text-center mb-8 text-sm font-medium">
        Join today
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold text-slate-800 uppercase tracking-widest mb-2 ml-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="new-user@nexus.com"
            className="w-full rounded-xl bg-white/60 px-5 py-3 text-slate-900 placeholder-slate-400 border border-white/20 shadow-inner focus:bg-white focus:ring-2 focus:ring-blue-500/50 transition duration-300 outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="flex justify-between items-center text-xs font-bold text-slate-800 uppercase tracking-widest mb-2 ml-1"
          >
            Set Password
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            className="w-full rounded-xl bg-white/60 px-5 py-3 text-slate-900 placeholder-slate-400 border border-white/20 shadow-inner focus:bg-white focus:ring-2 focus:ring-blue-500/50 transition duration-300 outline-none"
            required
          />
          {password && (
            <p className="mt-2 text-[10px] font-bold text-slate-700">
              STRENGTH:{" "}
              <span
                className={
                  getPasswordStrength(password) === "Strong"
                    ? "text-green-600"
                    : getPasswordStrength(password) === "Medium"
                      ? "text-amber-600"
                      : "text-red-600"
                }
              >
                {getPasswordStrength(password).toUpperCase()}
              </span>
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-2xl text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-blue-500/30 mt-4
            ${loading ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5"}
            transition duration-300`}
        >
          {loading ? "Processing..." : "Create Account"}
        </button>

        {error && (
          <p className="mt-4 text-center text-red-600 text-xs font-bold bg-red-50 py-2 rounded-lg border border-red-100 italic">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-4 text-center text-green-600 text-xs font-bold bg-green-50 py-2 rounded-lg border border-green-100 italic">
            {success}
          </p>
        )}
      </form>

      <div className="mt-8 pt-6 border-t border-black/5 text-center">
        <p className="text-slate-700 text-xs font-bold uppercase tracking-tighter">
          Already a member?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
