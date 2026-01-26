import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignupForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false); // optional on signup, can remove if you want
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Simple password strength logic
    const getPasswordStrength = (pwd) => {
        if (pwd.length > 10) return "Strong";
        if (pwd.length > 5) return "Medium";
        if (pwd.length > 0) return "Weak";
        return "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        setTimeout(() => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!email) {
                setError("Email is required.");
                setLoading(false);
                return;
            }
            if (!emailRegex.test(email)) {
                setError("Please enter a valid email address.");
                setLoading(false);
                return;
            }

            if (!password) {
                setError("Password is required.");
                setLoading(false);
                return;
            }
            if (password.length < 6) {
                setError("Password must be at least 6 characters long.");
                setLoading(false);
                return;
            }
            if (!/[A-Za-z]/.test(password)) {
                setError("Password must contain at least one letter.");
                setLoading(false);
                return;
            }
            if (!/[0-9]/.test(password)) {
                setError("Password must contain at least one number.");
                setLoading(false);
                return;
            }

            setSuccess("Account created successfully!");
            setLoading(false);
            setEmail("");
            setPassword("");
            setRememberMe(false);
            setShowPassword(false);
        }, 1500);
    };

    return (
        <div
            className="bg-white/25 backdrop-blur-md p-8 rounded-xl w-full max-w-md border border-white/30"
            role="main"
            aria-labelledby="signup-heading"
        >
            <h2
                id="signup-heading"
                className="text-2xl font-semibold text-center text-white mb-6"
            >
                Create an Account
            </h2>

            <form onSubmit={handleSubmit} aria-describedby="form-error form-success">
                <label htmlFor="email" className="text-white text-sm">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 mb-4 px-4 py-2 rounded bg-white/90 focus:outline-none"
                    placeholder="you@example.com"
                    aria-required="true"
                    aria-invalid={error.toLowerCase().includes("email") ? "true" : "false"}
                    aria-describedby={
                        error.toLowerCase().includes("email") ? "form-error" : undefined
                    }
                />

                <label
                    htmlFor="password"
                    className="text-white text-sm flex justify-between items-center"
                >
                    Password
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-sm text-blue-400 hover:text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-2"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </label>
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 mb-1 px-4 py-2 rounded bg-white/90 focus:outline-none"
                    placeholder="Min 6 characters, letters & numbers"
                    aria-required="true"
                    aria-invalid={error.toLowerCase().includes("password") ? "true" : "false"}
                    aria-describedby={
                        error.toLowerCase().includes("password") ? "form-error" : undefined
                    }
                />

                {/* Password strength */}
                {password && (
                    <p className="text-xs mt-1 text-white">
                        Password strength:{" "}
                        <span
                            className={
                                getPasswordStrength(password) === "Strong"
                                    ? "text-green-400"
                                    : getPasswordStrength(password) === "Medium"
                                        ? "text-yellow-400"
                                        : "text-red-400"
                            }
                        >
                            {getPasswordStrength(password)}
                        </span>
                    </p>
                )}

                {/* Remember Me */}
                <label
                    htmlFor="rememberMe"
                    className="text-white text-sm flex items-center gap-2 mt-4 select-none cursor-pointer"
                >
                    <input
                        id="rememberMe"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="w-4 h-4"
                    />
                    Remember Me
                </label>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded text-white font-semibold justify-center items-center inline-flex ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                            } transition`}
                        aria-busy={loading}
                    >
                        {loading && (
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                        )}
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <p
                        id="form-error"
                        role="alert"
                        className="text-red-600 text-sm mt-3 text-center"
                    >
                        {error}
                    </p>
                )}

                {/* Success Message */}
                {success && (
                    <p
                        id="form-success"
                        role="alert"
                        className="text-black text-sm mt-3 text-center font-medium"
                    >
                        {success}
                    </p>
                )}
            </form>

            <p className="text-white text-sm text-center mt-5">
                Already have an account?{" "}
                <Link to="/login" className="underline">
                    Login
                </Link>
            </p>

            <p className="text-white text-xs text-center mt-2">
                <Link to="/" className="underline">
                    Back to Home
                </Link>
            </p>
        </div>
    );
}
