from fastapi import FastAPI, APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Mind Over Matter API")
api_router = APIRouter(prefix="/api")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------- Models ----------
class PostBase(BaseModel):
    slug: str
    title: str
    category: str
    excerpt: str
    cover: str
    date: str
    read_time: str = Field(..., alias="readTime")
    dek: Optional[str] = None
    featured: bool = False
    editors_pick: bool = Field(False, alias="editorsPick")
    body: Optional[str] = None
    order: int = 0

    class Config:
        populate_by_name = True


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    category: Optional[str] = None
    excerpt: Optional[str] = None
    cover: Optional[str] = None
    date: Optional[str] = None
    read_time: Optional[str] = Field(None, alias="readTime")
    dek: Optional[str] = None
    featured: Optional[bool] = None
    editors_pick: Optional[bool] = Field(None, alias="editorsPick")
    body: Optional[str] = None
    order: Optional[int] = None

    class Config:
        populate_by_name = True


class Post(PostBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso, alias="createdAt")

    class Config:
        populate_by_name = True


class SubscribeIn(BaseModel):
    email: EmailStr


class Subscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    source: str = "newsletter"
    created_at: str = Field(default_factory=now_iso, alias="createdAt")

    class Config:
        populate_by_name = True


class ContactIn(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    message: str


class Contact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: Optional[EmailStr] = None
    message: str
    created_at: str = Field(default_factory=now_iso, alias="createdAt")

    class Config:
        populate_by_name = True


# ---------- Helpers ----------
def post_out(doc: dict) -> dict:
    """Return camelCase-friendly response, strip Mongo _id."""
    if not doc:
        return doc
    doc = {k: v for k, v in doc.items() if k != "_id"}
    return {
        "id": doc.get("id"),
        "slug": doc.get("slug"),
        "title": doc.get("title"),
        "category": doc.get("category"),
        "excerpt": doc.get("excerpt"),
        "cover": doc.get("cover"),
        "date": doc.get("date"),
        "readTime": doc.get("read_time"),
        "dek": doc.get("dek"),
        "featured": bool(doc.get("featured", False)),
        "editorsPick": bool(doc.get("editors_pick", False)),
        "body": doc.get("body"),
        "order": doc.get("order", 0),
        "createdAt": doc.get("created_at"),
    }


# ---------- Seed data ----------
SEED_POSTS = [
    {
        "slug": "the-quiet-revolution",
        "category": "Mindset",
        "title": "The Quiet Revolution of Choosing Yourself",
        "dek": "On learning to trust your inner voice in a world that profits from your self-doubt — and the small daily rituals that rebuild the ground beneath your feet.",
        "excerpt": "There is a moment — usually a very ordinary Tuesday — when you realise you have been outsourcing your certainty. This is an essay about taking it back.",
        "cover": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&q=80",
        "date": "July 12, 2025",
        "read_time": "11 min read",
        "featured": True,
        "editors_pick": False,
        "order": 100,
    },
    {
        "slug": "silent-anxiety",
        "category": "Anxiety & Calm",
        "title": "Overcoming Silent Anxiety",
        "excerpt": "High-functioning anxiety is the socially acceptable panic — the kind that looks like ambition on the outside and static on the inside.",
        "cover": "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&q=80",
        "date": "July 08, 2025",
        "read_time": "7 min read",
        "featured": False,
        "editors_pick": False,
        "order": 90,
    },
    {
        "slug": "growth-mindset",
        "category": "Mindset",
        "title": "The Growth Mindset, Reconsidered",
        "excerpt": "How to shift from 'I can't' to 'How can I?' — without becoming insufferable about it at dinner parties.",
        "cover": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80",
        "date": "July 02, 2025",
        "read_time": "9 min read",
        "featured": False,
        "editors_pick": False,
        "order": 80,
    },
    {
        "slug": "self-love-discipline",
        "category": "Self-Study",
        "title": "Self-Love as a Kind of Discipline",
        "excerpt": "Why mental health starts with the quiet way you speak to yourself when nobody is listening.",
        "cover": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
        "date": "June 27, 2025",
        "read_time": "6 min read",
        "featured": False,
        "editors_pick": False,
        "order": 70,
    },
    {
        "slug": "morning-pages",
        "category": "Habits",
        "title": "On Morning Pages and Other Small Devotions",
        "excerpt": "The unglamorous rituals that hold a life together — and why the boring practices are usually the ones that work.",
        "cover": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
        "date": "June 20, 2025",
        "read_time": "5 min read",
        "featured": False,
        "editors_pick": False,
        "order": 60,
    },
    {
        "slug": "attention-economy",
        "category": "Culture",
        "title": "You Are Not a Notification",
        "excerpt": "Notes on reclaiming attention in an economy designed to fracture it, one buzz at a time.",
        "cover": "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=1200&q=80",
        "date": "June 14, 2025",
        "read_time": "8 min read",
        "featured": False,
        "editors_pick": False,
        "order": 50,
    },
    {
        "slug": "letter-to-younger-self",
        "category": "Letters",
        "title": "A Letter to the Woman I Was at Twenty-Two",
        "excerpt": "I would tell her the fear is data, not a verdict — and that most of what she is afraid of will simply become a story she tells later.",
        "cover": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
        "date": "June 06, 2025",
        "read_time": "4 min read",
        "featured": False,
        "editors_pick": False,
        "order": 40,
    },
    # Editor's Picks (sidebar) — no cover required for the list
    {
        "slug": "rewire-brain",
        "category": "Mindset",
        "title": "Rewiring the Brain, Gently",
        "excerpt": "Small, repeated acts of attention change the neural wiring more than any grand resolution ever will.",
        "cover": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
        "date": "May 30, 2025",
        "read_time": "6 min read",
        "featured": False,
        "editors_pick": True,
        "order": 30,
    },
    {
        "slug": "resilience-map",
        "category": "Self-Study",
        "title": "The Cartography of Resilience",
        "excerpt": "Resilience is not a trait you're born with — it's a map you draw, one recovered day at a time.",
        "cover": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&q=80",
        "date": "May 21, 2025",
        "read_time": "9 min read",
        "featured": False,
        "editors_pick": True,
        "order": 25,
    },
    {
        "slug": "boundaries-love",
        "category": "Letters",
        "title": "Boundaries Are a Love Language",
        "excerpt": "The most generous thing you can offer someone is a very clear picture of where you end.",
        "cover": "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=1200&q=80",
        "date": "May 12, 2025",
        "read_time": "5 min read",
        "featured": False,
        "editors_pick": True,
        "order": 20,
    },
    {
        "slug": "stillness-is-work",
        "category": "Habits",
        "title": "Stillness Is a Kind of Work",
        "excerpt": "Rest is not the absence of doing. It is a discipline in its own right — and one you have to practice.",
        "cover": "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&q=80",
        "date": "May 04, 2025",
        "read_time": "5 min read",
        "featured": False,
        "editors_pick": True,
        "order": 15,
    },
]


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Mind Over Matter API", "version": "1.0"}


@api_router.post("/seed")
async def seed_db():
    """Idempotent seed: only inserts posts whose slug doesn't exist yet."""
    inserted = 0
    for p in SEED_POSTS:
        existing = await db.posts.find_one({"slug": p["slug"]})
        if existing:
            continue
        post = {
            "id": str(uuid.uuid4()),
            "created_at": now_iso(),
            **p,
        }
        await db.posts.insert_one(post)
        inserted += 1
    total = await db.posts.count_documents({})
    return {"inserted": inserted, "total": total}


@api_router.get("/posts")
async def list_posts(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    editors_pick: Optional[bool] = Query(None, alias="editorsPick"),
    limit: int = 50,
):
    query: dict = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if editors_pick is not None:
        query["editors_pick"] = editors_pick

    cursor = db.posts.find(query).sort("order", -1).limit(limit)
    docs = await cursor.to_list(limit)
    return [post_out(d) for d in docs]


@api_router.get("/posts/featured")
async def get_featured():
    doc = await db.posts.find_one({"featured": True})
    if not doc:
        raise HTTPException(status_code=404, detail="No featured post")
    return post_out(doc)


@api_router.get("/posts/{slug}")
async def get_post(slug: str):
    doc = await db.posts.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    return post_out(doc)


@api_router.post("/posts", status_code=201)
async def create_post(payload: PostCreate):
    if await db.posts.find_one({"slug": payload.slug}):
        raise HTTPException(status_code=409, detail="Slug already exists")

    # If new post is featured, unset previous featured
    if payload.featured:
        await db.posts.update_many({"featured": True}, {"$set": {"featured": False}})

    doc = {
        "id": str(uuid.uuid4()),
        "created_at": now_iso(),
        "slug": payload.slug,
        "title": payload.title,
        "category": payload.category,
        "excerpt": payload.excerpt,
        "cover": payload.cover,
        "date": payload.date,
        "read_time": payload.read_time,
        "dek": payload.dek,
        "featured": payload.featured,
        "editors_pick": payload.editors_pick,
        "body": payload.body,
        "order": payload.order,
    }
    await db.posts.insert_one(doc)
    return post_out(doc)


@api_router.put("/posts/{post_id}")
async def update_post(post_id: str, payload: PostUpdate):
    existing = await db.posts.find_one({"id": post_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")

    updates = {}
    data = payload.model_dump(by_alias=False, exclude_none=True)
    # Map camelCase aliases handled by pydantic already produced snake_case field names
    for k, v in data.items():
        updates[k] = v

    if updates.get("featured") is True:
        await db.posts.update_many(
            {"featured": True, "id": {"$ne": post_id}},
            {"$set": {"featured": False}},
        )

    if updates:
        await db.posts.update_one({"id": post_id}, {"$set": updates})

    doc = await db.posts.find_one({"id": post_id})
    return post_out(doc)


@api_router.delete("/posts/{post_id}")
async def delete_post(post_id: str):
    result = await db.posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"deleted": True, "id": post_id}


# --------- Subscriptions ---------
@api_router.post("/subscribe", status_code=201)
async def subscribe(payload: SubscribeIn):
    email = payload.email.lower().strip()
    existing = await db.subscriptions.find_one({"email": email})
    if existing:
        return {"status": "already_subscribed", "email": email}
    sub = Subscription(email=email)
    await db.subscriptions.insert_one(sub.model_dump(by_alias=False))
    return {"status": "subscribed", "email": email, "id": sub.id}


@api_router.get("/subscribers")
async def list_subscribers():
    docs = await db.subscriptions.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


# --------- Contact ---------
@api_router.post("/contact", status_code=201)
async def contact(payload: ContactIn):
    doc = Contact(**payload.model_dump()).model_dump(by_alias=False)
    await db.contacts.insert_one(doc)
    return {"status": "received", "id": doc["id"]}


# Mount router + CORS
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def on_start():
    # Ensure indexes
    try:
        await db.posts.create_index("slug", unique=True)
        await db.subscriptions.create_index("email", unique=True)
    except Exception as e:
        logger.warning(f"Index creation warning: {e}")

    # Auto-seed if empty
    try:
        count = await db.posts.count_documents({})
        if count == 0:
            for p in SEED_POSTS:
                doc = {
                    "id": str(uuid.uuid4()),
                    "created_at": now_iso(),
                    **p,
                }
                await db.posts.insert_one(doc)
            logger.info(f"Seeded {len(SEED_POSTS)} posts on startup")
    except Exception as e:
        logger.warning(f"Auto-seed failed: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
