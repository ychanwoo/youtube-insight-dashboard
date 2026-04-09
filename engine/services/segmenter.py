def split_transcript_into_segments(transcript, segment_seconds=30):
    if not transcript:
        return []

    segments = []
    current_start = 0
    current_end = segment_seconds
    current_texts = []

    for item in transcript:
        text = item.get("text", "").strip()
        start = item.get("start", 0)

        if not text:
            continue

        while start >= current_end:
            if current_texts:
                segments.append({
                    "start": current_start,
                    "end": current_end,
                    "text": " ".join(current_texts).strip(),
                    "label": 0
                })
            current_start = current_end
            current_end += segment_seconds
            current_texts = []

        current_texts.append(text)

    if current_texts:
        segments.append({
            "start": current_start,
            "end": current_end,
            "text": " ".join(current_texts).strip(),
            "label": 0
        })

    return segments