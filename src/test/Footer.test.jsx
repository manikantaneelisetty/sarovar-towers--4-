import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../layouts/Footer';

// ── Footer ──────────────────────────────────────────────────────────────────
describe('Footer', () => {
  const renderFooter = () =>
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

  it('renders the Aparna logo', () => {
    renderFooter();
    expect(screen.getByAltText('Aparna Logo')).toBeInTheDocument();
  });

  it('renders project description text', () => {
    renderFooter();
    expect(screen.getByText(/Ultra-luxury/i)).toBeInTheDocument();
  });

  it('renders Quick Links section', () => {
    renderFooter();
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
  });

  it('renders Contact Info section', () => {
    renderFooter();
    expect(screen.getByText('Contact Info')).toBeInTheDocument();
  });

  it('renders copyright notice with current year', () => {
    renderFooter();
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(year.toString()))).toBeInTheDocument();
  });

  it('renders all footer navigation links', () => {
    renderFooter();
    const homeLinks = screen.getAllByText('Home');
    expect(homeLinks.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('Specifications')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});
