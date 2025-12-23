import type { Ghazal } from '../types';

// Import JSON data - this will be replaced when we have the actual JSON file
let ghazalsData: Ghazal[] = [];

// Function to load ghazals from JSON file
export const loadGhazals = async (): Promise<void> => {
  if (ghazalsData.length > 0) {
    // Already loaded
    return;
  }

  try {
    // Dynamic import for the JSON file
    const data = await import('../assets/data/hafez_ghazals.json');
    ghazalsData = data.default || data;
  } catch (error) {
    console.error('Error loading ghazals data:', error);
    throw new Error('Failed to load ghazals data');
  }
};

// Function to get a random ghazal
export const getRandomGhazal = (): Ghazal | null => {
  if (ghazalsData.length === 0) {
    console.error('Ghazals data not loaded yet');
    return null;
  }

  const randomIndex = Math.floor(Math.random() * ghazalsData.length);
  return ghazalsData[randomIndex];
};

// Function to get a specific ghazal by ID
export const getGhazalById = (id: number): Ghazal | undefined => {
  return ghazalsData.find(ghazal => ghazal.id === id);
};

// Function to get all ghazals
export const getAllGhazals = (): Ghazal[] => {
  return ghazalsData;
};