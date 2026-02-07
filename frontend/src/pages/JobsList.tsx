import {useEffect, useMemo, useState} from "react";
import {Link, useSearchParams } from "react-router-dom";
import { listJobs } from "../api/jobs";
import type { Job } from "../api/types";

export default function JobsList(){
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "10");

    const [items, setItems] = useState<Job[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const canPrev = page > 1;
    const canNext = page < totalPages;

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        listJobs({ page, pageSize})
            .then((res) => {
                if (cancelled) return;
                setItems(res.items);
                setTotal(res.total);

                const tp =
                    res.total_pages ?? 
                    Math.max(1, Math.ceil(res.total / (res.page_size ?? pageSize)));
                setTotalPages(tp);
            })
            .catch((e: any) => {
                if(cancelled) return;
                setError(e?.message ?? "Failed to load jobs");
            })
            .finally(()=> {
                if(cancelled) return;
                setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [page, pageSize]);

    const header = useMemo(() => {
        return (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems:"baseline" }}>
                <h2 style={{ margin: 0 }}>Jobs</h2>
                <div style={{ color: "#666" }}>
                    {loading ? "Loading..." : `${total} total`}
                </div>
            </div>
        );
    }, [loading, total]);

    function updateParams(next: Partial<{ page: number, pageSize: number }>) {
        const sp = new URLSearchParams(searchParams);
        if (next.page !== undefined) sp.set("page", String(next.page));
        if (next.pageSize !== undefined) sp.set("pageSize", String(next.pageSize));
        setSearchParams(sp, { replace: true });
    }
    return (
    <div>
      {header}

      <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <button disabled={!canPrev || loading} onClick={() => updateParams({ page: page - 1 })}>
          Prev
        </button>
        <div>
          Page <b>{page}</b> of <b>{totalPages}</b>
        </div>
        <button disabled={!canNext || loading} onClick={() => updateParams({ page: page + 1 })}>
          Next
        </button>

        <div style={{ marginLeft: "auto" }}>
          <label>
            Page size{" "}
            <select
              value={pageSize}
              onChange={(e) => updateParams({ page: 1, pageSize: Number(e.target.value) })}
              disabled={loading}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        {loading && <div>Loading jobs…</div>}

        {error && (
          <div style={{ border: "1px solid #f99", padding: 12 }}>
            <div style={{ fontWeight: 600 }}>Error</div>
            <div>{error}</div>
            <button style={{ marginTop: 8 }} onClick={() => updateParams({ page })}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div style={{ padding: 12, border: "1px solid #ddd" }}>No jobs found.</div>
        )}

        {!loading && !error && items.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {items.map((job) => (
              <li key={job.id} style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                </div>
                <div style={{ color: "#555" }}>
                  {job.company} • {job.location} • {job.level}
                </div>
                <div style={{ color: "#777", fontSize: 12 }}>{job.tags}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}