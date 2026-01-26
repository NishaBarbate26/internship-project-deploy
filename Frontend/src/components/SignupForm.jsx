import { useState } from "react";
import { Link } from "react-router-dom";

const SignupForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ email, password }); // UI only
    };

    return (
        <div className="relative z-10 w-full max-w-md mx-4">
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white text-center mb-6">
                    Create an Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-sm text-white mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="you@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white/80 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm text-white mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white/80 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Links */}
                <div className="text-center mt-6 text-sm text-white">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="underline hover:text-blue-200">
                            Login
                        </Link>
                    </p>
                    <Link
                        to="/"
                        className="block mt-2 text-white/80 hover:text-white underline"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
