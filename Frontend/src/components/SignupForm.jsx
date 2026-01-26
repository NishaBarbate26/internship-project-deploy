import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignupForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
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

        // --- Client-Side Validation ---
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
            setError("Password must contain both letters and numbers.");
            return;
        }

        setLoading(true);

        try {
            // --- Firebase Auth Call ---
            await createUserWithEmailAndPassword(auth, email, password);

            setSuccess("Account created successfully! Redirecting...");
            setEmail("");
            setPassword("");

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            // --- Graceful Error Handling ---
            console.error("Firebase Error:", err.code);
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError("This email is already registered.");
                    break;
                case 'auth/invalid-email':
                    setError("Invalid email address.");
                    break;
                case 'auth/weak-password':
                    setError("The password is too weak.");
                    break;
                default:
                    setError("Failed to create account. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/25 backdrop-blur-md p-8 rounded-xl w-full max-w-md border border-white/30">
            <h2 className="text-2xl font-semibold text-center text-white mb-6">Create an Account</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="text-white text-sm">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-1 px-4 py-2 rounded bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div className="mb-1">
                    <div className="flex justify-between items-center">
                        <label htmlFor="password" name="password-label" className="text-white text-sm">Password</label>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-xs text-blue-200 hover:text-white underline"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 px-4 py-2 rounded bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Letters & numbers required"
                        required
                    />
                </div>

                {password && (
                    <p className="text-xs mb-4 text-white">
                        Strength: <span className={getPasswordStrength(password) === "Strong" ? "text-green-400" : "text-yellow-400"}>{getPasswordStrength(password)}</span>
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 mt-4 rounded text-white font-semibold transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>

                {error && <p className="text-red-200 text-sm mt-3 text-center bg-red-600/20 py-1 rounded">{error}</p>}
                {success && <p className="text-green-200 text-sm mt-3 text-center bg-green-600/20 py-1 rounded">{success}</p>}
            </form>

            <div className="text-center mt-6 text-white text-sm">
                <p>Already have an account? <Link to="/login" className="underline font-medium">Login</Link></p>
                <Link to="/" className="block mt-2 opacity-80 hover:opacity-100">Back to Home</Link>
            </div>
        </div>
    );
}