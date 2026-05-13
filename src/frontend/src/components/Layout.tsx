import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="min-h-screen dark"
      style={{
        background:
          "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)",
      }}
    >
      <Header onMenuToggle={() => setSidebarOpen((v) => !v)} />
      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 ml-0 md:ml-60 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
