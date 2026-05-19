import React, { useRef, useEffect, useState} from 'react';
import { sendContactMessage, type ContactPayload} from '../../api/contact';
import { logger } from '../../utils/logger';
import styles from './ContactForm.module.css'

interface ContactFormProps{
    isOpen:boolean;
    onClose: () => void;
}

const EMPTY: ContactPayload = { name: '', email: '', message:''}

const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose}) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [fields, setFields] = useState<ContactPayload>(EMPTY)
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isOpen) dialog.showModal()
        else dialog.close();
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async () => {
        setStatus('submitting');
        try{
            await sendContactMessage(fields);
            setStatus('success');
            setFields(EMPTY);
        } catch (err) {
            logger.error('Contact form submission failed', err);
            import('@sentry/react')
                .then(({ captureException }) => captureException(err))
                .catch(() => {});
            setStatus('error')
        }
    };

    const handleClose = () => {
        setStatus('idle');
        setFields(EMPTY);
        onClose()
    }

    return(
        <dialog ref={dialogRef} id="contact-dialog" aria-labelledby="contact-dialog-title" className={styles.dialog} onClose={handleClose}>
            <button type="button" className={styles.closeButton} onClick={handleClose} aria-label='Close'>x </button>
            <h2 id="contact-dialog-title" className={styles.title}>Get in touch</h2>
            {status === 'success' ? (
                <p className={styles.success}>Message sent. I'll get back to you soon</p>
            ) : (
                <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }} className={styles.form}>
                    <label className={styles.label}>
                        Name 
                        <input name='name' value={fields.name} onChange={handleChange} required className={styles.input} />
                    </label>
                    <label className={styles.label}>
                        Email 
                        <input type='email' name='email' value={fields.email} onChange={handleChange} required className={styles.input}/>
                    </label>
                    <label className={styles.label}>
                        Message 
                        <textarea name='message' value={fields.message} onChange={handleChange} required rows={5} className={styles.textarea}/>
                    </label>
                    {status === 'error' && <p className={styles.error}>Something went wrong. Please try again.</p>}
                    <button type="submit" disabled={status === 'submitting'} className={styles.submitButton}>
                        {status === 'submitting' ? 'Sending...' : 'Send'}
                    </button>
                </form>
            )}
        </dialog>
    );
};

export default ContactForm;