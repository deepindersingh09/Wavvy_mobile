import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
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
  // Always output to speakers (not earpiece)
  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: false,
      allowsRecordingIOS: false,
      interruptionModeIOS: 1, // DO_NOT_MIX
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: 1, // DO_NOT_MIX
      playThroughEarpieceAndroid: false,
    });
  }, []);

  const { id } = useLocalSearchParams<{ id: string }>();

  // Find current index in demo list
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

  // Player UI state
  const [position, setPosition] = useState(0); // seconds
  const [duration, setDuration] = useState(30); // seconds (Deezer preview)
  const [shuffle, setShuffle] = useState(false);

  // Shuffle/prev/next
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

    // Reset position and duration
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
          { shouldPlay: true }
        );
        soundRef.current = sound;
        setIsPlaying(true);

        // Record recently played here
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

          // Record recently played here
          await recordRecentlyPlayed(userId, song.id.toString());
        }
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  // Seek bar (forwards/backwards seek)
  const onSeek = async (seekTo: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(seekTo * 1000);
      setPosition(seekTo);
    }
  };

  // Format time (mm:ss)
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
        {/* Album Art */}
        {song.album?.cover_medium ? (
          <Image source={{ uri: song.album.cover_medium }} style={styles.coverImage} />
        ) : (
          <View style={[styles.noCoverPlaceholder, { backgroundColor: '#EDF0F7' }]}>
            <Ionicons name="musical-notes-outline" size={96} color="#888" />
          </View>
        )}

        {/* Track Info */}
        <Text style={[styles.title, { color: '#1A3164' }]}>{song.title}</Text>
        <Text style={[styles.artist, { color: '#888' }]}>{song.artist.name}</Text>
        <Text style={[styles.album, { color: '#888' }]}>{song.album?.title}</Text>

        {/* Seek Bar */}
        <View style={styles.seekBarContainer}>
          <TouchableOpacity
            style={styles.seekBarBackground}
            activeOpacity={0.8}
            onPress={e => {
              const touchX = (e.nativeEvent as any).locationX || 0;
              const percent = touchX / (SCREEN_WIDTH - 40); // paddingHorizontal=20*2
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
          {/* Previous */}
          <TouchableOpacity onPress={handlePrev}>
            <Ionicons name="play-skip-back" size={32} color="#1A3164" />
          </TouchableOpacity>
          {/* Shuffle Toggle */}
          <TouchableOpacity onPress={toggleShuffle}>
            <Ionicons
              name="shuffle"
              size={32}
              color={shuffle ? "#1A3164" : "#888"}
              style={shuffle ? { opacity: 1 } : { opacity: 0.5 }}
            />
          </TouchableOpacity>
          {/* Play/Pause */}
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
          {/* Next */}
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

      {/* Modern Footer Bar with Home and Settings */}
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
    paddingTop: 60,
  },
  seekBarContainer: {
    width: '100%',
    marginVertical: 18,
  },
  seekBarBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EDF0F7',
    width: '100%',
    overflow: 'hidden',
    marginBottom: 5,
  },
  seekBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1A3164',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  seekBarTimes: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { color: '#1A3164', fontWeight: '500', fontSize: 13 },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  playPauseButton: {
    marginHorizontal: 16,
  },
  footerBar: {
    position: "absolute",
    bottom: 0,
    paddingBottom: 22,
    right: 25,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 30,
    backgroundColor: "#191c24",
    borderTopWidth: 2,
    borderTopColor: "#eee",
    paddingTop: 12,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 14,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    left: 0,
    width: "100%",
    justifyContent: "center"
  },
  fabNormal: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1A3164",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 8,
  },
  fabLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
    marginBottom: 5,
    textAlign: "center",
  },
  coverImage: {
    width: 280,
    height: 280,
    borderRadius: 12,
    marginBottom: 30,
  },
  noCoverPlaceholder: {
    width: 280,
    height: 280,
    borderRadius: 12,
    backgroundColor: '#EDF0F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A3164',
    textAlign: 'center',
  },
  artist: {
    fontSize: 20,
    color: '#888',
    marginTop: 6,
    textAlign: 'center',
  },
  album: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
    marginBottom: 30,
    textAlign: 'center',
  },
  noPreviewText: {
    marginTop: 12,
    color: '#888',
    fontStyle: 'italic',
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
});
