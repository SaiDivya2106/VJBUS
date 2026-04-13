import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const token = credentialResponse.credential;
      console.log("Google token received:", token);
      const res = await fetch(`${import.meta.env.VITE_AUTH_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        credentials: "include",
      });

      const data = await res.json();
      console.log("Logged in user:", data.user);

      setUser(data.user);
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
        {/* Logo / Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-gray-500 mb-6">
          Sign in to continue to your account
        </p>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Login Failed")}
          />
        </div>

        {/* Footer text */}
        <p className="mt-8 text-sm text-gray-400">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-blue-500 hover:underline">
            Terms
          </a>{" "}
          &{" "}
          <a href="/privacy" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
