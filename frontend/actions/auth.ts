import { AxiosResponse } from "axios";
import { api } from "../lib/api";

interface SignInResponse {
  access_token: string;
}

type registerPayload = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

export const signIn = async (
  email: string,
  password: string
): Promise<AxiosResponse<SignInResponse>> => {
  return api.post("auth/login", {
    email,
    password,
  });
};

export const register = async (
  data: registerPayload
): Promise<AxiosResponse<any>> => {
  return api.post("auth/register", data);
};
