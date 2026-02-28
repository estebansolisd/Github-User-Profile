export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  followers: number;
  following: number;
  public_repos: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface RepoApiResponse {
  repos: GitHubRepo[];
  totalCount: number;
  hasMore: boolean;
}
