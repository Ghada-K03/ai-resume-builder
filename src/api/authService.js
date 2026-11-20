import api from "./axios";

export async function loginUser(email, password) {
  const response = await api.post("/cv/auth/login", {
    email,
    password,
  });

  return response.data;
}

export async function registerUser(userData) {
  const response = await api.post("/cv/auth/register", userData);

  return response.data;
}
export async function forgotPassword(email) {
  const response = await api.post("/cv/auth/forgot-password", { email });

  return response.data;
}
export async function resetPassword(data) {
  const response = await api.post("/cv/auth/reset-password", data);

  return response.data;
}
export async function getProfile() {
  const response = await api.get("/cv/auth/profile");

  return response.data;
}
export async function updateProfile(data) {
  const response = await api.patch("/cv/auth/profile", data);

  return response.data;
}
export async function changePassword(data) {
  const response = await api.post("/cv/auth/change-password", data);

  return response.data;
}
export async function logoutUser() {
  const response = await api.post("/cv/auth/logout");
  return response.data;
}
