import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});
const mono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Digital Planner — Process Orchestration & Food Production Planning con AI nativa",
  description:
    "Piattaforma B2B per orchestrare i processi produttivi e pianificare la produzione alimentare: batch planning, tracciabilità, forecasting AI, ottimizzazione turni e sicurezza enterprise.",
  openGraph: {
    title: "Digital Planner",
    description: "Orchestrazione dei processi e pianificazione della produzione alimentare con AI nativa.",
    type: "website",
    url: "https://planner.percorsisolari.it",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('dp-theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${sans.variable} ${mono.variable} font-sans antialiased bg-bg text-fg`}>{children}</body>
    </html>
  );
}
