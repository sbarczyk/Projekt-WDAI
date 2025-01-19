import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const { data } = await axios.post("http://localhost:5001/api/auth/refresh", { refreshToken });
          localStorage.setItem("accessToken", data.accessToken);
          axiosInstance.defaults.headers["Authorization"] = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Błąd odświeżania tokena:", refreshError);

        alert("Twoja sesja wygasła. Zaloguj się ponownie, aby kontynuować.");


        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;