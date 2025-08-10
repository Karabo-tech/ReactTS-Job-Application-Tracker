// src/pages/Landing.tsx
const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Job Application Tracker</h1>
      <p className="text-lg mb-6 text-center max-w-2xl">
        Track your job applications easily. Monitor statuses, add details, and stay organized in your job search journey.
        Get insights on applied, interviewed, and rejected applications to improve your strategy.
      </p>
      <div className="flex space-x-4">
        <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Login</a>
        <a href="/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Register</a>
      </div>
    </div>
  );
};

export default Landing;