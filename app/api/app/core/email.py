import smtplib
from email.message import EmailMessage

from app.core.config import settings
from fastapi import HTTPException, status


def send_registration_otp(email: str, otp: str) -> None:
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD or not settings.EMAIL_FROM:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Email delivery is not configured. Please contact support.",
        )

    message = EmailMessage()
    message["Subject"] = f"{otp} is your REPSI verification code"
    message["From"] = f"REPSI <{settings.EMAIL_FROM}>" if "<" not in settings.EMAIL_FROM else settings.EMAIL_FROM
    message["To"] = email

    # Plain text fallback
    plain_text = (
        f"Your REPSI Verification Code: {otp}\n\n"
        f"Enter this 6-digit code to verify your account and continue your setup.\n"
        f"This code will expire in {settings.OTP_EXPIRE_MINUTES} minutes.\n\n"
        "Security Note: Never share this code with anyone. REPSI support will never ask for your verification code.\n\n"
        "If you did not request this code, you can safely ignore this email.\n"
    )
    message.set_content(plain_text)

    # Professional HTML template
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>REPSI Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04); overflow: hidden;">
          <!-- Header Branding -->
          <tr>
            <td style="padding: 32px 40px 24px 40px; text-align: left; border-bottom: 1px solid #F1F5F9;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="background-color: #16A34A; width: 36px; height: 36px; border-radius: 8px; text-align: center; vertical-align: middle;">
                    <span style="color: #FFFFFF; font-size: 20px; font-weight: 800; line-height: 36px; display: inline-block;">R</span>
                  </td>
                  <td style="padding-left: 12px;">
                    <span style="font-size: 20px; font-weight: 700; color: #0F172A; letter-spacing: -0.5px;">REPSI</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 40px 24px 40px;">
              <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0F172A; letter-spacing: -0.3px;">
                Verify your email address
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 24px; color: #475569;">
                Thank you for choosing REPSI. Use the verification code below to confirm your email and continue setting up your fitness business:
              </p>

              <!-- OTP Code Card -->
              <div style="background-color: #F0FDF4; border: 2px solid #86EFAC; border-radius: 12px; padding: 24px 20px; text-align: center; margin: 24px 0;">
                <span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #166534; margin-bottom: 8px;">
                  Your Verification Code
                </span>
                <div style="font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, Monaco, monospace; font-size: 38px; font-weight: 700; letter-spacing: 12px; color: #0F172A; padding: 4px 0 4px 12px; user-select: all; -webkit-user-select: all;">
                  {otp}
                </div>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #15803D;">
                  Double-click or press &amp; hold to copy
                </p>
              </div>

              <!-- Notice & Expiry -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 20px; background-color: #F8FAFC; border-radius: 8px; padding: 14px 16px;">
                <tr>
                  <td style="font-size: 13px; line-height: 20px; color: #64748B;">
                    ⏱ <strong>Expires in {settings.OTP_EXPIRE_MINUTES} minutes.</strong><br>
                    🛡️ <strong>Security reminder:</strong> Never share this code with anyone. REPSI team members will never ask for your verification code.
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 20px; color: #94A3B8;">
                If you did not initiate this request, you can safely disregard this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #F8FAFC; border-top: 1px solid #F1F5F9; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #94A3B8;">
                © 2026 REPSI. All rights reserved. The Modern Gym &amp; Fitness Operating System.
              </p>
              <p style="margin: 0; font-size: 12px; color: #94A3B8;">
                Questions? Visit <a href="https://repsi.app" style="color: #16A34A; text-decoration: none; font-weight: 500;">repsi.app</a> or reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""
    message.add_alternative(html_content, subtype="html")

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(message)
    except (OSError, smtplib.SMTPException) as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Unable to send verification email: {str(exc)}",
        ) from exc


def send_gym_invitation(
    email: str, name: str, role: str, gym_name: str, invite_url: str
) -> None:
    role_label = "trainer" if role.lower() == "trainer" else "member"
    subject = f"Invitation to join {gym_name} as a {role_label.capitalize()}"

    content = f"""Hello {name},

You've been invited to join {gym_name} as a {role_label}.
Accept your invitation and create your password to get started:

{invite_url}

If you did not expect this invitation, you can safely ignore this email.
"""

    if not settings.SMTP_USER or not settings.SMTP_PASSWORD or not settings.EMAIL_FROM:
        print(f"\n[DEV MODE EMAIL] Invitation to {email}:\n{content}\n")
        return

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = settings.EMAIL_FROM
    message["To"] = email
    message.set_content(content)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(message)
    except (OSError, smtplib.SMTPException) as exc:
        print(f"[SMTP Error] Failed to send email to {email}: {exc}")
        print(f"[DEV FALLBACK LINK] {invite_url}")


def send_direct_credentials_email(
    email: str, name: str, role: str, gym_name: str, password: str, login_url: str
) -> None:
    role_label = "trainer" if role.lower() == "trainer" else "member"
    subject = f"Welcome to {gym_name} — Your Account Access"

    content = f"""Hello {name},

You have been added to {gym_name} as a {role_label.capitalize()}.

Your account is now ready. For your security, passwords are never sent in plain text. Please log in to your account and finalize your profile:

{login_url}

If you ever need to set or update your password, use the 'Forgot Password' link on the login page.
"""

    if not settings.SMTP_USER or not settings.SMTP_PASSWORD or not settings.EMAIL_FROM:
        print(f"\n[DEV MODE EMAIL] Welcome notification to {email}:\n{content}\n")
        return

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = settings.EMAIL_FROM
    message["To"] = email
    message.set_content(content)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(message)
    except (OSError, smtplib.SMTPException) as exc:
        print(f"[SMTP Error] Failed to send notification email to {email}: {exc}")


def send_password_reset_email(
    email: str, name: str, reset_url: str
) -> None:
    subject = "Reset your REPSI account password"
    content = f"""Hello {name},

We received a request to set or reset your password for your REPSI account.

Click the link below to choose your new password:
{reset_url}

This link is valid for 1 hour. If you did not request this, you can safely ignore this email.
"""

    if not settings.SMTP_USER or not settings.SMTP_PASSWORD or not settings.EMAIL_FROM:
        print(f"\n[DEV MODE EMAIL] Password Reset to {email}:\n{content}\n")
        return

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = settings.EMAIL_FROM
    message["To"] = email
    message.set_content(content)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(message)
    except (OSError, smtplib.SMTPException) as exc:
        print(f"[SMTP Error] Failed to send password reset email to {email}: {exc}")


