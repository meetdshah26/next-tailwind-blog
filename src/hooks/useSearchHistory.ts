import { useState, useEffect, useRef } from "react";

const HISTORY_KEY = "search_history";

// FIXME currently  not use this code
export const useSearchHistory = (initialQuery: string, onSearch: (query: string) => void) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery || "");
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch search history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  // Handle outside click to close history dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    
    // Add event listener for detecting outside clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when component is unmounted or ref changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array ensures this runs only once when the component is mounted

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Handle search input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowHistory(true);
    if (value.length >= 3 || value.length === 0) {
      onSearch(value);
      updateHistory(value);
    }
  };

  // Update search history in localStorage
  const updateHistory = (query: string) => {
    if (!query || query.length < 3) return;
    const updated = [query, ...history.filter((item) => item !== query)].slice(0, 5); // keep top 5 searches
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    setHistory(updated);
  };

  // Clear search input
  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
  };

  // Select a history item
  const handleSelectHistory = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
    setShowHistory(false);
  };

  // Clear the search history
  const handleClearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  return {
    searchQuery,
    setSearchQuery,
    history,
    showHistory,
    setShowHistory,
    handleChange,
    handleClear,
    handleSelectHistory,
    handleClearHistory,
    wrapperRef,
  };
};
