import type { FC } from "react";

interface HeaderProps {
  connected: boolean;
}

const Header: FC<HeaderProps> = ({ connected }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-700 bg-black/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 h-16">
        <a href="/" className="flex items-center gap-3 flex-row">
          <h1 className="text-xl font-bold">nostr</h1>
        </a>

        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full animate-pulse ${
              connected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-sm text-slate-500">
            {connected ? "متصل" : "غير متصل"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
