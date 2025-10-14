// lib/api.ts
const API_URL = process.env.API_URL;

export async function getUsers() {
  // In a real application, this would be an API call
  // For now, we'll return mock data
  return [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Student" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Student" },
    { id: 3, name: "Admin User", email: "admin@example.com", role: "Admin" },
  ];
}
export async function getIssues() {
  // In a real application, this would be an API call
  // For now, we'll return mock data
  return [
    {
      id: 1,
      title: "Login problem",
      status: "Open",
      submittedBy: "john@example.com",
      date: "2024-07-20",
    },
    {
      id: 2,
      title: "Chat not responding",
      status: "In Progress",
      submittedBy: "jane@example.com",
      date: "2024-07-21",
    },
    {
      id: 3,
      title: "Incorrect information",
      status: "Closed",
      submittedBy: "admin@example.com",
      date: "2024-07-22",
    },
  ];
}

// lib/api.js
export async function getInstructions(page = 1, limit = 10) {
  const res = await fetch(
    `${API_URL}/api/chatbot-instructions?page=${page}&limit=${limit}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch instructions");
  return res.json();
}
