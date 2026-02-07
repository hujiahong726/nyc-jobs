// const express = require('express');
// const cors = require('cors');
// const Database = require('better-sqlite3');
// const { z, parse } = require('zod');

// const app = express();
// app.use(cors({ origin: "http://localhost:5173"}));
// app.use(express.json());

// const db = new Database("jobs.db");

// db.exec(`
//     PRAGMA journal_mode  = WAL;

//     CREATE TABLE IF NOT EXISTS jobs (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         title TEXT NOT NULL,
//         company TEXT NOT NULL,
//         location TEXT NOT NULL,
//         level TEXT NOT NULL,
//         tags TEXT NOT NULL,
//         description TEXT NOT NULL,
//         created_at TEXT NOT NULL
//     );
// `);

// const count = db.prepare("SELECT COUNT(*) as c FROM jobs").get().c;

// if (count === 0){
//     const insert = db.prepare(`
//         INSERT INTO jobs (title, company, location, level, tags, description, created_at)
//         VALUES (@title, @company, @location, @level, @tags, @description, @created_at)
//         `);
//     const now = new Date();
//     const sample = Array.from({ length: 120 }).map((_, i) => {
//         const lvl = ["Intern", "Junior", "Mid", "Senior"][i % 4];
//         const tags = [
//       ["React", "TypeScript"],
//       ["Node", "Postgres"],
//       ["Java", "Spring"],
//       ["Python", "ML"],
//       ["AWS", "Docker"],
//     ][i % 5];
//     return {
//         title: `${lvl} Software Engineer ${i + 1}`,
//         company: ["Acme", "Nimbus", "Aster", "Orbit", "Vertex"][i % 5],
//         location: ["NYC", "Remote", "Brooklyn", "Manhattan"][i % 4],
//         level: lvl,
//         tags: tags.join(","),
//         description:
//         `This is a realistic job post description for role ${i + 1}.\n\n` +
//         `Responsibilities:\n- Build APIs\n- Ship UI\n- Collaborate\n\n` +
//         `Tech: ${tags.join(", ")}`,
//         created_at: new Date(now.getTime() - i * 3600_000).toISOString(),
//         };
//     });
//     const tx = db.transaction((rows) => rows.forEach((r) => insert.run(r)));
//     tx(sample);
//     console.log("Seeded jobs:", sample.length);
// }


// // --- helpers ---
// const listQuerySchema = z.object({
//   q: z.string().optional(),
//   level: z.string().optional(),
//   location: z.string().optional(),
//   page: z.coerce.number().int().min(1).default(1),
//   pageSize: z.coerce.number().int().min(1).max(50).default(10),
// });

// app.get("/health", (req, res) => res.json({ok: true}));

// app.get("/api/jobs", (req, res) => {
//     const parsed = listQuerySchema.safeParse(req.query);
//     if (!parsed.success) {
//         return res.status(400).json({error: "invalid query params", details: parsed.error.flatten()});
//     }
//     const {q, level, location, page, pageSize} = parsed.data;
//     const where = [];
//     const params = {};

//     if (q && q.trim()){
//         where.push("(title LIKE @q OR company LIKE @q OR tags LIKE @q)");
//         params.q = `%${q.trim()}%`;
//     }
//     if (level && level.trim()) {
//         where.push("level = @level");
//         params.level = level.trim();
//     }
//     if (location && location.trim()) {
//         where.push("location = @location");
//         params.location = location.trim();
//     }
    
// })