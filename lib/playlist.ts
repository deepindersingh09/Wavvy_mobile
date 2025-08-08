// import { supabase } from './supabase';

// export async function createPlaylist(playlistName: string) {
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) throw new Error("User not logged in");

//   const { data, error } = await supabase
//     .from('user_playlists')
//     .insert([{
//       name: playlistName,
//       created_by: user.id, // ✅ matches auth.uid()
//       is_pinned: false,
//       is_favourite: false
//     }])
//     .select()
//     .single();

//   if (error) throw error;
//   return data;
// }

// export async function addSongToPlaylist(playlistId: string, songId: string) {
//   const { data, error } = await supabase
//     .from('playlist_songs')
//     .insert([{
//       playlist_id: playlistId,
//       song_id: songId
//     }]);

//   if (error) throw error;
//   return data;
// }


// import { supabase } from './supabase';

// export async function fetchUserPlaylists(userId: string) {
//   const { data, error } = await supabase
//     .from('user_playlists')
//     .select('*')
//     .eq('created_by', userId)
//     .order('created_at', { ascending: false });

//   if (error) throw error;   
//   return data || [];
// }
import { supabase } from './supabase';

// Fetch all playlists (no user filter)
export async function fetchPlaylists() {
  const { data, error } = await supabase
    .from('user_playlists')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Create a new playlist (no user info needed)
export async function createPlaylist(name: string) {
  const { data, error } = await supabase
    .from('user_playlists')
    .insert([{ name, is_pinned: false, is_favourite: false }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Add a song to a playlist by IDs
export async function addSongToPlaylist(playlistId: string, songId: string) {
  const { error } = await supabase
    .from('playlist_songs')
    .insert([{ playlist_id: playlistId, song_id: songId }]);

  if (error) throw error;
}
