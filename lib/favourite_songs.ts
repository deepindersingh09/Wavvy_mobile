import { supabase } from './supabase';

// Returns true if this user has liked the given song
export async function isSongLiked(userId: string, songId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('favourite_songs')
    .select('id')
    .eq('user_id', userId)
    .eq('song_id', songId)
    .single();
  return !!data && !error;
}

// Adds a like for a song (if not already liked)
export async function addSongLike(userId: string, songId: string): Promise<void> {
  await supabase.from('favourite_songs').insert([
    { user_id: userId, song_id: songId }
  ]);
}

// Removes a like for a song
export async function removeSongLike(userId: string, songId: string): Promise<void> {
  await supabase
    .from('favourite_songs')
    .delete()
    .eq('user_id', userId)
    .eq('song_id', songId);
}
