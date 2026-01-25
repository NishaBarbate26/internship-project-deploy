import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="absolute top-0 left-0 w-full z-50">
            <div className="w-full px-10 py-6 flex justify-end">
                <div className="flex gap-10 text-white text-base font-medium tracking-wide">

                    {/* Login */}
                    <Link to="/login" className="relative group">
                        Login
                        <span
                            className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white
                         transition-all duration-300 group-hover:w-full"
                        />
                    </Link>

                    {/* Sign Up */}
                    <Link to="/signup" className="relative group">
                        Sign Up
                        <span
                            className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white
                         transition-all duration-300 group-hover:w-full"
                        />
                    </Link>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
