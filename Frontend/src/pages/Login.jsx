import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <div
      className="min-h-screen relative flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=2000')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay — unchanged */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Logo (top-left) */}
      <div className="absolute top-6 left-6 z-20">
        <Link to="/" className="text-white text-2xl font-bold tracking-tighter">
          TRAVEL
          <span className="text-blue-400">AI</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
