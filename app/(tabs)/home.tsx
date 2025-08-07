import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { usePlayer } from '../../lib/playercontext';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const { currentTrack } = usePlayer();

  const filters = ['All', 'English', 'Punjabi', 'Hindi'];

  const recommended = [
    { title: 'Punjabi Hits', image: require('../../assets/images/punjabi_hits.png') },
    { title: 'Chill Mix', image: require('../../assets/images/chill_mix.png') },
    { title: 'Lo-fi', image: require('../../assets/images/lofi.png') },
  ];

  const popular = [
    { title: 'Supreme', artist: 'Shubh', id: '3135556', image: require('../../assets/images/supreme.png') },
    { title: 'August', artist: 'Taylor Swift', id: '1109731', image: require('../../assets/images/august.png') },
    { title: 'Water', artist: 'Diljit Dosanjh', id: '129888030', image: require('../../assets/images/water.png') },
    { title: 'Levitating', artist: 'Taylor Swift', id: '13468026', image: require('../../assets/images/levitating.png') },
  ];

  const recent = [
    { title: 'Hasse', artist: 'Nirvair Pannu', id: '1196063402', image: require('../../assets/images/hasse.png') },
    { title: 'Attraction', artist: 'Sukha, ProdGK', id: '1109731', image: require('../../assets/images/attraction.png') },
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
          setUserName('there');
        }
      }
    };
    fetchName();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <Text style={styles.greeting}>{getGreeting()}, {userName || 'First name'} 👋</Text>

        {/* Filters */}
        <View style={styles.filters}>
          {filters.map((filter, index) => (
            <TouchableOpacity key={filter} style={[styles.filterBtn, index === 0 && styles.activeFilter]}>
              <Text style={[styles.filterText, index === 0 && styles.activeFilterText]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Jump Back In */}
        <Text style={styles.sectionTitle}>Jump back in</Text>
        <TouchableOpacity
          style={styles.jumpCard}
          onPress={() => router.push('/player/3135556')}
        >
          
          <View>
            <Text style={styles.jumpSong}>Until I Found You</Text>
            <Text style={styles.jumpArtist}>Stephen Sanchez</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.jumpRow}>
          <TouchableOpacity style={styles.jumpTile} onPress={() => router.push('/player/1109731')}>
            <Text style={styles.jumpTileText}>Song Name</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.jumpTile} onPress={() => router.push(`/playlist/playlist1`)}>
            <Text style={styles.jumpTileText}>Playlist 1</Text>
          </TouchableOpacity>
        </View>

        {/* Trending Near You */}
        <Text style={styles.sectionTitle}>Trending Near you</Text>
        <View style={styles.trendingRow}>
          {recommended.map((item, i) => (
            <TouchableOpacity key={i} style={styles.trendingCard} onPress={() => router.push(`/playlist/${item.title.toLowerCase().replace(/\s/g, '-')}`)}>
              <Image source={item.image} style={styles.trendingImage} />
              <Text style={styles.trendingText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular Songs */}
        <Text style={styles.sectionTitle}>Popular Songs</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularRow}>
          {popular.map((item) => (
            <TouchableOpacity key={item.title} style={styles.popularItem} onPress={() => router.push(`/player/${item.id}`)}>
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
            <TouchableOpacity key={item.title} style={styles.recentCard} onPress={() => router.push(`/player/${item.id}`)}>
              <Image source={item.image} style={styles.recentImage} />
              <Text style={styles.recentText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Now Playing Mini Bar */}
      {currentTrack && (
        <TouchableOpacity style={styles.miniBar} onPress={() => router.push(`/player/${currentTrack.id}`)}>
          <Text style={styles.miniBarText}>
            Now Playing: {currentTrack.artist.name} - {currentTrack.title}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16 },
  greeting: { fontSize: 18, fontWeight: '700', color: '#1A3164', marginBottom: 10 },

  filters: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 6, backgroundColor: '#EDF0F7', borderRadius: 20 },
  filterText: { color: '#1A3164', fontSize: 14, fontWeight: '500' },
  activeFilter: { backgroundColor: '#1A3164' },
  activeFilterText: { color: '#fff' },

  sectionTitle: { color: '#1A3164', fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 8 },

  jumpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A3164',
    borderRadius: 12,
    padding: 10,
    gap: 10,
    marginBottom: 10,
  },
  jumpImage: { width: 50, height: 50, borderRadius: 8 },
  jumpSong: { color: '#fff', fontSize: 15, fontWeight: '700' },
  jumpArtist: { color: '#eee', fontSize: 13 },

  jumpRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  jumpTile: { backgroundColor: '#EDF0F7', borderRadius: 10, flex: 1, padding: 10, alignItems: 'center' },
  jumpTileImage: { width: 60, height: 60, borderRadius: 8, marginBottom: 6 },
  jumpTileText: { color: '#1A3164', fontWeight: '600' },

  trendingRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  trendingCard: { backgroundColor: '#fff', borderRadius: 12, elevation: 2, alignItems: 'center', width: width * 0.28 },
  trendingImage: { width: '100%', height: 100, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  trendingText: { padding: 6, fontWeight: '700', color: '#1A3164', textAlign: 'center' },

  popularRow: { marginBottom: 16 },
  popularItem: { alignItems: 'center', marginRight: 18 },
  popularImage: { width: 80, height: 80, borderRadius: 40 },
  popularTitle: { color: '#1A3164', fontWeight: '700', fontSize: 13 },
  popularArtist: { color: '#888', fontSize: 12 },

  recentRow: { flexDirection: 'row', gap: 12 },
  recentCard: { backgroundColor: '#EDF0F7', borderRadius: 10, padding: 8, alignItems: 'center', flex: 1 },
  recentImage: { width: 60, height: 60, borderRadius: 8, marginBottom: 6 },
  recentText: { color: '#1A3164', fontWeight: '700', fontSize: 14 },

  miniBar: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#EDF0F7',
    width: '100%',
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  miniBarText: {
    color: '#1A3164',
    fontWeight: '600',
  },
});
