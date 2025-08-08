// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React, { useContext, useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { DeezerTrack } from '../../lib/deezer';
// import { supabase } from '../../lib/supabase';
// import { ThemeContext } from '../../lib/ThemeContext';

// export default function Library() {
//   const router = useRouter();
//   const { darkMode } = useContext(ThemeContext);  
 
//   const categories = [ 'Favourites','Playlists', 'Albums', 'Artists',];
//   const [activeCategory, setActiveCategory] = useState('Playlists');
 
//   const [favourites, setFavourites] = useState<DeezerTrack[]>([]);
// const [favouritesLoading, setFavouritesLoading] = useState(false);
// const [userId, setUserId] = useState<string | null>(null);
//   const [playlists, setPlaylists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreate, setShowCreate] = useState(false);
//   const [newName, setNewName] = useState('');
//   const [sort, setSort] = useState('recent'); // Or 'name'
//   const [showPinned, setShowPinned] = useState(false);
 
//   const fetchPlaylists = async () => {
//     setLoading(true);
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (user) {
//       let query = supabase.from('playlists').select('*').eq('created_by', user.id);
 
//       if (sort === 'name') query = query.order('name', { ascending: true });
//       else query = query.order('created_at', { ascending: false });
 
//       if (showPinned) query = query.eq('is_pinned', true);
 
//       const { data, error } = await query;
//       if (!error) setPlaylists(data || []);
//     }
//     setLoading(false);
//   };
 
//   useEffect(() => {
//     fetchPlaylists();
//   }, [sort, showPinned, showCreate]);
 
//   const togglePin = async (playlistId, currentPinned) => {
//     await supabase.from('playlists').update({ is_pinned: !currentPinned }).eq('id', playlistId);
//     await fetchPlaylists();
//   };
 
//   const deletePlaylist = async (playlistId) => {
//     await supabase.from('playlists').delete().eq('id', playlistId);
//     await fetchPlaylists();
//   };
 
//   const handleCreatePlaylist = async () => {
//     if (!newName.trim()) return;
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (user) {
//       await supabase.from('playlists').insert([{ name: newName, created_by: user.id, is_pinned: false }]);
//       setShowCreate(false);
//       setNewName('');
//       await fetchPlaylists();
//     }
//   };
 
//   const albums = [];
//   const artists = [];
 
//   return (
//     <SafeAreaView style={[styles.safeArea, darkMode && styles.darkSafeArea]}>
//       <TouchableOpacity onPress={() => router.back()}>
//         <Ionicons
//           name="arrow-back"
//           size={24}
//           color={darkMode ? '#fff' : '#1A3164'}
//           style={{ marginTop: 45, marginLeft: 15 }}
//         />
//       </TouchableOpacity>
 
//       <ScrollView style={[styles.container, darkMode && styles.darkContainer]} showsVerticalScrollIndicator={false}>
//         {/* Top Bar */}
//         <View style={styles.topBar}>
//           <Text style={[styles.title, darkMode && styles.darkTitle]}>Your Library</Text>
//           <View style={styles.iconRow}>
//             <TouchableOpacity onPress={() => setShowCreate(true)}>
//               <Text style={[styles.topIcon, { marginLeft: 10 }, darkMode && styles.darkTopIcon]}>＋</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
 
//         {/* Pill Categories */}
//         <View style={styles.categoryRow}>
//           {categories.map((cat) => (
//             <TouchableOpacity
//               key={cat}
//               style={[
//                 styles.categoryPill,
//                 activeCategory === cat && styles.activeCategory,
//                 darkMode && styles.darkCategoryPill,
//                 darkMode && activeCategory === cat && styles.darkActiveCategory,
//               ]}
//               onPress={() => setActiveCategory(cat)}
//             >
//               <Text
//                 style={[
//                   styles.categoryText,
//                   activeCategory === cat && styles.activeCategoryText,
//                   darkMode && styles.darkCategoryText,
//                   darkMode && activeCategory === cat && styles.darkActiveCategoryText,
//                 ]}
//               >
//                 {cat}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
 
//         {/* Recents Header and Sorting */}
//         <View style={styles.recentsHeader}>
//           <Text style={[styles.recentsLabel, darkMode && styles.darkRecentsLabel]}>Recents</Text>
//           <View style={{ flexDirection: 'row', gap: 10 }}>
//             <TouchableOpacity onPress={() => setSort('recent')}>
//               <Text style={[styles.gridIcon, sort === 'recent' && styles.activeIcon, darkMode && styles.darkGridIcon]}>
//                 ⏱️
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setSort('name')}>
//               <Text style={[styles.gridIcon, sort === 'name' && styles.activeIcon, darkMode && styles.darkGridIcon]}>
//                 A-Z
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setShowPinned(!showPinned)}>
//               <Text style={[styles.gridIcon, showPinned && styles.activeIcon, darkMode && styles.darkGridIcon]}>📌</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
 
