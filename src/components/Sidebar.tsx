import type { FC } from "react";
import { RELAY_OPTIONS } from "../types/nostr";

interface SidebarProps {
  selectedRelay: string;
  onRelayChange: (relay: string) => void;
  loading: boolean;
}

const Sidebar: FC<SidebarProps> = ({
  selectedRelay,
  onRelayChange,
  loading,
}) => {
  return (
    <aside className="hidden lg:block w-64 border-l border-slate-700 bg-black sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-4 space-y-8">
        {/* Navigation */}
        <nav className="space-y-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-slate-900 cursor-pointer transition-colors flex-row">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
            <span className="text-xl font-bold">الرئيسية</span>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-slate-900 cursor-pointer transition-colors flex-row">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-xl font-bold">استكشاف</span>
          </div>
        </nav>

        {/* Relay Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-400">
            المُرحل النشط
          </label>
          <select
            value={selectedRelay}
            onChange={(e) => onRelayChange(e.target.value)}
            disabled={loading}
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
            dir="ltr"
          >
            {RELAY_OPTIONS.map((opt) => (
              <option key={opt.url} value={opt.url}>
                {opt.name}
              </option>
            ))}
          </select>

          <div className="text-xs text-slate-600 space-y-1">
            <p className="truncate ltr" dir="ltr">
              {selectedRelay}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
