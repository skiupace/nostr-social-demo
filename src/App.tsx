import { useState, useCallback } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Feed from "./components/Feed";
import RightSidebar from "./components/RightSidebar";
import { useNostrRelay } from "./hooks/useNostrRelay";
import { RELAY_OPTIONS } from "./types/nostr";

export default function App() {
  const [selectedRelay, setSelectedRelay] = useState(RELAY_OPTIONS[0].url);
  const { connected, loading, events, profiles, error, changeRelay } =
    useNostrRelay(selectedRelay);

  const handleRelayChange = useCallback(
    (relay: string) => {
      setSelectedRelay(relay);
      changeRelay(relay);
    },
    [changeRelay]
  );

  return (
    <div
      className="flex flex-col h-screen w-screen bg-black text-white overflow-hidden"
      dir="rtl"
      lang="ar"
    >
      <Header connected={connected} />

      {/* Main Layout - Takes remaining height */}
      <div className="flex flex-1 overflow-hidden sm:pr-40">
        <Sidebar
          selectedRelay={selectedRelay}
          onRelayChange={handleRelayChange}
          loading={loading}
        />

        <main className="flex-1 border-l border-r border-slate-700 overflow-y-auto max-w-3xl">
          <Feed events={events} profiles={profiles} error={error} />
        </main>

        <RightSidebar connected={connected} currentRelay={selectedRelay} />
      </div>
    </div>
  );
}
