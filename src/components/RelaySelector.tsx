import { RELAY_OPTIONS } from "../types/nostr";

interface Props {
  selectedRelay: string;
  onRelayChange: (url: string) => void;
  isLoading: boolean;
}

export default function RelaySelector({
  selectedRelay,
  onRelayChange,
  isLoading,
}: Props) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Select Relay
      </label>
      <select
        value={selectedRelay}
        onChange={(e) => onRelayChange(e.target.value)}
        disabled={isLoading}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
      >
        {RELAY_OPTIONS.map((opt) => (
          <option key={opt.url} value={opt.url}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
