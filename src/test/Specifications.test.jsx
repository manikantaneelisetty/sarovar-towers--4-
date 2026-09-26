import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Specifications from '../pages/Specifications';

describe('Specifications Page', () => {
  const renderSpecs = () => {
    return render(
      <MemoryRouter>
        <Specifications />
      </MemoryRouter>
    );
  };

  it('renders page header and subtitle', () => {
    renderSpecs();
    expect(screen.getByText('Crafted to Perfection')).toBeInTheDocument();
    expect(screen.getByText(/Luxury/i)).toBeInTheDocument();
  });

  it('renders all specification sections', () => {
    renderSpecs();
    expect(screen.getByText('Structure & Framework')).toBeInTheDocument();
    expect(screen.getByText('Flooring & Surfaces')).toBeInTheDocument();
    expect(screen.getByText('Doors & Premium Joinery')).toBeInTheDocument();
    expect(screen.getByText('Plumbing & Sanitary')).toBeInTheDocument();
    expect(screen.getByText('Electrical & Automation')).toBeInTheDocument();
    expect(screen.getByText('Elevators & Lifts')).toBeInTheDocument();
    expect(screen.getByText('Security & Access Control')).toBeInTheDocument();
    expect(screen.getByText('Pipelined Gas & Utilities')).toBeInTheDocument();
  });

  it('renders detailed technical specifications content', () => {
    renderSpecs();
    expect(screen.getByText(/RCC Framed Structure/i)).toBeInTheDocument();
    expect(screen.getByText(/double-charged vitrified tiles/i)).toBeInTheDocument();
  });
});
