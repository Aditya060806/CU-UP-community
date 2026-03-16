import { NextResponse } from "next/server";
import type { GithubRepoInfo } from "@/types/portal";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repoUrl = searchParams.get("url");

  if (!repoUrl) return NextResponse.json({ error: "url is required" }, { status: 400 });

  // Parse GitHub URL → owner/repo
  let match: RegExpMatchArray | null = null;
  try {
    const url = new URL(repoUrl);
    // Support: github.com/owner/repo or github.com/owner/repo/...
    const parts = url.pathname.replace(/^\//, "").split("/");
    if (parts.length >= 2) match = [repoUrl, parts[0], parts[1]];
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!match) return NextResponse.json({ error: "Could not parse GitHub URL" }, { status: 400 });

  const [, owner, repo] = match;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 300 }, // cache 5 min
    });

    if (!res.ok) {
      if (res.status === 404)
        return NextResponse.json({ error: "Repository not found. Make sure it's public." }, { status: 404 });
      return NextResponse.json({ error: "GitHub API error" }, { status: res.status });
    }

    const data = await res.json();
    const info: GithubRepoInfo = {
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      language: data.language,
      stars: data.stargazers_count,
      forks: data.forks_count,
      topics: data.topics ?? [],
      defaultBranch: data.default_branch,
      htmlUrl: data.html_url,
      homepage: data.homepage,
      openIssues: data.open_issues_count,
      updatedAt: data.updated_at,
      avatarUrl: data.owner?.avatar_url,
    };
    return NextResponse.json(info);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
  }
}
