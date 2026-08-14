import type { Metadata } from 'next';
import { Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth/context';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'CopyScore — Adaptive Copywriting & CRO Assessment',
  description: 'The adaptive benchmarking standard for copywriters, performance marketers, and CRO specialists. Measure judgment under real-world constraints.',
  keywords: ['copywriting assessment', 'conversion rate optimization', 'CRO test', 'copy benchmark', 'performance copy', 'copywriter rank'],
  openGraph: {
    title: 'CopyScore — Adaptive Copywriting & CRO Benchmark',
    description: 'How good is your copy when it actually has to perform? Test your conversion, content, and CRO judgment.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CopyScore — Adaptive Copywriting Benchmark',
    description: 'Measure your conversion copywriting and CRO judgment with adaptive real-world scenarios.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#f7f6f0] text-[#0f0f11] font-sans antialiased min-h-screen selection:bg-[#df9367] selection:text-black">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

