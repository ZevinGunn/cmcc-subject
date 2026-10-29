import requests
import json
import time

BASE_URL = "http://localhost:8000/api"
TOKEN = "b0a76a4f886f49ee9d1e6e371a660eb0"

def main():
    print(f"[*] Testing with Token: {TOKEN}")
    
    # 1. Manual Token Set
    print("\n[*] Setting Manual Token...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/manual/token", json={
            "accessToken": TOKEN
        })
        print(f"[+] Token Response: {resp.json()}")
        
        # Construct Cookie String
        cookies_text = f"access_token={TOKEN}"
        
        # 2. Get User Profile
        print("\n[*] Fetching User Profile...")
        resp = requests.post(f"{BASE_URL}/auth/user/profile", json={
            "cookies_text": cookies_text
        })
        
        # Print raw response for debug
        print(f"[+] Raw Response Status: {resp.status_code}")
        try:
            data = resp.json()
            print(f"[+] Profile Data: {json.dumps(data, indent=2, ensure_ascii=False)}")
            
            if data.get("msg") == "成功" or str(data.get("status")) == "1":
                user_data = data.get("data", {})
                print(f"\n[SUCCESS] User Info:")
                print(f"  Phone: {user_data.get('phone')}")
                print(f"  Level: {user_data.get('levelName')}")
                print(f"  Province: {user_data.get('province')}")
            else:
                print(f"\n[FAIL] API returned error: {data.get('msg')}")
                
        except Exception as e:
            print(f"[!] Failed to parse JSON: {resp.text}")

    except Exception as e:
        print(f"[!] Error: {e}")

if __name__ == "__main__":
    main()
