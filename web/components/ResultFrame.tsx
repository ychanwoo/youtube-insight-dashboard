"use client";

import EngagementScatterChart from "../components/EngagementScatterChart";
import { useRouter } from "next/navigation";

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
  chartData: {
    title: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    engagementRate: number;
  }[];
  shortsRecommendation?: ShortsRecommendation;
};

type ResultFrameProps = {
  hasResult: boolean;
  url: string;
  data: YoutubeResult;
};

function formatNumber(value: number) {
  return value.toLocaleString("ko-KR");
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ko-KR");
}

const fallbackShortsHighlights: ShortsHighlight[] = [
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

function buildDetailedHighlights(highlights?: ShortsHighlight[]) {
  const source =
    highlights && highlights.length > 0 ? highlights : fallbackShortsHighlights;

  return Array.from({ length: 9 }, (_, index) => {
    const item = source[index] ?? fallbackShortsHighlights[index];
    return {
      ...item,
      score: Number(item.score.toFixed(1)),
    };
  });
}

export default function ResultFrame({ hasResult, data }: ResultFrameProps) {
  const router = useRouter();

  if (!hasResult) return null;

  const shortsHighlights = buildDetailedHighlights(
    data.shortsRecommendation?.highlights,
  );

  const handleOpenShortsDetail = () => {
    if (!data.shortsRecommendation?.isShortable) return;

    sessionStorage.setItem(
      "shortsDetailPayload",
      JSON.stringify({
        videoTitle: data.video.title,
        channelName: data.channel.name,
        highlights: shortsHighlights,
      }),
    );

    router.push("/shorts-detail");
  };

  return (
    <div id="result-section" className="flex w-full flex-col gap-6">
      {/* 1번째 section: 댓글 기반 피드백 */}
      <section className="rounded-3xl border border-neutral-100 p-6 bg-neutral-50 shadow-sm md:p-7 ">
        <div className="mb-6">
          <p className="text-sm font-medium text-red-500 pl-1">
            댓글 기반 피드백
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-black">
            Viewer Feedback Summary
          </h2>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-3">
          {/* 핵심 문제 */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 md:p-6">
            <h3 className="text-2xl font-bold text-red-500">핵심 문제</h3>

            <ul className="mt-5 space-y-4">
              <li className="rounded-2xl bg-neutral-100 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-neutral-700">음질 문제</span>
                  <span className="text-lg font-bold text-black">35%</span>
                </div>
              </li>

              <li className="rounded-2xl bg-neutral-100 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-neutral-700">
                    설명 속도 빠름
                  </span>
                  <span className="text-lg font-bold text-black">22%</span>
                </div>
              </li>
            </ul>
          </div>

          {/* 강점 */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 md:p-6">
            <h3 className="text-2xl font-bold text-black">강점</h3>

            <ul className="mt-5 space-y-4">
              <li className="rounded-2xl bg-neutral-100 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-neutral-700">
                    내용 이해 쉬움
                  </span>
                  <span className="text-lg font-bold text-black">41%</span>
                </div>
              </li>

              <li className="rounded-2xl bg-neutral-100 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-neutral-700">예시 좋음</span>
                  <span className="text-lg font-bold text-black">18%</span>
                </div>
              </li>
            </ul>
          </div>

          {/* 개선 제안 */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 md:p-6">
            <h3 className="text-2xl font-bold text-black">개선 제안</h3>

            <ul className="mt-5 space-y-4">
              <li className="rounded-2xl bg-neutral-100 px-5 py-4 text-sm text-neutral-700">
                마이크 품질 개선 필요
              </li>

              <li className="rounded-2xl bg-neutral-100 px-5 py-4 text-sm text-neutral-700">
                설명 속도 조절 필요
              </li>

              <li className="rounded-2xl bg-neutral-100 px-5 py-4 text-sm text-neutral-700">
                화질 개선 필요
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2번째 section: 쇼츠 편집 구간 */}
      <section
        onClick={handleOpenShortsDetail}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleOpenShortsDetail();
          }
        }}
        role={data.shortsRecommendation?.isShortable ? "button" : undefined}
        tabIndex={data.shortsRecommendation?.isShortable ? 0 : undefined}
        className={`rounded-3xl border border-neutral-100 bg-neutral-50 p-6 shadow-sm transition md:p-7 ${
          data.shortsRecommendation?.isShortable
            ? "cursor-pointer hover:-translate-y-0.5 hover:border-red-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500/30"
            : ""
        }`}
      >
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="pl-1 text-sm font-medium text-red-500">
              쇼츠 활용 포인트
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-black">
              Shorts Highlight Recommendation
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              쇼츠로 편집하기 적합한 구간을 추천하여, 짧은 영상으로 재활용할 수
              있는 포인트를 빠르게 확인할 수 있습니다.
            </p>
          </div>

          {data.shortsRecommendation?.isShortable && (
            <span className="inline-flex w-fit items-center rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
              상세 9개 구간 보기
            </span>
          )}
        </div>

        {/* 쇼츠 구간 적합할떄 */}
        {data.shortsRecommendation?.isShortable ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {shortsHighlights.slice(0, 3).map((item, index) => (
              <div
                key={`${item.startLabel}-${item.endLabel}-${index}`}
                className="rounded-3xl border border-neutral-200 bg-white p-5 transition hover:border-red-200 md:p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
                    추천 구간 {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-neutral-500">
                    점수 {item.score}
                  </span>
                </div>

                <p className="text-2xl font-bold tracking-tight text-black">
                  {item.startLabel} ~ {item.endLabel}
                </p>

                <p className="mt-4 rounded-2xl bg-neutral-100 px-4 py-3 text-sm leading-6 text-neutral-700">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        ) : (
          // 쇼츠 제작이 적합하지 않은 경우
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-xl">
                ⚠️
              </div>

              <div>
                <h3 className="text-xl font-bold text-black">
                  쇼츠 제작이 적합하지 않은 영상입니다
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  {data.shortsRecommendation?.reason ??
                    "자막 정보가 부족하거나 쇼츠로 활용할 만한 핵심 구간이 적습니다."}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3번째 section: 통계 */}
      <section className="rounded-3xl border border-neutral-100 p-6 bg-neutral-50 shadow-sm md:p-7">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-red-500 pl-1">분석 결과</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-black">
              Video & Channel Insights
            </h2>
          </div>

          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
            Live Analysis
          </span>
        </div>

        {/* 상단 정보 카드 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">영상 제목</p>
            <p className="mt-3 text-2xl font-bold leading-tight text-black">
              {data.video.title}
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">채널명</p>
            <p className="mt-3 text-2xl font-bold leading-tight text-black">
              {data.channel.name}
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">구독자 수</p>
            <p className="mt-3 text-2xl font-bold leading-tight text-black">
              {formatNumber(data.channel.subscriberCount)}
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">업로드 날짜</p>
            <p className="mt-3 text-2xl font-bold leading-tight text-black">
              {formatDate(data.video.publishedAt)}
            </p>
          </div>
        </div>

        {/* 채널 통계 */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 md:p-6">
            <h3 className="text-2xl font-bold text-black">채널 통계</h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-neutral-100 px-5 py-4">
                <span className="text-sm text-neutral-500">총 영상 수</span>
                <span className="text-xl font-bold text-black">
                  {formatNumber(data.channel.totalVideos)}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-neutral-100 px-5 py-4">
                <span className="text-sm text-neutral-500">
                  최근 영상 20개 최고 조회수
                </span>
                <span className="text-xl font-bold text-black">
                  {formatNumber(data.channel.topViewCount)}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-neutral-100 px-5 py-4">
                <span className="text-sm text-neutral-500">
                  전체 영상 평균 조회수
                </span>
                <span className="text-xl font-bold text-black">
                  {formatNumber(data.channel.avgViewCount)}
                </span>
              </div>
            </div>
          </div>

          {/* 시각화 */}
          <div className="min-w-0 rounded-[30px] border border-black/8 bg-white p-5 shadow-sm md:p-6">
            <h3 className="text-2xl font-bold text-black">
              조회수 대비 참여도 분석
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              최근 영상들의 조회수와 참여율을 비교하여, 높은 반응을 얻은 영상을
              확인할 수 있습니다.
            </p>

            <EngagementScatterChart data={data.chartData} />
          </div>
        </div>
      </section>
    </div>
  );
}