//         {/* Library Items */}
//         <View>
//           {activeCategory === 'Playlists' &&
//             (loading ? (
//               <ActivityIndicator color={darkMode ? '#fff' : '#1A3164'} />
//             ) : playlists.length === 0 ? (
//               <Text style={[{ color: '#888', textAlign: 'center', marginTop: 40 }, darkMode && { color: '#bbb' }]}>
//                 No playlists yet.
//               </Text>
//             ) : (
//               playlists.map((item) => (
//                 <TouchableOpacity key={item.id} style={[styles.libraryItemRow, darkMode && styles.darkLibraryItemRow]} activeOpacity={0.8}>
//                   <View style={[styles.albumThumb, { backgroundColor: item.is_pinned ? '#FFD880' : darkMode ? '#222' : '#EDF0F7' }]}>
//                     {item.is_pinned && (
//                       <Text style={{ fontSize: 18, color: '#1A3164', fontWeight: 'bold' }}>★</Text>
//                     )}
//                   </View>
//                   <View style={styles.libraryInfo}>
//                     <Text style={[styles.libraryTitle, darkMode && styles.darkLibraryTitle]}>{item.name}</Text>
//                     <Text style={[styles.librarySubtitle, darkMode && styles.darkLibrarySubtitle]}>
//                       Playlist • {item.track_count || 0} songs
//                     </Text>
//                   </View>
//                   <TouchableOpacity onPress={() => togglePin(item.id, item.is_pinned)}>
//                     <Text style={{ fontSize: 18, color: item.is_pinned ? '#FFC800' : '#bbb' }}>📌</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity onPress={() => deletePlaylist(item.id)}>
//                     <Text style={{ fontSize: 18, color: '#F55' }}>🗑️</Text>
//                   </TouchableOpacity>
//                 </TouchableOpacity>
//               ))
//             ))}
//           {/* You can add Albums/Artists sections here in the future */}
//         </View>
//       </ScrollView>
 
//       {/* Create Playlist Modal */}
//       <Modal visible={showCreate} animationType="slide" transparent>
//         <View style={[styles.modalBackdrop, darkMode && styles.darkModalBackdrop]}>
//           <View style={[styles.modalCard, darkMode && styles.darkModalCard]}>
//             <Text style={[styles.modalTitle, darkMode && styles.darkModalTitle]}>Create New Playlist</Text>
//             <TextInput
//               placeholder="Playlist Name"
//               value={newName}
//               onChangeText={setNewName}
//               style={[styles.modalInput, darkMode && styles.darkModalInput]}
//               autoFocus
//               placeholderTextColor={darkMode ? '#aaa' : '#888'}
//             />
//             <View style={{ flexDirection: 'row', marginTop: 16, gap: 16 }}>
//               <TouchableOpacity style={styles.modalBtn} onPress={handleCreatePlaylist}>
//                 <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalBtn, { backgroundColor: '#eee' }]}
//                 onPress={() => setShowCreate(false)}
//               >
//                 <Text style={{ color: '#1A3164', fontWeight: 'bold' }}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }
 
// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#fff' },
//   darkSafeArea: { backgroundColor: '#000' },
 
//   container: { flex: 1, backgroundColor: '#fff', padding: 16 },
//   darkContainer: { backgroundColor: '#000' },
 
//   topBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 14,
//   },
//   title: { fontSize: 22, fontWeight: '700', color: '#1A3164', flex: 1 },
//   darkTitle: { color: '#fff' },
 
//   iconRow: { flexDirection: 'row' },
//   topIcon: { fontSize: 20, color: '#1A3164' },
//   darkTopIcon: { color: '#bbb' },
 
//   categoryRow: {
//     flexDirection: 'row',
//     marginBottom: 14,
//     gap: 12,
//   },
//   categoryPill: {
//     backgroundColor: '#EDF0F7',
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   darkCategoryPill: { backgroundColor: '#222' },
//   categoryText: {
//     fontSize: 14,
//     color: '#1A3164',
//     fontWeight: '500',
//   },
//   darkCategoryText: { color: '#bbb' },
//   activeCategory: { backgroundColor: '#1A3164' },
//   darkActiveCategory: { backgroundColor: '#3E65B6' },
//   activeCategoryText: { color: '#fff', fontWeight: '700' },
//   darkActiveCategoryText: { color: '#fff' },
 
//   recentsHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//     marginTop: 8,
//   },
//   recentsLabel: { color: '#888', fontWeight: '600', fontSize: 16 },
//   darkRecentsLabel: { color: '#bbb' },
 
//   gridIcon: { color: '#888', fontSize: 17, marginRight: 7 },
//   darkGridIcon: { color: '#bbb' },
 
//   activeIcon: { color: '#1A3164', fontWeight: 'bold' },
 
//   libraryItemRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 18,
//     borderRadius: 13,
//     backgroundColor: '#fff',
//     paddingVertical: 2,
//     paddingRight: 8,
//   },
//   darkLibraryItemRow: { backgroundColor: '#111' },
 
//   albumThumb: {
//     width: 56,
//     height: 56,
//     borderRadius: 11,
//     marginRight: 13,
//     alignItems: 'center',
//     justifyContent: 'center',
//     overflow: 'hidden',
//   },
 
//   libraryInfo: { flex: 1 },
//   libraryTitle: { fontSize: 16, fontWeight: '700', color: '#1A3164' },
//   darkLibraryTitle: { color: '#fff' },
 
//   librarySubtitle: { color: '#888', fontWeight: '500', fontSize: 13 },
//   darkLibrarySubtitle: { color: '#bbb' },
 
//   // Modal
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   darkModalBackdrop: { backgroundColor: 'rgba(255,255,255,0.1)' },
 
//   modalCard: {
//     backgroundColor: '#fff',
//     borderRadius: 18,
//     padding: 24,
//     width: '80%',
//     alignItems: 'center',
//   },
//   darkModalCard: { backgroundColor: '#222' },
 
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1A3164',
//     marginBottom: 16,
//   },
//   darkModalTitle: { color: '#fff' },
 
//   modalInput: {
//     backgroundColor: '#EDF0F7',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     height: 44,
//     width: '100%',
//     fontSize: 16,
//     marginBottom: 4,
//     color: '#1A3164',
//   },
//   darkModalInput: {
//     backgroundColor: '#333',
//     color: '#ccc',
//   },
 
//   modalBtn: {
//     flex: 1,
//     backgroundColor: '#1A3164',
//     borderRadius: 10,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
// });


// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React, { useContext, useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Image,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { fetchDeezerTrackById } from '../../lib/deezer'; // Your Deezer API fetch function
// import { supabase } from '../../lib/supabase';
// import { ThemeContext } from '../../lib/ThemeContext';

// export default function Library() {
//   const router = useRouter();
//   const { darkMode } = useContext(ThemeContext);

//   const categories = ['Favourites', 'Playlists', 'Albums', 'Artists'];
//   const [activeCategory, setActiveCategory] = useState('Favourites');

