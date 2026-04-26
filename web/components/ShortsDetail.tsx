"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ShortsHighlight = {
  startLabel: string;
  endLabel: string;
  reason: string;
  score: number;
};

type ShortsDetailPayload = {
  videoTitle: string;
  channelName: string;
  highlights: ShortsHighlight[];
};

const defaultHighlights: ShortsHighlight[] = [
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
  {
    startLabel: "08:18",
    endLabel: "08:47",
    score: 7.6,
    reason: "시청자의 관심을 끌 수 있는 전환 구간",
  },
  {
    startLabel: "11:02",
    endLabel: "11:29",
    score: 7.4,
    reason: "짧게 잘라도 의미가 유지되는 설명 구간",
  },
  {
    startLabel: "14:36",
    endLabel: "15:05",
    score: 7.2,
    reason: "핵심 내용을 압축해 전달하는 구간",
  },
  {
    startLabel: "17:21",
    endLabel: "17:49",
    score: 7.0,
    reason: "반응을 유도하기 좋은 질문형 발화 구간",
  },
  {
    startLabel: "20:03",
    endLabel: "20:31",
    score: 6.8,
    reason: "맥락 없이도 이해 가능한 요약 구간",
  },
  {
    startLabel: "23:44",
    endLabel: "24:12",
    score: 6.6,
    reason: "편집 후 숏폼 도입부로 활용하기 좋은 구간",
  },
  {
    startLabel: "26:09",
    endLabel: "26:38",
    score: 6.4,
    reason: "마무리 메시지가 분명한 구간",
  },
];

const tags = [
  "Core Message",
  "Hook",
  "Transition",
  "Standalone",
  "Summary",
  "Question",
  "Context",
  "Opening",
  "Closing",
];

function getInitialPayload(): ShortsDetailPayload {
  const fallbackPayload = {
    videoTitle: "분석된 영상",
    channelName: "ReflectTube",
    highlights: defaultHighlights,
  };

  if (typeof window === "undefined") return fallbackPayload;

  const rawPayload = sessionStorage.getItem("shortsDetailPayload");
  if (!rawPayload) return fallbackPayload;

  try {
    const parsed = JSON.parse(rawPayload) as ShortsDetailPayload;
    if (Array.isArray(parsed.highlights) && parsed.highlights.length > 0) {
      return {
        videoTitle: parsed.videoTitle || "분석된 영상",
        channelName: parsed.channelName || "ReflectTube",
        highlights: parsed.highlights.slice(0, 9),
      };
    }
  } catch {
    sessionStorage.removeItem("shortsDetailPayload");
  }

  return fallbackPayload;
}

export default function ShortsDetail() {
  const router = useRouter();
  const [payload] = useState<ShortsDetailPayload>(getInitialPayload);

  const highlights = useMemo(() => {
    return Array.from({ length: 9 }, (_, index) => {
      return payload.highlights[index] ?? defaultHighlights[index];
    });
  }, [payload.highlights]);

  const topScore = highlights[0]?.score ?? 0;
  const averageScore =
    highlights.reduce((sum, item) => sum + item.score, 0) / highlights.length;

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#f8f8f7] text-black">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 -top-40 h-100 w-100 -translate-x-1/2 rounded-full bg-red-100/70 blur-3xl" />
        <div className="absolute -right-35 top-70 h-75 w-75 rounded-full bg-neutral-200/70 blur-3xl" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.045) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.25))",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.25))",
        }}
      />

      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-red-500 hover:text-red-600"
          >
            ← Back
          </button>

          <span className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600">
            Shorts Detail
          </span>
        </div>

        <div className="rounded-4xl border border-neutral-100 bg-white/80 p-6 shadow-sm backdrop-blur md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-red-500">
                쇼츠 편집 적합 구간 상세 분석
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-black md:text-5xl">
                Top 9 Shorts Highlights
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-600 md:text-base">
                메인 화면에서 보여준 상위 3개 구간을 포함해, 쇼츠로 재활용하기
                좋은 후보 구간 9개를 점수순으로 확인할 수 있습니다.
              </p>

              <div className="mt-5 rounded-2xl bg-neutral-100 px-5 py-4">
                <p className="text-xs font-semibold text-neutral-500">
                  분석 영상
                </p>
                <p className="mt-2 line-clamp-2 text-lg font-bold text-black">
                  {payload.videoTitle}
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  {payload.channelName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-3xl bg-red-600 p-4 text-white">
                <p className="text-xs font-semibold text-red-100">Best</p>
                <p className="mt-2 text-3xl font-black">{topScore}</p>
              </div>
              <div className="rounded-3xl bg-neutral-950 p-4 text-white">
                <p className="text-xs font-semibold text-neutral-400">Avg</p>
                <p className="mt-2 text-3xl font-black">
                  {averageScore.toFixed(1)}
                </p>
              </div>
              <div className="rounded-3xl border border-neutral-200 bg-white p-4">
                <p className="text-xs font-semibold text-neutral-500">Count</p>
                <p className="mt-2 text-3xl font-black text-black">9</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {highlights.map((item, index) => {
            const isTopThree = index < 3;

            return (
              <article
                key={`${item.startLabel}-${item.endLabel}-${index}`}
                className={`rounded-[28px] border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:p-6 ${
                  isTopThree
                    ? "border-red-200"
                    : "border-neutral-200 hover:border-red-100"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        isTopThree
                          ? "bg-red-600 text-white"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      추천 구간 {index + 1}
                    </span>
                    <p className="mt-4 text-3xl font-black tracking-tight text-black">
                      {item.startLabel}
                    </p>
                    <p className="text-sm font-semibold text-neutral-400">
                      to {item.endLabel}
                    </p>
                  </div>

                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-neutral-100">
                    <span className="text-xs font-bold text-neutral-500">
                      score
                    </span>
                    <span className="text-xl font-black text-red-600">
                      {item.score}
                    </span>
                  </div>
                </div>

                <p className="mt-5 rounded-2xl bg-neutral-100 px-4 py-3 text-sm leading-6 text-neutral-700">
                  {item.reason}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
                  <span className="text-xs font-semibold text-neutral-500">
                    {tags[index]}
                  </span>
                  <span className="text-xs font-bold text-red-500">
                    {isTopThree ? "Main" : "Detail"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
