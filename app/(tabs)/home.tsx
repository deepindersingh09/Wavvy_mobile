import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fetchDeezerTrackById } from '../../lib/deezer';
import { usePlayer } from '../../lib/playercontext';
import { supabase } from '../../lib/supabase';
import { ThemeContext } from '../../lib/ThemeContext';

const { width } = Dimensions.get('window');

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const { currentTrack } = usePlayer();

  const { darkMode } = useContext(ThemeContext);
  const styles = themedStyles(darkMode);
  // Added 'query' key for search term
  const recommended = [
    { title: 'Punjabi Hits', image: require('../../assets/images/punjabi_hits.png'), query: 'Punjabi Hits' },
    { title: 'Lo-fi', image: require('../../assets/images/lofi.png'), query: 'Lo-fi' },
    { title: 'Chill Mix', image: require('../../assets/images/chill_mix.png'), query: 'Chill Mix' },
  ];

  const popular = [
    { title: 'Cheques', artist: 'Shubh', id: '2282321217', image: require('../../assets/images/cheques.png') },
    { title: 'Jine Saah', artist: 'Ninja', id: '370172031', image: require('../../assets/images/jine_saah.png') },
    { title: 'August', artist: 'Taylor Swift', id: '1053765282', image: require('../../assets/images/august.png') },
    { title: 'Jatta', artist: 'Arijit Singh', id: '1594140971', image: require('../../assets/images/jatta_.png') },
    { title: 'Sada Aura', artist: 'Dulla', id: '3461561831', image: require('../../assets/images/sada_aura.png') },
    { title: 'Khairiyat', artist: 'Arijit Singh', id: '3174180021', image: require('../../assets/images/khairiyat.png') },
  ];

  const recent = [
    { title: 'Bandook', artist: 'Nirvair Pannu', id: '972650742', image: require('../../assets/images/bandook.png') },
    { title: 'Attraction', artist: 'Sukha, ProdGK', id: '2361725765', image: require('../../assets/images/attraction.png') },
    { title: 'Barfest', artist: 'Nirvair Pannu', id: '2705113272', image: require('../../assets/images/barfest.png') },
    { title: 'Pasand Jatt Di', artist: 'Nirvair Pannu', id: '3270662611', image: require('../../assets/images/pasand_jatt_di.png') },
    { title: 'Neal', artist: 'Sidhu Moosewala', id: '3408975791', image: require('../../assets/images/neal_.png') },
  ];

  useEffect(() => {
    const fetchName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_details')
          .select('first_name, last_name')
          .eq('uuid', user.id)
          .single();
        if (data?.first_name) {
          setUserName(
            data.last_name && data.last_name.trim().length > 0
              ? `${data.first_name} ${data.last_name}`
              : data.first_name
          );
        } else {
          setUserName('there!');
        }
      }
    };
    fetchName();
  }, []);

  // Jump back in logic
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [recentSongs, setRecentSongs] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setUserId(null);
        setUserName('there!');
        return;
      }
      setUserId(user.id);

      const { data, error: nameError } = await supabase
        .from('user_details')
        .select('first_name, last_name')
        .eq('uuid', user.id)
        .single();

      if (nameError || !data?.first_name) {
        setUserName('there!');
      } else {
        setUserName(
          data.last_name && data.last_name.trim().length > 0
            ? `${data.first_name} ${data.last_name}`
            : data.first_name
        );
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchRecentlyPlayed() {
      if (!userId) return;

      setLoadingRecent(true);
      try {
        const { data: recentData, error } = await supabase
          .from('recently_played')
          .select('song_id')
          .eq('user_id', userId)
          .order('played_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching recently played songs:', error);
          setRecentSongs([]);
          return;
        }

        if (recentData?.length) {
          const tracks = await Promise.all(
            recentData.map(async (item) => {
              try {
                return await fetchDeezerTrackById(item.song_id);
              } catch (e) {
                console.error(`Failed fetching track ${item.song_id}`, e);
                return null;
              }
            })
          );

          setRecentSongs(tracks.filter(Boolean));
        } else {
          setRecentSongs([]);
        }
      } catch (err) {
        console.error('Failed to fetch recently played:', err);
        setRecentSongs([]);
      } finally {
        setLoadingRecent(false);
      }
    }

    fetchRecentlyPlayed();
  }, [userId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 35, paddingBottom: 60 }}
      >
        {/* Header */}
        <Text style={styles.greeting}>{getGreeting()}, {userName || 'First name'} 👋</Text>

        {/* Filters */}
        {/* <View style={styles.filters}>
          {filters.map((filter, index) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterBtn,
                index === 0 && styles.activeFilter,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  index === 0 && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}

        {/* Jump Back In */}
        {/* <Text style={styles.sectionTitle}>Jump back in</Text>

        {loadingRecent ? (
          <Text style={{ color: darkMode ? '#fff' : '#1A3164', marginBottom: 12 }}>Loading...</Text>
        ) : recentSongs.length === 0 ? (
          <Text style={{ color: darkMode ? '#fff' : '#1A3164', marginBottom: 12 }}>
            No recent songs played yet.
          </Text>
        ) : (
          <>
            {recentSongs[0] && (
              <TouchableOpacity
                key={`large-${recentSongs[0].id}`}
                style={styles.jumpCardLarge}
                onPress={() => router.push(`/player/${recentSongs[0].id}`)}
              >
                <Image
                  source={{ uri: recentSongs[0].album.cover_medium }}
                  style={styles.jumpImageLarge}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.jumpSongLarge}>{recentSongs[0].title}</Text>
                  <Text style={styles.jumpArtistLarge}>{recentSongs[0].artist.name}</Text>
                </View>
              </TouchableOpacity>
            )}

            <View style={styles.jumpGrid}>
              {recentSongs.slice(1, 5).map((song, index) => (
                <TouchableOpacity
                  key={`small-${index}-${song.id}`}
                  style={styles.jumpCardSmall}
                  onPress={() => router.push(`/player/${song.id}`)}
                >
                  <Image
                    source={{ uri: song.album.cover_medium }}
                    style={styles.jumpImageSmall}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.jumpSongSmall}>{song.title}</Text>
                    <Text style={styles.jumpArtistSmall}>{song.artist.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Trending Near You</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendingRow}
        >
          {recommended.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.trendingCard}
              onPress={() => router.push(`/search?q=${encodeURIComponent(item.title)}`)}
>
              <Image source={item.image} style={styles.trendingImage} />
              <Text style={styles.trendingText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView> */}

        {/* Jump Back In */}
        <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#1A3164' }]}>
          Jump back in
        </Text>

        {loadingRecent ? (
          <Text style={{ color: darkMode ? '#fff' : '#1A3164', marginBottom: 12 }}>Loading...</Text>
        ) : recentSongs.length === 0 ? (
          <Text style={{ color: darkMode ? '#fff' : '#1A3164', marginBottom: 12 }}>
            No recent songs played yet.
          </Text>
        ) : (
          <>
            {recentSongs[0] && (
              <TouchableOpacity
                key={`large-${recentSongs[0].id}`}
                style={styles.jumpCardLarge}
                onPress={() => router.push(`/player/${recentSongs[0].id}`)}
              >
                <Image
                  source={{ uri: recentSongs[0].album.cover_medium }}
                  style={styles.jumpImageLarge}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.jumpSongLarge, { color: darkMode ? '#fff' : '#1A3164' }]}>
                    {recentSongs[0].title}
                  </Text>
                  <Text style={[styles.jumpArtistLarge, { color: darkMode ? '#bbb' : '#666' }]}>
                    {recentSongs[0].artist.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <View style={styles.jumpGrid}>
              {recentSongs.slice(1, 5).map((song, index) => (
                <TouchableOpacity
                  key={`small-${index}-${song.id}`}
                  style={styles.jumpCardSmall}
                  onPress={() => router.push(`/player/${song.id}`)}
                >
                  <Image
                    source={{ uri: song.album.cover_medium }}
                    style={styles.jumpImageSmall}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.jumpSongSmall, { color: darkMode ? '#fff' : '#1A3164' }]}>
                      {song.title}
                    </Text>
                    <Text style={[styles.jumpArtistSmall, { color: darkMode ? '#bbb' : '#666' }]}>
                      {song.artist.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}


        {/* Popular Songs */}
        <Text style={styles.sectionTitle}>Popular Songs</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularRow}>
          {popular.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.popularItem}
              onPress={() => router.push(`/player/${item.id}`)}
            >
              <Image source={item.image} style={styles.popularImage} />
              <Text style={styles.popularTitle}>{item.title}</Text>
              <Text style={styles.popularArtist}>{item.artist}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Rotation */}
        <Text style={styles.sectionTitle}>Your recent rotation</Text>
        <View style={styles.recentRow}>
          {recent.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.recentCard}
              onPress={() => router.push(`/player/${item.id}`)}
            >
              <Image source={item.image} style={styles.recentImage} />
              <View style={styles.recentInfo}>
                <Text style={styles.recentText}>{item.title}</Text>
                <Text style={styles.recentArtist}>{item.artist}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const themedStyles = (darkMode: boolean) =>
  StyleSheet.create({
     safeArea: {
      flex: 1,
      backgroundColor: darkMode ? '#121212' : '#fff',
    },
    container: {
      padding: 16,
    },
    greeting: {
      fontSize: 18,
      fontWeight: '700',
      color: darkMode ? '#fff' : '#1A3164',
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: darkMode ? '#fff' : '#1A3164',
      marginTop: 2,
      marginBottom: 8,
    },
    loadingText: {
      color: darkMode ? '#fff' : '#1A3164',
      marginBottom: 12,
    },
    noRecentText: {
      color: darkMode ? '#fff' : '#1A3164',
      marginBottom: 12,
    },
    jumpCardLarge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: darkMode ? '#222' : '#EDF0F7',
      borderRadius: 12,
      gap: 8,
      marginBottom: 12,
      padding: 10,
    },
    jumpImageLarge: {
      width: 52,
      height: 55,
      borderRadius: 8,
      marginRight: 8,
    },
    jumpSongLarge: {
      color: darkMode ? '#fff' : '#1A3164',
      fontSize: 14,
      fontWeight: '700',
    },
    jumpArtistLarge: {
      color: darkMode ? '#bbb' : '#666',
      fontSize: 12,
    },
    jumpGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 8,
    },
    jumpCardSmall: {
      width: (width - 48) / 2,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: darkMode ? '#222' : '#EDF0F7',
      borderRadius: 12,
      padding: 8,
      marginBottom: 8,
    },
    jumpImageSmall: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: 8,
    },
    jumpSongSmall: {
      color: darkMode ? '#fff' : '#1A3164',
      fontSize: 14,
      fontWeight: '600',
    },
    jumpArtistSmall: {
      color: darkMode ? '#bbb' : '#666',
      fontSize: 12,
    },
    popularRow: {
      marginBottom: 16,
    },
    popularItem: {
      alignItems: 'center',
      marginHorizontal: 8,
    },
    popularImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    popularTitle: {
      color: darkMode ? '#fff' : '#1A3164',
      fontWeight: '700',
      fontSize: 13,
    },
    popularArtist: {
      color: darkMode ? '#bbb' : '#888',
      fontSize: 10,
    },
    recentRow: {
      flexDirection: 'column',
      gap: 12,
      paddingHorizontal: 6,
    },
    recentCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: darkMode ? '#333' : '#EDF0F7',
      borderRadius: 8,
      marginBottom: 10,
      padding: 8,
    },
    recentImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 12,
    },
    recentInfo: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
    recentText: {
      color: darkMode ? '#fff' : '#1A3164',
      fontSize: 14,
      fontWeight: '500',
    },
    recentArtist: {
      color: darkMode ? '#bbb' : '#888',
      fontSize: 10,
    },
  });
