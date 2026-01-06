export interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

export interface Profile {
  name: string;
  picture: string;
  about: string;
}

export const RELAY_OPTIONS = [
  { url: "wss://nos.lol/", name: "nos.lol (Recommended)" },
  { url: "wss://relay.nostr.band/", name: "Nostr.Band" },
  { url: "wss://nostr.wine/", name: "nostr.wine" },
  { url: "wss://damus.io/", name: "damus.io" },
];

export enum EventKind {
  METADATA = 0,
  TEXT_NOTE = 1,
}
