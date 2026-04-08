from fastapi import APIRouter
from pydantic import BaseModel
from services.highlight_extractor import extract_highlights

router = APIRouter()

class HighlightRequest(BaseModel):
    video_id: str
    title: str

@router.post("/")
def get_highlights(req: HighlightRequest):
    return extract_highlights(req.video_id, req.title)