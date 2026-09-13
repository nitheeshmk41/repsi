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
