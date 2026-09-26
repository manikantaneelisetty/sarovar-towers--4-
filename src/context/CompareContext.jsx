/* eslint-disable react-refresh/only-export-components */
// oxlint-disable react/only-export-components
import React, { createContext, useState, useEffect, useContext } from 'react';

export const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('compareFlats');
    if (saved) {
      try {
        setCompareList(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse compare list from localStorage', e);
      }
    }
  }, []);

  // Save to local storage when state changes
  const saveList = (list) => {
    setCompareList(list);
    localStorage.setItem('compareFlats', JSON.stringify(list));
  };

  const addToCompare = (flat) => {
    // Check if duplicate
    const exists = compareList.some(
      (item) => item.tower === flat.tower && item.flat === flat.flat
    );

    if (exists) {
      alert('This flat is already added.');
      return false;
    }

    if (compareList.length >= 3) {
      alert('Only 3 flats can be compared.');
      return false;
    }

    const newList = [...compareList, flat];
    saveList(newList);
    return true;
  };

  const removeFromCompare = (tower, flatNo) => {
    const newList = compareList.filter(
      (item) => !(item.tower === tower && item.flat === flatNo)
    );
    saveList(newList);
    
    // Close modal if no flats remaining
    if (newList.length === 0) {
      setIsCompareOpen(false);
    }
  };

  const clearCompare = () => {
    saveList([]);
    setIsCompareOpen(false);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        isCompareOpen,
        setIsCompareOpen,
        addToCompare,
        removeFromCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};
