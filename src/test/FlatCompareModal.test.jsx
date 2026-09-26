import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FlatCompareModal from '../components/FlatCompareModal';
import { CompareContext } from '../context/CompareContext';

describe('FlatCompareModal', () => {
  const mockFlat1 = {
    tower: 1,
    floor: 5,
    flat: '501',
    title: 'Flat 501',
    image: '/images/t1-flats/101.png',
    info: '4 BHK | 3348 Sq.ft | West Facing',
    specs: [
      ['Drawing', "12'0 X 13'8"],
      ['Dining', "15'9 X 12'0"]
    ]
  };

  const mockFlat2 = {
    tower: 2,
    floor: 10,
    flat: '1002',
    title: 'Flat 1002',
    image: '/images/t2-flats/102.png',
    info: '3 BHK | 2878 Sq.ft | West Facing',
    specs: [
      ['Drawing', "13'8 X 13'0"],
      ['Dining', "11'8 X 22'8"]
    ]
  };

  const renderModal = (contextValue) => {
    return render(
      <MemoryRouter>
        <CompareContext.Provider value={contextValue}>
          <FlatCompareModal />
        </CompareContext.Provider>
      </MemoryRouter>
    );
  };

  it('renders nothing when isCompareOpen is false', () => {
    const { container } = renderModal({
      compareList: [mockFlat1],
      isCompareOpen: false,
      setIsCompareOpen: vi.fn(),
      removeFromCompare: vi.fn(),
      clearCompare: vi.fn()
    });

    expect(container.firstChild).toBeNull();
  });

  it('renders modal when isCompareOpen is true', () => {
    renderModal({
      compareList: [mockFlat1, mockFlat2],
      isCompareOpen: true,
      setIsCompareOpen: vi.fn(),
      removeFromCompare: vi.fn(),
      clearCompare: vi.fn()
    });

    expect(screen.getByText('Compare Apartments')).toBeInTheDocument();
    expect(screen.getByText('Flat 501')).toBeInTheDocument();
    expect(screen.getByText('Flat 1002')).toBeInTheDocument();
  });

  it('calls clearCompare when Clear All is clicked', () => {
    const clearCompareMock = vi.fn();
    renderModal({
      compareList: [mockFlat1],
      isCompareOpen: true,
      setIsCompareOpen: vi.fn(),
      removeFromCompare: vi.fn(),
      clearCompare: clearCompareMock
    });

    fireEvent.click(screen.getByText('Clear All'));
    expect(clearCompareMock).toHaveBeenCalledTimes(1);
  });

  it('calls setIsCompareOpen(false) when close button is clicked', () => {
    const setIsCompareOpenMock = vi.fn();
    renderModal({
      compareList: [mockFlat1],
      isCompareOpen: true,
      setIsCompareOpen: setIsCompareOpenMock,
      removeFromCompare: vi.fn(),
      clearCompare: vi.fn()
    });

    const closeButtons = screen.getAllByRole('button');
    // First button or close icon button
    const closeBtn = closeButtons.find(b => b.querySelector('svg'));
    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(setIsCompareOpenMock).toHaveBeenCalledWith(false);
    }
  });

  it('calls removeFromCompare when flat remove button is clicked', () => {
    const removeFromCompareMock = vi.fn();
    renderModal({
      compareList: [mockFlat1],
      isCompareOpen: true,
      setIsCompareOpen: vi.fn(),
      removeFromCompare: removeFromCompareMock,
      clearCompare: vi.fn()
    });

    const removeBtn = screen.getByTitle('Remove flat');
    fireEvent.click(removeBtn);
    expect(removeFromCompareMock).toHaveBeenCalledWith(1, '501');
  });
});
