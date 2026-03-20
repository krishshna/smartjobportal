import React, { useEffect, useState } from "react";
import api from "../api/axios";

const TABS = ["Jobs", "Post Job", "Applications"];

export default function AdminDashboard() {
  const [tab, setTab] = useState("Jobs");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", location: "", description: "", salary: "", jobType: "FULL_TIME" });
  const [formMsg, setFormMsg] = useState("");

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs");
      setJobs(res.data);
    } finally { setLoading(false); }
  };

  const fetchApplications = async (jobId) => {
    if (applications[jobId]) { setSelectedJobId(jobId); return; }
    try {
      const res = await api.get(`/admin/applications/${jobId}`);
      setApplications(prev => ({ ...prev, [jobId]: res.data }));
      setSelectedJobId(jobId);
    } catch (e) { console.error(e); }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setFormMsg("");
    try {
      await api.post("/jobs/create", form);
      setFormMsg("Job posted successfully!");
      setForm({ title: "", company: "", location: "", description: "", salary: "", jobType: "FULL_TIME" });
      fetchJobs();
    } catch (e) {
      setFormMsg("Error posting job.");
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (e) { console.error(e); }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      await api.put(`/admin/applications/${appId}/status?status=${status}`);
      const updated = { ...applications };
      for (const jid in updated) {
        updated[jid] = updated[jid].map(a => a.id === appId ? { ...a, status } : a);
      }
      setApplications(updated);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage jobs and review applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-3xl font-bold text-blue-700">{jobs.length}</p>
          <p className="text-sm text-slate-500 mt-1">Active Jobs</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-3xl font-bold text-blue-700">
            {Object.values(applications).reduce((s, a) => s + a.length, 0)}
          </p>
          <p className="text-sm text-slate-500 mt-1">Total Applications Loaded</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 col-span-2 sm:col-span-1">
          <p className="text-3xl font-bold text-green-600">
            {Object.values(applications).reduce((s, a) => s + a.filter(x => x.status === "HIRED").length, 0)}
          </p>
          <p className="text-sm text-slate-500 mt-1">Hired</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab: Jobs */}
      {tab === "Jobs" && (
        <div className="space-y-3">
          {loading ? (
            <p className="text-slate-500 text-sm">Loading...</p>
          ) : jobs.length === 0 ? (
            <p className="text-slate-500">No jobs posted yet.</p>
          ) : jobs.map(job => (
            <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{job.title}</h3>
                  <p className="text-sm text-slate-600">{job.company} · {job.location}</p>
                  {job.salary && <p className="text-xs text-slate-400 mt-1">💰 {job.salary}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => { fetchApplications(job.id); setTab("Applications"); }}
                    className="px-3 py-1.5 text-xs text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    View Applications
                  </button>
                  <button
                    onClick={() => handleDeactivate(job.id)}
                    className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Post Job */}
      {tab === "Post Job" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-2xl">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Post a New Job</h2>
          {formMsg && (
            <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
              formMsg.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}>{formMsg}</div>
          )}
          <form onSubmit={handlePostJob} className="space-y-4">
            {[
              { label: "Job Title", key: "title", placeholder: "e.g. Software Engineer" },
              { label: "Company", key: "company", placeholder: "e.g. Acme Corp" },
              { label: "Location", key: "location", placeholder: "e.g. Bengaluru, Remote" },
              { label: "Salary", key: "salary", placeholder: "e.g. ₹8–12 LPA" },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                <input
                  required={key !== "salary"}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={placeholder}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Type</label>
              <select
                value={form.jobType}
                onChange={(e) => setForm({ ...form, jobType: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe the role, responsibilities, and requirements..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              Post Job
            </button>
          </form>
        </div>
      )}

      {/* Tab: Applications */}
      {tab === "Applications" && (
        <div>
          <div className="flex gap-3 mb-5 flex-wrap">
            {jobs.map(job => (
              <button
                key={job.id}
                onClick={() => fetchApplications(job.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  selectedJobId === job.id
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-slate-700 border-slate-300 hover:border-blue-300"
                }`}
              >
                {job.title}
              </button>
            ))}
          </div>

          {selectedJobId && applications[selectedJobId] ? (
            applications[selectedJobId].length === 0 ? (
              <p className="text-slate-500 text-sm">No applications for this job yet.</p>
            ) : (
              <div className="space-y-3">
                {applications[selectedJobId].map((app) => (
                  <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{app.applicantName}</p>
                      <p className="text-sm text-slate-500">{app.applicantEmail}</p>
                      {app.appliedAt && (
                        <p className="text-xs text-slate-400 mt-1">
                          Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {["APPLIED", "UNDER_REVIEW", "SHORTLISTED", "REJECTED", "HIRED"].map(s => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p className="text-slate-400 text-sm">Select a job above to view its applications.</p>
          )}
        </div>
      )}
    </div>
  );
}