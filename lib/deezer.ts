export interface DeezerTrack {
  id: number;
  title: string;
  artist: { name: string };
  album: { title: string; cover_medium: string };
  preview: string; // 30s MP3
}

export async function searchDeezerTracks(query: string): Promise<DeezerTrack[]> {
  const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.data as DeezerTrack[];
}

export async function fetchDeezerTrackById(id: string): Promise<DeezerTrack | null> {
  const url = `https://api.deezer.com/track/${id}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  return json as DeezerTrack;
}