//   const [favouriteSongs, setFavouriteSongs] = useState([]);
//   const [favLoading, setFavLoading] = useState(false);

//   const [playlists, setPlaylists] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch favourite songs from Supabase, then Deezer details
//   const fetchFavouriteSongs = async () => {
//     setFavLoading(true);
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       setFavouriteSongs([]);
//       setFavLoading(false);
//       return;
//     }

//     const { data: likedSongs, error } = await supabase
//       .from('favourite_songs')
//       .select('song_id')
//       .eq('user_id', user.id);

//     if (error) {
//       console.error('Error fetching liked songs:', error);
//       setFavouriteSongs([]);
//       setFavLoading(false);
//       return;
//     }

//     const songs = [];
//     for (const item of likedSongs) {
//       try {
//         const songDetails = await fetchDeezerTrackById(item.song_id);
//         if (songDetails) songs.push(songDetails);
//       } catch (err) {
//         console.warn(`Failed to fetch song ${item.song_id}`, err);
//       }
//     }

//     setFavouriteSongs(songs);
//     setFavLoading(false);
//   };

//   useEffect(() => {
//     fetchFavouriteSongs();
//     // You can also fetch playlists or other data here if needed
//   }, []);

//   // Open player with song id
//   const openSong = (id) => {
//     router.push(`/player/${id}`);
//   };

//   // Render favourite songs list UI
//   const renderFavourites = () => {
//     if (favLoading) return <ActivityIndicator color={darkMode ? '#fff' : '#1A3164'} />;

//     if (favouriteSongs.length === 0) {
//       return <Text style={[styles.emptyText, darkMode && styles.darkEmptyText]}>No favourite songs yet.</Text>;
//     }

//     return favouriteSongs.map((song) => (
//       <TouchableOpacity
//         key={song.id}
//         style={[styles.libraryItemRow, darkMode && styles.darkLibraryItemRow]}
//         onPress={() => openSong(song.id.toString())}
//       >
//         <View style={styles.albumThumb}>
//           {song.album?.cover_medium ? (
//             <Image
//               source={{ uri: song.album.cover_medium }}
//               style={{ width: 56, height: 56, borderRadius: 11 }}
//             />
//           ) : (
//             <Ionicons name="musical-notes-outline" size={40} color="#888" />
//           )}
//         </View>
//         <View style={styles.libraryInfo}>
//           <Text style={[styles.libraryTitle, darkMode && styles.darkLibraryTitle]} numberOfLines={1}>
//             {song.title}
//           </Text>
//           <Text style={[styles.librarySubtitle, darkMode && styles.darkLibrarySubtitle]} numberOfLines={1}>
//             {song.artist.name}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     ));
//   };

//   // You can keep your playlists and other category UI similar to your previous code here...
//   // For brevity, this example shows only Favourites category UI.

//   return (
//     <SafeAreaView style={[styles.safeArea, darkMode && styles.darkSafeArea]}>
//       <TouchableOpacity onPress={() => router.back()}>
//         <Ionicons
//           name="arrow-back"
//           size={24}
//           color={darkMode ? '#fff' : '#1A3164'}
//           style={{ marginTop: 45, marginLeft: 15 }}
//         />
//       </TouchableOpacity>

//       <ScrollView style={[styles.container, darkMode && styles.darkContainer]} showsVerticalScrollIndicator={false}>
//         <View style={styles.categoryRow}>
//           {categories.map((cat) => (
//             <TouchableOpacity
//               key={cat}
//               style={[
//                 styles.categoryPill,
//                 activeCategory === cat && styles.activeCategory,
//                 darkMode && styles.darkCategoryPill,
//                 darkMode && activeCategory === cat && styles.darkActiveCategory,
//               ]}
//               onPress={() => setActiveCategory(cat)}
//             >
//               <Text
//                 style={[
//                   styles.categoryText,
//                   activeCategory === cat && styles.activeCategoryText,
//                   darkMode && styles.darkCategoryText,
//                   darkMode && activeCategory === cat && styles.darkActiveCategoryText,
//                 ]}
//               >
//                 {cat}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <View>
//           {activeCategory === 'Favourites' && renderFavourites()}

