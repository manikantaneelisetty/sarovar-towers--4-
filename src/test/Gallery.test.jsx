import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Gallery from '../pages/Gallery';

describe('Gallery Page', () => {
  const renderGallery = () => {
    return render(
      <MemoryRouter>
        <Gallery />
      </MemoryRouter>
    );
  };

  it('renders gallery header and filter categories', () => {
    renderGallery();
    expect(screen.getByText('Full Collection')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Exterior')).toBeInTheDocument();
    expect(screen.getByText('Interiors')).toBeInTheDocument();
    expect(screen.getByText('Amenities')).toBeInTheDocument();
    expect(screen.getByText('Videos')).toBeInTheDocument();
  });

  it('renders gallery items', () => {
    renderGallery();
    expect(screen.getByText('Grand Facade')).toBeInTheDocument();
    expect(screen.getByText('Tower Elevation')).toBeInTheDocument();
    expect(screen.getByText('Living Room')).toBeInTheDocument();
  });

  it('switches category when filter button is clicked', () => {
    renderGallery();
    const exteriorBtn = screen.getByText('Exterior');
    fireEvent.click(exteriorBtn);

    expect(screen.getByText('Grand Facade')).toBeInTheDocument();
    expect(screen.getByText('Tower Elevation')).toBeInTheDocument();
  });
});
