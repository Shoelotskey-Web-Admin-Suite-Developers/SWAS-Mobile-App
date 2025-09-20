// src/utils/api/getBranches.ts
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL; // or VITE_API_BASE_URL depending on setup

export const getBranches = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/branches/b`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to fetch branches");
    }

    const data = await res.json();
    return data; // returns array of branches with type "B"
  } catch (error) {
    console.error("Error fetching branches:", error);
    throw error;
  }
};
