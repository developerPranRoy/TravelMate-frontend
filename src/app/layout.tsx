import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'TravelMate — Discover Bangladesh',
  description: 'Book your dream tour packages across Bangladesh with TravelMate.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-background">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </AuthProvider>
      </body>
    </html>
  );
}
