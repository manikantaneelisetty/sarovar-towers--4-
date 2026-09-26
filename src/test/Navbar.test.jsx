import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import { CompareProvider } from '../context/CompareContext';

const renderNavbar = (route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <CompareProvider>
        <Navbar />
      </CompareProvider>
    </MemoryRouter>
  );

// ── Navbar ──────────────────────────────────────────────────────────────────
describe('Navbar', () => {
  it('renders the logo image', () => {
    renderNavbar();
    const logo = screen.getByAltText('Aparna Logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderNavbar();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Location Map')).toBeInTheDocument();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('Specifications')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('does not show Compare button when list is empty', () => {
    renderNavbar();
    expect(screen.queryByText(/Compare/)).toBeNull();
  });
});
