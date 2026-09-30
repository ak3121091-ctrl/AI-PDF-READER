import type { Metadata, Viewport } from 'next';
import './globals.css';
import '@/shaders/threeui.css';
import { AuthProvider } from '@/lib/auth/authContext';

export const metadata: Metadata = {
  title: 'StudyForge AI — Turn PDFs Into Your Personal Study System',
  description:
    'StudyForge AI transforms PDFs, notes and previous-year papers into summaries, important topics, quizzes, flashcards and personalized study plans.',
  openGraph: {
    title: 'StudyForge AI — Turn PDFs Into Your Personal Study System',
    description:
      'Upload your notes, textbooks and previous-year papers. StudyForge AI turns them into an interactive AI-powered learning system.',
    type: 'website',
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>',
  },
};

export const viewport: Viewport = {
  themeColor: '#29251d',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
