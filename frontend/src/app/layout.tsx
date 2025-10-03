import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { PerformanceMonitor } from "@/components/common/PerformanceMonitor";
import { MonitoringDashboard } from "@/components/common/MonitoringDashboard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Salas - Sistema de Visualização de Salas",
  description: "Sistema para visualização e gerenciamento de salas e andares",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Polyfills para compatibilidade com Node.js no Electron
              if (typeof global === 'undefined') {
                window.global = globalThis;
              }
              if (typeof require === 'undefined') {
                window.require = () => {};
              }
              if (typeof process === 'undefined') {
                window.process = { env: {} };
              }
              if (typeof __dirname === 'undefined') {
                window.__dirname = '';
              }
              if (typeof __filename === 'undefined') {
                window.__filename = '';
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <PerformanceMonitor show={process.env.NODE_ENV === 'development'} />
        <MonitoringDashboard show={process.env.NODE_ENV === 'development'} position="bottom-left" />
      </body>
    </html>
  );
}
