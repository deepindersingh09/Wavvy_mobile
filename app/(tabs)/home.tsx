import { Ionicons } from '@expo/vector-icons';
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
    { title: 'Lo-fi', image: require('../../assets/images/lofi.png') },
    { title: 'Chill Mix', image: require('../../assets/images/chill_mix.png') },
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
          onPress={() => router.push('/player/1474534502')}>
          <Image
            source={require('../../assets/images/until_i_found.png')}
            style={styles.jumpImage}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.jumpSong}>Until I Found You</Text>
            <Text style={styles.jumpArtist}>Stephen Sanchez</Text>
          </View>
          <Ionicons name="play" size={28} color="#fff" style={styles.jumpPlayIcon} />

        </TouchableOpacity>

          {/* Song Tile */}
            <View style={styles.jumpRow}> 
          <TouchableOpacity style={styles.jumpTileHorizontal} onPress={() => router.push('/player/117708444')}>
            <Image
              source={require('../../assets/images/unstoppable_.png')}
              style={styles.jumpTileImageSmall}
            />
            <View>
              <Text style={styles.jumpTileText}>Unstoppable</Text>
              <Text style={styles.jumpTileSubText}>Sia</Text>
            </View>
          </TouchableOpacity>
          

          {/* Song Tile */}
          <TouchableOpacity style={styles.jumpTileHorizontal} onPress={() => router.push('/player/3422339821')}>
            <Image
              source={require('../../assets/images/postivity_.png')}
              style={styles.jumpTileImageSmall}
            />
            <View>
              <Text style={styles.jumpTileText}>Positivity</Text>
              <Text style={styles.jumpTileSubText}>Jordan Sandhu</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.jumpRow}>
          {/* Song Tile */}
          <TouchableOpacity style={styles.jumpTileHorizontal} onPress={() => router.push('/player/1505527562')}>
            <Image
              source={require('../../assets/images/jaan_.png')}
              style={styles.jumpTileImageSmall}
            />
            <View>
              <Text style={styles.jumpTileText}>Jaan</Text>
              <Text style={styles.jumpTileSubText}>Nimrat Khaira</Text>
            </View>
          </TouchableOpacity>

          {/* Song Tile */}
          <TouchableOpacity style={styles.jumpTileHorizontal} onPress={() => router.push('/player/3140442331')}>
            <Image
              source={require('../../assets/images/majhail_.png')}
              style={styles.jumpTileImageSmall}
            />
            <View>
              <Text style={styles.jumpTileText}>Majhail</Text>
              <Text style={styles.jumpTileSubText}>Prem Dhillon</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Trending Near You */}
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
              onPress={() =>
                router.push(`/playlist/${item.title.toLowerCase().replace(/\s/g, '-')}`)
              }
            >
              <Image source={item.image} style={styles.trendingImage} />
              <Text style={styles.trendingText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>


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
              <View style={styles.recentInfo}>
                <Text style={styles.recentText}>{item.title}</Text>
                <Text style={styles.recentArtist}>{item.artist}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Now Playing Mini Bar
      {currentTrack && (
        <TouchableOpacity style={styles.miniBar} onPress={() => router.push(`/player/${currentTrack.id}`)}>
          <Text style={styles.miniBarText}>
            Now Playing: {currentTrack.artist.name} - {currentTrack.title}
          </Text>
        </TouchableOpacity>
      )} */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16 },
  greeting: { fontSize: 18, fontWeight: '700', color: '#1A3164', marginBottom: 10 },

  filters: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 6, backgroundColor: '#EDF0F7', borderRadius: 20 },
  filterText: { color: '#1A3164', fontSize: 14, fontWeight: '500' },
  activeFilter: { backgroundColor: '#1A3164' },
  activeFilterText: { color: '#fff' },

  sectionTitle: { color: '#1A3164', fontSize: 16, fontWeight: '700', marginTop: 2, marginBottom: 8 },

  jumpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A3164',
    borderRadius: 12,
    gap: 10,
    marginBottom: 10,
    marginRight: 6,
  },

  jumpImage: { width: 55, height: 55, borderRadius: 8 },
  jumpSong: { color: '#fff', fontSize: 15, fontWeight: '700', marginLeft: 5 },
  jumpArtist: { color: '#eee', fontSize: 10, marginLeft: 5 },
  jumpRow: { flexDirection: 'row', gap: 4, marginBottom: 16 },
  jumpTile: { backgroundColor: '#EDF0F7', borderRadius: 10, flex: 1, alignItems: 'center' },
  jumpTileImage: { width: 65, height: 65, borderRadius: 8, marginBottom: 6 },
  jumpTileText: { color: '#1A3164', fontWeight: '600', fontSize: 12 },

  jumpTileHorizontal: {
    backgroundColor: '#EDF0F7',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },

  jumpTileImageSmall: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },

  jumpTileSubText: {
    color: '#666',
    fontSize: 10,
  },
  jumpPlayIcon: {
    marginRight: 10,
    alignSelf: 'center',
  },

  trendingRow: { flexDirection: 'row', gap: 15, marginBottom: 16 },
  trendingCard: { backgroundColor: '#fff', borderRadius: 12, elevation: 2, alignItems: 'center', width: width * 0.28 },
  trendingImage: { width: '100%', height: 120, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  trendingText: { padding: 6, fontWeight: '700', color: '#1A3164', textAlign: 'center', fontSize: 12 },

  popularRow: { marginBottom: 16 },
  popularItem: { alignItems: 'center', marginRight: 8, marginLeft: 8 },
  popularImage: { width: 80, height: 80, borderRadius: 40 },
  popularTitle: { color: '#1A3164', fontWeight: '700', fontSize: 13 },
  popularArtist: { color: '#888', fontSize: 10 },

  recentRow: {
    flexDirection: 'column',
    gap: 12,
    paddingHorizontal: 6,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF0F7',
    borderRadius: 8,
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
    color: '#1A3164',
    fontSize: 14,
    fontWeight: '500',
  },
  recentArtist: {
    color: '#888',
    fontSize: 10,
  },

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
