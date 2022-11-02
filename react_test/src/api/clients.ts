import axios, { AxiosError } from "axios";

import { IData, INewClient } from "../utils/interfaces";

axios.defaults.baseURL = "http://localhost:1337/api";

export const getAllClients = async () => {
  const response = await axios.get<IData>("clients");
  return response;
};

export const createClient = async (newClient: INewClient) => {
  const response = await axios.post("clients", { data: newClient });
  return response;
};

export const deleteClient = async (id: number) => {
  const response = await axios.delete(`clients/${id}`);
  return response;
};

export const updateClient = async (id: number, newClient: INewClient) => {
  const response = await axios.put(`clients/${id}`, { data: newClient });
  return response;
};
