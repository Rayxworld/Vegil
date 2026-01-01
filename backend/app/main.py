import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import scans, subscription

# Load environment variables from .env file if it exists
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).parent.parent / '.env'
    if env_path.exists():
        load_dotenv(env_path)
        print(f"✅ Loaded environment variables from {env_path}")
    else:
        print("ℹ️  No .env file found. Using system environment variables.")
except ImportError:
    print("ℹ️  python-dotenv not installed. Using system environment variables.")

app = FastAPI(title="AI Security Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scans.router, prefix="/api/scans")
app.include_router(subscription.router, prefix="/api/subscriptions")

@app.get("/")
def root():
    return {"message": "AI Security Agent Backend Live"}