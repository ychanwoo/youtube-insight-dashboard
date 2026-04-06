"use client";

import { useState } from "react";
import ResultFrame from "./ResultFrame";

type ShortsHighlight = {
  startLabel: string;
  endLabel: string;
  reason: string;
  score: number;
};

type ShortsRecommendation = {
  isShortable: boolean;
  reason?: string;
  highlights?: ShortsHighlight[];
};

export type YoutubeResult = {
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
  chartData: {
    title: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    engagementRate: number;
  }[];
  shortsRecommendation?: ShortsRecommendation;
};

type Props = {
  url: string;
  setUrl: (value: string) => void;
};

export default function AnalyzeSection({ url, setUrl }: Props) {
  const [hasResult, setHasResult] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<YoutubeResult | null>(null);
  const [loading, setLoading] = useState(false);

  const isValidYoutubeUrl = (url: string) => {
    const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]+/;
    return regex.test(url);
  };

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setShowModal(true);
      return;
    }

    if (!isValidYoutubeUrl(url)) {
      setShowModal(true);
      return;
    }

    try {
      setLoading(true);

      const youtubeRes = await fetch("/api/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!youtubeRes.ok) {
        throw new Error("유튜브 API 호출 실패");
      }

      const youtubeData: YoutubeResult = await youtubeRes.json();

      // 2. video_id 추출
      const videoId = extractVideoId(url);

      // 3. FastAPI 하이라이트 API 호출
      let shortsRecommendation: ShortsRecommendation;

      try {
        const highlightsRes = await fetch("http://127.0.0.1:8000/highlights/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            video_id: videoId,
            title: youtubeData.video.title,
          }),
        });

        if (!highlightsRes.ok) throw new Error();

        shortsRecommendation = await highlightsRes.json();
      } catch {
        shortsRecommendation = {
          isShortable: true,
          highlights: [
            {
              startLabel: "02:14",
              endLabel: "02:42",
              score: 8.7,
              reason: "핵심 메시지가 잘 전달되는 구간",
            },
            {
              startLabel: "05:10",
              endLabel: "05:35",
              score: 7.9,
              reason: "흥미 유발 발화 구간",
            },
          ],
        };
      }

      const mergedData: YoutubeResult = {
        ...youtubeData,
        shortsRecommendation,
      };

      setResult(mergedData);
      setHasResult(true);

      setTimeout(() => {
        const resultSection = document.getElementById("result-section");
        resultSection?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const extractVideoId = (url: string) => {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname.includes("youtu.be")) {
        return parsedUrl.pathname.slice(1);
      }

      if (parsedUrl.pathname.includes("/shorts/")) {
        return parsedUrl.pathname.split("/shorts/")[1];
      }

      return parsedUrl.searchParams.get("v") || "";
    } catch {
      return "";
    }
  };

  return (
    <>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 ">
        <div className="overflow-hidden">
          <div className="flex flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-red-500">
                YOUTUBE ANALYTICS DASHBOARD
              </p>

              <h1 className="text-3xl font-extrabold leading-tight text-black md:text-5xl">
                Analyze a YouTube video URL
                <span className="block text-red-500">
                  and view channel insights instantly
                </span>
              </h1>

              <p className="mt-4 text-sm leading-6 text-neutral-600 md:text-base">
                영상 및 채널 통계와 함께 시청자 피드백을 분석하여, 어떤 요소를
                개선하면 더 좋은 반응을 얻을 수 있는지 보여줍니다.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row min-w-0">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="유튜브 영상 URL을 입력하세요"
                className="h-14 min-h-14 w-full shrink-0 appearance-none rounded-2xl border border-neutral-300 bg-white px-5 text-base text-black outline-none placeholder:text-neutral-400 focus:border-red-500 md:flex-1 md:text-sm"
              />

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
                className="h-14 rounded-2xl bg-red-600 px-6 text-sm font-bold text-white transition hover:bg-red-500 active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? "Loading..." : "Analyze"}
              </button>
            </div>
          </div>
        </div>

        {hasResult && result && (
          <ResultFrame hasResult={hasResult} url={url} data={result} />
        )}
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 relative top-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                💬
              </div>
              <div>
                <h2 className="text-lg font-bold text-black">입력 필요</h2>
                <p className="text-sm text-neutral-500">URL을 입력해주세요.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
