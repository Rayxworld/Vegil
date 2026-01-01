from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport
import json
import os
from typing import Dict, Set

# In-memory storage for test subscriptions (persists during backend session)
_test_subscriptions: Dict[int, Set[str]] = {}

SUBGRAPH_URLS = {
    # Mainnets
    1: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-ethereum-mainnet",
    56: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-bsc",
    8453: "https://base.subgraph.superfluid.finance",
    42161: "https://arbitrum.subgraph.superfluid.finance",
    # Testnets
    11155111: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-sepolia",  # Sepolia
    97: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-bsc-testnet",  # BSC Testnet
}


def add_test_subscription(wallet: str, chain_id: int):
    if chain_id not in _test_subscriptions:
        _test_subscriptions[chain_id] = set()
    _test_subscriptions[chain_id].add(wallet.lower())

async def is_subscribed(wallet: str, chain_id: int) -> bool:
    # Check local test subscriptions first
    if chain_id in _test_subscriptions and wallet.lower() in _test_subscriptions[chain_id]:
        return True

    if chain_id not in SUBGRAPH_URLS:
        return False

    transport = AIOHTTPTransport(url=SUBGRAPH_URLS[chain_id])
    client = Client(transport=transport, fetch_schema_from_transport=True)

    query = gql("""
    query GetFlows($sender: ID!) {
      account(id: $sender) {
        outflows {
          flowRate
        }
      }
    }
    """)

    try:
        result = await client.execute_async(query, variable_values={"sender": wallet})
        account = result.get("account")
        if not account:
            return False
        total_flow = sum(int(flow["flowRate"]) for flow in account["outflows"])
        return total_flow >= 385802469135802  # ~$10/month
    except:
        return False