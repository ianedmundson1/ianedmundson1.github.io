import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MITDataSciencePage from '../MITDataSciencePage';

describe('MITDataSciencePage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <MITDataSciencePage />
      </MemoryRouter>,
    );

  it('renders the hero title', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { level: 1, name: 'MIT Applied Data Science' }),
    ).toBeInTheDocument();
  });

  it('renders the skip link', () => {
    renderPage();
    const skipLink = screen.getByText('Skip to interactive demo');
    expect(skipLink).toHaveAttribute('href', '#demo');
  });

  it('renders the demo section heading', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Try the Emotion Detection Model' }),
    ).toBeInTheDocument();
  });

  it('shows camera and upload buttons in idle mode', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /open camera/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload an image/i })).toBeInTheDocument();
  });

  it('switches to upload mode when upload button is clicked', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /upload an image/i }));
    expect(screen.getByText('Upload an Image')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /open camera/i })).not.toBeInTheDocument();
  });

  it('renders project badges', () => {
    renderPage();
    expect(screen.getByText('Machine Learning • Analytics')).toBeInTheDocument();
    expect(screen.getByText('Interactive')).toBeInTheDocument();
  });
});
