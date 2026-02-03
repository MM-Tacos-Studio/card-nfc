from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Request, Response
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import hashlib
import secrets
import httpx
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Profile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    profile_id: str
    name: str
    job: str
    phone: str
    whatsapp: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    linkedin: Optional[str] = None
    tiktok: Optional[str] = None
    youtube: Optional[str] = None
    photo_url: Optional[str] = None
    primary_color: str = "#3B82F6"
    secondary_color: str = "#8B5CF6"
    unique_link: str
    is_archived: bool = False
    subscription_start: datetime
    created_at: datetime
    updated_at: datetime

class ProfileCreate(BaseModel):
    name: str
    job: str
    phone: str
    whatsapp: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    linkedin: Optional[str] = None
    tiktok: Optional[str] = None
    youtube: Optional[str] = None
    photo_url: Optional[str] = None
    primary_color: str = "#3B82F6"
    secondary_color: str = "#8B5CF6"

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    job: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    linkedin: Optional[str] = None
    tiktok: Optional[str] = None
    youtube: Optional[str] = None
    photo_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain: str, hashed: str) -> bool:
    return hash_password(plain) == hashed

def generate_unique_link(name: str) -> str:
    clean_name = "".join(c.lower() if c.isalnum() else "-" for c in name)
    random_code = secrets.token_hex(4)
    return f"{clean_name}-{random_code}"

async def get_user_from_token(request: Request) -> Optional[User]:
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.replace("Bearer ", "")
    
    if not session_token:
        return None
    
    session_doc = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    
    if not session_doc:
        return None
    
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        return None
    
    user_doc = await db.users.find_one(
        {"user_id": session_doc["user_id"]},
        {"_id": 0}
    )
    
    if not user_doc:
        return None
    
    if isinstance(user_doc["created_at"], str):
        user_doc["created_at"] = datetime.fromisoformat(user_doc["created_at"])
    
    return User(**user_doc)

@api_router.post("/auth/register")
async def register(data: RegisterRequest, response: Response):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    hashed_pw = hash_password(data.password)
    
    user_doc = {
        "user_id": user_id,
        "email": data.email,
        "name": data.name,
        "password": hashed_pw,
        "picture": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    session_token = secrets.token_urlsafe(32)
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.user_sessions.insert_one(session_doc)
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7 * 24 * 60 * 60,
        path="/"
    )
    
    return {"session_token": session_token, "user": {"user_id": user_id, "email": data.email, "name": data.name}}

@api_router.post("/auth/login")
async def login(data: LoginRequest, response: Response):
    user_doc = await db.users.find_one({"email": data.email}, {"_id": 0})
    if not user_doc or not verify_password(data.password, user_doc.get("password", "")):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    session_token = secrets.token_urlsafe(32)
    session_doc = {
        "user_id": user_doc["user_id"],
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.user_sessions.insert_one(session_doc)
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7 * 24 * 60 * 60,
        path="/"
    )
    
    return {
        "session_token": session_token,
        "user": {
            "user_id": user_doc["user_id"],
            "email": user_doc["email"],
            "name": user_doc["name"],
            "picture": user_doc.get("picture")
        }
    }

@api_router.post("/auth/session")
async def exchange_session(request: Request, response: Response):
    session_id = request.headers.get("X-Session-ID")
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID manquant")
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Session invalide")
        
        oauth_data = resp.json()
    
    user_doc = await db.users.find_one({"email": oauth_data["email"]}, {"_id": 0})
    
    if user_doc:
        user_id = user_doc["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {
                "name": oauth_data["name"],
                "picture": oauth_data["picture"]
            }}
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user_doc = {
            "user_id": user_id,
            "email": oauth_data["email"],
            "name": oauth_data["name"],
            "picture": oauth_data["picture"],
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(user_doc)
    
    session_token = oauth_data["session_token"]
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.user_sessions.insert_one(session_doc)
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7 * 24 * 60 * 60,
        path="/"
    )
    
    final_user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    return {
        "session_token": session_token,
        "user": {
            "user_id": final_user["user_id"],
            "email": final_user["email"],
            "name": final_user["name"],
            "picture": final_user.get("picture")
        }
    }

@api_router.get("/auth/me")
async def get_current_user(request: Request):
    user = await get_user_from_token(request)
    if not user:
        raise HTTPException(status_code=401, detail="Non authentifié")
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie("session_token", path="/", samesite="none", secure=True)
    return {"message": "Déconnecté"}

@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_ext = Path(file.filename).suffix
    file_id = f"{uuid.uuid4().hex}{file_ext}"
    file_path = UPLOADS_DIR / file_id
    
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"url": f"/api/uploads/{file_id}"}

@api_router.get("/uploads/{file_id}")
async def get_upload(file_id: str):
    file_path = UPLOADS_DIR / file_id
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Fichier non trouvé")
    return FileResponse(file_path)

@api_router.post("/profiles", response_model=Profile)
async def create_profile(data: ProfileCreate, request: Request):
    user = await get_user_from_token(request)
    if not user:
        raise HTTPException(status_code=401, detail="Non authentifié")
    
    profile_id = f"profile_{uuid.uuid4().hex[:12]}"
    unique_link = generate_unique_link(data.name)
    
    existing = await db.profiles.find_one({"unique_link": unique_link})
    while existing:
        unique_link = generate_unique_link(data.name)
        existing = await db.profiles.find_one({"unique_link": unique_link})
    
    now = datetime.now(timezone.utc)
    profile_doc = {
        "profile_id": profile_id,
        "user_id": user.user_id,
        **data.model_dump(),
        "unique_link": unique_link,
        "is_archived": False,
        "subscription_start": now.isoformat(),
        "created_at": now.isoformat(),
        "updated_at": now.isoformat()
    }
    
    await db.profiles.insert_one(profile_doc)
    
    profile_doc["subscription_start"] = now
    profile_doc["created_at"] = now
    profile_doc["updated_at"] = now
    
    return Profile(**{k: v for k, v in profile_doc.items() if k != "_id"})

