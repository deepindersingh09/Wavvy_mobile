// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { supabase } from '../lib/supabase';

// export default function PlaylistsPage() {
//   const [playlists, setPlaylists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState<string | null>(null);

//   // Fetch current user
//   useEffect(() => {
//     async function getUser() {
//       const { data, error } = await supabase.auth.getUser();
//       if (!error && data?.user) {
//         setUserId(data.user.id);
//       }
//     }
//     getUser();
//   }, []);

//   // Fetch playlists once userId is available
//   useEffect(() => {
//     if (!userId) return;

//     async function fetchPlaylists() {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('user_playlists')
//         .select('*')
//         .eq('created_by', userId)
//         .order('created_at', { ascending: false });

//       if (error) {
//         console.error('Error fetching playlists:', error);
//       } else {
//         setPlaylists(data || []);
//       }
//       setLoading(false);
//     }

//     fetchPlaylists();
//   }, [userId]);

//   if (loading) return <ActivityIndicator size="large" color="#1A3164" style={{ flex: 1 }} />;

//   if (playlists.length === 0)
//     return (
//       <View style={styles.centered}>
//         <Text>No playlists found.</Text>
//       </View>
//     );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Your Playlists</Text>
//       <FlatList
//         data={playlists}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.playlistItem} onPress={() => {/* navigate to playlist details */}}>
//             <Text style={styles.playlistName}>{item.name}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1A3164' },
//   playlistItem: {
//     paddingVertical: 15,
//     borderBottomColor: '#ddd',
//     borderBottomWidth: 1,
//   },
//   playlistName: {
//     fontSize: 18,
//     color: '#1A3164',
//   },
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// });
    