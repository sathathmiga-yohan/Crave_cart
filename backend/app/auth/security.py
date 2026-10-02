# JWT token எப்ப expire ஆகணும் என்று calculate பண்ண இது தேவை.
from datetime import datetime, timedelta, timezone

# இது JWT token create + decode பண்ண. 
import jwt

# Depends-FastAPI dependency system.db: Session = Depends(get_db)-இந்த function-க்கு database session வேண்டும்; get_db() மூலம் கொடு.
# HTTPException-Error response
# status-HTTP status codes
from fastapi import Depends, HTTPException, status

# Protected endpoint-க்கு request வரும்போது Bearer token எடுக்க இது உதவும்.
from fastapi.security import OAuth2PasswordBearer

# User password-ஐ plain text-ஆ database-ல் store பண்ணக்கூடாது. so use panra
from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.user import User, UserRole


# PASSWORD HASHING
# Password-ஐ secure-ah hash பண்ணவும், பின்னர் verify பண்ணவும் ஒரு password-hashing object/tool உருவாக்குறோம்.
password_hash = PasswordHash.recommended()

# User register பண்ணும்போது password-ஐ மறைச்சு database-ல் வைக்கிறது.
def hash_password(password: str) -> str:
    return password_hash.hash(password)

# User login பண்ணும்போது கொடுத்த password சரியா என்று பார்க்கிறது.
def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:

    return password_hash.verify(
        plain_password,
        hashed_password
    )


# OAUTH2
# User request அனுப்பும்போது அவர் அனுப்புற JWT token-ஐ எடுத்துத் தருவது
oauth2_scheme = OAuth2PasswordBearer(

# "Token வாங்குவதற்கான login endpoint /auth/login."
    tokenUrl="/auth/login"
)


# CREATE ACCESS TOKEN
# User login successful ஆனதும் அவருக்கு ஒரு JWT token உருவாக்கிக் கொடுப்பது.
def create_access_token(user_id: int) -> str:

# Token எப்ப expire ஆகணும்?
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
# pay load nna Token-க்குள் வைக்க வேண்டிய information.
    payload = {
        "sub": str(user_id),
        "exp": expire
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
#  ஒரே sentence-ல்: create_access_token() = login ஆன user யார் + token எப்ப expire ஆகணும் என்ற தகவலை வைத்து JWT access token உருவாக்கும் function.


# DECODE ACCESS TOKEN

def decode_access_token(token: str) -> int:

    try:

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )

        return int(user_id)

    except (jwt.InvalidTokenError, ValueError):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )


# GET CURRENT USER

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:

    user_id = decode_access_token(token)

    user = db.scalar(
        select(User).where(
            User.id == user_id
        )
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )

    return user


# REQUIRE ADMIN

def require_admin(
    current_user: User = Depends(get_current_user)
) -> User:

    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return current_user