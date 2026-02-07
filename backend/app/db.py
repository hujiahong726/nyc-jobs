import aiosqlite
from contextlib import asynccontextmanager
from fastapi import FastAPI
from datetime import datetime, timedelta

DB_PATH = "jobs.db"

@asynccontextmanager
async def life_span(app: FastAPI):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.executescript("""
            PRAGMA journal_mode = WAL;

            CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            location TEXT NOT NULL,
            level TEXT NOT NULL,
            tags TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
        """)
        async with db.execute("SELECT COUNT(*) FROM jobs") as cursor:
            count = (await cursor.fetchone())[0]

        if count == 0:
            now = datetime.now()
            rows = []
            for i in range(10):
                lvl = ["Intern", "Junior", "Mid", "Senior"][i % 4]
                tags = [
                    ["React", "TypeScript"],
                    ["Node", "Postgres"],
                    ["Java", "Spring"],
                    ["Python", "ML"],
                    ["AWS", "Docker"],
                ][i % 5]
                rows.append((
                    f"{lvl} Software Engineer {i+1}",
                    ["Acme", "Nimbus", "Aster", "Orbit", "Vertex"][i % 5],
                    ["NYC", "Remote", "Brooklyn", "Manhattan"][i % 4],
                    lvl,
                    ",".join(tags),
                    f"Job description for role {i+1}",
                    (now - timedelta(hours=i)).isoformat(),
                ))
            await db.executemany("""
                INSERT INTO jobs 
                (title, company, location, level, tags, description, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, rows)
            await db.commit()
            print("Database seeded successfully")
        else:
            print("Database already exists.")
    yield

async def get_db():
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        yield db