import { Job } from "@/lib/validations/jobs";
import { create } from "zustand";

interface JobsStore {
  jobs: Job[];
  companyJobs: Job[];
  selectedJob: Job | null;
  isLoading: boolean;
  error: string | null;
  setJobs: (jobs: Job[]) => void;
  setCompanyJobs: (jobs: Job[]) => void;
  setSelectedJob: (job: Job | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addJob: (job: Job) => void;
  updateJob: (jobId: number, job: Partial<Job>) => void;
  removeJob: (jobId: number) => void;
  clearJobs: () => void;
}

export const useJobsStore = create<JobsStore>((set) => ({
  jobs: [],
  companyJobs: [],
  selectedJob: null,
  isLoading: false,
  error: null,
  setJobs: (jobs) => set({ jobs, error: null }),
  setCompanyJobs: (companyJobs) => set({ companyJobs, error: null }),
  setSelectedJob: (selectedJob) => set({ selectedJob }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  addJob: (job) =>
    set((state) => ({
      jobs: [...state.jobs, job],
      companyJobs: [...state.companyJobs, job],
    })),
  updateJob: (jobId, updatedJob) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.job_id === jobId ? { ...job, ...updatedJob } : job
      ),
      companyJobs: state.companyJobs.map((job) =>
        job.job_id === jobId ? { ...job, ...updatedJob } : job
      ),
      selectedJob:
        state.selectedJob?.job_id === jobId
          ? { ...state.selectedJob, ...updatedJob }
          : state.selectedJob,
    })),
  removeJob: (jobId) =>
    set((state) => ({
      jobs: state.jobs.filter((job) => job.job_id !== jobId),
      companyJobs: state.companyJobs.filter((job) => job.job_id !== jobId),
      selectedJob:
        state.selectedJob?.job_id === jobId ? null : state.selectedJob,
    })),
  clearJobs: () =>
    set({
      jobs: [],
      companyJobs: [],
      selectedJob: null,
      error: null,
      isLoading: false,
    }),
}));
