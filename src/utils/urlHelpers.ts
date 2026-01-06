export function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url.slice(0, 20) + "...";
  }
}

export function getDisplayUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const path =
      urlObj.pathname !== "/"
        ? urlObj.pathname.slice(0, 40) +
          (urlObj.pathname.length > 40 ? "..." : "")
        : "";
    return urlObj.hostname + path;
  } catch {
    return url.slice(0, 50) + (url.length > 50 ? "..." : "");
  }
}
