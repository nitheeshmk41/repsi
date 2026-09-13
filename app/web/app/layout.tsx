import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

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
        */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('repsi-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="repsi-theme"
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
