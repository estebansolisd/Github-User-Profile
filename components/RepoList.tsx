import { GitHubRepo } from "@/lib/types";

interface RepoListProps {
  repos: GitHubRepo[];
  totalCount: number;
  sort: "updated" | "stars";
  hasMore: boolean;
  isLoading: boolean;
  onSortChange: (sort: "updated" | "stars") => void;
  onLoadMore: () => void;
}

function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="py-3 border-b border-gray-200">
          <div className="h-4 w-1/3 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-3 w-2/3 bg-gray-100 rounded mb-2 animate-pulse"></div>
          <div className="h-2 w-1/4 bg-gray-100 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}

export function RepoList({ repos, totalCount, sort, hasMore, isLoading, onSortChange, onLoadMore }: RepoListProps) {
  return (
    <section aria-label="Repositories">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium">Repositories ({totalCount})</h2>
        <select
          id="sort-select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as "updated" | "stars")}
          disabled={isLoading}
          className="px-2 py-1 border border-gray-300 bg-white text-sm"
        >
          <option value="updated">Recently updated</option>
          <option value="stars">Most stars</option>
        </select>
      </div>
      
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <>
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
              onClick={onLoadMore}
              className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm"
            >
              Load more
            </button>
          )}
        </>
      )}
    </section>
  );
}
