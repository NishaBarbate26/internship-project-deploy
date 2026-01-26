// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserEmail(currentUser.email);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <div className="p-8 max-w-xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>
            <p className="mb-6">Logged in as: <strong>{userEmail}</strong></p>
            <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold"
            >
                Logout
            </button>
        </div>
    );
}
