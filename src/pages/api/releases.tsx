export const getConfig = async () => {
  return {
    render: 'dynamic',
  };
};

interface GitHubRelease {
  tag_name: string;
  name: string;
  html_url: string;
  prerelease: boolean;
  published_at: string;
}

interface ReleaseInfo {
  stable: {
    version: string;
    name: string;
    url: string;
    publishedAt: string;
  } | null;
  prerelease: {
    version: string;
    name: string;
    url: string;
    publishedAt: string;
  } | null;
}

export default async function ReleasesAPI() {
  try {
    const response = await fetch(
      'https://api.github.com/repos/Love-Rox/rox/releases?per_page=20',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Rox-Homepage',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const releases: GitHubRelease[] = await response.json();

    // Find latest stable and prerelease
    let stable: ReleaseInfo['stable'] = null;
    let prerelease: ReleaseInfo['prerelease'] = null;

    for (const release of releases) {
      if (release.prerelease) {
        if (!prerelease) {
          prerelease = {
            version: release.tag_name,
            name: release.name,
            url: release.html_url,
            publishedAt: release.published_at,
          };
        }
      } else {
        if (!stable) {
          stable = {
            version: release.tag_name,
            name: release.name,
            url: release.html_url,
            publishedAt: release.published_at,
          };
        }
      }

      // Stop if we found both
      if (stable && prerelease) break;
    }

    const result: ReleaseInfo = { stable, prerelease };

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // 1 hour cache
      },
    });
  } catch (error) {
    console.error('Failed to fetch releases:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch releases', stable: null, prerelease: null }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      }
    );
  }
}
