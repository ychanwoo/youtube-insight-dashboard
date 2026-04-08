def extract_highlights(video_id: str, title: str):
    return {
        "isShortable": True,
        "highlights": [
            {
                "startLabel": "02:14",
                "endLabel": "02:42",
                "score": 8.7,
                "reason": "핵심 메시지가 잘 전달되는 구간"
            },
            {
                "startLabel": "05:10",
                "endLabel": "05:35",
                "score": 7.9,
                "reason": "흥미 유발 발화 구간"
            }
        ]
    }