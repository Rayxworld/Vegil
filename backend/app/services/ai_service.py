import os
import requests
import base64
from typing import Dict, List
import json
import re
from urllib.parse import urlparse

class AISecurityService:
    """
    Enhanced AI Security Service with improved phishing detection
    """
    
    def __init__(self):
        self.openrouter_api_key = os.getenv("OPENROUTER_API_KEY", "")
        self.virustotal_api_key = os.getenv("VIRUSTOTAL_API_KEY", "")
        self.openrouter_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.1-8b-instruct:free")
        self.MAX_EMAIL_CHARS = 2000
        
        # Known brand domains for typosquatting detection
        self.known_brands = [
            'paypal', 'google', 'facebook', 'amazon', 'apple', 'microsoft',
            'netflix', 'instagram', 'twitter', 'linkedin', 'walmart', 'ebay',
            'chase', 'bankofamerica', 'wellsfargo', 'citibank', 'amex',
            'coinbase', 'binance', 'metamask', 'opensea'
        ]
    
    async def scan_email(self, content: str) -> Dict:
        """Analyze emails using OpenRouter AI"""
        if not self.openrouter_api_key:
            return self._heuristic_email_scan(content)
        
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
                "max_tokens": 300
            }
            
            response = requests.post(self.openrouter_url, headers=headers, json=payload, timeout=15)
            
            if response.status_code == 200:
                ai_text = response.json()['choices'][0]['message']['content']
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
        """Enhanced URL analysis with better phishing detection"""
        # First check with advanced heuristics
        heuristic_result = self._enhanced_link_scan(url)
        
        # If heuristics detect high risk, return immediately
        if heuristic_result['risk_score'] >= 60:
            return heuristic_result
        
        # Otherwise try VirusTotal if available
        if self.virustotal_api_key:
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
                    
                    # Combine with heuristic score
                    combined_score = max(risk_score, heuristic_result['risk_score'])
                    
                    level = "Low"
                    if combined_score > 75: level = "Critical"
                    elif combined_score > 50: level = "High"
                    elif combined_score > 25: level = "Medium"

                    all_flags = heuristic_result['flags'].copy()
                    if malicious > 0:
                        all_flags.append(f"{malicious} security vendors flagged as malicious")

                    return {
                        "url": url,
                        "risk_level": level,
                        "risk_score": combined_score,
                        "flags": all_flags,
                        "details": attr.get("title", heuristic_result['details']),
                        "source": "VirusTotal + AiGuard Intelligence"
                    }
            except Exception as e:
                print(f"VirusTotal Error: {e}")
        
        return heuristic_result

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

    # --- Enhanced Heuristics ---

    def _enhanced_link_scan(self, url: str) -> Dict:
        """Advanced phishing and malicious URL detection"""
        score = 0
        flags = []
        
        try:
            parsed = urlparse(url.lower())
            domain = parsed.netloc or parsed.path.split('/')[0]
            
            # Remove www. prefix for analysis
            domain = domain.replace('www.', '')
            
            # 1. Typosquatting Detection (CRITICAL)
            for brand in self.known_brands:
                if brand in domain and domain != f"{brand}.com":
                    # Check for common substitutions
                    if self._is_typosquatting(domain, brand):
                        score += 80
                        flags.append(f"⚠️ TYPOSQUATTING: Impersonating '{brand}'")
                        break
            
            # 2. Suspicious TLDs
            suspicious_tlds = ['.xyz', '.tk', '.ml', '.ga', '.cf', '.top', '.work', 
                              '.click', '.link', '.download', '.zip', '.review']
            if any(domain.endswith(tld) for tld in suspicious_tlds):
                score += 30
                flags.append("Suspicious domain extension")
            
            # 3. IP Address instead of domain
            if re.match(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', domain):
                score += 50
                flags.append("Using IP address instead of domain name")
            
            # 4. Excessive subdomains
            subdomain_count = domain.count('.')
            if subdomain_count > 3:
                score += 25
                flags.append(f"Suspicious number of subdomains ({subdomain_count})")
            
            # 5. URL shorteners (potential masking)
            shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'short.link']
            if any(s in domain for s in shorteners):
                score += 20
                flags.append("URL shortener detected (destination hidden)")
            
            # 6. Homograph attack (Unicode tricks)
            if not domain.isascii():
                score += 60
                flags.append("Non-ASCII characters (possible homograph attack)")
            
            # 7. Suspicious keywords in URL
            phishing_keywords = ['secure', 'account', 'verify', 'login', 'update', 
                                'banking', 'confirm', 'suspended', 'locked']
            for keyword in phishing_keywords:
                if keyword in url.lower():
                    score += 15
                    flags.append(f"Suspicious keyword: '{keyword}'")
            
            # 8. Very long domain names (often used in phishing)
            if len(domain) > 40:
                score += 20
                flags.append("Unusually long domain name")
            
            # 9. Multiple dashes (common in phishing)
            if domain.count('-') > 2:
                score += 15
                flags.append("Multiple hyphens in domain")
            
        except Exception as e:
            print(f"URL parsing error: {e}")
        
        score = min(score, 100)
        
        level = "Low"
        if score > 70: level = "Critical"
        elif score > 50: level = "High"
        elif score > 30: level = "Medium"
        
        details = "Safe to proceed" if score < 30 else \
                 "Exercise extreme caution - likely phishing attempt" if score > 70 else \
                 "Proceed with caution and verify authenticity"
        
        return {
            "url": url,
            "risk_level": level,
            "risk_score": score,
            "flags": flags if flags else ["No suspicious patterns detected"],
            "details": details,
            "source": "AiGuard Enhanced Intelligence"
        }

    def _is_typosquatting(self, domain: str, brand: str) -> bool:
        """Detect common typosquatting techniques"""
        # Remove .com, .net, etc. for comparison
        domain_base = domain.split('.')[0]
        
        # Common substitutions
        substitutions = {
            'o': '0', 'i': '1', 'l': '1', 'a': '@', 
            'e': '3', 's': '5', 'g': '9', 'b': '8'
        }
        
        # Check character substitutions
        for char, substitute in substitutions.items():
            if brand.replace(char, substitute) == domain_base:
                return True
        
        # Check extra/missing characters
        if len(domain_base) == len(brand) and \
           sum(c1 != c2 for c1, c2 in zip(domain_base, brand)) <= 2:
            return True
        
        # Check if brand is substring with additions
        if brand in domain_base and domain_base != brand:
            return True
            
        return False

    def _heuristic_email_scan(self, content: str, reason="Basic Heuristics") -> Dict:
        score = 0
        found = []
        c = content.lower()
        checks = ["urgent", "verify", "suspend", "bank", "password", "login", 
                 "winner", "click here", "act now", "confirm your", "unusual activity"]
        for kw in checks:
            if kw in c:
                score += 12
                found.append(kw)
        
        score = min(score, 100)
        level = "Critical" if score > 70 else "High" if score > 50 else "Medium" if score > 30 else "Low"
        
        return {
            "risk_level": level,
            "risk_score": score,
            "flags": found if found else ["No obvious phishing patterns"],
            "analysis": f"{reason}. Detected {len(found)} suspicious pattern(s).",
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