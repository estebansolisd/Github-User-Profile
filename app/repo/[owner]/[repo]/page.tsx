"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface RepoDetails {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  updated_at: string;
  created_at: string;
  language: string | null;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export default function RepoPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;

  const [data, setData] = useState<RepoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRepo() {
      try {
        const res = await fetch(`/api/github/repo?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`);
        if (!res.ok) {
          throw new Error("Failed to fetch repository");
        }
        const repoData = await res.json();
        setData(repoData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
      setLoading(false);
    }
    fetchRepo();
  }, [owner, repo]);

  if (loading) {
    return (
      <main id="main" className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-500">Loading...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main id="main" className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-sm text-red-600">{error || "Repository not found"}</p>
      </main>
    );
  }

  return (
    <main id="main" className="max-w-2xl mx-auto px-4 py-8">
      <a href="/" className="text-sm text-gray-500 hover:text-gray-900">← Back</a>
      
      <h1 className="text-lg font-medium mt-4 mb-2">{data.name}</h1>
      <p className="text-sm text-gray-500 mb-4">{data.description || "No description"}</p>
      
      <div className="text-sm text-gray-400 flex gap-4">
        <span>{data.stargazers_count.toLocaleString()} stars</span>
        <span>{data.forks_count.toLocaleString()} forks</span>
        {data.language && <span>{data.language}</span>}
      </div>

      <div className="mt-4">
        <a href={data.html_url} className="text-sm underline">View on GitHub</a>
      </div>
    </main>
  );
}
