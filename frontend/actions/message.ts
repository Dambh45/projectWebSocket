import { AxiosResponse } from "axios";
import { api } from "../lib/api";

export interface Message {
  id: number;
  content: string;
  SentDate: string;
  user: {
    firstname: string;
    lastname: string;
    color: string;
  };
};

export const getAllMessagesFromChannel = (id: string): Promise<AxiosResponse<Message[]>> => {
  return api.get(`/messages/${id}`);
};

