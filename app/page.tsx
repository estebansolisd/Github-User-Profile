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
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (searchUsername: string) => {
    setUsername(searchUsername);
    setLoading(true);
    setError(null);
    setUser(null);
    setRepos([]);

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`/api/github/user?username=${encodeURIComponent(searchUsername)}`),
        fetch(`/api/github/repos?username=${encodeURIComponent(searchUsername)}&page=1&sort=updated`),
      ]);

      if (!userRes.ok) {
        if (userRes.status === 502) {
          setError("Unable to fetch user. Please check the username and try again.");
        } else {
          setError("User not found");
        }
        setLoading(false);
        return;
      }

      const userData = await userRes.json();
      setUser(userData);

      const reposData = await reposRes.json();
      
      setRepos(reposData.repos || []);
      setTotalCount(reposData.totalCount || 0);
      setHasMore(reposData.hasMore || false);

      setTimeout(() => {
        resultsRef.current?.focus();
      }, 100);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <main id="main" className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-medium mb-1">GitHub Profile Explorer</h1>
      <p className="text-sm text-gray-500 mb-6">Search for a GitHub user to view their profile and repositories.</p>

      <SearchUser onSearch={handleSearch} isLoading={loading} error={error} />

      <div ref={resultsRef} tabIndex={-1}>
        {user && (
          <div className="mt-8">
            <UserProfile user={user} />
            <div className="mt-6">
              <RepoList
                username={username}
                initialRepos={repos}
                totalCount={totalCount}
                hasMore={hasMore}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
