from youtube_transcript_api import YouTubeTranscriptApi


def get_transcript(video_id: str):
    try:
        ytt_api = YouTubeTranscriptApi()
        transcript = ytt_api.fetch(video_id, languages=["ko", "en"])
        return transcript.to_raw_data()
    except Exception as e:
        print("자막 가져오기 실패:", e)
        return []