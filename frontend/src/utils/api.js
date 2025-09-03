// src/utils/api.js
const BACKEND_URL = "http://localhost:8081";

// Helper function to get JWT from localStorage
const getToken = () => localStorage.getItem("jwt");

// Wrapper around fetch
export const apiFetch = async (url, options = {}) => {
   const token = getToken();

   if (!token) {
      // If no token, force logout
      window.location.href = "/login";
      return;
   }

   // Add Authorization header
   options.headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
   };

   try {
      const res = await fetch(`${BACKEND_URL}${url}`, options);

      // If unauthorized, log out automatically
      if (res.status === 401 || res.status === 403) {
         localStorage.removeItem("jwt");
         window.location.href = "/login";
         return;
      }

      return res;
   } catch (err) {
      console.error("API fetch error:", err);
      throw err;
   }
};
