import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LocationMap from '../pages/LocationMap';

describe('LocationMap Page', () => {
  const renderLocationMap = () => {
    return render(
      <MemoryRouter>
        <LocationMap />
      </MemoryRouter>
    );
  };

  it('renders Google Map iframe', () => {
    renderLocationMap();
    const iframe = screen.getByTitle('Aparna Sarovar Towers Location Map');
    expect(iframe).toBeInTheDocument();
  });

  it('renders neighborhood directory panel and default places', () => {
    renderLocationMap();
    expect(screen.getByText('Neighborhood Directory')).toBeInTheDocument();
    expect(screen.getByText('Lingampally Railway Station')).toBeInTheDocument();
    expect(screen.getByText('Citizens Specialty Hospital')).toBeInTheDocument();
  });

  it('filters places when category tabs are clicked', () => {
    renderLocationMap();
    const transitBtn = screen.getByRole('button', { name: 'Transit' });
    fireEvent.click(transitBtn);

    expect(screen.getByText('Lingampally Railway Station')).toBeInTheDocument();
    expect(transitBtn).toHaveStyle({ background: '#38bdf8' });
  });

  it('toggles minimize and expand for directory panel', () => {
    renderLocationMap();
    const toggleBtn = screen.getByRole('button', { name: 'Minimize' });
    fireEvent.click(toggleBtn);

    expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument();
    expect(screen.getByText(/places • All/i)).toBeInTheDocument();
  });
});
