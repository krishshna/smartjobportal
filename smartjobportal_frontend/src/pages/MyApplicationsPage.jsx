import React, { useEffect, useState } from "react";
import api from "../api/axios";

const STATUS_CONFIG = {
  APPLIED:       { label: "Applied",       color: "bg-blue-50 text-blue-700 border-blue-200" },
  UNDER_REVIEW:  { label: "Under Review",  color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  SHORTLISTED:   { label: "Shortlisted",   color: "bg-purple-50 text-purple-700 border-purple-200" },
  REJECTED:      { label: "Rejected",      color: "bg-red-50 text-red-700 border-red-200" },
  HIRED:         { label: "Hired 🎉",       color: "bg-green-50 text-green-700 border-green-200" },
};

export default function MyApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [jobs, setJobs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/applications/my");
        setApps(res.data);
        const jobDetails = {};
        await Promise.all(
          res.data.map(async (app) => {
            if (!jobDetails[app.jobId]) {
              try {
                const j = await api.get(`/jobs/${app.jobId}`);
                jobDetails[app.jobId] = j.data;
              } catch (e) {
                jobDetails[app.jobId] = null;
              }
            }
          })
        );
        setJobs(jobDetails);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
            <div className="h-3 bg-slate-100 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
        <p className="text-slate-500 mt-1">Track the status of all your job applications</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {Object.entries(STATUS_CONFIG).map(([key, { label, color }]) => {
          const count = apps.filter(a => a.status === key).length;
          return (
            <div key={key} className={`rounded-xl border p-3 text-center ${color}`}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs font-medium mt-0.5">{label}</p>
            </div>
          );
        })}
      </div>

      {apps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-slate-600 font-medium">No applications yet</p>
          <p className="text-slate-400 text-sm mt-1">Start applying to jobs to see them here</p>
          <a href="/jobs" className="mt-4 inline-block px-5 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors">
            Browse Jobs
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => {
            const job = jobs[app.jobId];
            const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.APPLIED;
            return (
              <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900">{job?.title || `Job #${app.jobId}`}</h3>
                  <p className="text-sm text-slate-600">{job?.company || "—"}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 flex-wrap">
                    {job?.location && <span>📍 {job.location}</span>}
                    {app.appliedAt && (
                      <span>Applied {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    )}
                  </div>
                </div>
                <span className={`shrink-0 px-3 py-1 text-xs font-semibold rounded-full border ${status.color}`}>
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}