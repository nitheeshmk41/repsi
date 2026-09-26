import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata: Metadata = {
  title: {
    default: "REPSI — Fitness Management Platform",
    template: "%s | REPSI",
  },
  description:
    "REPSI is the modern operating system for gyms. Manage members, memberships, attendance, trainers, classes, payments, and more — all in one powerful platform.",
  keywords: ["gym management", "fitness software", "membership management", "gym software", "REPSI"],
  authors: [{ name: "REPSI" }],
  openGraph: {
    title: "REPSI — Gym Management Platform",
    description: "The modern operating system for gyms.",
    url: "https://repsi.app",
    siteName: "REPSI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Inline script to prevent flash of incorrect theme.
          Runs before React hydration — sets the class immediately.
          Defaults to light theme.
        */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('repsi-theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="repsi-theme"
        >
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "placeholder"}>
            <AuthProvider>
              {children}
            </AuthProvider>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
