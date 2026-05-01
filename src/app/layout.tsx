import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bharat Trends - Live Political Pulse of India',
  description: 'Track the latest trending topics and political pulse across India.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex justify-center">
        <div className="w-full max-w-md min-h-screen bg-background shadow-2xl relative">
          {children}
        </div>
      </body>
    </html>
  );
}
