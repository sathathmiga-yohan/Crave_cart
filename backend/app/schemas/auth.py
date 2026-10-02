# User login successful ஆனதும் backend JWT token return பண்ணும்:
from pydantic import BaseModel


# TOKEN RESPONSE SCHEMA

class TokenResponse(BaseModel):

    access_token: str
    token_type: str = "bearer"

# inka en login schema illa?#

# naanka fastAPI la OAuth2PasswordRequestForm use panni login request handle pannurom. So, login schema create panna vendiyathu illa.