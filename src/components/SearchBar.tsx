"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiSearch, FiX, FiClock } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";

type Props = {
  onSearch: (query: string) => void;
  initialQuery?: string;
  loading?: boolean;
};
const HISTORY_KEY = "search_history";

const SearchBar = ({ onSearch, initialQuery = "", loading = false }: Props) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery || "");
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowHistory(true);
    if (value.length >= 3 || value.length === 0) {
      onSearch(value); // Trigger debounced search
      updateHistory(value);
    }
  };

  // Update localStorage
  const updateHistory = (query: string) => {
    if (!query || query.length < 3) return;
    const updated = [query, ...history.filter((item) => item !== query)].slice(
      0,
      5
    ); // top 5
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    setHistory(updated);
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
  };

  const handleSelectHistory = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative w-full max-w-xl mx-auto mb-6 mt-3"
    >
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
        <FiSearch size={20} />
      </div>

      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        type="text"
        value={searchQuery}
        onChange={handleChange}
        onFocus={() => setShowHistory(true)}
        placeholder="Search..."
        className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />

      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        {loading ? (
          <ImSpinner2 className="animate-spin text-blue-500" size={20} />
        ) : (
          searchQuery && (
            <button
              onClick={handleClear}
              className="text-gray-500 hover:text-red-500 transition-colors duration-200"
            >
              <FiX size={20} />
            </button>
          )
        )}
      </div>

      {/* Dropdown history */}
      {showHistory && history.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {history.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectHistory(item)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-black"
            >
              <FiClock />
              <span>{item}</span>
            </button>
          ))}
          <button
            onClick={handleClearHistory}
            className="w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-200"
          >
            Clear Search History
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
