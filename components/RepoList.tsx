"use client";

import { useState } from "react";
import { GitHubRepo } from "@/lib/types";

interface RepoListProps {
  username: string;
  initialRepos: GitHubRepo[];
  totalCount: number;
  hasMore: boolean;
}

export function RepoList({ username, initialRepos, totalCount, hasMore: initialHasMore }: RepoListProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>(initialRepos);
  const [sort, setSort] = useState<"updated" | "stars">("updated");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/github/repos?username=${encodeURIComponent(username)}&page=${page + 1}&sort=${sort}`);
      const data = await res.json();
      if (data.repos) {
        setRepos((prev) => [...prev, ...data.repos]);
        setPage((p) => p + 1);
        setHasMore(data.hasMore);
      }
    } catch (err) {
      console.error("Failed to load more repos:", err);
    }
    setIsLoading(false);
  };

  const handleSortChange = async (newSort: "updated" | "stars") => {
    setSort(newSort);
    setPage(1);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/github/repos?username=${encodeURIComponent(username)}&page=1&sort=${newSort}`);
      const data = await res.json();
      if (data.repos) {
        setRepos(data.repos);
        setHasMore(data.hasMore);
      }
    } catch (err) {
      console.error("Failed to sort repos:", err);
    }
    setIsLoading(false);
  };

  return (
    <section aria-label="Repositories">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium">Repositories ({totalCount})</h2>
        <select
          id="sort-select"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value as "updated" | "stars")}
          disabled={isLoading}
          className="px-2 py-1 border border-gray-300 bg-white text-sm"
        >
          <option value="updated">Recently updated</option>
          <option value="stars">Most stars</option>
        </select>
      </div>
      <div role="list" className="flex flex-col gap-3">
        {repos.map((repo) => (
          <div
            key={repo.id}
            role="listitem"
            className="py-3 border-b border-gray-200"
          >
            <h3 className="text-sm font-medium m-0">
              <a href={`/repo/${repo.owner.login}/${repo.name}`}>
                {repo.name}
              </a>
            </h3>
            <p className="text-sm text-gray-500 m-0 mt-1">
              {repo.description || "—"}
            </p>
            <div className="text-xs text-gray-400 mt-2 flex gap-3">
              <span>{repo.stargazers_count.toLocaleString()} stars</span>
              <span>{repo.forks_count.toLocaleString()} forks</span>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm disabled:bg-gray-300"
        >
          {isLoading ? "..." : "Load more"}
        </button>
      )}
    </section>
  );
}
