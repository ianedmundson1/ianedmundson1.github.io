import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ImageUpload from '../ImageUpload';

const PNG_MAGIC = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
const NOT_PNG = new Uint8Array([0x3c, 0x73, 0x76, 0x67, 0, 0, 0, 0, 0, 0, 0, 0]); // "<svg"

const fileWith = (bytes: Uint8Array, name: string, type: string) =>
  new File([new Uint8Array(bytes)], name, { type });

describe('ImageUpload magic-byte sniffing', () => {
  it('rejects a file whose bytes do not match the declared MIME', async () => {
    const onUpload = vi.fn();
    render(<ImageUpload onUpload={onUpload} onCancel={() => {}} />);

    const input = screen.getByLabelText(/choose image file/i) as HTMLInputElement;
    const liar = fileWith(NOT_PNG, 'evil.png', 'image/png');
    await userEvent.upload(input, liar);

    expect(await screen.findByRole('alert')).toHaveTextContent(/don't match its extension/i);
    expect(onUpload).not.toHaveBeenCalled();
  });

  it('accepts a file whose magic bytes match the declared MIME', async () => {
    const onUpload = vi.fn();
    render(<ImageUpload onUpload={onUpload} onCancel={() => {}} />);

    const input = screen.getByLabelText(/choose image file/i) as HTMLInputElement;
    const good = fileWith(PNG_MAGIC, 'real.png', 'image/png');
    await userEvent.upload(input, good);

    expect(await screen.findByRole('button', { name: /analyze this image/i })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

});
