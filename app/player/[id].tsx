// import { Ionicons } from '@expo/vector-icons';
// import Slider from '@react-native-community/slider';
// import { Audio } from 'expo-av';
// import { router, useLocalSearchParams } from 'expo-router';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Dimensions,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import CustomTabBar from '../../components/CustomTabBar';
// import { DeezerTrack, fetchDeezerTrackById } from '../../lib/deezer';
// import { addSongLike, isSongLiked, removeSongLike } from '../../lib/favourite_songs';
// import { supabase } from '../../lib/supabase';
// import { recordRecentlyPlayed } from '../../lib/supabase_recently_played';

// const SCREEN_WIDTH = Dimensions.get('window').width;

// // Demo track list
// const demoTrackList = [
//   '3135556',
//   '1109731',
//   '129888030',
//   '1196063402',
//   '13468026'
// ];

// export default function SongPlayer() {
//   useEffect(() => {
//     Audio.setAudioModeAsync({
//       staysActiveInBackground: false,
//       allowsRecordingIOS: false,
//       interruptionModeIOS: 1,
//       playsInSilentModeIOS: true,
//       shouldDuckAndroid: true,
//       interruptionModeAndroid: 1,
//       playThroughEarpieceAndroid: false,
//     });
//   }, []);

//   const { id } = useLocalSearchParams<{ id: string }>();

//   const [trackList] = useState(demoTrackList);
//   const [currentIdx, setCurrentIdx] = useState(
//     demoTrackList.findIndex((tid) => tid === id)
//   );

//   const [song, setSong] = useState<DeezerTrack | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const soundRef = useRef<Audio.Sound | null>(null);

//   const [isLiked, setIsLiked] = useState(false);
//   const [likeLoading, setLikeLoading] = useState(false);

//   const [userId, setUserId] = useState<string | null>(null);

//   const [position, setPosition] = useState(0);
//   const [duration, setDuration] = useState(30);
//   const [shuffle, setShuffle] = useState(false);

//   const SCREEN_WIDTH = Dimensions.get('window').width;
//   const BAR_WIDTH = SCREEN_WIDTH * 0.9; // 90% of screen width

//   // NEW: Repeat and Volume
//   const [repeat, setRepeat] = useState(false);
//   const [volume, setVolume] = useState(1);

//   const goToSongById = (songId: string) => {
//     router.replace(`/player/${songId}`);
//   };

//   const handleNext = () => {
//     if (!trackList.length) return;
//     if (shuffle) {
//       let idx;
//       do {
//         idx = Math.floor(Math.random() * trackList.length);
//       } while (trackList.length > 1 && idx === currentIdx);
//       goToSongById(trackList[idx]);
//     } else {
//       const nextIdx = (currentIdx + 1) % trackList.length;
//       goToSongById(trackList[nextIdx]);
//     }
//   };

//   const handlePrev = () => {
//     if (!trackList.length) return;
//     if (shuffle) {
//       let idx;
//       do {
//         idx = Math.floor(Math.random() * trackList.length);
//       } while (trackList.length > 1 && idx === currentIdx);
//       goToSongById(trackList[idx]);
//     } else {
//       const prevIdx = (currentIdx - 1 + trackList.length) % trackList.length;
//       goToSongById(trackList[prevIdx]);
//     }
//   };

//   const toggleShuffle = () => setShuffle((v) => !v);

//   // Add to Playlist button handler
//   const onAddToPlaylist = () => {
//     alert("Show playlist picker here!");
//   };

//   useEffect(() => {
//     setCurrentIdx(trackList.findIndex((tid) => tid === id));
//   }, [id, trackList]);

//   useEffect(() => {
//     async function fetchUserId() {
//       const { data, error } = await supabase.auth.getUser();
//       if (error || !data?.user) {
//         setUserId(null);
//       } else {
//         setUserId(data.user.id);
//       }
//     }
//     fetchUserId();
//   }, []);

//   useEffect(() => {
//     async function loadSong() {
//       if (!id) return;
//       setLoading(true);
//       try {
//         const trackData = await fetchDeezerTrackById(id);
//         setSong(trackData);
//       } catch (err) {
//         console.error('Failed to fetch song:', err);
//         setSong(null);
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadSong();

//     setPosition(0);
//     setDuration(30);

//     return () => {
//       if (soundRef.current) {
//         soundRef.current.unloadAsync();
//         soundRef.current = null;
//       }
//       setIsPlaying(false);
//     };
//   }, [id]);

//   useEffect(() => {
//     if (!id || !userId) {
//       setIsLiked(false);
//       return;
//     }
//     (async () => {
//       const liked = await isSongLiked(userId, id);
//       setIsLiked(liked);
//     })();
//   }, [id, userId]);

//   // Set repeat on sound instance
//   useEffect(() => {
//     if (soundRef.current) {
//       soundRef.current.setIsLoopingAsync(repeat);
//     }
//   }, [repeat]);

//   // Set volume on sound instance
//   useEffect(() => {
//     if (soundRef.current) {
//       soundRef.current.setVolumeAsync(volume);
//     }
//   }, [volume]);

//   const toggleLike = async () => {
//     if (!userId || !song) return;
//     setLikeLoading(true);
//     try {
//       if (isLiked) {
//         await removeSongLike(userId, song.id.toString());
//         setIsLiked(false);
//       } else {
//         await addSongLike(userId, song.id.toString());
//         setIsLiked(true);
//       }
//     } catch (e) {
//       console.error('Like toggle failed:', e);
//     } finally {
//       setLikeLoading(false);
//     }
//   };

//   const onPlayPause = async () => {
//     if (!song?.preview || !userId) return;
//     try {
//       if (!soundRef.current) {
//         const { sound } = await Audio.Sound.createAsync(
//           { uri: song.preview },
//           {
//             shouldPlay: true,
//             volume: volume,
//             isLooping: repeat
//           }
//         );
//         soundRef.current = sound;
//         setIsPlaying(true);
//         await recordRecentlyPlayed(userId, song.id.toString());

