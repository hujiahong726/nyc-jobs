from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import aiosqlite
from app.db import get_db, life_span


app = FastAPI(title="NYC Jobs API", lifespan=life_span)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"ok": True}

@app.get("/api/jobs")
async def jobs(page:int = Query(1, ge=1), 
               page_size:int = Query(10, le=50), 
               db:aiosqlite.Connection = Depends(get_db)):
    offset = (page - 1) * page_size

    async with db.execute(
        "SELECT * FROM jobs ORDER BY id LIMIT ? OFFSET ?", 
        (page_size, offset),
    ) as cursor:
        rows = await cursor.fetchall()

    async with db.execute("SELECT COUNT(*) FROM jobs") as cursor:
        total = (await cursor.fetchone())[0]
    
    total_pages = (total + page_size - 1) // page_size

    return {
        "items": [dict(r) for r in rows],
        "total": total,
        "page": page,
        "total_pages": total_pages,
        "page_size": page_size
    }

@app.get("/api/jobs/{job_id}")
async def get_job(job_id: int, db:aiosqlite.Connection = Depends(get_db)):
    async with db.execute("SELECT * FROM jobs WHERE id = ?", [job_id]) as cursor:
        row = await cursor.fetchone()

        if row is None:
            raise HTTPException(status_code=404, detail="job not found")
    return dict(row)