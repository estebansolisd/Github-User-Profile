import { NextResponse } from "next/server";
import { githubHeaders, parseJsonSafely } from "@/lib/github";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = (searchParams.get("username") || "").trim();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sort = searchParams.get("sort") || "updated";

  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  try {
    const sortParam = sort === "stars" ? "stars" : "updated";
    const perPage = 20;
    const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?page=${page}&per_page=${perPage}&sort=${sortParam}&order=desc`;

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

    const repos = data || [];
    const totalCount = parseInt(res.headers.get("x-total-count") || "0", 10);

    console.log({ repos, data, totalCount }, "repos");
    

    return NextResponse.json({
      repos,
      totalCount,
      hasMore: page * perPage < totalCount
    });
  } catch {
    return NextResponse.json({ error: "Network failure" }, { status: 502 });
  }
}
