import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { DeezerTrack, fetchDeezerTrackById } from '../../lib/deezer';
import { supabase } from '../../lib/supabase';

type FavouriteSong = {
  id: string;
  song_id: string;
};

export default function Favourites() {
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState<DeezerTrack[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

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
    if (!userId) {
      setFavourites([]);
      setLoading(false);
      return;
    }

    async function fetchFavourites() {
      setLoading(true);
      // get all liked song IDs for the user
      const { data, error } = await supabase
        .from('favourite_songs')
        .select('song_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching favourites:', error);
        setLoading(false);
        return;
      }

      if (data?.length === 0) {
        setFavourites([]);
        setLoading(false);
        return;
      }

      // fetch details for each song by its id (assuming fetchDeezerTrackById exists)
      const songs = await Promise.all(
        data.map((fav) => fetchDeezerTrackById(fav.song_id))
      );

      setFavourites(songs);
      setLoading(false);
    }

    fetchFavourites();
  }, [userId]);

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" color="#1A3164" />
      </View>
    );
  }

  if (favourites.length === 0) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <Text>No favourite songs yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favourites}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push(`/player/${item.id}`)}
          style={{ padding: 16, borderBottomWidth: 1, borderColor: '#ddd' }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
          <Text style={{ fontSize: 14, color: '#666' }}>{item.artist.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
