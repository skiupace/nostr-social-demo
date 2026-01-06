import type { FC } from "react";

interface RightSidebarProps {
  connected: boolean;
  currentRelay: string;
}

const RightSidebar: FC<RightSidebarProps> = () => {
  return (
    <aside className="hidden xl:block w-80 bg-black sticky top-16 h-[calc(100vh-64px)] overflow-y-auto p-4 space-y-4">
      {/* Search */}
      <div className="sticky top-0 z-30 pb-4">
        <div className="relative">
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
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
          <input
            type="text"
            placeholder="ابحث في نوستر"
            className="w-full bg-slate-900 border border-slate-700 rounded-full pl-4 pr-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="bg-slate-900 rounded-2xl p-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-400">4</p>
          <p className="text-xs text-slate-400">المُرحلات</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-400">∞</p>
          <p className="text-xs text-slate-400">المستخدمون</p>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