//         sound.setOnPlaybackStatusUpdate((status) => {
//           if (status.isLoaded) {
//             setPosition((status.positionMillis || 0) / 1000);
//             setDuration((status.durationMillis || 30000) / 1000);
//             setIsPlaying(status.isPlaying);
//           }
//         });
//       } else {
//         if (isPlaying) {
//           await soundRef.current.pauseAsync();
//           setIsPlaying(false);
//         } else {
//           await soundRef.current.playAsync();
//           setIsPlaying(true);
//           await recordRecentlyPlayed(userId, song.id.toString());
//         }
//       }
//     } catch (error) {
//       console.error('Audio playback error:', error);
//     }
//   };

//   const onSeek = async (seekTo: number) => {
//     if (soundRef.current) {
//       await soundRef.current.setPositionAsync(seekTo * 1000);
//       setPosition(seekTo);
//     }
//   };

//   const formatTime = (sec: number) => {
//     const m = Math.floor(sec / 60);
//     const s = Math.floor(sec % 60);
//     return `${m}:${s < 10 ? '0' : ''}${s}`;
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#1A3164" />
//       </View>
//     );
//   }

//   if (!song) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.errorText}>Song not found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: '#fff' }]}>

//       {/* Header Bar */}
//       <View style={{ width: '100%', paddingHorizontal: 20, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
//         {/* <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={28} color="#1A3164" />
//         </TouchableOpacity> */}
//         <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A3164' }}>Now Playing</Text>
//         <View style={{ width: 28 }} />
//       </View>

//       <View style={{ paddingHorizontal: 15, alignItems: 'center' }}>
//         {song.album?.cover_medium ? (
//           <Image source={{ uri: song.album.cover_medium }} style={styles.coverImage} />
//         ) : (
//           <View style={[styles.noCoverPlaceholder, { backgroundColor: '#EDF0F7' }]}>
//             <Ionicons name="musical-notes-outline" size={96} color="#888" />
//           </View>
//         )}

//         <Text style={[styles.title, { color: '#1A3164' }]}>{song.title}</Text>
//         <Text style={[styles.artist, { color: '#888' }]}>{song.artist.name}</Text>
//         <Text style={[styles.album, { color: '#888' }]}>{song.album?.title}</Text>

//         {/* Progress Bar */}

//         <View style={{ width: SCREEN_WIDTH * 0.9, alignSelf: 'center', marginTop: 1 }}>
//           {/* Seek Slider */}
//           <Slider
//             style={{ width: '100%', height: 40 }}
//             minimumValue={0}
//             maximumValue={duration}
//             value={position}
//             minimumTrackTintColor="#1A3164"
//             maximumTrackTintColor="#696969ff"
//             thumbTintColor="#1A3164"
//             onSlidingComplete={value => onSeek(value)}
//           />

//           {/* Time Labels */}
//           <View style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             marginTop: -5,
//           }}>
//             <Text style={{ color: '#1A3164', fontWeight: '600', fontSize: 12 }}>
//               {formatTime(position)}
//             </Text>
//             <Text style={{ color: '#1A3164', fontWeight: '600', fontSize: 12 }}>
//               {formatTime(duration)}
//             </Text>
//           </View>
//         </View>

//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             marginTop: 8,
//             paddingHorizontal: 15,
//           }}>

//           {/* Repeat */}
//           <TouchableOpacity onPress={() => setRepeat(r => !r)} activeOpacity={0.7}>
//             <Ionicons
//               name="repeat"
//               size={28}
//               color={repeat ? "#1A3164" : "#888"}
//               style={{ opacity: repeat ? 1 : 0.5, marginRight: 30 }}
//             />
//           </TouchableOpacity>

//           {/* Previous */}
//           <TouchableOpacity onPress={handlePrev} activeOpacity={0.7}>
//             <Ionicons name="play-skip-back" size={32} color="#1A3164" style={{ marginHorizontal: 20 }} />
//           </TouchableOpacity>

//           {/* Play / Pause */}
//           <TouchableOpacity
//             onPress={onPlayPause}
//             activeOpacity={0.7}
//             disabled={!song.preview}
//             style={{ marginHorizontal: 20 }}>
//             <Ionicons
//               name={isPlaying ? 'pause-circle' : 'play-circle'}
//               size={65}
//               color={song.preview ? '#1A3164' : '#ccc'}
//             />
//           </TouchableOpacity>

//           {/* Next */}
//           <TouchableOpacity onPress={handleNext} activeOpacity={0.7}>
//             <Ionicons name="play-skip-forward" size={32} color="#1A3164" style={{ marginHorizontal: 20 }} />
//           </TouchableOpacity>

//           {/* Shuffle */}
//           <TouchableOpacity onPress={toggleShuffle} activeOpacity={0.7}>
//             <Ionicons
//               name="shuffle"
//               size={28}
//               color={shuffle ? "#1A3164" : "#888"}
//               style={{ opacity: shuffle ? 1 : 0.5, marginLeft: 30 }}
//             />
//           </TouchableOpacity>
//         </View>


//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             width: '100%',
//             alignSelf: 'center',
//             marginTop: 20,
//             marginBottom: 10,
//           }}>

//           {/* Right side: Volume Control */}
//           <View style={{ flexDirection: 'row', alignItems: 'center', width: 150, gap: 8 }}>
//             <Ionicons name="volume-medium" size={20} color="#1A3164" />
//             <Slider
//               style={{ flex: 1, height: 40 }}
//               minimumValue={0}
//               maximumValue={1}
//               value={volume}
//               onValueChange={setVolume}
//               minimumTrackTintColor="#1A3164"
//               maximumTrackTintColor="#ccc"
//               thumbTintColor="#1A3164"
//             />
//           </View>

//           {/* Left side: Like and Playlist buttons close together */}
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
//             {/* Like Button */}
//             <TouchableOpacity onPress={toggleLike} disabled={likeLoading}>
//               <Ionicons
//                 name={isLiked ? 'heart' : 'heart-outline'}
//                 size={36}
//                 color={isLiked ? '#1A3164' : '#aaa'}
//               />
//             </TouchableOpacity>

