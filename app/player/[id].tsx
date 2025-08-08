import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DeezerTrack, fetchDeezerTrackById } from '../../lib/deezer';
import { addSongLike, isSongLiked, removeSongLike } from '../../lib/favourite_songs';
import { supabase } from '../../lib/supabase';
import { recordRecentlyPlayed } from '../../lib/supabase_recently_played';
 
const SCREEN_WIDTH = Dimensions.get('window').width;
 
// Demo track list
const demoTrackList = [
  '3135556',
  '1109731',
  '129888030',
  '1196063402',
  '13468026'
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
  const [currentIdx, setCurrentIdx] = useState(
    demoTrackList.findIndex((tid) => tid === id)
  );
 
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
 
  // NEW: Repeat and Volume
  const [repeat, setRepeat] = useState(false);
  const [volume, setVolume] = useState(1);
 
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
 
  // Add to Playlist button handler
  const onAddToPlaylist = () => {
    alert("Show playlist picker here!");
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
            isLooping: repeat
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
      <View style={{ paddingHorizontal: 20, alignItems: 'center' }}>
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
 
        {/* Repeat + Volume Row */}
        <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center', marginBottom: 16 }}>
          {/* Repeat */}
          <TouchableOpacity onPress={() => setRepeat((r) => !r)}>
            <Ionicons
              name="repeat"
              size={26}
              color={repeat ? "#1A3164" : "#888"}
              style={{ opacity: repeat ? 1 : 0.5 }}
            />
          </TouchableOpacity>
          {/* Volume */}
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#1A3164', fontSize: 12, fontWeight: '500', marginBottom: 4 }}>Volume</Text>
            <Slider
              style={{ width: '100%' }}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={setVolume}
              minimumTrackTintColor="#1A3164"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#1A3164"
            />
          </View>
        </View>
 
        {/* Seek Bar */}
        <View style={styles.seekBarContainer}>
          <TouchableOpacity
            style={styles.seekBarBackground}
            activeOpacity={0.8}
            onPress={e => {
              const touchX = (e.nativeEvent as any).locationX || 0;
              const percent = touchX / (SCREEN_WIDTH - 40);
              onSeek(percent * duration);
            }}
          >
            <View style={[styles.seekBarFill, { width: `${(position / duration) * 100}%` }]} />
          </TouchableOpacity>
          <View style={styles.seekBarTimes}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
 
        {/* Player Controls Row */}
        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={handlePrev}>
            <Ionicons name="play-skip-back" size={32} color="#1A3164" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleShuffle}>
            <Ionicons
              name="shuffle"
              size={32}
              color={shuffle ? "#1A3164" : "#888"}
              style={shuffle ? { opacity: 1 } : { opacity: 0.5 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPlayPause}
            style={styles.playPauseButton}
            disabled={!song.preview}
          >
            <Ionicons
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={78}
              color={song.preview ? '#1A3164' : '#ccc'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext}>
            <Ionicons name="play-skip-forward" size={32} color="#1A3164" />
          </TouchableOpacity>
        </View>
 
        {/* Like + Add to Playlist Row */}
        <View style={{ flexDirection: "row", gap: 22, marginTop: 18, justifyContent: "center" }}>
          {/* Like */}
          <TouchableOpacity onPress={toggleLike} disabled={likeLoading}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={36}
              color={isLiked ? '#1A3164' : '#aaa'}
            />
          </TouchableOpacity>
          {/* Add to Playlist */}
          <TouchableOpacity onPress={onAddToPlaylist}>
            <Ionicons name="add-circle-outline" size={36} color="#1A3164" />
          </TouchableOpacity>
        </View>
 
        {!song.preview && (
          <Text style={[styles.noPreviewText, { color: '#888' }]}>
            No audio preview available.
          </Text>
        )}
      </View>
 
      {/* FooterBar (unchanged) */}
      <View style={styles.footerBar}>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.fabNormal}
            onPress={() => router.replace('/library')}
          >
            <Ionicons name="musical-notes-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.fabLabel}>Library</Text>
        </View>
 
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.fabNormal}
            onPress={() => router.replace('/home')}
          >
            <Ionicons name="home-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.fabLabel}>Home</Text>
        </View>
 
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.fabNormal}
            onPress={() => router.replace('/settings')}
          >
            <Ionicons name="settings-outline" size={36} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.fabLabel}>Settings</Text>
        </View>
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 28,
    paddingBottom: 0,
    alignItems: 'center',
  },
  coverImage: {
    width: 260,
    height: 260,
    borderRadius: 24, // Large radius for rounded look
    marginTop: 16,
    marginBottom: 30,
    alignSelf: 'center',
  },
  noCoverPlaceholder: {
    width: 260,
    height: 260,
    borderRadius: 24,
    backgroundColor: '#F0F2FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 30,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#233B7A',
    textAlign: 'center',
    marginBottom: 2,
  },
  artist: {
    fontSize: 18,
    color: '#8a8b97',
    textAlign: 'center',
    fontWeight: '600',
  },
  album: {
    fontSize: 15,
    color: '#b0b2be',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 0,
    fontWeight: '400',
  },
  repeatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginTop: 0,
    marginBottom: 0,
    width: '90%',
    alignSelf: 'center',
  },
  seekBarContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  seekBarBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e8ebf3',
    width: '100%',
    overflow: 'hidden',
    marginBottom: 5,
  },
  seekBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#233B7A',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  seekBarTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  timeText: {
    color: '#233B7A',
    fontWeight: '600',
    fontSize: 13,
  },
  volumeLabel: {
    color: '#233B7A',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 2,
    marginBottom: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    marginTop: 18,
    marginBottom: 8,
  },
  playPauseButton: {
    marginHorizontal: 12,
  },
  actionRow: {
    flexDirection: "row",
    gap: 28,
    marginTop: 18,
    justifyContent: "center",
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#F55',
    fontSize: 18,
  },
  noPreviewText: {
    marginTop: 12,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
 
  footerBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#233B7A",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingVertical: 14,
    zIndex: 3,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 16,
    elevation: 15,
  },
  fabNormal: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#233B7A",
    alignItems: "center",
    justifyContent: "center",
  },
  fabLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 6,
    textAlign: "center",
  },
});