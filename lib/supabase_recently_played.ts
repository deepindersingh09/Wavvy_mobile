import { supabase } from './supabase';

// Add a row to recently_played when a user listens to a song
export async function recordRecentlyPlayed(userId: string, songId: string): Promise<void> {
  await supabase.from('recently_played').insert([
    { user_id: userId, song_id: songId }
  ]);
}
