import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./SavedJobs.css";
const SavedJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const fetchSavedJobs = async () => {
        try {
            const res = await API.get("/api/jobs/saved");
            setJobs(res.data);
        } catch {
            setError("Failed to load saved jobs");
        } finally {
            setLoading(false);
        }
    };
    const removeJob = async (jobId) => {
        try {
            await API.delete(`/api/jobs/saved/${jobId}`);
            setJobs((prev) => prev.filter((job) => job._id !== jobId));
        } catch {
            setError("Unable to remove job");
        }
    };
    const groupJobsByDate = () => {
        return jobs.reduce((groups, job) => {
            const dateKey = new Date(job.savedAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(job);
            return groups;
        }, {});
    };
    const groupedJobs = groupJobsByDate();
    useEffect(() => {
        fetchSavedJobs();
    }, []);
    if (loading) return <p className="center">Loading...</p>;
    return (
        <div className="saved-jobs-page">
            <button className="job-search-btn" onClick={() => navigate("/job-finder")}>
                Search More Jobs
            </button>
            <h2>Saved Jobs</h2>
            {error && <p className="error-text">{error}</p>}
            {Object.keys(groupedJobs).length === 0 ? (
                <p>No saved jobs yet</p>
            ) : (
                Object.entries(groupedJobs).map(([date, jobsOnDate]) => (
                    <div key={date} className="date-group">
                        <h3 className="saved-date-heading">{date}</h3>
                        <div className="saved-list">
                            {jobsOnDate.map((job) => (
                                <div className="job-card" key={job._id}>
                                    <h4>{job.title}</h4>
                                    <p>{job.company}</p>
                                    <p>{job.location}</p>
                                    <div className="job-actions">
                                        <a
                                            href={job.applyLink}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Apply
                                        </a>
                                        <button onClick={() => removeJob(job._id)}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
export default SavedJobs;