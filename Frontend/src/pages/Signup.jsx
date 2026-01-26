import { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setError("Email is required.");
            return;
        }
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Password validation
        if (!password) {
            setError("Password is required.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (!/[A-Za-z]/.test(password)) {
            setError("Password must contain at least one letter.");
            return;
        }
        if (!/[0-9]/.test(password)) {
            setError("Password must contain at least one number.");
            return;
        }

        // Success (UI only)
        setSuccess("Account created successfully!");
        setEmail("");
        setPassword("");
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Signup Card */}
            <div className="bg-white/25 backdrop-blur-md p-8 rounded-xl w-full max-w-md border border-white/30">
                <h2 className="text-2xl font-semibold text-center text-white mb-6">
                    Create an Account
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <label className="text-white text-sm">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-1 mb-4 px-4 py-2 rounded bg-white/90 focus:outline-none"
                        placeholder="you@example.com"
                    />

                    {/* Password */}
                    <label className="text-white text-sm">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 mb-4 px-4 py-2 rounded bg-white/90 focus:outline-none"
                        placeholder="Min 6 chars, letters & numbers"
                    />

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full mt-2 py-2 rounded bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
                    >
                        Sign Up
                    </button>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-600 text-sm mt-3 text-center">
                            {error}
                        </p>
                    )}

                    {/* Success Message */}
                    {success && (
                        <p className="text-black text-sm mt-3 text-center font-medium">
                            {success}
                        </p>
                    )}
                </form>

                {/* Bottom Links */}
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
        </div>
    );
};

export default Signup;
