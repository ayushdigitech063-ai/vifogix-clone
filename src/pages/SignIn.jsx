import { useNavigate } from "react-router-dom";
import SignUpForm from "../components/forms/SignUpForm";
import AuthSidePanel from "../components/forms/AuthSidePanel";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const handleSignIn = async (data) => {
    const loggedUser = await login({
      email: data.email,
      password: data.password,
    });

    const isBuyer =
      loggedUser?.role?.toUpperCase() === "BUYER" ||
      data.role?.toUpperCase() === "BUYER";

    toast.success("Signed in successfully!");
    navigate(isBuyer ? "/buyer-dashboard" : "/publisher-dashboard");
  };

  return (
    <main className="grid min-h-screen font-sans lg:grid-cols-2">
      <AuthSidePanel
        headline="Grow your reach with"
        accentText="trusted publishers"
        description="Order guest posts and press releases from one intuitive dashboard."
        trustPoints={[
          "Verified high-authority publishers",
          "Fast delivery in 1–3 business days",
          "Transparent pricing with live metrics",
        ]}
      />

      <section className="flex items-center justify-center bg-background px-4 py-12 md:px-8">
        <SignUpForm mode="signin" onSubmit={handleSignIn} />
      </section>
    </main>
  );
};

export default SignIn;

