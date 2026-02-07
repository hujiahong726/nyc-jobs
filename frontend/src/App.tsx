import { useState } from 'react'
import { Routes, Route, Navigate, Link } from "react-router-dom";
import JobsList from "./pages/JobsList";
import JobDetail from "./pages/JobDetail";
// import './App.css';
function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: 16}}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/jobs" style={{ textDecoration: "none", fontWeight: 700 }}>
            NYC Jobs
          </Link>
        </header>

        <main style={{ marginTop: 16}}>
          <Routes>
            <Route path="/" element={<Navigate to="/jobs" replace />} />
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="*" element={<div>Not found</div>} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App
