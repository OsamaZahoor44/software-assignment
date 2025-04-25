// pages/api/search.js
export default async function handler(req, res) {
  const { query, mediaType, page = 1, extensions } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  const baseUrl =
    mediaType === 'audio'
      ? 'https://api.openverse.org/v1/audio/'
      : mediaType === 'image'
      ? 'https://api.openverse.org/v1/images/'
      : null;

  if (!baseUrl) {
    return res.status(400).json({ error: 'Invalid or unsupported mediaType' });
  }

  const params = new URLSearchParams({
    q: query,
    page,
    page_size: '20',
  });

  if (extensions) {
    params.append('extension', extensions);
  }

  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Openverse API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json({
      results: data.results || [],
      totalResults: data.result_count || 0,
    });
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ error: error.message });
  }
}
