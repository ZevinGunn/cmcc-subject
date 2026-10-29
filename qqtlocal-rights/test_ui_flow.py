import requests
import json

BASE_URL = "http://localhost:8000/api"
TOKEN = "b0a76a4f886f49ee9d1e6e371a660eb0"

def test_config_update():
    print(f"[*] Testing with Token: {TOKEN}")
    
    # 1. Login/Validate User
    print("\n[*] 1. Validating User...")
    resp = requests.post(f"{BASE_URL}/auth/user/profile", json={
        "cookies_text": f"access_token={TOKEN}"
    })
    print(f"[+] User Profile: {resp.status_code}")
    if resp.json().get("msg") != "成功":
        print("[!] Login failed")
        return

    # 2. Simulate Frontend Logic: Create Job with Custom Config
    print("\n[*] 2. Creating Job with Custom Config...")
    job_payload = {
        "name": "每日自动抢购",
        "cookies_text": f"access_token={TOKEN}",
        "product_id": "3442",
        "executor": "python",
        "schedule_type": "cron",
        "cron": {
            "hour": "9",
            "minute": "59",
            "second": "59",
            "day": "*",
            "month": "*",
            "day_of_week": "*"
        },
        "start_delay_ms": 850,
        "run_mode": "concurrent",
        "max_workers": 5,
        "poll_times": 5,
        "poll_interval_ms": 50
    }
    
    # Clean old jobs first (Simulating UI logic)
    jobs = requests.get(f"{BASE_URL}/jobs").json()
    for j in jobs:
        if j['name'] == "每日自动抢购":
            requests.delete(f"{BASE_URL}/jobs/{j['job_id']}")
            print(f"[-] Deleted old job: {j['job_id']}")
            
    # Create new
    resp = requests.post(f"{BASE_URL}/jobs", json=job_payload)
    print(f"[+] Create Job Response: {resp.status_code}")
    print(f"[+] Job ID: {resp.json().get('job_id')}")
    
    # 3. Verify Job Config
    print("\n[*] 3. Verifying Job List...")
    jobs = requests.get(f"{BASE_URL}/jobs").json()
    my_job = next((j for j in jobs if j['name'] == "每日自动抢购"), None)
    if my_job:
        print(f"[SUCCESS] Job Found: {my_job['job_id']}")
        print(f"  - Schedule: {my_job['schedule_type']}")
        print(f"  - Next Run: {my_job.get('next_run_time')}")
    else:
        print("[FAIL] Job not found in list")

if __name__ == "__main__":
    test_config_update()
