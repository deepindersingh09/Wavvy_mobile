import { supabase } from './supabase';

// Add a song to a playlist
export async function addSongToPlaylist(playlistId: string, songId: string) {
  const { data, error } = await supabase
    .from('playlist_songs')
    .insert([{ playlist_id: playlistId, song_id: songId }]);

  if (error) throw error;
  return data;
}

// Remove a song from a playlist
export async function removeSongFromPlaylist(playlistId: string, songId: string) {
  const { error } = await supabase
    .from('playlist_songs')
    .delete()
    .eq('playlist_id', playlistId)
    .eq('song_id', songId);

  if (error) throw error;
}

// Fetch all songs for a playlist
export async function fetchSongsInPlaylist(playlistId: string) {
  const { data, error } = await supabase
    .from('playlist_songs')
    .select('song_id')
    .eq('playlist_id', playlistId);

  if (error) throw error;
  return data || [];
}
