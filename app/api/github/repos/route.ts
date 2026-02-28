import { NextResponse } from "next/server";
import { githubHeaders, parseJsonSafely } from "../../../../lib/github";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = (searchParams.get("username") || "").trim();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sort = searchParams.get("sort") || "updated";

  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  try {
    const perPage = 30;
    const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?page=${page}&per_page=${perPage}&sort=updated&order=desc`;

    const res = await fetch(url, {
      headers: githubHeaders(),
      next: { revalidate: 60 }
    });

    const data = await parseJsonSafely(res);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Unable to fetch repositories", status: res.status },
        { status: 502 }
      );
    }

    let repos = data || [];

    if (sort === "stars") {
      repos = repos.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count);
    }

    return NextResponse.json({
      repos
    });
  } catch {
    return NextResponse.json({ error: "Network failure" }, { status: 502 });
  }
}
