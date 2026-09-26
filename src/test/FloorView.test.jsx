import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import FloorView from '../pages/FloorView';

describe('FloorView Component', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 1000,
      height: 700,
      top: 0,
      left: 0,
      bottom: 700,
      right: 1000,
      x: 0,
      y: 0,
      toJSON: () => {}
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders FloorView without errors and displays tower/floor header', () => {
    render(
      <MemoryRouter initialEntries={['/floor/1/5']}>
        <Routes>
          <Route path="/floor/:towerId/:floorNo" element={<FloorView />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Canopus Block - Floor/i)).toBeInTheDocument();
    expect(screen.getByText('Tower 1 View')).toBeInTheDocument();
    expect(screen.getByText('Jump to Floor')).toBeInTheDocument();
  });

  it('renders SVG hotspots for flats and allows toggling floor details', () => {
    render(
      <MemoryRouter initialEntries={['/floor/1/1']}>
        <Routes>
          <Route path="/floor/:towerId/:floorNo" element={<FloorView />} />
        </Routes>
      </MemoryRouter>
    );

    // Toggle Floor Details
    const toggleBtn = screen.getByLabelText('Toggle Floor Details');
    expect(toggleBtn).toBeInTheDocument();

    // Details overlay is initially hidden
    expect(screen.queryByText('Tower 1 (Canopus)')).not.toBeInTheDocument();

    // Click to show details
    fireEvent.click(toggleBtn);
    expect(screen.getByText('Tower 1 (Canopus)')).toBeInTheDocument();
    expect(screen.getByText('4 Apartments')).toBeInTheDocument();

    // Close details button is present and clickable
    const closeBtn = screen.getByLabelText('Close Floor Details');
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
  });

  it('opens Jump to Floor drawer and allows selecting tower/floor', () => {
    render(
      <MemoryRouter initialEntries={['/floor/2/10']}>
        <Routes>
          <Route path="/floor/:towerId/:floorNo" element={<FloorView />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Orion Block - Floor/i)).toBeInTheDocument();
    expect(screen.getByText('Tower 2 View')).toBeInTheDocument();

    // Open Jump to Floor drawer
    const jumpBtn = screen.getByText('Jump to Floor');
    fireEvent.click(jumpBtn);

    expect(screen.getByText('SELECT TOWER')).toBeInTheDocument();
    expect(screen.getByText('SELECT FLOOR')).toBeInTheDocument();
  });

  it('renders refuge floor and displays refuge information on flat 02 hover', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/floor/1/12']}>
        <Routes>
          <Route path="/floor/:towerId/:floorNo" element={<FloorView />} />
        </Routes>
      </MemoryRouter>
    );

    // Floor 12 details show Refuge Floor
    const toggleBtn = screen.getByLabelText('Toggle Floor Details');
    fireEvent.click(toggleBtn);
    expect(screen.getByText('Refuge Floor')).toBeInTheDocument();
    expect(screen.getByText(/Flat 1202 \(Refuge Zone\)/i)).toBeInTheDocument();

    // Hover 2nd polygon (idx 1, flat 1202)
    const polygons = container.querySelectorAll('polygon');
    expect(polygons.length).toBe(4);
    
    // Hover flat 1202
    fireEvent.mouseEnter(polygons[1]);
    expect(screen.getByText('REFUGE FLAT')).toBeInTheDocument();
    expect(screen.getByText('Refuge Area Information')).toBeInTheDocument();
  });
});
