import os
import requests
import base64
from typing import Dict, List
import json

class AISecurityService:
    """
    Primary AI Security Service
    - Uses OpenRouter for Text/Account analysis (supports many FREE models)
    - Uses VirusTotal for Link scanning
    - Implements content truncation to save tokens
    """
    
    def __init__(self):
        self.openrouter_api_key = os.getenv("OPENROUTER_API_KEY", "")
        self.virustotal_api_key = os.getenv("VIRUSTOTAL_API_KEY", "")
        self.openrouter_url = "https://openrouter.ai/api/v1/chat/completions"
        
        # Default to a highly capable FREE model
        self.model = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.1-8b-instruct:free")
        
        # Limits to stay within free/safe boundaries
        self.MAX_EMAIL_CHARS = 2000  # Truncate long emails to save tokens
    
    async def scan_email(self, content: str) -> Dict:
        """Analyze emails using OpenRouter AI"""
        if not self.openrouter_api_key:
            return self._heuristic_email_scan(content)
        
        # Truncate content for token efficiency
        truncated_content = content[:self.MAX_EMAIL_CHARS]
        if len(content) > self.MAX_EMAIL_CHARS:
            truncated_content += "... [Content Truncated for Analysis]"

        try:
            headers = {
                "Authorization": f"Bearer {self.openrouter_api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "AiGuard Security"
            }
            
            prompt = f"""[CYBERSECURITY ANALYSIS]
Analyze this email for phishing, social engineering, or malicious intent.
Content: {truncated_content}

Return ONLY a JSON object with:
{{
  "risk_level": "Low"|"Medium"|"High"|"Critical",
  "risk_score": 0-100,
  "flags": ["list", "of", "findings"],
  "analysis": "Brief explanation"
}}"""

            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.1,
                "max_tokens": 300 # Limit output tokens
            }
            
            response = requests.post(self.openrouter_url, headers=headers, json=payload, timeout=15)
            
            if response.status_code == 200:
                ai_text = response.json()['choices'][0]['message']['content']
                # Try to extract JSON from md if AI wraps it
                if "```json" in ai_text:
                    ai_text = ai_text.split("```json")[1].split("```")[0].strip()
                elif "```" in ai_text:
                    ai_text = ai_text.split("```")[1].split("```")[0].strip()
                
                result = json.loads(ai_text)
                result['source'] = f"AI ({self.model})"
                return result
            else:
                return self._heuristic_email_scan(content, f"API Error ({response.status_code})")
                
        except Exception as e:
            print(f"OpenRouter Error: {e}")
            return self._heuristic_email_scan(content, "AI unavailable, using fallback logic")

    async def scan_link(self, url: str) -> Dict:
        """Analyze URLs using VirusTotal (if key exists) or Logic"""
        if not self.virustotal_api_key:
            return self._heuristic_link_scan(url)
        
        try:
            headers = {"x-apikey": self.virustotal_api_key}
            url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
            vt_url = f"https://www.virustotal.com/api/v3/urls/{url_id}"
            
            res = requests.get(vt_url, headers=headers, timeout=10)
            
            if res.status_code == 200:
                attr = res.json().get("data", {}).get("attributes", {})
                stats = attr.get("last_analysis_stats", {})
                malicious = stats.get("malicious", 0)
                
                risk_score = min(malicious * 20, 100)
                level = "Low"
                if risk_score > 75: level = "Critical"
                elif risk_score > 50: level = "High"
                elif risk_score > 25: level = "Medium"

                return {
                    "url": url,
                    "risk_level": level,
                    "risk_score": risk_score,
                    "flags": [f"{malicious} vendors flagged as malicious"] if malicious > 0 else [],
                    "details": attr.get("title", "No specific details") if malicious > 0 else "Safe to proceed",
                    "source": "VirusTotal Intelligence"
                }
            else:
                # If URL not found, we could submit it, but for speed we'll use fallback
                return self._heuristic_link_scan(url)
        except:
            return self._heuristic_link_scan(url)

    async def assess_x_risk(self, handle: str) -> Dict:
        """Assess X handle risk using OpenRouter"""
        if not self.openrouter_api_key:
            return self._heuristic_x_scan(handle)

        try:
            headers = {"Authorization": f"Bearer {self.openrouter_api_key}", "Content-Type": "application/json"}
            prompt = f"Assess the suspension risk for X handle '@{handle}'. Return JSON ONLY: {{\"suspension_risk\": 0-100, \"risk_factors\": [], \"recommendation\": \"\"}}"
            
            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 200
            }
            
            res = requests.post(self.openrouter_url, headers=headers, json=payload, timeout=10)
            if res.status_code == 200:
                data = json.loads(res.json()['choices'][0]['message']['content'])
                data['handle'] = handle
                data['source'] = f"AI ({self.model})"
                return data
        except:
            pass
        return self._heuristic_x_scan(handle)

    # --- Fallback Heuristics ---

    def _heuristic_email_scan(self, content: str, reason="Basic Heuristics") -> Dict:
        score = 0
        found = []
        c = content.lower()
        checks = ["urgent", "verify", "suspend", "bank", "password", "login", "winner", "click here"]
        for kw in checks:
            if kw in c:
                score += 15
                found.append(kw)
        
        score = min(score, 100)
        return {
            "risk_level": "High" if score > 60 else "Medium" if score > 30 else "Low",
            "risk_score": score,
            "flags": found,
            "analysis": f"Note: {reason}. Detected suspicious keywords.",
            "source": "AiGuard Internal Logic"
        }

    def _heuristic_link_scan(self, url: str) -> Dict:
        score = 20 if any(x in url.lower() for x in [".xyz", "free", "claim", "secure"]) else 0
        return {
            "url": url,
            "risk_level": "Low" if score == 0 else "Medium",
            "risk_score": score,
            "flags": ["Suspicious TLD/Pattern"] if score > 0 else [],
            "details": "Checking against internal malicious patterns.",
            "source": "AiGuard Internal Logic"
        }

    def _heuristic_x_scan(self, handle: str) -> Dict:
        return {
            "handle": handle,
            "suspension_risk": 40 if any(char.isdigit() for char in handle) else 10,
            "risk_factors": ["Heuristic analysis based on handle string"],
            "recommendation": "Maintain organic posting habits.",
            "source": "AiGuard Internal Logic"
        }

ai_security_service = AISecurityService()
