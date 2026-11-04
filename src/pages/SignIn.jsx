import { useNavigate } from "react-router-dom";
import SignUpForm from "../components/forms/SignUpForm";
import AuthSidePanel from "../components/forms/AuthSidePanel";

const SignIn = () => {
  const navigate = useNavigate();

  const handleSignIn = async (data) => {
    if (data.role === "seller") {
      navigate("/publisher-dashboard");
    } else {
      navigate("/buyer-dashboard");
    }
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

