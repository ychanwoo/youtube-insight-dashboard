from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.highlights import router as highlights_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "ReflectTube API is running"}

app.include_router(highlights_router, prefix="/highlights", tags=["highlights"])