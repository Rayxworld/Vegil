from fastapi import APIRouter
from app.services.superfluid_service import is_subscribed, add_test_subscription

router = APIRouter()

@router.post("/check")
async def check_subscription(data: dict):
    wallet = data.get("wallet")
    chain_id = data.get("chain_id")
    if not wallet or not chain_id:
        return {"subscribed": False}

    subscribed = await is_subscribed(wallet.lower(), int(chain_id))
    return {"subscribed": subscribed}

@router.post("/test-subscribe")
async def test_subscribe(data: dict):
    """Endpoint for testing - simulates a subscription without real blockchain transaction"""
    wallet = data.get("wallet")
    chain_id = data.get("chain_id")
    if not wallet or not chain_id:
        return {"success": False, "error": "Missing wallet or chain_id"}

    try:
        add_test_subscription(wallet, int(chain_id))
        return {"success": True, "message": "Test subscription added"}
    except Exception as e:
        return {"success": False, "error": str(e)}