//           {/* Add Playlists, Albums, Artists UI here as per your existing code */}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#fff' },
//   darkSafeArea: { backgroundColor: '#000' },

//   container: { flex: 1, backgroundColor: '#fff', padding: 16 },
//   darkContainer: { backgroundColor: '#000' },

//   categoryRow: {
//     flexDirection: 'row',
//     marginBottom: 14,
//     gap: 12,
//   },
//   categoryPill: {
//     backgroundColor: '#EDF0F7',
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   darkCategoryPill: { backgroundColor: '#222' },
//   categoryText: {
//     fontSize: 14,
//     color: '#1A3164',
//     fontWeight: '500',
//   },
//   darkCategoryText: { color: '#bbb' },
//   activeCategory: { backgroundColor: '#1A3164' },
//   darkActiveCategory: { backgroundColor: '#3E65B6' },
//   activeCategoryText: { color: '#fff', fontWeight: '700' },
//   darkActiveCategoryText: { color: '#fff' },

//   libraryItemRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 18,
//     borderRadius: 13,
//     backgroundColor: '#fff',
//     paddingVertical: 6,
//     paddingRight: 8,
//   },
//   darkLibraryItemRow: { backgroundColor: '#111' },

//   albumThumb: {
//     width: 56,
//     height: 56,
//     borderRadius: 11,
//     marginRight: 13,
//     alignItems: 'center',
//     justifyContent: 'center',
//     overflow: 'hidden',
//   },

//   libraryInfo: { flex: 1 },
//   libraryTitle: { fontSize: 16, fontWeight: '700', color: '#1A3164' },
//   darkLibraryTitle: { color: '#fff' },

//   librarySubtitle: { color: '#888', fontWeight: '500', fontSize: 13 },
//   darkLibrarySubtitle: { color: '#bbb' },

//   emptyText: { textAlign: 'center', marginTop: 40, color: '#888' },
//   darkEmptyText: { color: '#bbb' },
// });



import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fetchDeezerTrackById } from '../../lib/deezer';
import { supabase } from '../../lib/supabase';
import { ThemeContext } from '../../lib/ThemeContext';

