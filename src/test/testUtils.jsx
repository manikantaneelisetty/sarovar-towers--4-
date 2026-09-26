import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CompareProvider } from '../context/CompareContext';

// Helper: wrap component with required providers
const renderWithProviders = (ui, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <CompareProvider>
        {ui}
      </CompareProvider>
    </MemoryRouter>
  );
};

export { renderWithProviders };
