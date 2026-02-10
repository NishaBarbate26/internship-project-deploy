import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <div
      className="min-h-screen relative flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/auth-bg.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Logo */}
      <div className="absolute top-6 left-6 z-20">
        <Link to="/" className="text-white text-2xl font-bold tracking-tighter">
          TRAVEL
          <span className="text-blue-400">AI</span>
        </Link>
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