export default function Library() {
  const router = useRouter();
  const { darkMode } = useContext(ThemeContext);

  // const categories = ['Favourites', 'Playlists', 'Albums', 'Artists'];
    const categories = ['Favourites'];
  const [activeCategory, setActiveCategory] = useState('Favourites');

  const [favouriteSongs, setFavouriteSongs] = useState([]);
  const [favLoading, setFavLoading] = useState(false);

  const fetchFavouriteSongs = async () => {
    setFavLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setFavouriteSongs([]);
      setFavLoading(false);
      return;
    }

    const { data: likedSongs, error } = await supabase
      .from('favourite_songs')
      .select('id, song_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching liked songs:', error);
      setFavouriteSongs([]);
      setFavLoading(false);
      return;
    }

    const songs = [];
    for (const item of likedSongs) {
      try {
        const songDetails = await fetchDeezerTrackById(item.song_id);
        if (songDetails) songs.push({ ...songDetails, favRecordId: item.id });
      } catch (err) {
        console.warn(`Failed to fetch song ${item.song_id}`, err);
      }
    }

    setFavouriteSongs(songs);
    setFavLoading(false);
  };

  useEffect(() => {
    fetchFavouriteSongs();
  }, []);

  const openSong = (id) => {
    router.push(`/player/${id}`);
  };

  // Remove song from favourites
  const unlikeSong = async (favRecordId) => {
    setFavLoading(true);
    const { error } = await supabase.from('favourite_songs').delete().eq('id', favRecordId);
    if (error) {
      console.error('Error removing favourite:', error);
    }
    await fetchFavouriteSongs();
  };

  const renderFavourites = () => {
    if (favLoading) return <ActivityIndicator color={darkMode ? '#fff' : '#1A3164'} />;

    if (favouriteSongs.length === 0) {
      return <Text style={[styles.emptyText, darkMode && styles.darkEmptyText]}>No favourite songs yet.</Text>;
    }

    return favouriteSongs.map((song) => (
      <View
        key={song.id}
        style={[styles.libraryItemRow, darkMode && styles.darkLibraryItemRow]}
      >
        <TouchableOpacity
          style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
          onPress={() => openSong(song.id.toString())}
        >
          <View style={styles.albumThumb}>
            {song.album?.cover_medium ? (
              <Image
                source={{ uri: song.album.cover_medium }}
                style={{ width: 56, height: 56, borderRadius: 11 }}
              />
            ) : (
              <Ionicons name="musical-notes-outline" size={40} color="#888" />
            )}
          </View>
          <View style={styles.libraryInfo}>
            <Text style={[styles.libraryTitle, darkMode && styles.darkLibraryTitle]} numberOfLines={1}>
              {song.title}
            </Text>
            <Text style={[styles.librarySubtitle, darkMode && styles.darkLibrarySubtitle]} numberOfLines={1}>
              {song.artist.name}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Heart Icon to unlike */}
        <TouchableOpacity onPress={() => unlikeSong(song.favRecordId)} style={{ padding: 10 }}>
          <Ionicons name="heart" size={24} color="red" />
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <SafeAreaView style={[styles.safeArea, darkMode && styles.darkSafeArea]}>
            <View style={[styles.header, { backgroundColor: darkMode ? '#121212' : '#fff' }]}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={darkMode ? '#fff' : '#1A3164'} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: darkMode ? '#fff' : '#1A3164' }]}>My Library</Text>
              <View style={{ width: 24 }} />
            </View>

      <ScrollView style={[styles.container, darkMode && styles.darkContainer]} showsVerticalScrollIndicator={false}>
        <View style={styles.categoryRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryPill,
                activeCategory === cat && styles.activeCategory,
                darkMode && styles.darkCategoryPill,
                darkMode && activeCategory === cat && styles.darkActiveCategory,
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat && styles.activeCategoryText,
                  darkMode && styles.darkCategoryText,
                  darkMode && activeCategory === cat && styles.darkActiveCategoryText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View>
          {activeCategory === 'Favourites' && renderFavourites()}

          {/* Add Playlists, Albums, Artists UI here as needed */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  darkSafeArea: { backgroundColor: '#000' },

  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  darkContainer: { backgroundColor: '#000' },
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 0,
    marginTop: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 12,
  },
  categoryPill: {
    backgroundColor: '#EDF0F7',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  darkCategoryPill: { backgroundColor: '#222' },
  categoryText: {
    fontSize: 14,
    color: '#1A3164',
    fontWeight: '500',
  },
  darkCategoryText: { color: '#bbb' },
  activeCategory: { backgroundColor: '#1A3164' },
  darkActiveCategory: { backgroundColor: '#3E65B6' },
  activeCategoryText: { color: '#fff', fontWeight: '700' },
  darkActiveCategoryText: { color: '#fff' },

  libraryItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    borderRadius: 13,
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingRight: 8,
  },
  darkLibraryItemRow: { backgroundColor: '#111' },

  albumThumb: {
    width: 56,
    height: 56,
    borderRadius: 11,
    marginRight: 13,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  libraryInfo: { flex: 1 },
  libraryTitle: { fontSize: 16, fontWeight: '700', color: '#1A3164' },
  darkLibraryTitle: { color: '#fff' },

  librarySubtitle: { color: '#888', fontWeight: '500', fontSize: 13 },
  darkLibrarySubtitle: { color: '#bbb' },

  emptyText: { textAlign: 'center', marginTop: 40, color: '#888' },
  darkEmptyText: { color: '#bbb' },
});
