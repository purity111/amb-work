'use client';

import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface UseFormPersistenceOptions {
  key: string;
  debounceMs?: number;
  excludeFields?: string[];
}

export function useFormPersistence<T extends Record<string, any>>(
  form: UseFormReturn<any>,
  options: UseFormPersistenceOptions
) {
  const { key, debounceMs = 1000, excludeFields = [] } = options;
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isRestoringRef = useRef(false);

  // Save form data to localStorage
  const saveFormData = (data: T) => {
    if (isRestoringRef.current) return;
    
    try {
      const filteredData = { ...data };
      
      // Remove excluded fields (like files that can't be serialized)
      excludeFields.forEach(field => {
        if (field in filteredData) {
          delete filteredData[field];
        }
      });

      // Convert File objects to a serializable format
      const serializedData = JSON.parse(JSON.stringify(filteredData, (key, value) => {
        if (value instanceof File) {
          return {
            __isFile: true,
            name: value.name,
            size: value.size,
            type: value.type,
            lastModified: value.lastModified
          };
        }
        return value;
      }));

      localStorage.setItem(key, JSON.stringify(serializedData));
    } catch (error) {
      console.warn('Failed to save form data:', error);
    }
  };

  // Restore form data from localStorage
  const restoreFormData = () => {
    try {
      const savedData = localStorage.getItem(key);
      if (!savedData) return false;

      const parsedData = JSON.parse(savedData);
      
      // Convert serialized File objects back to File objects
      const restoredData = JSON.parse(JSON.stringify(parsedData), (key, value) => {
        if (value && typeof value === 'object' && value.__isFile) {
          // Create a placeholder File object (we can't fully restore the file)
          return new File([], value.name, {
            type: value.type,
            lastModified: value.lastModified
          });
        }
        return value;
      });

      isRestoringRef.current = true;
      form.reset(restoredData);
      isRestoringRef.current = false;
      return true;
    } catch (error) {
      console.warn('Failed to restore form data:', error);
      return false;
    }
  };

  // Watch form changes and save with debounce
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        saveFormData(data as T);
      }, debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [form, debounceMs, excludeFields]);

  // Restore data on mount
  useEffect(() => {
    restoreFormData();
  }, []);

  // Clear saved data when form is successfully submitted
  const clearSavedData = () => {
    localStorage.removeItem(key);
  };

  return {
    restoreFormData,
    clearSavedData
  };
}

