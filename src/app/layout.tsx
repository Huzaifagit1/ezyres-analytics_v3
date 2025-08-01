import './globals.css';
import type { Metadata } from 'next';
import Navbar from '../../components/navbar';
export const metadata: Metadata = {
  title: 'EzyRes Analytics',
  description: 'Real estate insights dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Navbar />
          <main className="ml-16 lg:ml-20 flex-1 bg-gray-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
