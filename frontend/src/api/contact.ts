import { apiFetch } from "./client";

export interface ContactPayload {
    name: string;
    email: string;
    message: string;
}

export const sendContactMessage = (payload: ContactPayload): Promise<void> =>
    apiFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type':'application/json'},
        body: JSON.stringify(payload)
    });