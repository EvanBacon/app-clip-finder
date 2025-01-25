"use server";

export async function lookupClipAsync(url: string): Promise<string[]> {
  // ensure https:// prefix
  if (!url.startsWith("https://")) {
    url = `https://${url}`;
  }

  // Normalize the URL
  const normalizedUrl = new URL(url);
  const baseUrl = `${normalizedUrl.protocol}//${normalizedUrl.host}`;

  // Define possible locations for the apple-app-site-association file
  const locations = [
    `${baseUrl}/.well-known/apple-app-site-association`,
    `${baseUrl}/apple-app-site-association`,
  ];

  // Attempt to download the apple-app-site-association file from both locations
  let associationFile;
  for (const location of locations) {
    try {
      const response = await fetch(location);
      if (response.ok) {
        associationFile = await response.json();
        break;
      }
    } catch (error) {
      // Continue to the next location if the file is not found
      continue;
    }
  }

  if (!associationFile) {
    throw new Error("apple-app-site-association file not found");
  }

  // Extract the app clip bundle ID if it exists
  const appClips = associationFile?.["appclips"];
  if (appClips && appClips.apps && appClips.apps.length > 0) {
    return appClips.apps.map((appId) => {
      // Split the first part (TEAM ID)
      const [teamId, ...bundleId] = appId.split(".");
      return bundleId.join(".");
    });
  } else {
    throw new Error(`URL ${url} does not have an App Clip`);
  }
}
