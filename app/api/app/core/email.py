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
    message["Subject"] = "Your REPSI verification code"
    message["From"] = settings.EMAIL_FROM
    message["To"] = email
    message.set_content(
        f"Your REPSI verification code is {otp}. It expires in "
        f"{settings.OTP_EXPIRE_MINUTES} minutes. If you did not request this, "
        "you can safely ignore this email."
    )

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(message)
    except (OSError, smtplib.SMTPException) as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to send the verification email. Please try again.",
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
    subject = f"Welcome to {gym_name} - Your Account Credentials"

    content = f"""Hello {name},

You have been added to {gym_name} as a {role_label.capitalize()}.

Your account has been provisioned. Here are your login credentials:

Email: {email}
Password: {password}

Log in to your dashboard here:
{login_url}

Please change your password after your initial login for security.
"""

    if not settings.SMTP_USER or not settings.SMTP_PASSWORD or not settings.EMAIL_FROM:
        print(f"\n[DEV MODE EMAIL] Direct Credentials to {email}:\n{content}\n")
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
        print(f"[SMTP Error] Failed to send credentials email to {email}: {exc}")


