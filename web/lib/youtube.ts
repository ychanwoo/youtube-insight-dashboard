export function extractVideoId(input: string): string | null {
  try {
    const url = new URL(input);

    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1) || null;
    }

    if (
      url.hostname.includes("youtube.com") ||
      url.hostname.includes("www.youtube.com")
    ) {
      if (url.pathname === "/watch") {
        return url.searchParams.get("v");
      }

      if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.split("/shorts/")[1] ?? null;
      }

      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.split("/embed/")[1] ?? null;
      }
    }

    return null;
  } catch {
    return null;
  }
}
