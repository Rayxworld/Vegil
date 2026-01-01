from fastapi import APIRouter
from pydantic import BaseModel
import os
from app.services.ai_service import ai_security_service

router = APIRouter()

class LinkRequest(BaseModel):
    url: str

class EmailRequest(BaseModel):
    content: str

class XRequest(BaseModel):
    handle: str

@router.post("/link")
async def scan_link(request: LinkRequest):
    return await ai_security_service.scan_link(request.url)

@router.post("/email")
async def scan_email(request: EmailRequest):
    return await ai_security_service.scan_email(request.content)

@router.post("/x-risk")
async def assess_x_risk(request: XRequest):
    return await ai_security_service.assess_x_risk(request.handle)

@router.get("/status")
async def get_service_status():
    """Returns active service configuration"""
    return {
        "active_service": "AI Guard v2",
        "apis": {
            "openrouter": bool(os.getenv("OPENROUTER_API_KEY")),
            "virustotal": bool(os.getenv("VIRUSTOTAL_API_KEY"))
        },
        "model": os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.1-8b-instruct:free")
    }