//             {/* Add to Playlist Button */}
//             <TouchableOpacity onPress={onAddToPlaylist}>
//               <Ionicons name="add-circle-outline" size={36} color="#1A3164" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//     <CustomTabBar />

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#fff',
//     flex: 1,
//     paddingTop: 28,
//     paddingBottom: 0,
//     alignItems: 'center',
//   },
//   coverImage: {
//     width: 340,
//     height: 340,
//     borderRadius: 0,
//     marginTop: 50,
//     marginBottom: 10,
//     alignSelf: 'center',
//   },
//   noCoverPlaceholder: {
//     width: 260,
//     height: 260,
//     borderRadius: 24,
//     backgroundColor: '#F0F2FA',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 16,
//     marginBottom: 30,
//     alignSelf: 'center',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#233B7A',
//     textAlign: 'center',
//   },
//   artist: {
//     fontSize: 14,
//     color: '#8a8b97',
//     textAlign: 'center',
//     fontWeight: '600',
//   },
//   album: {
//     fontSize: 12,
//     color: '#b0b2be',
//     textAlign: 'center',
//     marginBottom: 5,
//     marginTop: 0,
//     fontWeight: '400',
//   },
//   repeatRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 24,
//     marginTop: 0,
//     marginBottom: 0,
//     width: '90%',
//     alignSelf: 'center',
//   },
//   seekBarBackground: {
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: 'rgba(255,0,0,0.1)',
//     width: '100%',
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   seekBarFill: {
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#233B7A',
//     position: 'absolute',
//     left: 0,
//     top: 0,
//     bottom: 0,
//   },
//   seekBarTimes: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 5,
//   },
//   timeText: {
//     color: '#233B7A',
//     fontWeight: '600',
//     fontSize: 13,
//   },
//   volumeLabel: {
//     color: '#233B7A',
//     fontWeight: '700',
//     fontSize: 14,
//     marginLeft: 2,
//     marginBottom: 2,
//   },
//   controlsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 22,
//     marginTop: 18,
//     marginBottom: 8,
//   },
//   playPauseButton: {
//     marginHorizontal: 4,
//   },
//   actionRow: {
//     flexDirection: "row",
//     gap: 28,
//     marginTop: 18,
//     justifyContent: "center",
//     alignItems: 'center',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   errorText: {
//     color: '#F55',
//     fontSize: 18,
//   },
//   noPreviewText: {
//     marginTop: 12,
//     color: '#888',
//     fontStyle: 'italic',
//     textAlign: 'center',
//   },

// });


// now adding the add to playlist functionality

// import { Ionicons } from '@expo/vector-icons';
// import Slider from '@react-native-community/slider';
// import { Audio } from 'expo-av';
// import { router, useLocalSearchParams } from 'expo-router';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Dimensions,
//   Image,
//   Modal,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import CustomTabBar from '../../components/CustomTabBar';
// import { DeezerTrack, fetchDeezerTrackById } from '../../lib/deezer';
// import { addSongLike, isSongLiked, removeSongLike } from '../../lib/favourite_songs';
// import { supabase } from '../../lib/supabase';
// import { recordRecentlyPlayed } from '../../lib/supabase_recently_played';

// const SCREEN_WIDTH = Dimensions.get('window').width;

// const demoTrackList = [
//   '3135556',
//   '1109731',
//   '129888030',
//   '1196063402',
//   '13468026',
// ];

// export default function SongPlayer() {
//   useEffect(() => {
//     Audio.setAudioModeAsync({
//       staysActiveInBackground: false,
//       allowsRecordingIOS: false,
//       interruptionModeIOS: 1,
//       playsInSilentModeIOS: true,
//       shouldDuckAndroid: true,
//       interruptionModeAndroid: 1,
//       playThroughEarpieceAndroid: false,
//     });
//   }, []);

//   const { id } = useLocalSearchParams<{ id: string }>();

//   const [trackList] = useState(demoTrackList);
//   const [currentIdx, setCurrentIdx] = useState(demoTrackList.findIndex((tid) => tid === id));

//   const [song, setSong] = useState<DeezerTrack | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const soundRef = useRef<Audio.Sound | null>(null);

//   const [isLiked, setIsLiked] = useState(false);
//   const [likeLoading, setLikeLoading] = useState(false);

//   const [userId, setUserId] = useState<string | null>(null);

//   const [position, setPosition] = useState(0);
//   const [duration, setDuration] = useState(30);
//   const [shuffle, setShuffle] = useState(false);

//   // Repeat and Volume
//   const [repeat, setRepeat] = useState(false);
//   const [volume, setVolume] = useState(1);

//   // Playlist modal states
//   const [showPlaylistModal, setShowPlaylistModal] = useState(false);
//   const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
//   const [newPlaylistName, setNewPlaylistName] = useState('');
//   const [loadingPlaylists, setLoadingPlaylists] = useState(false);
//   const [addingToPlaylist, setAddingToPlaylist] = useState(false);

//   const goToSongById = (songId: string) => {
//     router.replace(`/player/${songId}`);
//   };

//   const handleNext = () => {
//     if (!trackList.length) return;
//     if (shuffle) {
//       let idx;
//       do {
//         idx = Math.floor(Math.random() * trackList.length);
//       } while (trackList.length > 1 && idx === currentIdx);
//       goToSongById(trackList[idx]);
//     } else {
//       const nextIdx = (currentIdx + 1) % trackList.length;
//       goToSongById(trackList[nextIdx]);
//     }
//   };

//   const handlePrev = () => {
//     if (!trackList.length) return;
//     if (shuffle) {
//       let idx;
//       do {
//         idx = Math.floor(Math.random() * trackList.length);
//       } while (trackList.length > 1 && idx === currentIdx);
//       goToSongById(trackList[idx]);
//     } else {
//       const prevIdx = (currentIdx - 1 + trackList.length) % trackList.length;
//       goToSongById(trackList[prevIdx]);
//     }
//   };

//   const toggleShuffle = () => setShuffle((v) => !v);

//   // Fetch user's playlists from Supabase
//   const fetchUserPlaylists = async () => {
//     if (!userId) return;
//     setLoadingPlaylists(true);
//     const { data, error } = await supabase
//       .from('user_playlists')
//       .select('*')
//       .eq('created_by', userId)
//       .order('created_at', { ascending: false });

//     if (!error) {
//       setUserPlaylists(data || []);
//     } else {
//       console.error('Error fetching playlists:', error);
//     }
//     setLoadingPlaylists(false);
//   };

//   // Show modal and fetch playlists on Add to Playlist button click
//   const onAddToPlaylist = async () => {
//     await fetchUserPlaylists();
//     setShowPlaylistModal(true);
//   };

//   // Add song to an existing playlist
//   const addSongToExistingPlaylist = async (playlistId: string) => {
//     if (!userId || !song) return;
//     setAddingToPlaylist(true);

//     // Check if song already in playlist
//     const { data: existing, error: checkError } = await supabase
//       .from('playlist_songs')
//       .select('*')
//       .eq('playlist_id', playlistId)
//       .eq('song_id', song.id.toString());

//     if (checkError) {
//       console.error('Check existing song error:', checkError);
//       setAddingToPlaylist(false);
//       return;
//     }
//     if (existing.length > 0) {
//       alert('Song already in this playlist.');
//       setAddingToPlaylist(false);
//       return;
//     }

//     // Add song to playlist
//     const { error } = await supabase
//       .from('playlist_songs')
//       .insert([{ playlist_id: playlistId, song_id: song.id.toString() }]);

//     if (error) {
//       console.error('Add song to playlist error:', error);
//       alert('Failed to add song to playlist.');
//     } else {
//       alert('Song added to playlist!');
//       setShowPlaylistModal(false);
//     }
//     setAddingToPlaylist(false);
//   };

//   // Create a new playlist and add the song to it
//   const createNewPlaylistAndAddSong = async () => {
//     if (!userId || !song || !newPlaylistName.trim()) return;

//     setAddingToPlaylist(true);

//     // Create new playlist
//     const { data: newPlaylist, error: createError } = await supabase
//       .from('user_playlists')
//       .insert([{ name: newPlaylistName.trim(), created_by: userId, is_pinned: false, is_favourite: false }])
//       .select()
//       .single();

//     if (createError || !newPlaylist) {
//       console.error('Create playlist error:', createError);
//       alert('Failed to create playlist.');
//       setAddingToPlaylist(false);
//       return;
//     }

//     // Add song to newly created playlist
//     const { error: addSongError } = await supabase
//       .from('playlist_songs')
//       .insert([{ playlist_id: newPlaylist.id, song_id: song.id.toString() }]);

//     if (addSongError) {
//       console.error('Add song to new playlist error:', addSongError);
//       alert('Failed to add song to the new playlist.');
//     } else {
//       alert('Playlist created and song added!');
//       setShowPlaylistModal(false);
//       setNewPlaylistName('');
//     }
//     setAddingToPlaylist(false);
//   };

//   useEffect(() => {
//     setCurrentIdx(trackList.findIndex((tid) => tid === id));
//   }, [id, trackList]);

//   useEffect(() => {
//     async function fetchUserId() {
//       const { data, error } = await supabase.auth.getUser();
//       if (error || !data?.user) {
//         setUserId(null);
//       } else {
//         setUserId(data.user.id);
//       }
//     }
//     fetchUserId();
//   }, []);

//   useEffect(() => {
//     async function loadSong() {
//       if (!id) return;
//       setLoading(true);
//       try {
//         const trackData = await fetchDeezerTrackById(id);
//         setSong(trackData);
//       } catch (err) {
//         console.error('Failed to fetch song:', err);
//         setSong(null);
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadSong();

//     setPosition(0);
//     setDuration(30);

//     return () => {
//       if (soundRef.current) {
//         soundRef.current.unloadAsync();
//         soundRef.current = null;
//       }
//       setIsPlaying(false);
//     };
//   }, [id]);

//   useEffect(() => {
//     if (!id || !userId) {
//       setIsLiked(false);
//       return;
//     }
//     (async () => {
//       const liked = await isSongLiked(userId, id);
//       setIsLiked(liked);
//     })();
//   }, [id, userId]);

//   // Set repeat on sound instance
//   useEffect(() => {
//     if (soundRef.current) {
//       soundRef.current.setIsLoopingAsync(repeat);
//     }
//   }, [repeat]);

//   // Set volume on sound instance
//   useEffect(() => {
//     if (soundRef.current) {
//       soundRef.current.setVolumeAsync(volume);
//     }
//   }, [volume]);

//   const toggleLike = async () => {
//     if (!userId || !song) return;
//     setLikeLoading(true);
//     try {
//       if (isLiked) {
//         await removeSongLike(userId, song.id.toString());
//         setIsLiked(false);
//       } else {
//         await addSongLike(userId, song.id.toString());
//         setIsLiked(true);
//       }
//     } catch (e) {
//       console.error('Like toggle failed:', e);
//     } finally {
//       setLikeLoading(false);
//     }
//   };

//   const onPlayPause = async () => {
//     if (!song?.preview || !userId) return;
//     try {
//       if (!soundRef.current) {
//         const { sound } = await Audio.Sound.createAsync(
//           { uri: song.preview },
//           {
//             shouldPlay: true,
//             volume: volume,
//             isLooping: repeat,
//           }
//         );
//         soundRef.current = sound;
//         setIsPlaying(true);
//         await recordRecentlyPlayed(userId, song.id.toString());

//         sound.setOnPlaybackStatusUpdate((status) => {
//           if (status.isLoaded) {
//             setPosition((status.positionMillis || 0) / 1000);
//             setDuration((status.durationMillis || 30000) / 1000);
//             setIsPlaying(status.isPlaying);
//           }
//         });
//       } else {
//         if (isPlaying) {
//           await soundRef.current.pauseAsync();
//           setIsPlaying(false);
//         } else {
//           await soundRef.current.playAsync();
//           setIsPlaying(true);
//           await recordRecentlyPlayed(userId, song.id.toString());
//         }
//       }
//     } catch (error) {
//       console.error('Audio playback error:', error);
//     }
//   };

//   const onSeek = async (seekTo: number) => {
//     if (soundRef.current) {
//       await soundRef.current.setPositionAsync(seekTo * 1000);
//       setPosition(seekTo);
//     }
//   };

//   const formatTime = (sec: number) => {
//     const m = Math.floor(sec / 60);
//     const s = Math.floor(sec % 60);
//     return `${m}:${s < 10 ? '0' : ''}${s}`;
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#1A3164" />
//       </View>
//     );
//   }

//   if (!song) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.errorText}>Song not found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: '#fff' }]}>
//       {/* Header Bar */}
//       <View
//         style={{
//           width: '100%',
//           paddingHorizontal: 20,
//           paddingTop: 10,
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginTop: 10,
//         }}
//       >
//         <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A3164' }}>Now Playing</Text>
//         <View style={{ width: 28 }} />
//       </View>

//       <View style={{ paddingHorizontal: 15, alignItems: 'center' }}>
//         {song.album?.cover_medium ? (
//           <Image source={{ uri: song.album.cover_medium }} style={styles.coverImage} />
//         ) : (
//           <View style={[styles.noCoverPlaceholder, { backgroundColor: '#EDF0F7' }]}>
//             <Ionicons name="musical-notes-outline" size={96} color="#888" />
//           </View>
//         )}

//         <Text style={[styles.title, { color: '#1A3164' }]}>{song.title}</Text>
//         <Text style={[styles.artist, { color: '#888' }]}>{song.artist.name}</Text>
//         <Text style={[styles.album, { color: '#888' }]}>{song.album?.title}</Text>

//         {/* Progress Bar */}
//         <View style={{ width: SCREEN_WIDTH * 0.9, alignSelf: 'center', marginTop: 1 }}>
//           {/* Seek Slider */}
//           <Slider
//             style={{ width: '100%', height: 40 }}
//             minimumValue={0}
//             maximumValue={duration}
//             value={position}
//             minimumTrackTintColor="#1A3164"
//             maximumTrackTintColor="#696969ff"
//             thumbTintColor="#1A3164"
//             onSlidingComplete={(value) => onSeek(value)}
//           />

//           {/* Time Labels */}
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               marginTop: -5,
//             }}
//           >
//             <Text style={{ color: '#1A3164', fontWeight: '600', fontSize: 12 }}>{formatTime(position)}</Text>
//             <Text style={{ color: '#1A3164', fontWeight: '600', fontSize: 12 }}>{formatTime(duration)}</Text>
//           </View>
//         </View>

//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             marginTop: 8,
//             paddingHorizontal: 15,
//           }}
//         >
//           {/* Repeat */}
//           <TouchableOpacity onPress={() => setRepeat((r) => !r)} activeOpacity={0.7}>
//             <Ionicons
//               name="repeat"
//               size={28}
//               color={repeat ? '#1A3164' : '#888'}
//               style={{ opacity: repeat ? 1 : 0.5, marginRight: 30 }}
//             />
//           </TouchableOpacity>

//           {/* Previous */}
//           <TouchableOpacity onPress={handlePrev} activeOpacity={0.7}>
//             <Ionicons name="play-skip-back" size={32} color="#1A3164" style={{ marginHorizontal: 20 }} />
//           </TouchableOpacity>

//           {/* Play / Pause */}
//           <TouchableOpacity
//             onPress={onPlayPause}
//             activeOpacity={0.7}
//             disabled={!song.preview}
//             style={{ marginHorizontal: 20 }}
//           >
//             <Ionicons
//               name={isPlaying ? 'pause-circle' : 'play-circle'}
//               size={65}
//               color={song.preview ? '#1A3164' : '#ccc'}
//             />
//           </TouchableOpacity>

//           {/* Next */}
//           <TouchableOpacity onPress={handleNext} activeOpacity={0.7}>
//             <Ionicons name="play-skip-forward" size={32} color="#1A3164" style={{ marginHorizontal: 20 }} />
//           </TouchableOpacity>

//           {/* Shuffle */}
//           <TouchableOpacity onPress={toggleShuffle} activeOpacity={0.7}>
//             <Ionicons
//               name="shuffle"
//               size={28}
//               color={shuffle ? '#1A3164' : '#888'}
//               style={{ opacity: shuffle ? 1 : 0.5, marginLeft: 30 }}
//             />
//           </TouchableOpacity>
//         </View>

//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             width: '100%',
//             alignSelf: 'center',
//             marginTop: 20,
//             marginBottom: 10,
//           }}
//         >
//           {/* Volume Control */}
//           <View style={{ flexDirection: 'row', alignItems: 'center', width: 150, gap: 8 }}>
//             <Ionicons name="volume-medium" size={20} color="#1A3164" />
//             <Slider
//               style={{ flex: 1, height: 40 }}
//               minimumValue={0}
//               maximumValue={1}
//               value={volume}
//               onValueChange={setVolume}
//               minimumTrackTintColor="#1A3164"
//               maximumTrackTintColor="#ccc"
//               thumbTintColor="#1A3164"
//             />
//           </View>

//           {/* Like and Playlist buttons */}
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
//             {/* Like Button */}
//             <TouchableOpacity onPress={toggleLike} disabled={likeLoading}>
//               <Ionicons
//                 name={isLiked ? 'heart' : 'heart-outline'}
//                 size={36}
//                 color={isLiked ? '#1A3164' : '#aaa'}
//               />
//             </TouchableOpacity>

//             {/* Add to Playlist Button */}
//             <TouchableOpacity onPress={onAddToPlaylist}>
//               <Ionicons name="add-circle-outline" size={36} color="#1A3164" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       {/* Playlist Picker Modal */}
//       <Modal
//         visible={showPlaylistModal}
//         animationType="slide"
//         transparent
//         onRequestClose={() => setShowPlaylistModal(false)}
//       >
//         <View style={styles.modalBackdrop}>
//           <View style={styles.modalCard}>
//             <Text style={styles.modalTitle}>Add to Playlist</Text>

//             {loadingPlaylists ? (
//               <ActivityIndicator size="large" color="#1A3164" />
//             ) : (
//               <>
//                 {userPlaylists.length === 0 && <Text style={{ marginBottom: 10 }}>No playlists found.</Text>}

//                 {userPlaylists.map((playlist) => (
//                   <TouchableOpacity
//                     key={playlist.id}
//                     style={styles.playlistRow}
//                     onPress={() => addSongToExistingPlaylist(playlist.id)}
//                     disabled={addingToPlaylist}
//                   >
//                     <Text style={styles.playlistName}>{playlist.name}</Text>
//                   </TouchableOpacity>
//                 ))}

//                 <TextInput
//                   placeholder="New Playlist Name"
//                   value={newPlaylistName}
//                   onChangeText={setNewPlaylistName}
//                   style={styles.modalInput}
//                   editable={!addingToPlaylist}
//                 />

//                 <TouchableOpacity
//                   style={[styles.modalBtn, { marginTop: 10 }]}
//                   onPress={createNewPlaylistAndAddSong}
//                   disabled={addingToPlaylist || !newPlaylistName.trim()}
//                 >
//                   <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
//                     {addingToPlaylist ? 'Adding...' : 'Create & Add'}
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[styles.modalBtn, { marginTop: 10, backgroundColor: '#eee' }]}
//                   onPress={() => setShowPlaylistModal(false)}
//                   disabled={addingToPlaylist}
//                 >
//                   <Text style={{ color: '#1A3164', fontWeight: 'bold', textAlign: 'center' }}>Cancel</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>

