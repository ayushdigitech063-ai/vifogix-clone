import SignUpForm from "../components/forms/SignUpForm";
import AuthSidePanel from "../components/forms/AuthSidePanel";

const SignUp = () => (
  <main className="grid min-h-screen font-sans lg:grid-cols-2">
   
    <section className="flex items-center justify-center bg-background px-4 py-12 md:px-8">
      <SignUpForm mode="signup" onSubmit={async (data) => console.log(data)} />
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

export default SignUp;

