import SignupForm from "../components/SignupForm";

const Signup = () => {
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
            <SignupForm />
        </div>
    );
};

export default Signup;
