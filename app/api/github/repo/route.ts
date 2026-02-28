import { NextResponse } from "next/server";
import { githubHeaders, parseJsonSafely } from "@/lib/github";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json({ error: "owner and repo are required" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
      headers: githubHeaders(),
      next: { revalidate: 60 }
    });

    const data = await parseJsonSafely(res);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Unable to fetch repository", status: res.status },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Network failure" }, { status: 502 });
  }
}
