import type { Metadata } from "next";

import { AppToaster } from "@/components/providers/app-toaster";
import { QueryProvider } from "@/components/providers/query-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Life OS",
  description:
    "A premium personal dashboard for study, training, habits, and finances.",
};

const themeScript = `
  (function() {
    try {
      var raw = localStorage.getItem("life-ui-store");
      var parsed = raw ? JSON.parse(raw) : null;
      var theme = parsed && parsed.state && parsed.state.theme ? parsed.state.theme : "dark";
      var root = document.documentElement;
      root.classList.toggle("dark", theme === "dark");
      root.style.colorScheme = theme;
    } catch (error) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <QueryProvider>
          {children}
          <AppToaster />
        </QueryProvider>
      </body>
    </html>
  );
}
