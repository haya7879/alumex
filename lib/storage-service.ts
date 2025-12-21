// Temporary storage service implementation
export const StorageService = {
  getUser: () => {
    // You can implement actual storage logic here
    // For now, returning a mock user
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    }
    return { full_name: 'User Name' };
  },
};

