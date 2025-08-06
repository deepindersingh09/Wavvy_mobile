export interface AudioDBSong {
  idTrack: string;
  strTrack: string;
  strArtist: string;
  strAlbum?: string;
  intYearReleased?: string;
  strTrackThumb?: string;
  preview?: string; // URL to audio preview (if available)
}

// Fetches a song by its id from TheAudioDB API
export async function fetchSongById(id: string): Promise<AudioDBSong | null> {
  // Replace this URL with the endpoint you're actually using!
  // Example using TheAudioDB: https://theaudiodb.com/api/v1/json/2/track.php?h=32734374
  const API_URL = `https://theaudiodb.com/api/v1/json/2/track.php?h=${id}`;
  
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    if (json.track && json.track.length > 0) {
      const track = json.track[0];
      return {
        idTrack: track.idTrack,
        strTrack: track.strTrack,
        strArtist: track.strArtist,
        strAlbum: track.strAlbum,
        intYearReleased: track.intYearReleased,
        strTrackThumb: track.strTrackThumb,
        preview: track.strMusicVid || track.strTrackThumb, // replace with a proper audio preview URL if available
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching song from TheAudioDB:', error);
    return null;
  }
}
