import { AxiosResponse } from "axios";
import { api } from "../lib/api";

export interface Channel {
  id: number;
  name: string;
  usersAuthaurized: { id: number }[];
};

export const getAllChannels = (): Promise<AxiosResponse<Channel[]>> => {
  return api.get("/channels");
};

export const getChannel = (id: string): Promise<AxiosResponse<Channel>> => {
  return api.get(`/channels/${id}`);
};

export const createChannel = (name: string): Promise<AxiosResponse<Channel>> => {
    return api.post('/channels', { name: name.trim() });
  };

export const changeChannelUserAccess = (id: string, userId: string): Promise<AxiosResponse<Channel>> => {
  return api.post(`/channels/${id}/${userId}`);
};

export const deleteChannel = (id: string): Promise<AxiosResponse<Channel>> => {
  return api.delete(`/channels/${id}`);
};