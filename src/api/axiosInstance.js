import axios from "axios";
import { generateJwtToken } from "./generateJwtToken";

const axiosInstance = axios.create({
    baseURL : "http://localhost:8010/employee-onboarding-system/eobs",
    headers :  {
        'Content-Type': 'application/json',
    }
});

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("jwtToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }
// );

// axiosInstance.interceptors.response.use((response) => response, async (error) => {
//     const originalRequest = error.config;
    
//     if (!originalRequest._retry && (error.response?.status === 401 || error.response?.status === 403)) {
//         originalRequest._retry = true;
//         const newToken = await generateJwtToken();
//         if (!newToken) return Promise.reject(error);
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return axiosInstance(originalRequest);
//     }

//     return Promise.reject(error);
//   }
// );


export default axiosInstance;

