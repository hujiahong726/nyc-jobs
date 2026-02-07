import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJob } from "../api/jobs";
import type { Job } from "../api/types";

export default function JobDetail(){
    const { id } = useParams();
    const jobId = Number(id);

    const [job, setJob] = useState<Job | null> (null);
    const [loading, setLoading] = useState<boolean> (false);
    const [error, setError] = useState<string | null> (null);

    useEffect(() => {
        if (!Number.isFinite(jobId)) {
            setError("Invalid job id");
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        getJob(jobId)
            .then((res) => {
                if (cancelled) return;
                setJob(res);
            })
            .catch((e: any) => {
                if (cancelled) return;
                setError(e?.message ?? "Failed to load job");
            })
            .finally(() => {
                if (cancelled) return;
                setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [jobId]);

    return (
    <div>
      <Link to="/jobs">← Back to jobs</Link>

      {loading && <div style={{ marginTop: 12 }}>Loading…</div>}

      {error && (
        <div style={{ marginTop: 12, border: "1px solid #f99", padding: 12 }}>
          <div style={{ fontWeight: 600 }}>Error</div>
          <div>{error}</div>
        </div>
      )}

      {!loading && !error && job && (
        <div style={{ marginTop: 12 }}>
          <h2 style={{ marginBottom: 4 }}>{job.title}</h2>
          <div style={{ color: "#555" }}>
            {job.company} • {job.location} • {job.level}
          </div>
          <div style={{ color: "#777", fontSize: 12, marginTop: 6 }}>{job.tags}</div>

          <pre style={{ whiteSpace: "pre-wrap", marginTop: 16 }}>
            {job.description}
          </pre>
        </div>
      )}
    </div>
  );

}