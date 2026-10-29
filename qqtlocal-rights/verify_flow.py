import requests
import json
import time

BASE_URL = "http://localhost:8000/api"
PHONE = "15210334812"
CODE = "634462"

def main():
    # 1. Login
    print(f"[*] Logging in with {PHONE} / {CODE} ...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json={
            "phone": PHONE,
            "smsCode": CODE
        })
        data = resp.json()
        
        # Check success - backend might return status 1 or code 0
        # Based on previous tool output: {"status": "1", "msg": "...", "cookies": [...]}
        if str(data.get("status")) != "1" and data.get("code") != 0 and data.get("msg") != "成功":
            print(f"[!] Login failed: {data}")
            return

        print("[+] Login successful!")
        cookies_list = data.get("cookies", [])
        
        # Format cookies for subsequent requests (name=value; name=value)
        cookie_parts = []
        for c in cookies_list:
            cookie_parts.append(f"{c['name']}={c['value']}")
        cookies_text = "; ".join(cookie_parts)
        
        print(f"[*] Cookies obtained: {cookies_text[:50]}...")

        # 2. Get User Profile
        print("\n[*] Fetching User Profile...")
        resp = requests.post(f"{BASE_URL}/auth/user/profile", json={
            "cookies_text": cookies_text
        })
        print(f"[+] Profile Response: {resp.text[:200]}...")

        # 3. Get Product List
        print("\n[*] Fetching Product List...")
        resp = requests.post(f"{BASE_URL}/auth/products/list", json={
            "cookies_text": cookies_text
        })
        prods = resp.json()
        
        # Check prods structure
        prod_list = prods.get("data", {}).get("prodList", [])
        if not prod_list and "list" in prods:
             prod_list = prods["list"]

        if prod_list:
            print(f"[+] Found {len(prod_list)} products.")
            # Find ID 3442
            target = next((p for p in prod_list if str(p.get('prodId')) == "3442"), None)
            if target:
                print(f"[+] Found Target Product 3442: {target.get('prodName')}")
            else:
                print("[-] Target Product 3442 not found in list.")
        else:
            print(f"[?] Unexpected product response: {str(prods)[:100]}")

        # 4. Create Immediate Job (Rush Buy)
        print("\n[*] Triggering Rush Buy (Immediate Job)...")
        job_payload = {
            "name": f"Verify-Flow-{int(time.time())}",
            "cookies_text": cookies_text,
            "product_id": "3442",
            "executor": "python",
            "schedule_type": "immediate",
            "run_mode": "concurrent",
            "max_workers": 5,
            "poll_times": 5,
            "poll_interval_ms": 100
        }
        resp = requests.post(f"{BASE_URL}/jobs", json=job_payload)
        print(f"[+] Job Creation Response: {resp.json()}")

    except Exception as e:
        print(f"[!] Error: {e}")

if __name__ == "__main__":
    main()
