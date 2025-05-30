import { AxiosResponse } from "axios";
import { api } from "../lib/api";

export interface Log {
    id: number;
    event: string;
    eventDate: string;
    user: {
      firstname: string;
      lastname: string;
      color: string;
    };
}

export const getLogs = (): Promise<AxiosResponse<Log[]>> => {
  return api.get('/logs');
};