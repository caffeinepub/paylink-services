import { Link } from "@tanstack/react-router";
import { Wifi } from "lucide-react";
import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-container">
      {children}
      <footer className="footer-gradient text-white mt-8 px-4 py-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-white/20 rounded-lg p-1.5">
            <Wifi className="w-4 h-4" />
          </div>
          <span className="font-bold text-base">Vasu Communication</span>
        </div>
        <p className="text-white/70 text-xs mb-1">Owner: Manoj | 7339891179</p>
        <p className="text-white/70 text-xs mb-4">
          Airtel WiFi, Recharge & Payment Services
        </p>
        <div className="border-t border-white/20 pt-3">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white/60 hover:text-white"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export function PageHeader({
  title,
  showBack = true,
}: { title: string; showBack?: boolean }) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-border shadow-xs">
      <div className="flex items-center gap-3 px-4 py-3">
        {showBack && (
          <Link
            to="/"
            className="p-1 rounded-lg hover:bg-muted transition-colors"
            data-ocid="nav.link"
            aria-label="Back"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <title>Back</title>
              <path d="M19 12H5M5 12l7-7M5 12l7 7" />
            </svg>
          </Link>
        )}
        <h1 className="font-bold text-base text-foreground">{title}</h1>
      </div>
    </header>
  );
}
