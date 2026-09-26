import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CompareProvider, useCompare } from '../context/CompareContext';

// ── CompareContext ──────────────────────────────────────────────────────────
describe('CompareContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const Wrapper = ({ children }) => (
    <CompareProvider>{children}</CompareProvider>
  );

  it('initializes with empty compareList', () => {
    const TestComponent = () => {
      const { compareList } = useCompare();
      return <div data-testid="count">{compareList.length}</div>;
    };
    render(<TestComponent />, { wrapper: Wrapper });
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('adds a flat to compareList', () => {
    const TestComponent = () => {
      const { compareList, addToCompare } = useCompare();
      return (
        <>
          <button onClick={() => addToCompare({ tower: 1, flat: '101', specs: [], info: 'Test', image: '' })}>
            Add
          </button>
          <div data-testid="count">{compareList.length}</div>
        </>
      );
    };
    render(<TestComponent />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByTestId('count').textContent).toBe('1');
  });

  it('prevents adding duplicate flat', () => {
    const TestComponent = () => {
      const { compareList, addToCompare } = useCompare();
      return (
        <>
          <button onClick={() => addToCompare({ tower: 1, flat: '101', specs: [], info: 'Test', image: '' })}>
            Add
          </button>
          <div data-testid="count">{compareList.length}</div>
        </>
      );
    };
    // Suppress the alert
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<TestComponent />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText('Add'));
    fireEvent.click(screen.getByText('Add')); // duplicate
    expect(screen.getByTestId('count').textContent).toBe('1');
    vi.restoreAllMocks();
  });

  it('limits compareList to 3 items and rejects the 4th', () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    const flats = [
      { tower: 1, flat: '101', specs: [], info: '', image: '' },
      { tower: 1, flat: '102', specs: [], info: '', image: '' },
      { tower: 1, flat: '103', specs: [], info: '', image: '' },
      { tower: 1, flat: '104', specs: [], info: '', image: '' },
    ];

    const TestComponent = () => {
      const { compareList, addToCompare } = useCompare();
      return (
        <>
          {flats.map((flat) => (
            <button key={flat.flat} onClick={() => addToCompare(flat)}>
              Add {flat.flat}
            </button>
          ))}
          <div data-testid="count">{compareList.length}</div>
        </>
      );
    };

    render(<TestComponent />, { wrapper: Wrapper });

    fireEvent.click(screen.getByText('Add 101'));
    fireEvent.click(screen.getByText('Add 102'));
    fireEvent.click(screen.getByText('Add 103'));
    fireEvent.click(screen.getByText('Add 104')); // should be rejected

    expect(screen.getByTestId('count').textContent).toBe('3');
    expect(window.alert).toHaveBeenCalledWith('Only 3 flats can be compared.');
    vi.restoreAllMocks();
  });

  it('removes a flat from compareList', () => {
    const TestComponent = () => {
      const { compareList, addToCompare, removeFromCompare } = useCompare();
      return (
        <>
          <button onClick={() => addToCompare({ tower: 1, flat: '101', specs: [], info: '', image: '' })}>Add</button>
          <button onClick={() => removeFromCompare(1, '101')}>Remove</button>
          <div data-testid="count">{compareList.length}</div>
        </>
      );
    };
    render(<TestComponent />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByTestId('count').textContent).toBe('1');
    fireEvent.click(screen.getByText('Remove'));
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('clears all items from compareList', () => {
    const TestComponent = () => {
      const { compareList, addToCompare, clearCompare } = useCompare();
      return (
        <>
          <button onClick={() => addToCompare({ tower: 1, flat: '101', specs: [], info: '', image: '' })}>Add</button>
          <button onClick={clearCompare}>Clear</button>
          <div data-testid="count">{compareList.length}</div>
        </>
      );
    };
    render(<TestComponent />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText('Add'));
    fireEvent.click(screen.getByText('Clear'));
    expect(screen.getByTestId('count').textContent).toBe('0');
  });
});
