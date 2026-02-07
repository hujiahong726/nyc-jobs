import {apiFetch} from "./client";
import type {Job, JobsListResponse} from "./types";

export function listJobs(params: { page: number; pageSize: number}) {
    const qs = new URLSearchParams({
        page: String(params.page),
        page_size: String(params.pageSize),
    });

    return apiFetch<JobsListResponse>(`/api/jobs?${qs.toString()}`);
}

export function getJob(jobId: number) {
    return apiFetch<Job>(`/api/jobs/${jobId}`);
}