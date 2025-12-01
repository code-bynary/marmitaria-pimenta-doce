import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Marmitaria Pimenta Doce",
  description: "Sistema de Gestão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main style={{
            flex: 1,
            marginLeft: '250px',
            padding: '2rem',
            minHeight: '100vh',
            backgroundColor: 'hsl(var(--background))'
          }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
