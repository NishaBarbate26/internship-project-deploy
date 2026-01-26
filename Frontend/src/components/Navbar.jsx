import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Requirement: Update navigation for authenticated state
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav className="absolute top-0 left-0 w-full z-50">
            <div className="w-full px-10 py-6 flex justify-between items-center">
                {/* Logo Section */}
                <Link to="/" className="text-white text-xl font-bold tracking-tighter">
                    TRAVEL<span className="text-blue-400">AI</span>
                </Link>

                <div className="flex gap-10 text-white text-base font-medium tracking-wide items-center">
                    {user ? (
                        <>
                            {/* Authenticated Links */}
                            <Link to="/dashboard" className="relative group">
                                Dashboard
                                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full" />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg backdrop-blur-md transition-all border border-white/30"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Guest Links */}
                            <Link to="/login" className="relative group">
                                Login
                                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full" />
                            </Link>

                            <Link to="/signup" className="relative group">
                                Sign Up
                                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full" />
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;