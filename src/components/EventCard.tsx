import type { FC } from "react";
import type { NostrEvent, Profile } from "../types/nostr";
import { getDomain, getDisplayUrl } from "../utils/urlHelpers";
import { formatTime, getInitial } from "../utils/timeAndFormat";

interface EventCardProps {
  event: NostrEvent;
  profile?: Profile;
}

const EventCard: FC<EventCardProps> = ({ event, profile }) => {
  // Extract image URLs from content (simple URL detection)
  const imageRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp))/gi;
  const images: string[] = event.content.match(imageRegex) || [];

  // Extract all URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const allUrls: string[] = event.content.match(urlRegex) || [];

  // Filter non-image URLs (links)
  const links: string[] = allUrls.filter(
    (url: string) => !images.includes(url)
  );

  // Nostr entity regex (NIP-19: note1, nevent1, nprofile1, npub1, etc.)
  const nostrRegex =
    /(nostr:(note1|nevent1|nprofile1|npub1|naddr1)[0-9a-z]+)/gi;

  // Process content with clickable links and Nostr references
  const renderContentWithLinks = (content: string) => {
    // First, split by Nostr references
    const nostrParts = content.split(nostrRegex);

    return nostrParts.map((part, idx) => {
      // Check if this part is a Nostr reference
      if (part && nostrRegex.test(part)) {
        nostrRegex.lastIndex = 0;

        // Extract the entity type and code
        const match = part.match(
          /(nostr:)?(note1|nevent1|nprofile1|npub1|naddr1)([0-9a-z]+)/i
        );
        if (match) {
          const entityType = match[2].toLowerCase();
          // const entityCode = match[3];

          let label = "";
          let icon = "";

          if (entityType === "nevent1" || entityType === "note1") {
            label = "عرض ملاحظة";
            icon = "💬";
          } else if (entityType === "nprofile1" || entityType === "npub1") {
            label = "عرض الملف الشخصي";
            icon = "👤";
          } else if (entityType === "naddr1") {
            label = "عرض المحتوى";
            icon = "📄";
          }

          return (
            <a
              key={idx}
              href={`https://njump.me/${part}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 mt-2 bg-slate-800/50 hover:bg-blue-900/30 border border-slate-700 hover:border-blue-500/50 rounded-lg transition-colors text-blue-400 hover:text-blue-300 text-sm"
            >
              <span>{icon}</span>
              <span>{label}</span>
            </a>
          );
        }

        return <span key={idx}>{part}</span>;
      }

      // For non-Nostr parts, process URLs
      if (!part) return null;

      const urlParts = part.split(urlRegex);
      return urlParts.map((urlPart, urlIdx) => {
        if (!urlPart) return null;

        // Check if this part is a URL
        if (urlRegex.test(urlPart)) {
          urlRegex.lastIndex = 0;

          // Extract domain from URL
          let displayUrl = urlPart;
          try {
            const url = new URL(urlPart);
            displayUrl =
              url.hostname +
              (url.pathname !== "/"
                ? url.pathname.slice(0, 30) +
                  (url.pathname.length > 30 ? "..." : "")
                : "");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            displayUrl =
              urlPart.slice(0, 40) + (urlPart.length > 40 ? "..." : "");
          }

          return (
            <a
              key={`${idx}-${urlIdx}`}
              href={urlPart}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 hover:underline transition-colors break-all"
            >
              {displayUrl}
            </a>
          );
        }

        // Regular text
        return <span key={`${idx}-${urlIdx}`}>{urlPart}</span>;
      });
    });
  };

  // Get text content without image URLs, but keep other text and links
  const textContent = event.content.replace(imageRegex, "").trim();

  return (
    <div className="border-b border-slate-700 p-3 sm:p-4 hover:bg-slate-900/50 transition-colors cursor-pointer">
      <div className="flex gap-3 flex-row">
        {/* Avatar */}
        <div className="shrink-0">
          {profile?.picture ? (
            <img
              src={profile.picture}
              alt={profile.name}
              className="w-12 h-12 rounded-full object-cover hover:opacity-80 transition-opacity"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
              {getInitial(profile?.name || "")}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 text-sm flex-row">
            <span className="text-sm sm:text-base font-bold text-white hover:underline">
              {profile?.name || "مجهول"}
            </span>
            <span className="text-slate-500">@{event.pubkey.slice(0, 8)}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-500 hover:underline">
              {formatTime(event.created_at)}
            </span>
          </div>

          {/* Text Content with Clickable Links */}
          {textContent && (
            <p
              className="text-sm sm:text-base text-white mt-2 sm:mt-3 wrap-break-word whitespace-pre-wrap leading-relaxed"
              dir="ltr"
            >
              {renderContentWithLinks(textContent)}
            </p>
          )}

          {/* Images Gallery */}
          {images.length > 0 && (
            <div
              className={`mt-2 sm:mt-3 rounded-lg sm:rounded-2xl overflow-hidden ${
                images.length === 1
                  ? "max-w-xs sm:max-w-md"
                  : "grid grid-cols-2 gap-1 sm:gap-2"
              }`}
            >
              {images.map((imageUrl, idx) => (
                <div
                  key={idx}
                  className="relative bg-slate-800 rounded-lg overflow-hidden cursor-pointer"
                >
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={imageUrl}
                      alt={`Post image ${idx + 1}`}
                      className="w-full h-auto object-cover max-h-96 hover:opacity-75 transition-opacity"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Links Preview Card */}
          {links.length > 0 && (
            <div className="mt-3 space-y-2">
              {links.map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 p-3 border border-slate-700 rounded-lg hover:bg-slate-800/50 transition-colors group"
                >
                  <svg
                    className="w-5 h-5 text-slate-500 shrink-0 group-hover:text-blue-400 transition-colors mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 truncate">
                      {getDomain(link)}
                    </p>
                    <p className="text-xs sm:text-sm text-white hover:text-blue-400 transition-colors truncate group-hover:underline">
                      {getDisplayUrl(link)}
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-slate-600 shrink-0 group-hover:text-blue-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between mt-2 sm:mt-3 max-w-xs text-slate-500 text-xs sm:text-sm gap-2 sm:gap-0 flex-row">
            <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors flex-row">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12a9 9 0 010-18 9 9 0 010 18z"
                />
              </svg>
              <span className="text-xs">0</span>
            </div>
            <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer transition-colors flex-row">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12l-3-3m0 6l3 3m8-6l3 3m0-6l-3-3"
                />
              </svg>
              <span className="text-xs">0</span>
            </div>
            <div className="flex items-center gap-2 hover:text-red-500 cursor-pointer transition-colors flex-row">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-xs">0</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors flex-row">
              <svg
                className="w-4 h-4"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
