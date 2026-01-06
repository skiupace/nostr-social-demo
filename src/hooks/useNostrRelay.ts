import { useState, useEffect, useRef, useCallback } from "react";
import { verifyEvent } from "nostr-tools";
import type { NostrEvent, Profile } from "../types/nostr";
import { EventKind } from "../types/nostr";

export function useNostrRelay(initialRelay: string) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<NostrEvent[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const seenIds = useRef(new Set<string>());
  // eslint-disable-next-line react-hooks/purity
  const subId = useRef("feed-" + Math.random().toString(36).substr(2, 9));
  const connectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const connectToRelay = useCallback((url: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        // Clear any existing timeout
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
        }

        // Close existing connection
        if (socketRef.current) {
          socketRef.current.close();
          socketRef.current = null;
        }

        console.log("Attempting to connect to:", url);
        setError(null);

        const socket = new WebSocket(url);

        // Set a connection timeout of 5 seconds
        connectionTimeoutRef.current = setTimeout(() => {
          if (
            !socketRef.current ||
            socketRef.current.readyState !== WebSocket.OPEN
          ) {
            console.error("Connection timeout for relay:", url);
            socket.close();
            setConnected(false);
            setError(`Connection timeout to ${url}`);
            reject(new Error("Connection timeout"));
          }
        }, 5000);

        socket.onopen = () => {
          if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
          }
          console.log("Connected to relay:", url);
          socketRef.current = socket;
          setConnected(true);
          setError(null);
          setLoading(true);

          // Subscribe to recent events
          const filters = {
            kinds: [EventKind.METADATA, EventKind.TEXT_NOTE],
            limit: 50,
          };

          const message = JSON.stringify(["REQ", subId.current, filters]);
          console.log("Sending subscription request:", message);
          socket.send(message);
          resolve();
        };

        socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            const [type, id, data] = message;

            if (type === "EVENT" && id === subId.current) {
              // Verify event signature
              if (!verifyEvent(data)) {
                console.warn("Invalid event signature, skipping");
                return;
              }

              // Deduplicate
              if (seenIds.current.has(data.id)) {
                return;
              }
              seenIds.current.add(data.id);

              if (data.kind === EventKind.METADATA) {
                // Handle metadata event
                try {
                  const metadata = JSON.parse(data.content);
                  setProfiles((prev) => ({
                    ...prev,
                    [data.pubkey]: {
                      name: metadata.name || "Anonymous",
                      picture: metadata.picture || "",
                      about: metadata.about || "",
                    },
                  }));
                } catch (e) {
                  console.warn("Failed to parse metadata:", e);
                  // Set a default profile
                  setProfiles((prev) => ({
                    ...prev,
                    [data.pubkey]: {
                      name: data.pubkey.slice(0, 8) + "...",
                      picture: "",
                      about: "",
                    },
                  }));
                }
              } else if (data.kind === EventKind.TEXT_NOTE) {
                // Handle text note event
                setEvents((prev) => {
                  const updated = [data, ...prev];
                  return updated.slice(0, 100); // Keep only latest 100
                });
              }

              setLoading(false);
            }

            // Handle end of stored events signal
            if (type === "EOSE" && id === subId.current) {
              console.log("Sync complete");
              setLoading(false);
            }
          } catch (e) {
            console.error("Error parsing relay message:", e);
          }
        };

        socket.onerror = (error) => {
          if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
          }
          console.error("WebSocket error:", error);
          setConnected(false);
          setError(`Failed to connect to ${url}`);
          reject(error);
        };

        socket.onclose = () => {
          if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
          }
          console.log("Disconnected from relay");
          setConnected(false);
        };
      } catch (error) {
        console.error("Error creating WebSocket:", error);
        setConnected(false);
        setError(`Error connecting to ${url}`);
        reject(error);
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    seenIds.current.clear();

    connectToRelay(initialRelay).catch((error) => {
      console.error("Failed to connect to relay:", error);
      setConnected(false);
      setLoading(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, [initialRelay, connectToRelay]);

  return {
    connected,
    loading,
    events,
    profiles,
    error,
    changeRelay: connectToRelay,
  };
}
