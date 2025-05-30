import { AxiosResponse } from "axios";
import { api } from "../lib/api";

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: "USER" | "ADMIN";
  color: string;
}

export const getAllUsers = (): Promise<AxiosResponse<User[]>> => {
  return api.get("/users");
};

export const getUserInfo = (): Promise<AxiosResponse<User>> => {
  return api.get("/users/me");
};

export const updateUserInfo = (user: User|undefined): Promise<AxiosResponse<User>> => {
  return api.post('/users/me', user);
};