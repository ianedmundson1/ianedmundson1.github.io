import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ContactForm from './ContactForm';

vi.mock('../../api/contact', () => ({
  sendContactMessage: vi.fn(),
}));

import { sendContactMessage } from '@/api/contact';

beforeAll(() => {
  // jsdom doesn't implement HTMLDialogElement modal methods.
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
});

const fillAndSubmit = async () => {
  await userEvent.type(screen.getByLabelText(/name/i), 'Ada');
  await userEvent.type(screen.getByLabelText(/email/i), 'ada@example.com');
  await userEvent.type(screen.getByLabelText(/message/i), 'Hello');
  await userEvent.click(screen.getByRole('button', { name: /^send$/i }));
};

describe('ContactForm', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('opens the dialog when isOpen flips true', () => {
    const { rerender } = render(<ContactForm isOpen={false} onClose={() => {}} />);
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
    rerender(<ContactForm isOpen={true} onClose={() => {}} />);
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it('closes the dialog when isOpen flips false', () => {
    const { rerender } = render(<ContactForm isOpen={true} onClose={() => {}} />);
    rerender(<ContactForm isOpen={false} onClose={() => {}} />);
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  it('submits the form and shows the success state', async () => {
    vi.mocked(sendContactMessage).mockResolvedValueOnce(undefined);
    render(<ContactForm isOpen={true} onClose={() => {}} />);

    await fillAndSubmit();

    await waitFor(() =>
      expect(sendContactMessage).toHaveBeenCalledWith({
        name: 'Ada',
        email: 'ada@example.com',
        message: 'Hello',
      }),
    );
    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
  });

  it('shows the error state when the API call rejects', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(sendContactMessage).mockRejectedValueOnce(new Error('nope'));
    render(<ContactForm isOpen={true} onClose={() => {}} />);

    await fillAndSubmit();

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
    errSpy.mockRestore();
  });
});
