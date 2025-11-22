const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

export const encryptToken = (token: string): string => {
  try {
    return btoa(token + SECRET_KEY);
  } catch (error) {
    console.error("Encryption error:", error);
    return token;
  }
};

export const decryptToken = (encryptedToken: string): string | null => {
  try {
    const decoded = atob(encryptedToken);
    return decoded.replace(SECRET_KEY, "");
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};
