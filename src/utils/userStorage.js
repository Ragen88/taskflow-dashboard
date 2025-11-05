// Utility functions for storing and retrieving user profile data in localStorage

const STORAGE_KEY = "taskflow_user_profile";

export const saveUserProfile = (userData) => {
  try {
    const profileData = {
      name: userData.name || "",
      nickname: userData.nickname || "",
      picture: userData.picture || "",
      pictureDataUrl: userData.pictureDataUrl || "",
      email: userData.email || "",
      sub: userData.sub || "",
      ...userData, // Save all user data
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
    return true;
  } catch (error) {
    console.error("Error saving user profile to localStorage:", error);
    return false;
  }
};

export const getUserProfile = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error("Error reading user profile from localStorage:", error);
    return null;
  }
};

export const updateUserProfile = (updates) => {
  try {
    const currentProfile = getUserProfile();
    if (currentProfile) {
      const updatedProfile = {
        ...currentProfile,
        ...updates,
        // Only overwrite pictureDataUrl if provided in updates
        pictureDataUrl: updates.pictureDataUrl !== undefined ? updates.pictureDataUrl : currentProfile.pictureDataUrl || "",
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
      return updatedProfile;
    }
    return null;
  } catch (error) {
    console.error("Error updating user profile in localStorage:", error);
    return null;
  }
};

export const clearUserProfile = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing user profile from localStorage:", error);
    return false;
  }
};
