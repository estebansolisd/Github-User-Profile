"use client";

import { useState, useRef } from "react";
import { SearchUser } from "../components/SearchUser";
import { UserProfile } from "../components/UserProfile";
import { RepoList } from "../components/RepoList";
import { GitHubUser, GitHubRepo } from "../lib/types";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"updated" | "stars">("updated");
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const hasMore = repos.length < totalCount;

  const loadRepos = async (searchUsername: string, sortValue: string, pageNum: number) => {
    setIsLoadingRepos(true);
    try {
      const startTime = Date.now();
      const res = await fetch(`/api/github/repos?username=${encodeURIComponent(searchUsername)}&page=${pageNum}&sort=${sortValue}`);
      const data = await res.json();
      
      const elapsed = Date.now() - startTime;
      const delay = elapsed < 500 ? 500 - elapsed : 0;
      
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      return data;
    } catch (err) {
      console.error("Failed to load repos:", err);
      return { repos: [] };
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const handleSearch = async (searchUsername: string) => {
    setUsername(searchUsername);
    setIsLoadingUser(true);
    setError(null);
    setUser(null);
    setRepos([]);
    setPage(1);
    setSort("updated");

    try {
      const userRes = await fetch(`/api/github/user?username=${encodeURIComponent(searchUsername)}`);

      if (!userRes.ok) {
        if (userRes.status === 502) {
          setError("Unable to fetch user. Please check the username and try again.");
        } else {
          setError("User not found");
        }
        setIsLoadingUser(false);
        return;
      }

      const userData = await userRes.json();
      setUser(userData);
      setTotalCount(userData.public_repos || 0);
      setIsLoadingUser(false);

      const reposData = await loadRepos(searchUsername, "updated", 1);
      setRepos(reposData.repos || []);

      setTimeout(() => {
        resultsRef.current?.focus();
      }, 100);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
      setIsLoadingUser(false);
    }
  };

  const loadMoreRepos = async () => {
    if (isLoadingRepos || !hasMore) return;
    
    const nextPage = page + 1;
    const data = await loadRepos(username, sort, nextPage);
    if (data.repos && data.repos.length > 0) {
      setRepos((prev) => [...prev, ...data.repos]);
      setPage(nextPage);
    }
  };

  const handleSortChange = async (newSort: "updated" | "stars") => {
    setSort(newSort);
    setPage(1);
    const data = await loadRepos(username, newSort, 1);
    if (data.repos) {
      setRepos(data.repos);
    }
  };

  return (
    <main id="main" className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-medium mb-1">GitHub Profile Explorer</h1>
      <p className="text-sm text-gray-500 mb-6">Search for a GitHub user to view their profile and repositories.</p>

      <SearchUser onSearch={handleSearch} isLoading={isLoadingUser} error={error} />

      <div ref={resultsRef} tabIndex={-1}>
        {user && (
          <div className="mt-8">
            <UserProfile user={user} />
            <div className="mt-6">
              <RepoList
                repos={repos}
                totalCount={totalCount}
                sort={sort}
                hasMore={hasMore}
                isLoading={isLoadingRepos}
                onSortChange={handleSortChange}
                onLoadMore={loadMoreRepos}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
