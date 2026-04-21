from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from core.config import Settings


security = HTTPBearer()

def verify_token(token=Depends(security)):
    payload = jwt.decode(token.credentials, Settings.SECRET_KEY, algorithms=["HS256"])
    return payload

def get_current_user(token=Depends(security)):
    try:
        payload = jwt.decode(
            token.credentials,
            Settings.SECRET_KEY,
            algorithms=[Settings.ALGORITHM]
        )
        return payload
    except:
        raise HTTPException(status_code=401, detail="Token inválido")