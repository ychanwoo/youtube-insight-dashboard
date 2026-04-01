import { NextRequest, NextResponse } from "next/server";
import { extractVideoId } from "@/lib/youtube";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

type VideoApiItem = {
  id: string;
  snippet: {
    title: string;
    channelId: string;
    channelTitle: string;
    publishedAt: string;
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount: string;
  };
};

type ChannelApiItem = {
  id: string;
  snippet: {
    title: string;
  };
  statistics?: {
    subscriberCount?: string;
    videoCount?: string;
  };
  contentDetails?: {
    relatedPlaylists?: {
      uploads?: string;
    };
  };
};

type PlaylistItem = {
  contentDetails?: {
    videoId?: string;
  };
};

type YoutubeChartPoint = {
  title: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  engagementRate: number;
};

type YoutubeResult = {
  video: {
    title: string;
    publishedAt: string;
    viewCount: number;
  };
  channel: {
    name: string;
    subscriberCount: number;
    totalVideos: number;
    topViewCount: number;
    avgViewCount: number;
  };
  chartData: YoutubeChartPoint[];
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API error: ${res.status} ${text}`);
  }

  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { message: "URL is required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "Missing YOUTUBE_API_KEY in .env.local" },
        { status: 500 },
      );
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { message: "Invalid YouTube URL." },
        { status: 400 },
      );
    }

    // 1) 영상 정보
    const videoUrl = `${BASE_URL}/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;

    const videoData = await fetchJson<{ items: VideoApiItem[] }>(videoUrl);
    const video = videoData.items?.[0];

    if (!video) {
      return NextResponse.json(
        { message: "Video not found." },
        { status: 404 },
      );
    }

    const channelId = video.snippet.channelId;

    // 2) 채널 정보 + uploads playlist
    const channelUrl = `${BASE_URL}/channels?part=snippet,statistics,contentDetails&id=${channelId}&key=${apiKey}`;

    const channelData = await fetchJson<{ items: ChannelApiItem[] }>(
      channelUrl,
    );
    const channel = channelData.items?.[0];

    if (!channel) {
      return NextResponse.json(
        { message: "Channel not found." },
        { status: 404 },
      );
    }

    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;

    let topViewCount = 0;
    let avgViewCount = 0;
    let chartData: YoutubeChartPoint[] = [];

    if (uploadsPlaylistId) {
      // 3) 업로드 영상 목록 일부 조회 (예: 최근 20개)
      const playlistUrl = `${BASE_URL}/playlistItems?part=contentDetails&playlistId=${uploadsPlaylistId}&maxResults=20&key=${apiKey}`;

      const playlistData = await fetchJson<{ items: PlaylistItem[] }>(
        playlistUrl,
      );

      const videoIds = playlistData.items
        .map((item) => item.contentDetails?.videoId)
        .filter((id): id is string => Boolean(id));

      if (videoIds.length > 0) {
        const batchVideosUrl = `${BASE_URL}/videos?part=snippet,statistics&id=${videoIds.join(",")}&key=${apiKey}`;

        const batchVideosData = await fetchJson<{ items: VideoApiItem[] }>(
          batchVideosUrl,
        );

        chartData = batchVideosData.items.map((item) => {
          const viewCount = Number(item.statistics?.viewCount ?? 0);
          const likeCount = Number(item.statistics?.likeCount ?? 0);
          const commentCount = Number(item.statistics?.commentCount ?? 0);

          const engagementRate =
            viewCount > 0
              ? Number(
                  (((likeCount + commentCount) / viewCount) * 100).toFixed(2),
                )
              : 0;
          return {
            title: item.snippet?.title?.trim() ?? "제목 없음",
            viewCount,
            likeCount,
            commentCount,
            engagementRate,
          };
        });

        const counts = batchVideosData.items.map((item) =>
          Number(item.statistics?.viewCount ?? 0),
        );

        if (counts.length > 0) {
          topViewCount = Math.max(...counts);
          avgViewCount = Math.round(
            counts.reduce((sum, count) => sum + count, 0) / counts.length,
          );
        }
      }
    }

    const result: YoutubeResult = {
      video: {
        title: video.snippet.title,
        publishedAt: video.snippet.publishedAt,
        viewCount: Number(video.statistics?.viewCount ?? 0),
      },
      channel: {
        name: channel.snippet.title,
        subscriberCount: Number(channel.statistics?.subscriberCount ?? 0),
        totalVideos: Number(channel.statistics?.videoCount ?? 0),
        topViewCount,
        avgViewCount,
      },
      chartData,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch YouTube data." },
      { status: 500 },
    );
  }
}
