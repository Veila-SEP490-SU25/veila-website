'use client';

import { Cormorant_Garamond, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/providers/theme.provider';
import { StoreProvider } from '@/providers/store.provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/providers/auth.provider';
import { RouteProvider } from '@/providers/route.provider';
import { PagingProvider } from '@/providers/paging.provider';
import { VerifyPhonePopupProvider } from '@/hooks/use-verify-phone-popup';
import { GoogleAuthHandler } from '@/app/(auth)/components/google-auth-handler';

export const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
});

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'vietnamese'],
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
      <body className={`${cormorant.className} ${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <AuthProvider>
              <RouteProvider>
                <PagingProvider>
                  <VerifyPhonePopupProvider>
                    {children}
                    <GoogleAuthHandler />
                  </VerifyPhonePopupProvider>
                </PagingProvider>
              </RouteProvider>
            </AuthProvider>
          </StoreProvider>
          <Toaster
            position="top-right"
            duration={5000}
            expand={true}
            visibleToasts={3}
            gap={5}
            richColors={true}
            closeButton={true}
          />
        </ThemeProvider>
        <Script src="https://cdn.payos.vn/checkout.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
