import type { FC } from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import type { NostrEvent, Profile } from "../types/nostr";
import EventCard from "./EventCard";
import FeedRefresh from "./FeedRefresh";
import { FeedHeader } from "./FeedHeader";

interface FeedProps {
  events: NostrEvent[];
  profiles: Record<string, Profile>;
  error?: string | null;
  isLoading?: boolean;
  onLoadMore?: () => void;
}

const Feed: FC<FeedProps> = ({
  events,
  profiles,
  error,
  isLoading = false,
  onLoadMore,
}) => {
  const [displayedEvents, setDisplayedEvents] = useState<NostrEvent[]>([]);
  const [newEventsQueue, setNewEventsQueue] = useState<NostrEvent[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const lastEventIdRef = useRef<string>("");

  // Update displayed events when new events come in
  useEffect(() => {
    if (events.length === 0) return;

    // On first load, display all events
    if (displayedEvents.length === 0) {
      setDisplayedEvents(events);
      lastEventIdRef.current = events[0]?.id || "";
      return;
    }

    // Find events newer than what's currently displayed
    const newerEvents = events.filter((event) => {
      // Check if event is not already in displayed events
      return !displayedEvents.some((e) => e.id === event.id);
    });

    if (newerEvents.length > 0) {
      setNewEventsQueue(newerEvents);
    }
  }, [events, displayedEvents]);

  // Handle refresh - add new events to display
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Add queued events to the top of the feed
      setDisplayedEvents((prevEvents) => [
        ...newEventsQueue.sort((a, b) => b.created_at - a.created_at),
        ...prevEvents,
      ]);

      // Clear the queue
      setNewEventsQueue([]);

      // Scroll to top
      if (feedContainerRef.current) {
        feedContainerRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [newEventsQueue]);

  // Observe intersection for infinite scroll
  useEffect(() => {
    if (!onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById("feed-sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [isLoading, onLoadMore]);

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Error Banner */}
      {error && (
        <div className="border-b border-red-700 bg-red-900/20 p-4">
          <p className="text-red-400 text-sm font-medium" dir="auto">
            {error}
          </p>
          <p className="text-red-300/70 text-xs mt-1">
            محاولة إعادة الاتصال...
          </p>
        </div>
      )}

      {/* Feed Container */}
      <div ref={feedContainerRef} className="flex-1 overflow-y-auto">
        <FeedHeader />
        <FeedRefresh
          newPostsCount={newEventsQueue.length}
          onRefresh={handleRefresh}
          isLoading={isRefreshing}
        />

        {/* Posts */}
        <div className="divide-y divide-slate-700">
          {displayedEvents.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-400 text-center">
                لا توجد منشورات حالياً
              </p>
            </div>
          ) : (
            displayedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                profile={profiles[event.pubkey]}
              />
            ))
          )}
        </div>

        {/* Loading Sentinel for infinite scroll */}
        <div id="feed-sentinel" className="h-4" />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-slate-400">
              <svg
                className="w-5 h-5 animate-spin"
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
              <span>جاري التحميل...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
