const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, ''); // or VITE_API_BASE_URL depending on setup

// Create a cache for branch names to minimize API calls
const branchNameCache: Record<string, string> = {};

/**
 * Fetches the branch name for a given branch ID
 * @param branchId - The ID of the branch
 * @returns The branch name or the original ID if not found
 */
export async function getBranchName(branchId: string): Promise<string> {
  // Return from cache if available
  if (branchNameCache[branchId]) {
    return branchNameCache[branchId];
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/branches/${encodeURIComponent(branchId)}`);
    
    if (!response.ok) {
      console.warn(`Failed to fetch branch: ${response.status}`);
      return branchId; // Return the original ID as fallback
    }
    
    const data = await response.json();
    
    if (data && data.branch_name) {
      // Store in cache for future use
      branchNameCache[branchId] = data.branch_name;
      return data.branch_name;
    }
    
    return branchId; // Return the original ID as fallback
  } catch (error) {
    console.error('Error fetching branch name:', error);
    return branchId; // Return the original ID as fallback
  }
}