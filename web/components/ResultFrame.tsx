import EngagementScatterChart from "../components/EngagementScatterChart";

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

export default function ResultFrame({ hasResult, data }: ResultFrameProps) {
  if (!hasResult) return null;

  return (
    <div id="result-section" className="flex w-full flex-col gap-6">
      {/* 1번째 section: 통계 */}
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

      {/* 2번째 section: 댓글 기반 피드백 */}
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
    </div>
  );
}
