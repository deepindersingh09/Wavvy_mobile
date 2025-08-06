import React, { createContext, useContext, useState, useRef } from 'react';
import { Audio } from 'expo-av';

export const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  // Track list and current index for queue control
  const [trackList, setTrackList] = useState([]); // array of Deezer tracks
  const [currentIndex, setCurrentIndex] = useState(0);

  // Track details
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(30);
  const [shuffle, setShuffle] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);

  // Play track and update queue position
  async function playTrack(track, list = null, index = 0) {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    if (list) {
      setTrackList(list);
      setCurrentIndex(index);
    }
    setCurrentTrack(track);
    if (track.preview) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.preview },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      setIsPlaying(true);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition((status.positionMillis || 0) / 1000);
          setDuration((status.durationMillis || 30000) / 1000);
          setIsPlaying(status.isPlaying);
        }
      });
    }
  }

  // Next song
  async function next() {
    if (!trackList.length) return;
    let newIndex;
    if (shuffle) {
      do {
        newIndex = Math.floor(Math.random() * trackList.length);
      } while (trackList.length > 1 && newIndex === currentIndex);
    } else {
      newIndex = (currentIndex + 1) % trackList.length;
    }
    setCurrentIndex(newIndex);
    playTrack(trackList[newIndex], trackList, newIndex);
  }

  // Previous song
  async function previous() {
    if (!trackList.length) return;
    let newIndex;
    if (shuffle) {
      do {
        newIndex = Math.floor(Math.random() * trackList.length);
      } while (trackList.length > 1 && newIndex === currentIndex);
    } else {
      newIndex = (currentIndex - 1 + trackList.length) % trackList.length;
    }
    setCurrentIndex(newIndex);
    playTrack(trackList[newIndex], trackList, newIndex);
  }

  // Toggle shuffle
  function toggleShuffle() {
    setShuffle((s) => !s);
  }

  async function pause() {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    }
  }
  async function resume() {
    if (soundRef.current) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  }
  async function seek(to) {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(to * 1000);
      setPosition(to);
    }
  }

  // Start a playlist/queue (recommended for search results, etc)
  async function playTrackList(list, index = 0) {
    if (!list || !list.length) return;
    setTrackList(list);
    setCurrentIndex(index);
    playTrack(list[index], list, index);
  }

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      position,
      duration,
      shuffle,
      playTrack,
      playTrackList,
      pause,
      resume,
      seek,
      next,
      previous,
      toggleShuffle,
      trackList,
      currentIndex,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
