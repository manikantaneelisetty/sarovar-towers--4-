import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import FlatDetails from '../pages/FlatDetails';
import { CompareProvider } from '../context/CompareContext';

describe('FlatDetails Component', () => {
  beforeEach(() => {
    localStorage.clear();
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      bottom: 600,
      right: 800,
      x: 0,
      y: 0,
      toJSON: () => {}
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders FlatDetails page with specifications panel open by default', () => {
    render(
      <CompareProvider>
        <MemoryRouter initialEntries={['/flat/1/3/301']}>
          <Routes>
            <Route path="/flat/:towerId/:floorNo/:flatNo" element={<FlatDetails />} />
          </Routes>
        </MemoryRouter>
      </CompareProvider>
    );

    expect(screen.getByText('Back to Floor Layout')).toBeInTheDocument();
    expect(screen.getByText('3D Floor Rendering Plan')).toBeInTheDocument();
    expect(screen.getByText('Room Specifications')).toBeInTheDocument();
    expect(screen.getByText('Flat 301')).toBeInTheDocument();
  });

  it('closes and re-opens the Specifications drawer via the close button and toggle button', () => {
    render(
      <CompareProvider>
        <MemoryRouter initialEntries={['/flat/1/5/502']}>
          <Routes>
            <Route path="/flat/:towerId/:floorNo/:flatNo" element={<FlatDetails />} />
          </Routes>
        </MemoryRouter>
      </CompareProvider>
    );

    // Should be open by default
    expect(screen.getByText('Room Specifications')).toBeInTheDocument();
    expect(screen.getByText('Flat 502')).toBeInTheDocument();

    // Click close '×' button
    const closeBtn = screen.getByRole('button', { name: '×' });
    fireEvent.click(closeBtn);

    // Now 'View Specifications' button should be shown
    const openSpecsBtn = screen.getByText('View Specifications');
    expect(openSpecsBtn).toBeInTheDocument();

    // Re-open
    fireEvent.click(openSpecsBtn);
    expect(screen.getByText('Room Specifications')).toBeInTheDocument();
  });

  it('opens and closes the 2D Plan modal', () => {
    render(
      <CompareProvider>
        <MemoryRouter initialEntries={['/flat/2/4/403']}>
          <Routes>
            <Route path="/flat/:towerId/:floorNo/:flatNo" element={<FlatDetails />} />
          </Routes>
        </MemoryRouter>
      </CompareProvider>
    );

    // Specifications panel is already open by default
    const view2DBtn = screen.getByText('View 2D Plan');
    fireEvent.click(view2DBtn);

    expect(screen.getByText('2D layout')).toBeInTheDocument();
    expect(screen.getByAltText('2D Floor plan')).toBeInTheDocument();
  });

  it('opens and closes the Pricing Quote modal with validation', () => {
    render(
      <CompareProvider>
        <MemoryRouter initialEntries={['/flat/3/1/104']}>
          <Routes>
            <Route path="/flat/:towerId/:floorNo/:flatNo" element={<FlatDetails />} />
          </Routes>
        </MemoryRouter>
      </CompareProvider>
    );

    // Specifications panel is already open by default
    fireEvent.click(screen.getByText('Request Pricing'));

    expect(screen.getByText('Request Price Quote')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email ID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mobile Number')).toBeInTheDocument();
  });

  it('renders refuge flat badge and safety norms for flat 02 on refuge floors', () => {
    render(
      <CompareProvider>
        <MemoryRouter initialEntries={['/flat/1/21/2102']}>
          <Routes>
            <Route path="/flat/:towerId/:floorNo/:flatNo" element={<FlatDetails />} />
          </Routes>
        </MemoryRouter>
      </CompareProvider>
    );

    expect(screen.getByText('Flat 2102')).toBeInTheDocument();
    expect(screen.getByText(/DESIGNATED REFUGE FLAT/i)).toBeInTheDocument();
    expect(screen.getByText(/Refuge Flat Safety Norms/i)).toBeInTheDocument();
  });
});
