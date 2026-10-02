const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getImageUrl = (imagePath) => {

  if (!imagePath) {
    return null;
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  return `${API_BASE_URL}${imagePath}`;
};