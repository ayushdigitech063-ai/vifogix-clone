import { useNavigate } from "react-router-dom";
import SignUpForm from "../components/forms/SignUpForm";
import AuthSidePanel from "../components/forms/AuthSidePanel";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();

  const handleSignUp = async (formData) => {
    // Prepare registration payload matching the backend
    const registerPayload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role ? formData.role.toUpperCase() : "SELLER",
      socialProfiles: formData.socialProfiles || {
        linkedin: null,
        facebook: null,
        instagram: null,
      },
    };

    // Register via Auth context/services
    await register(registerPayload);
    navigate("/publisher-dashboard");
    toast.success("Account created successfully!");
  };

  return (
    <main className="grid min-h-screen font-sans lg:grid-cols-2">
      <section className="flex items-center justify-center bg-background px-4 py-12 md:px-8">
        <SignUpForm mode="signup" onSubmit={handleSignUp} />
      </section>
      <AuthSidePanel
        headline="Start building authority"
        accentText="today"
        description="Join thousands of agencies and brands growing their online visibility."
        trustPoints={[
          "Access to 70k+ verified media outlets",
          "Guaranteed indexing and dofollow options",
          "Dedicated campaign managers and 24/7 support",
        ]}
      />
    </main>
  );
};

export default SignUp;
