// import React, { useEffect, useState } from 'react';
// import {
//     ActivityIndicator,
//     FlatList,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { fetchDeezerTrackById } from '../lib/deezer'; // Your existing function
// import { supabase } from '../lib/supabase'; // Adjust path as needed

// export default function PlaylistDetailScreen({ route, navigation }) {
//   const { playlistId, playlistName } = route.params;

//   const [songs, setSongs] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     navigation.setOptions({ title: playlistName });
//   }, [navigation, playlistName]);

//   useEffect(() => {
//     async function fetchPlaylistSongs() {
//       setLoading(true);

//       // Step 1: Get all song IDs in the playlist
//       const { data: playlistSongs, error } = await supabase
//         .from('playlist_songs')
//         .select('song_id')
//         .eq('playlist_id', playlistId);

//       if (error) {
//         console.error('Error fetching playlist songs:', error);
//         setLoading(false);
//         return;
//       }

//       if (!playlistSongs || playlistSongs.length === 0) {
//         setSongs([]);
//         setLoading(false);
//         return;
//       }

//       // Step 2: Fetch song details from Deezer API or your source
//       try {
//         const songDetails = await Promise.all(
//           playlistSongs.map(async (ps) => {
//             return await fetchDeezerTrackById(ps.song_id);
//           })
//         );
//         setSongs(songDetails);
//       } catch (e) {
//         console.error('Error fetching song details:', e);
//       }
//       setLoading(false);
//     }

//     fetchPlaylistSongs();
//   }, [playlistId]);

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#1A3164" />
//       </View>
//     );
//   }

//   if (songs.length === 0) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.noSongsText}>No songs found in this playlist.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={songs}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.songItem}
//             onPress={() => navigation.navigate('SongPlayer', { id: item.id.toString() })}
//           >
//             <Text style={styles.songTitle}>{item.title}</Text>
//             <Text style={styles.songArtist}>{item.artist.name}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 20 },
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   noSongsText: { fontSize: 16, color: '#888' },
//   songItem: {
//     paddingVertical: 12,
//     borderBottomColor: '#ddd',
//     borderBottomWidth: 1,
//   },
//   songTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1A3164',
//   },
//   songArtist: {
//     fontSize: 14,
//     color: '#666',
//   },
// });
