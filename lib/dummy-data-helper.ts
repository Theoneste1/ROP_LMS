// Helper function to always use dummy data for testing
// Set USE_DUMMY_DATA=true in environment to force dummy data usage

export function shouldUseDummyData(): boolean {
  return process.env.USE_DUMMY_DATA === "true" || process.env.NODE_ENV === "development"
}

export async function getDummyDataOrDatabase<T>(
  dbQuery: () => Promise<T>,
  dummyData: T,
  errorMessage = "Database not available - using dummy data"
): Promise<T> {
  if (shouldUseDummyData()) {
    console.log("Using dummy data (USE_DUMMY_DATA=true)")
    return dummyData
  }

  try {
    return await dbQuery()
  } catch (error) {
    console.warn(errorMessage, error)
    return dummyData
  }
}
