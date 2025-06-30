from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
import cohere
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

co = cohere.Client(COHERE_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VideoRequest(BaseModel):
    videoId: str

@app.post("/summarize")
async def summarize_video(req: VideoRequest):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(req.videoId)
        full_text = " ".join([entry["text"] for entry in transcript])

        if len(full_text) > 10000:
            full_text = full_text[:10000] 

        response = co.summarize(
            text=full_text,
            length="long", 
            format="paragraph",  
            model="summarize-xlarge"
        )

        return {"summary": response.summary}

    except TranscriptsDisabled:
        raise HTTPException(status_code=403, detail="Transcript disabled.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