@api_router.get("/profiles", response_model=List[Profile])
async def get_profiles(request: Request, filter: Optional[str] = None):
    user = await get_user_from_token(request)
    if not user:
        raise HTTPException(status_code=401, detail="Non authentifié")
    
    query = {"user_id": user.user_id}
    
    if filter == "expiring":
        now = datetime.now(timezone.utc)
        expiry_threshold = now + timedelta(days=30)
        profiles = await db.profiles.find(query, {"_id": 0}).to_list(1000)
        filtered_profiles = []
        for p in profiles:
            sub_start = p["subscription_start"]
            if isinstance(sub_start, str):
                sub_start = datetime.fromisoformat(sub_start)
            if sub_start.tzinfo is None:
                sub_start = sub_start.replace(tzinfo=timezone.utc)
            next_renewal = sub_start + timedelta(days=365)
            if now < next_renewal <= expiry_threshold and not p.get("is_archived", False):
                filtered_profiles.append(p)
        profiles = filtered_profiles
    elif filter == "archived":
        query["is_archived"] = True
        profiles = await db.profiles.find(query, {"_id": 0}).to_list(1000)
    else:
        profiles = await db.profiles.find(query, {"_id": 0}).to_list(1000)
    
    for p in profiles:
        for date_field in ["subscription_start", "created_at", "updated_at"]:
            if isinstance(p[date_field], str):
                p[date_field] = datetime.fromisoformat(p[date_field])
    
    return [Profile(**p) for p in profiles]

@api_router.get("/profiles/public/{unique_link}")
async def get_public_profile(unique_link: str):
    profile_doc = await db.profiles.find_one({"unique_link": unique_link}, {"_id": 0})
    if not profile_doc:
        raise HTTPException(status_code=404, detail="Profil non trouvé")
    
    for date_field in ["subscription_start", "created_at", "updated_at"]:
        if isinstance(profile_doc[date_field], str):
            profile_doc[date_field] = datetime.fromisoformat(profile_doc[date_field])
    
    return Profile(**profile_doc)

@api_router.get("/profiles/{profile_id}", response_model=Profile)
async def get_profile(profile_id: str, request: Request):
    user = await get_user_from_token(request)
    if not user:
        raise HTTPException(status_code=401, detail="Non authentifié")
    
    profile_doc = await db.profiles.find_one(
        {"profile_id": profile_id, "user_id": user.user_id},
        {"_id": 0}
    )
    
    if not profile_doc:
        raise HTTPException(status_code=404, detail="Profil non trouvé")
    
    for date_field in ["subscription_start", "created_at", "updated_at"]:
        if isinstance(profile_doc[date_field], str):
            profile_doc[date_field] = datetime.fromisoformat(profile_doc[date_field])
    
    return Profile(**profile_doc)

@api_router.put("/profiles/{profile_id}", response_model=Profile)
async def update_profile(profile_id: str, data: ProfileUpdate, request: Request):
    user = await get_user_from_token(request)
    if not user:
        raise HTTPException(status_code=401, detail="Non authentifié")
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
    
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.profiles.update_one(
        {"profile_id": profile_id, "user_id": user.user_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Profil non trouvé")
    
    profile_doc = await db.profiles.find_one({"profile_id": profile_id}, {"_id": 0})
    
    for date_field in ["subscription_start", "created_at", "updated_at"]:
        if isinstance(profile_doc[date_field], str):
            profile_doc[date_field] = datetime.fromisoformat(profile_doc[date_field])
    
    return Profile(**profile_doc)

@api_router.patch("/profiles/{profile_id}/archive")
async def toggle_archive(profile_id: str, request: Request):
    user = await get_user_from_token(request)
    if not user:
        raise HTTPException(status_code=401, detail="Non authentifié")
    
    profile_doc = await db.profiles.find_one(
        {"profile_id": profile_id, "user_id": user.user_id},
        {"_id": 0}
    )
    
    if not profile_doc:
        raise HTTPException(status_code=404, detail="Profil non trouvé")
    
    new_status = not profile_doc.get("is_archived", False)
    
    await db.profiles.update_one(
        {"profile_id": profile_id},
        {"$set": {"is_archived": new_status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"is_archived": new_status}

@api_router.get("/profiles/{profile_id}/vcard")
async def generate_vcard(profile_id: str, request: Request):
    profile_doc = await db.profiles.find_one({"profile_id": profile_id}, {"_id": 0})
    if not profile_doc:
        raise HTTPException(status_code=404, detail="Profil non trouvé")
    
    vcard_lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        f"FN:{profile_doc['name']}",
        f"TITLE:{profile_doc['job']}",
        f"TEL;TYPE=CELL:{profile_doc['phone']}"
    ]
    
    if profile_doc.get("email"):
        vcard_lines.append(f"EMAIL:{profile_doc['email']}")
    
    if profile_doc.get("website"):
        vcard_lines.append(f"URL:{profile_doc['website']}")
    
    if profile_doc.get("address"):
        vcard_lines.append(f"ADR:;;{profile_doc['address']};;;;")
    
    vcard_lines.append("END:VCARD")
    
    vcard_content = "\n".join(vcard_lines)
    
    vcard_path = UPLOADS_DIR / f"{profile_id}.vcf"
    with vcard_path.open("w", encoding="utf-8") as f:
        f.write(vcard_content)
    
    return FileResponse(
        vcard_path,
        media_type="text/vcard",
        filename=f"{profile_doc['name']}.vcf"
    )

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()