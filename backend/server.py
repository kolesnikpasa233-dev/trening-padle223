from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class TimeSlot(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    time: str
    available: bool = True

class DaySchedule(BaseModel):
    model_config = ConfigDict(extra="ignore")
    date: str
    slots: List[TimeSlot]

class BookingCreate(BaseModel):
    name: str
    phone: str
    date: str
    time: str
    format_type: str

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    date: str
    time: str
    format_type: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    status: str = "confirmed"

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    text: str
    rating: int
    avatar: Optional[str] = None

# Generate schedule for next 14 days
def generate_schedule(days: int = 14) -> List[DaySchedule]:
    schedule = []
    base_times = [
        "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
        "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
    ]
    today = datetime.now(timezone.utc)
    
    for i in range(days):
        day = today + timedelta(days=i)
        date_str = day.strftime("%Y-%m-%d")
        slots = [
            TimeSlot(id=str(uuid.uuid4()), time=t, available=True)
            for t in base_times
        ]
        schedule.append(DaySchedule(date=date_str, slots=slots))
    
    return schedule

# Static reviews data
REVIEWS = [
    Review(id="1", name="Алексей К.", text="Отличное место! Пришёл новичком, уже через месяц играю регулярно. Атмосфера супер!", rating=5, avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"),
    Review(id="2", name="Мария С.", text="Записались с подругами на корпоратив — было весело! Обязательно вернёмся.", rating=5, avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"),
    Review(id="3", name="Дмитрий В.", text="Перешёл с тенниса — падл более динамичный и социальный. Рекомендую!", rating=5, avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"),
    Review(id="4", name="Елена П.", text="Тренер объяснил все правила за 10 минут. Теперь хожу каждую неделю.", rating=5, avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"),
]

# Routes
@api_router.get("/")
async def root():
    return {"message": "Padel Center API"}

@api_router.get("/schedule", response_model=List[DaySchedule])
async def get_schedule():
    # Check booked slots from DB
    schedule = generate_schedule()
    bookings = await db.bookings.find({}, {"_id": 0, "date": 1, "time": 1}).to_list(1000)
    booked_slots = {(b["date"], b["time"]) for b in bookings}
    
    for day in schedule:
        for slot in day.slots:
            if (day.date, slot.time) in booked_slots:
                slot.available = False
    
    return schedule

@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_data: BookingCreate):
    # Check if slot is available
    existing = await db.bookings.find_one({
        "date": booking_data.date,
        "time": booking_data.time
    }, {"_id": 0})
    
    if existing:
        raise HTTPException(status_code=400, detail="Этот слот уже занят")
    
    booking = Booking(
        name=booking_data.name,
        phone=booking_data.phone,
        date=booking_data.date,
        time=booking_data.time,
        format_type=booking_data.format_type
    )
    
    doc = booking.model_dump()
    await db.bookings.insert_one(doc)
    
    return booking

@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings():
    bookings = await db.bookings.find({}, {"_id": 0}).to_list(1000)
    return bookings

@api_router.get("/reviews", response_model=List[Review])
async def get_reviews():
    return REVIEWS

@api_router.get("/stats")
async def get_stats():
    bookings_count = await db.bookings.count_documents({})
    return {
        "players": 1247,
        "games_per_month": 234,
        "rating": 4.9,
        "bookings": bookings_count
    }

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
