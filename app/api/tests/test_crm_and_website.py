import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_razorpay_and_crm_and_website_builder():
    # 1. Register Owner 1 (Alpha Gym)
    res_1 = client.post("/api/v1/auth/register", json={
        "full_name": "CRM Owner Alpha",
        "email": "crm.alpha@test.com",
        "password": "Password123!",
        "gym_name": "Alpha Elite Fitness",
        "gym_phone": "+91 99887 11111",
        "gym_city": "Bangalore",
    })
    assert res_1.status_code == 201, res_1.text
    token_1 = res_1.json()["access_token"]
    ws_1 = res_1.json()["workspace_id"]
    headers_1 = {"Authorization": f"Bearer {token_1}"}

    # 2. Register Owner 2 (Beta Gym)
    res_2 = client.post("/api/v1/auth/register", json={
        "full_name": "CRM Owner Beta",
        "email": "crm.beta@test.com",
        "password": "Password123!",
        "gym_name": "Beta Cross Gym",
        "gym_phone": "+91 99887 22222",
        "gym_city": "Chennai",
    })
    assert res_2.status_code == 201, res_2.text
    token_2 = res_2.json()["access_token"]
    ws_2 = res_2.json()["workspace_id"]
    headers_2 = {"Authorization": f"Bearer {token_2}"}

    # ==========================
    # RAZORPAY PAYMENT TESTS
    # ==========================
    # Create order
    order_res = client.post("/api/v1/payments/razorpay/create-order", headers=headers_1, json={
        "amount": 2999.0,
        "currency": "INR",
        "receipt": "rcpt_test_001",
        "notes": {"plan": "Annual Growth"}
    })
    assert order_res.status_code == 200, order_res.text
    order_data = order_res.json()
    assert "order_id" in order_data
    assert order_data["amount_paisa"] == 299900
    assert order_data["amount"] == 2999.0

    # Verify signature
    verify_res = client.post("/api/v1/payments/razorpay/verify", headers=headers_1, json={
        "razorpay_order_id": order_data["order_id"],
        "razorpay_payment_id": "pay_mock_123456",
        "razorpay_signature": "MOCK_VERIFIED_SIGNATURE",
        "amount": 2999.0,
        "notes": {"plan": "Annual Growth"}
    })
    assert verify_res.status_code == 200, verify_res.text
    assert verify_res.json()["verified"] is True

    # ==========================
    # CRM LEAD LIFECYCLE TESTS
    # ==========================
    # Create Lead for Alpha
    lead_res = client.post("/api/v1/crm/leads", headers=headers_1, json={
        "full_name": "Kavita Rao",
        "phone": "+91 98765 43210",
        "email": "kavita@example.com",
        "lead_source": "Instagram",
        "interested_plan": "Strength & Conditioning",
        "priority": "High",
        "expected_value": 15000.0,
        "notes": "Looking for weight loss guidance."
    })
    assert lead_res.status_code == 201, lead_res.text
    lead_a = lead_res.json()
    lead_id = lead_a["id"]
    assert lead_a["full_name"] == "Kavita Rao"
    assert lead_a["status"].lower() == "new"

    # Move along pipeline: New -> Contacted -> Visit Scheduled
    status_res = client.patch(f"/api/v1/crm/leads/{lead_id}/status", headers=headers_1, json={
        "status": "Contacted",
        "note": "Spoke via WhatsApp, scheduled visit for Saturday"
    })
    assert status_res.status_code == 200
    assert status_res.json()["status"].lower() == "contacted"

    # Add a follow-up
    followup_res = client.post("/api/v1/crm/follow-ups", headers=headers_1, json={
        "lead_id": lead_id,
        "follow_up_type": "WhatsApp",
        "scheduled_date": "2026-09-20",
        "notes": "Remind about trial session"
    })
    assert followup_res.status_code == 201, followup_res.text

    # Pipeline stages
    pipeline_res = client.get("/api/v1/crm/pipeline", headers=headers_1)
    assert pipeline_res.status_code == 200
    pipeline = pipeline_res.json()
    contacted_stage = next((s for s in pipeline if s["stage"].lower() == "contacted"), None)
    assert contacted_stage is not None
    assert contacted_stage["count"] >= 1

    # CRM Dashboard metrics
    dash_res = client.get("/api/v1/crm/dashboard", headers=headers_1)
    assert dash_res.status_code == 200
    metrics = dash_res.json()
    assert metrics["total_leads"] >= 1
    assert metrics["contacted_leads"] >= 1

    # Convert Lead to Member (Should create member or link cleanly)
    convert_res = client.post(f"/api/v1/crm/leads/{lead_id}/convert", headers=headers_1, json={
        "plan_name": "Strength & Conditioning",
        "amount_paid": 15000.0,
        "payment_method": "upi"
    })
    assert convert_res.status_code == 200, convert_res.text
    assert convert_res.json()["lead_status"] == "converted"
    member_id = convert_res.json()["converted_member_id"]
    assert member_id is not None

    # Idempotent/Duplicate member check: Try converting another lead with the same phone/email
    lead2_res = client.post("/api/v1/crm/leads", headers=headers_1, json={
        "full_name": "Kavita Rao Duplicate",
        "phone": "+91 98765 43210",
        "email": "kavita@example.com",
        "lead_source": "Referral",
        "priority": "Medium"
    })
    lead2_id = lead2_res.json()["id"]
    convert2_res = client.post(f"/api/v1/crm/leads/{lead2_id}/convert", headers=headers_1, json={})
    assert convert2_res.status_code == 200
    # Must link to the EXISTING member, not create a duplicate
    assert convert2_res.json()["converted_member_id"] == member_id

    # Check At-Risk endpoint
    at_risk_res = client.get("/api/v1/crm/at-risk", headers=headers_1)
    assert at_risk_res.status_code == 200
    assert isinstance(at_risk_res.json(), list)

    # Multi-tenant isolation: Owner 2 (Beta) cannot see Alpha's lead or pipeline
    beta_leads = client.get("/api/v1/crm/leads", headers=headers_2).json()
    assert beta_leads["total"] == 0
    beta_access = client.get(f"/api/v1/crm/leads/{lead_id}", headers=headers_2)
    assert beta_access.status_code == 404

    # ==========================
    # WEBSITE BUILDER TESTS
    # ==========================
    # 1. Get or initialize Alpha's website
    site_res = client.get("/api/v1/websites/my-website", headers=headers_1)
    assert site_res.status_code == 200, site_res.text
    site_data = site_res.json()
    assert site_data["subdomain"] is not None
    assert site_data["is_published"] is False

    # 2. Update website content, theme, and 6 templates
    update_res = client.patch("/api/v1/websites/my-website", headers=headers_1, json={
        "template": "Performance",
        "headline": "Transform Your Physique with Alpha Elite",
        "primary_color": "#E11D48",
        "phone": "+91 99887 11111",
        "email": "info@alphaelite.com",
        "sections": {
            "hero": True,
            "about": True,
            "services": True,
            "memberships": True,
            "trainers": True,
            "contact": True
        }
    })
    assert update_res.status_code == 200, update_res.text
    assert update_res.json()["template"] == "Performance"
    assert update_res.json()["primary_color"] == "#E11D48"

    # 3. Connect custom domain
    domain_res = client.post("/api/v1/websites/my-website/domain", headers=headers_1, json={
        "custom_domain": "alphaelite.com"
    })
    assert domain_res.status_code == 200
    domain_info = domain_res.json()
    assert domain_info["custom_domain"] == "alphaelite.com"
    assert domain_info["cname_value"] == "sites.repsi.app"

    # Verify domain
    verify_domain_res = client.post("/api/v1/websites/my-website/verify-domain", headers=headers_1)
    assert verify_domain_res.status_code == 200
    assert verify_domain_res.json()["ssl_status"] == "Active"

    # 4. Publish website
    pub_res = client.post("/api/v1/websites/my-website/publish", headers=headers_1)
    assert pub_res.status_code == 200
    assert pub_res.json()["is_published"] is True
    subdomain = pub_res.json()["subdomain"]

    # 5. Public Website Runtime (Unauthenticated)
    public_res = client.get(f"/api/v1/websites/public/{subdomain}")
    assert public_res.status_code == 200, public_res.text
    pub_data = public_res.json()
    assert pub_data["gym_name"] == "Alpha Elite Fitness"
    assert pub_data["headline"] == "Transform Your Physique with Alpha Elite"
    assert pub_data["template"] == "Performance"

    # 6. Public visitor submits lead form on the website
    lead_submit_res = client.post(f"/api/v1/websites/public/{subdomain}/lead", json={
        "name": "Rohan Verma",
        "phone": "+91 97777 66666",
        "email": "rohan@visitor.com",
        "interested_plan": "Performance Conditioning",
        "message": "Interested in morning personal training sessions."
    })
    assert lead_submit_res.status_code in (200, 201), lead_submit_res.text
    assert lead_submit_res.json()["status"] == "success"

    # Verify that lead automatically landed in Alpha's CRM
    alpha_leads_res = client.get("/api/v1/crm/leads", headers=headers_1)
    assert alpha_leads_res.status_code == 200
    alpha_leads = alpha_leads_res.json()["items"]
    website_lead = next((l for l in alpha_leads if l["phone"] == "+91 97777 66666"), None)
    assert website_lead is not None
    assert website_lead["lead_source"] == "Website"
    assert website_lead["full_name"] == "Rohan Verma"

    # Multi-tenant isolation for website: Beta cannot access or modify Alpha's site
    beta_site = client.get("/api/v1/websites/my-website", headers=headers_2).json()
    assert beta_site["workspace_id"] == ws_2
    assert beta_site["subdomain"] != subdomain
