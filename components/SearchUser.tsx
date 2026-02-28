"use client";

import { useState, FormEvent } from "react";

interface SearchUserProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export function SearchUser({ onSearch, isLoading, error }: SearchUserProps) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <section aria-label="Search section">
      <form onSubmit={handleSubmit} role="search" className="flex gap-2">
        <input
          id="username-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          disabled={isLoading}
          className="flex-1 px-3 py-2 border border-gray-300 bg-white text-sm"
        />
        <button
          type="submit"
          disabled={isLoading || !username.trim()}
          className="px-4 py-2 bg-gray-900 text-white text-sm disabled:bg-gray-300"
        >
          {isLoading ? "..." : "Search"}
        </button>
      </form>
      {error && (
        <div role="alert" aria-live="polite" className="text-red-600 text-sm mt-2">
          {error}
        </div>
      )}
    </section>
  );
}
