import { GitHubUser } from "@/lib/types";

interface UserProfileProps {
  user: GitHubUser;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <section aria-label="User profile">
      <div className="flex items-center gap-3">
        <img
          src={user.avatar_url}
          alt={`${user.name || user.login}'s avatar`}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="text-base font-medium m-0">
            {user.name || user.login}
            {user.name && <span className="text-gray-500 font-normal"> ({user.login})</span>}
          </h3>
          <p className="m-0 text-sm text-gray-500">
            {user.followers} followers · {user.following} following
          </p>
        </div>
      </div>
    </section>
  );
}
