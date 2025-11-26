/**
 * useLocalStorage.js
 * 
 * Custom React hook for managing localStorage with automatic persistence
 * Handles JSON serialization, error handling, and SSR safety
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to persist state in localStorage
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Initial value if not found in localStorage
 * @param {Object} options - Configuration options
 * @returns {[state, setState]} - State value and setter function
 */
export const useLocalStorage = (key, initialValue, options = {}) => {
  const { serialize = JSON.stringify, deserialize = JSON.parse } = options;

  // Create state
  const [state, setState] = useState(() => {
    try {
      // Get stored value or use initial
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.warn(`Failed to read localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, serialize(state));
    } catch (error) {
      console.warn(`Failed to save localStorage key "${key}":`, error);
    }
  }, [key, state, serialize]);

  return [state, setState];
};

/**
 * Custom hook to persist multiple related values under one key
 * @param {string} key - The localStorage key
 * @param {Object} initialValue - Object with initial values
 * @returns {[state, setState, updateField]} - State, full setter, and field updater
 */
export const useLocalStorageObject = (key, initialValue) => {
  const [state, setState] = useLocalStorage(key, initialValue);

  // Function to update a single field
  const updateField = useCallback((fieldName, fieldValue) => {
    setState(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));
  }, [setState]);

  return [state, setState, updateField];
};

/**
 * Hook to clear localStorage for a specific key
 * @param {string} key - The localStorage key to clear
 * @returns {Function} - Function to clear the key
 */
export const useClearStorage = (key) => {
  return useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to clear localStorage key "${key}":`, error);
    }
  }, [key]);
};

export default useLocalStorage;
