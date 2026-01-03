import { SignIn } from "@clerk/nextjs";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function SignInPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12 ">
        <div className="">
          {/* Decorative Elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />

          {/* Main Card */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur-xl opacity-50" />

            {/* Sign In Form */}
            <div className="relative glass-card rounded-2xl border border-white/20 shadow-2xl backdrop-blur-2xl overflow-hidden">
              {/* Header Section */}
              <div className="relative px-8 pt-8 pb-6 text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
                <div className="relative">
                  {/* Logo/Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4 shadow-lg">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>

                  <h1 className="text-2xl font-bold text-white mb-2">
                    Welcome Back
                  </h1>
                  <p className="text-white/70 text-sm">
                    Sign in to access your admin dashboard
                  </p>
                </div>
              </div>

              {/* Clerk SignIn Component */}
              <div className="px-8 pb-8">
                <SignIn
                  redirectUrl="/admin"
                  appearance={{
                    baseTheme: undefined,
                    variables: {
                      colorPrimary: "#fbbf24", // gold color
                      colorBackground: "transparent",
                      colorInputBackground: "rgba(255, 255, 255, 0.05)",
                      colorInputText: "#ffffff",
                      colorText: "#ffffff",
                      borderRadius: "0.75rem",
                    },
                    elements: {
                      formButtonPrimary:
                        "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]",
                      card: "bg-transparent shadow-none border-none",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      formFieldLabel: "text-white/90 font-medium text-sm",
                      formFieldInput:
                        "border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300",
                      footerActionLink:
                        "text-primary hover:text-primary/80 font-medium transition-colors duration-200",
                      dividerLine: "bg-white/20",
                      dividerText: "text-white/60",
                      socialButtonsBlockButton:
                        "border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all duration-300",
                      socialButtonsBlockButtonText: "text-white",
                      formFieldInputShowPasswordButton:
                        "text-white/70 hover:text-white",
                      alert: "bg-red-500/10 border-red-500/20 text-red-400",
                      alertText: "text-red-400",
                    },
                  }}
                />
              </div>

              {/* Bottom Decorative Line */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-6">
            <p className="text-white/60 text-sm">
              Secure access to KCF Fellowship admin panel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