//       <CustomTabBar />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1A3164',
//   },
//   coverImage: {
//     width: 280,
//     height: 280,
//     borderRadius: 14,
//     marginTop: 20,
//   },
//   noCoverPlaceholder: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 280,
//     height: 280,
//     borderRadius: 14,
//     marginTop: 20,
//   },
//   title: {
//     fontWeight: '700',
//     fontSize: 22,
//     marginTop: 18,
//     textAlign: 'center',
//   },
//   artist: {
//     fontWeight: '500',
//     fontSize: 16,
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   album: {
//     fontWeight: '400',
//     fontSize: 14,
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//     width: '80%',
//     maxHeight: '80%',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1A3164',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   playlistRow: {
//     paddingVertical: 10,
//     borderBottomColor: '#ddd',
//     borderBottomWidth: 1,
//   },
//   playlistName: {
//     fontSize: 16,
//     color: '#1A3164',
//   },
//   modalInput: {
//     borderWidth: 1,
//     borderColor: '#1A3164',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     fontSize: 16,
//     marginTop: 15,
//     color: '#1A3164',
//   },
//   modalBtn: {
//     backgroundColor: '#1A3164',
//     borderRadius: 10,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
// });


import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomTabBar from '../../components/CustomTabBar';
import { DeezerTrack, fetchDeezerTrackById } from '../../lib/deezer';
import { addSongLike, isSongLiked, removeSongLike } from '../../lib/favourite_songs';
import { addSongToPlaylist, createPlaylist } from '../../lib/playlist';
import { supabase } from '../../lib/supabase';
import { recordRecentlyPlayed } from '../../lib/supabase_recently_played';

const SCREEN_WIDTH = Dimensions.get('window').width;

const demoTrackList = [
  '3135556',
  '1109731',
  '129888030',
  '1196063402',
  '13468026',
];

export default function SongPlayer() {
  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: false,
      allowsRecordingIOS: false,
      interruptionModeIOS: 1,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: 1,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  const { id } = useLocalSearchParams<{ id: string }>();

  const [trackList] = useState(demoTrackList);
  const [currentIdx, setCurrentIdx] = useState(demoTrackList.findIndex((tid) => tid === id));

  const [song, setSong] = useState<DeezerTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(30);
  const [shuffle, setShuffle] = useState(false);

  // Repeat and Volume
  const [repeat, setRepeat] = useState(false);
  const [volume, setVolume] = useState(1);

  // Playlist modal states
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [addingToPlaylist, setAddingToPlaylist] = useState(false);

  const goToSongById = (songId: string) => {
    router.replace(`/player/${songId}`);
  };

  const handleNext = () => {
    if (!trackList.length) return;
    if (shuffle) {
      let idx;
      do {
        idx = Math.floor(Math.random() * trackList.length);
      } while (trackList.length > 1 && idx === currentIdx);
      goToSongById(trackList[idx]);
    } else {
      const nextIdx = (currentIdx + 1) % trackList.length;
      goToSongById(trackList[nextIdx]);
    }
  };

  const handlePrev = () => {
    if (!trackList.length) return;
    if (shuffle) {
      let idx;
      do {
        idx = Math.floor(Math.random() * trackList.length);
      } while (trackList.length > 1 && idx === currentIdx);
      goToSongById(trackList[idx]);
    } else {
      const prevIdx = (currentIdx - 1 + trackList.length) % trackList.length;
      goToSongById(trackList[prevIdx]);
    }
  };

  const toggleShuffle = () => setShuffle((v) => !v);

  // Fetch user's playlists from Supabase
  const fetchUserPlaylists = async () => {
    if (!userId) return;
    setLoadingPlaylists(true);
    const { data, error } = await supabase
      .from('user_playlists')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (!error) {
      setUserPlaylists(data || []);
    } else {
      console.error('Error fetching playlists:', error);
    }
    setLoadingPlaylists(false);
  };

  // Show modal and fetch playlists on Add to Playlist button click
  const onAddToPlaylist = async () => {
    await fetchUserPlaylists();
    setShowPlaylistModal(true);
  };

  // Add song to an existing playlist
  const addSongToExistingPlaylist = async (playlistId: string) => {
    if (!userId || !song) return;
    setAddingToPlaylist(true);

    // Check if song already in playlist
    const { data: existing, error: checkError } = await supabase
      .from('playlist_songs')
      .select('*')
      .eq('playlist_id', playlistId)
      .eq('song_id', song.id.toString());

    if (checkError) {
      console.error('Check existing song error:', checkError);
      setAddingToPlaylist(false);
      return;
    }
    if (existing.length > 0) {
      alert('Song already in this playlist.');
      setAddingToPlaylist(false);
      return;
    }

    // Add song to playlist
    const { error } = await supabase
      .from('playlist_songs')
      .insert([{ playlist_id: playlistId, song_id: song.id.toString() }]);

    if (error) {
      console.error('Add song to playlist error:', error);
      alert('Failed to add song to playlist.');
    } else {
      alert('Song added to playlist!');
      setShowPlaylistModal(false);
    }
    setAddingToPlaylist(false);
  };

  // // Create a new playlist and add the song to it
  // const createNewPlaylistAndAddSong = async () => {
  //   if (!userId || !song || !newPlaylistName.trim()) {
  //     alert('Please enter a playlist name.');
  //     return;
  //   }

  //   setAddingToPlaylist(true);

  //   // Create new playlist
  //   const { data: newPlaylist, error: createError } = await supabase
  //     .from('user_playlists')
  //     .insert([{ name: newPlaylistName.trim(), created_by: userId, is_pinned: false, is_favourite: false }])
  //     .select()
  //     .single();

  //   if (createError || !newPlaylist) {
  //     console.error('Create playlist error:', createError);
  //     alert('Failed to create playlist.');
  //     setAddingToPlaylist(false);
  //     return;
  //   }

  //   // Add song to newly created playlist
  //   const { error: addSongError } = await supabase
  //     .from('playlist_songs')
  //     .insert([{ playlist_id: newPlaylist.id, song_id: song.id.toString() }]);

  //   if (addSongError) {
  //     console.error('Add song to new playlist error:', addSongError);
  //     alert('Failed to add song to the new playlist.');
  //   } else {
  //     alert('Playlist created and song added!');
  //     setShowPlaylistModal(false);
  //     setNewPlaylistName('');
  //   }
  //   setAddingToPlaylist(false);
  // };


  const createNewPlaylistAndAddSong = async () => {
  if (!userId || !song || !newPlaylistName.trim()) {
    alert('Please enter a playlist name.');
    return;
  }

  setAddingToPlaylist(true);

  try {
    const newPlaylist = await createPlaylist(newPlaylistName.trim());
    await addSongToPlaylist(newPlaylist.id, song.id.toString());

    alert('Playlist created and song added!');
    setShowPlaylistModal(false);
    setNewPlaylistName('');
    // Optionally refresh the playlist list so modal updates if you show playlists there
    await fetchUserPlaylists();
  } catch (error) {
    console.error('Error creating playlist and adding song:', error);
    alert('Failed to create playlist or add song.');
  } finally {
    setAddingToPlaylist(false);
  }
};  

  useEffect(() => {
    setCurrentIdx(trackList.findIndex((tid) => tid === id));
  }, [id, trackList]);

  useEffect(() => {
    async function fetchUserId() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setUserId(null);
      } else {
        setUserId(data.user.id);
      }
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    async function loadSong() {
      if (!id) return;
      setLoading(true);
      try {
        const trackData = await fetchDeezerTrackById(id);
        setSong(trackData);
      } catch (err) {
        console.error('Failed to fetch song:', err);
        setSong(null);
      } finally {
        setLoading(false);
      }
    }
    loadSong();

    setPosition(0);
    setDuration(30);

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setIsPlaying(false);
    };
  }, [id]);

  useEffect(() => {
    if (!id || !userId) {
      setIsLiked(false);
      return;
    }
    (async () => {
      const liked = await isSongLiked(userId, id);
      setIsLiked(liked);
    })();
  }, [id, userId]);

  // Set repeat on sound instance
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.setIsLoopingAsync(repeat);
    }
  }, [repeat]);

  // Set volume on sound instance
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.setVolumeAsync(volume);
    }
  }, [volume]);

  const toggleLike = async () => {
    if (!userId || !song) return;
    setLikeLoading(true);
    try {
      if (isLiked) {
        await removeSongLike(userId, song.id.toString());
        setIsLiked(false);
      } else {
        await addSongLike(userId, song.id.toString());
        setIsLiked(true);
      }
    } catch (e) {
      console.error('Like toggle failed:', e);
    } finally {
      setLikeLoading(false);
    }
  };

  const onPlayPause = async () => {
    if (!song?.preview || !userId) return;
    try {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: song.preview },
          {
            shouldPlay: true,
            volume: volume,
            isLooping: repeat,
          }
        );
        soundRef.current = sound;
        setIsPlaying(true);
        await recordRecentlyPlayed(userId, song.id.toString());

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setPosition((status.positionMillis || 0) / 1000);
            setDuration((status.durationMillis || 30000) / 1000);
            setIsPlaying(status.isPlaying);
          }
        });
      } else {
        if (isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setIsPlaying(true);
          await recordRecentlyPlayed(userId, song.id.toString());
        }
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const onSeek = async (seekTo: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(seekTo * 1000);
      setPosition(seekTo);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1A3164" />
      </View>
    );
  }

  if (!song) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Song not found.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}>
      {/* Header Bar */}
      <View
        style={{
          width: '100%',
          paddingHorizontal: 20,
          paddingTop: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '900', color: '#1A3164', marginTop: 55, textAlign: 'center' }}>Now Playing</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={{ paddingHorizontal: 15, alignItems: 'center' }}>
        {song.album?.cover_medium ? (
          <Image source={{ uri: song.album.cover_medium }} style={styles.coverImage} />
        ) : (
          <View style={[styles.noCoverPlaceholder, { backgroundColor: '#EDF0F7' }]}>
            <Ionicons name="musical-notes-outline" size={96} color="#888" />
          </View>
        )}

        <Text style={[styles.title, { color: '#1A3164' }]}>{song.title}</Text>
        <Text style={[styles.artist, { color: '#888' }]}>{song.artist.name}</Text>
        <Text style={[styles.album, { color: '#888' }]}>{song.album?.title}</Text>

        {/* Progress Bar */}
        <View style={{ width: SCREEN_WIDTH * 0.9, alignSelf: 'center', marginTop: 1 }}>
          {/* Seek Slider */}
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            minimumTrackTintColor="#1A3164"
            maximumTrackTintColor="#696969ff"
            thumbTintColor="#1A3164"
            onSlidingComplete={(value) => onSeek(value)}
          />

          {/* Time Labels */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: -5,
            }}
          >
            <Text style={{ color: '#1A3164', fontWeight: '600', fontSize: 12 }}>{formatTime(position)}</Text>
            <Text style={{ color: '#1A3164', fontWeight: '600', fontSize: 12 }}>{formatTime(duration)}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 8,
            paddingHorizontal: 15,
          }}
        >
          {/* Repeat */}
          <TouchableOpacity onPress={() => setRepeat((r) => !r)} activeOpacity={0.7}>
            <Ionicons
              name="repeat"
              size={28}
              color={repeat ? '#1A3164' : '#888'}
              style={{ opacity: repeat ? 1 : 0.5, marginRight: 30 }}
            />
          </TouchableOpacity>

          {/* Previous */}
          <TouchableOpacity onPress={handlePrev} activeOpacity={0.7}>
            <Ionicons name="play-skip-back" size={32} color="#1A3164" style={{ marginHorizontal: 20 }} />
          </TouchableOpacity>

          {/* Play / Pause */}
          <TouchableOpacity
            onPress={onPlayPause}
            activeOpacity={0.7}
            disabled={!song.preview}
            style={{ marginHorizontal: 20 }}
          >
            <Ionicons
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={65}
              color={song.preview ? '#1A3164' : '#ccc'}
            />
          </TouchableOpacity>

          {/* Next */}
          <TouchableOpacity onPress={handleNext} activeOpacity={0.7}>
            <Ionicons name="play-skip-forward" size={32} color="#1A3164" style={{ marginHorizontal: 20 }} />
          </TouchableOpacity>

          {/* Shuffle */}
          <TouchableOpacity onPress={toggleShuffle} activeOpacity={0.7}>
            <Ionicons
              name="shuffle"
              size={28}
              color={shuffle ? '#1A3164' : '#888'}
              style={{ opacity: shuffle ? 1 : 0.5, marginLeft: 30 }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            alignSelf: 'center',
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          {/* Volume Control */}
          <View style={{ flexDirection: 'row', alignItems: 'center', width: 150, gap: 8 }}>
            <Ionicons name="volume-medium" size={20} color="#1A3164" />
            <Slider
              style={{ flex: 1, height: 40 }}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={setVolume}
              minimumTrackTintColor="#1A3164"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#1A3164"
            />
          </View>

          {/* Like and Playlist buttons */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            {/* Like Button */}
            <TouchableOpacity onPress={toggleLike} disabled={likeLoading}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={36}
                color={isLiked ? '#1A3164' : '#aaa'}
              />
            </TouchableOpacity>

            {/* Add to Playlist Button */}
            <TouchableOpacity onPress={onAddToPlaylist}>
              <Ionicons name="add-circle-outline" size={36} color="#1A3164" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Playlist Picker Modal */}
      <Modal
        visible={showPlaylistModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPlaylistModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add to Playlist</Text>

            {loadingPlaylists ? (
              <ActivityIndicator size="large" color="#1A3164" />
            ) : (
              <>
                {userPlaylists.length === 0 && <Text style={{ marginBottom: 10 }}>No playlists found.</Text>}

                {userPlaylists.map((playlist) => (
                  <TouchableOpacity
                    key={playlist.id}
                    style={styles.playlistRow}
                    onPress={() => addSongToExistingPlaylist(playlist.id)}
                    disabled={addingToPlaylist}
                  >
                    <Text style={styles.playlistName}>{playlist.name}</Text>
                  </TouchableOpacity>
                ))}

                <TextInput
                  placeholder="New Playlist Name"
                  value={newPlaylistName}
                  onChangeText={setNewPlaylistName}
                  style={styles.modalInput}
                  editable={!addingToPlaylist}
                />

                <TouchableOpacity
                  style={[styles.modalBtn, { marginTop: 10 }]}
                  onPress={createNewPlaylistAndAddSong}
                  disabled={addingToPlaylist || !newPlaylistName.trim()}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                    {addingToPlaylist ? 'Adding...' : 'Create & Add'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, { marginTop: 10, backgroundColor: '#eee' }]}
                  onPress={() => setShowPlaylistModal(false)}
                  disabled={addingToPlaylist}
                >
                  <Text style={{ color: '#1A3164', fontWeight: 'bold', textAlign: 'center' }}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <CustomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A3164',
  },
  coverImage: {
    width: 280,
    height: 280,
    borderRadius: 14,
    marginTop: 50,
  },
  noCoverPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 280,
    height: 280,
    borderRadius: 14,
    marginTop: 20,
  },
  title: {
    fontWeight: '700',
    fontSize: 22,
    marginTop: 18,
    textAlign: 'center',
  },
  artist: {
    fontWeight: '500',
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  album: {
    fontWeight: '400',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A3164',
    marginBottom: 10,
    textAlign: 'center',
  },
  playlistRow: {
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  playlistName: {
    fontSize: 16,
    color: '#1A3164',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#1A3164',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginTop: 15,
    color: '#1A3164',
  },
  modalBtn: {
    backgroundColor: '#1A3164',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
});
