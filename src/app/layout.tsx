"use client"

import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme.provider";
import { StoreProvider } from "@/providers/store.provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/auth.provider";

export const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <title>Veila</title>
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </StoreProvider>
          <Toaster
            position="top-right"
            duration={5000}
            expand={true}
            visibleToasts={3}
            gap={5}
            richColors={true}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
