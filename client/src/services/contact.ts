import { api } from "./api";

export interface ContactInput {
  name: string;
  email?: string;
  phone?: string;
  message: string;
}

export const contactApi = {
  submit: (data: ContactInput) => api.post<{ success: boolean }>("/contact", data),
};
