import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const STATUS_COLORS = {
  APPLIED: "bg-blue-50 text-blue-700",
  UNDER_REVIEW: "bg-yellow-50 text-yellow-700",
  SHORTLISTED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  HIRED: "bg-emerald-50 text-emerald-700",
};

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [loading, setLoading] = useState(false);
  const [applyingId, setApplyingId] = useState(null);
  const [message, setMessage] = useState({ id: null, text: "", type: "" });
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/jobs", { params });
      setJobs(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs({ title, location, jobType });
  };

  const handleApply = async (jobId) => {
    if (!user) { window.location.href = "/login"; return; }
    setApplyingId(jobId);
    try {
      const res = await api.post(`/apply?jobId=${jobId}`);
      setMessage({ id: jobId, text: res.data, type: "success" });
    } catch (e) {
      setMessage({ id: jobId, text: e.response?.data || "Error applying.", type: "error" });
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-1">Find Your Next Opportunity</h1>
        <p className="text-blue-200 mb-6">Search thousands of jobs from top companies</p>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job title or keyword"
            className="flex-1 px-4 py-2.5 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="flex-1 px-4 py-2.5 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-white"
          />
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="px-4 py-2.5 rounded-lg text-slate-800 text-sm focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
          <button type="submit" className="px-6 py-2.5 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm">
            Search
          </button>
        </form>
      </div>

      <div className="flex gap-6">
        {/* Job List */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              {loading ? "Searching..." : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} found`}
            </h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-slate-600 font-medium">No jobs found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`bg-white rounded-xl border p-5 cursor-pointer transition-all hover:border-blue-300 hover:shadow-md ${
                    selectedJob?.id === job.id ? "border-blue-500 shadow-md ring-1 ring-blue-200" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900">{job.title}</h3>
                        {job.jobType && (
                          <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full font-medium">
                            {job.jobType.replace("_", " ")}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">{job.company}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 flex-wrap">
                        {job.location && <span>📍 {job.location}</span>}
                        {job.salary && <span>💰 {job.salary}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {message.id === job.id && (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}>
                          {message.text}
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleApply(job.id); }}
                        disabled={applyingId === job.id}
                        className="px-4 py-1.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60"
                      >
                        {applyingId === job.id ? "Applying..." : "Apply"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedJob && (
          <div className="hidden lg:block w-96 shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedJob.title}</h2>
                  <p className="text-slate-600">{selectedJob.company}</p>
                </div>
                <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
              </div>
              <div className="space-y-2 text-sm text-slate-600 mb-4">
                {selectedJob.location && <p>📍 {selectedJob.location}</p>}
                {selectedJob.salary && <p>💰 {selectedJob.salary}</p>}
                {selectedJob.jobType && <p>🕒 {selectedJob.jobType.replace("_", " ")}</p>}
              </div>
              {selectedJob.description && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">Job Description</h3>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
                </div>
              )}
              <button
                onClick={() => handleApply(selectedJob.id)}
                disabled={applyingId === selectedJob.id}
                className="mt-6 w-full py-2.5 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
              >
                {applyingId === selectedJob.id ? "Applying..." : "Apply Now"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}