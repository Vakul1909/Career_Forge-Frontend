import { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
const ROLE_OPTIONS = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Analyst",
    "Data Scientist",
    "Machine Learning Engineer",
    "AI Engineer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Cyber Security Analyst",
    "Mobile App Developer",
    "Software Engineer",
    "Product Manager",
    "UI/UX Designer",
];
const isValidPhone = (phone) => {
    return /^[0-9]{10}$/.test(phone);
};
const Profile = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        college: "",
        course: "",
        targetRole: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const showError = (msg) => {
        setError(msg);
        setTimeout(() => setError(""), 2000);
    };
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await API.get("/api/users/me");
                setUser(res.data); 
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, []);
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user.phone || !user.college || !user.course || !user.targetRole) {
            showError("All fields are required");
            return;
        }
        if (!isValidPhone(user.phone)) {
            showError("Enter a valid phone number");
            return;
        }
        try {
            setLoading(true);
            await API.put("/api/users/profile", {
                phone: user.phone,
                targetRole: user.targetRole,
                college: user.college,
                course: user.course,
            });
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/");
        } catch {
            showError("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="profile-page">
            <h2>Complete Your Profile</h2>
            {error && <p className="jf-error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label className="sectionlogin-title">Enter Name:</label>
                <input value={user.name} disabled />
                <label className="sectionlogin-title">Enter Mail:</label>
                <input value={user.email} disabled />
                <label className="sectionlogin-title">Enter Phone no.:</label>
                <input
                    name="phone"
                    placeholder="Phone Number"
                    value={user.phone}
                    onChange={handleChange}
                />
                <label className="sectionlogin-title">College Name:</label>
                <input
                    name="college"
                    placeholder="Enter College Name"
                    value={user.college}
                    onChange={handleChange}
                />
                <label className="sectionlogin-title">Course:</label>
                <input
                    name="course"
                    placeholder="Enter Course"
                    value={user.course}
                    onChange={handleChange}
                />
                <label className="sectionlogin-title">Select Job Role:</label>
                <select
                    name="targetRole"
                    value={user.targetRole}
                    onChange={handleChange}
                >
                    <option value="">Select Target Role</option>
                    {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save & Continue"}
                </button>
            </form>
        </div>
    );
};
export default Profile;