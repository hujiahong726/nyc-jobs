export type Job = {
    id: number;
    title: string;
    company: string;
    location: string;
    level: string;
    tags: string;
    description: string;
    created_at: string;
};

export type JobsListResponse = {
    items: Job[];
    page: number;
    page_size?: number;
    limit?: number;
    total: number;
    total_pages?: number;
};