const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://reactts-job-application-tracker3.onrender.com"
    : "http://localhost:3001";

export default API_BASE_URL;
