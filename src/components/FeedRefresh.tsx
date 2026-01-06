import type { FC } from "react";

interface FeedRefreshProps {
  newPostsCount: number;
  onRefresh: () => void;
  isLoading: boolean;
}

const FeedRefresh: FC<FeedRefreshProps> = ({
  newPostsCount,
  onRefresh,
  isLoading,
}) => {
  if (newPostsCount === 0) return null;

  return (
    <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-center gap-2 hover:bg-slate-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className={`w-4 h-4 text-blue-400 ${isLoading ? "animate-spin" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span className="text-blue-400 font-medium">
          {isLoading ? "جاري التحديث..." : `${newPostsCount} منشور جديد`}
        </span>
      </button>
    </div>
  );
};

export default FeedRefresh;
