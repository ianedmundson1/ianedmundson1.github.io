import { apiFetch } from "./client";

export interface ContactPayLoad {
    name: string;
    email: string;
    message: string;
}

export const sendContactMessage = (payload: ContactPayLoad): Promise<void> =>
    apiFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type':'application/json'},
        body: JSON.stringify(payload)
    });