from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db import users
from db import users, healthdata

app = FastAPI()

# ⭐⭐⭐ ADD THIS EXACT BLOCK BELOW ⭐⭐⭐
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     # <— allow frontend
    allow_credentials=True,
    allow_methods=["*"],     # <— POST, GET, PUT allowed
    allow_headers=["*"],     # <— allow JSON headers
)

class HealthData(BaseModel):
    username: str
    heartrate: list
    oxygen: list
    steps: list
    sleep: list
    stress: list
    temperature: list

@app.get("/health-data")
def get_health_data(username: str):
    data = healthdata.find_one({"username": username}, {"_id": 0})
    if data:
        return {"success": True, "data": data}

    return {"success": False, "message": "No data found for user"}

@app.post("/update-health-data")
def update_health_data(data: HealthData):
    healthdata.update_one(
        {"username": data.username},
        {"$set": data.dict()},
        upsert=True
    )
    return {"success": True}


# ⭐⭐⭐ ABOVE BLOCK IS MOST IMPORTANT ⭐⭐⭐
# ----------------- MODELS -----------------
class Signup(BaseModel):
    username: str
    password: str

class Login(BaseModel):
    username: str
    password: str

# ----------------- ROUTES -----------------
@app.post("/signup")
def signup(data: Signup):
    if users.find_one({"username": data.username}):
        return {"success": False, "message": "User already exists"}

    users.insert_one({"username": data.username, "password": data.password})
    return {"success": True}


@app.post("/login")
def login(data: Login):
    try:
        user = users.find_one({
            "username": data.username,
            "password": data.password
        })

        if user:
            return {"success": True}

        return {"success": False, "message": "Invalid credentials"}

    except Exception as e:
        return {"success": False, "error": str(e)}

