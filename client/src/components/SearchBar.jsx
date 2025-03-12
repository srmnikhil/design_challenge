import SearchIcon from "@mui/icons-material/Search";
import { useState, useCallback } from "react";

const SearchBar = ({ search, setSearch }) => {
  // Define the debounced function using useCallback to ensure it's memoized.
  const debouncedFunction = useCallback(() => {
    let timer;
    return function (e) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setSearch(e.target.value); // Updating the parent with the search value
      }, 500);
    };
  }, [setSearch]); // `setSearch` is a dependency

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search vehicle parts..."
          onChange={debouncedFunction()} // This will now call the debounced function
          className="w-full py-3 px-5 border bg-white border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition"
        >
          <SearchIcon />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
