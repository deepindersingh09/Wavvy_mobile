import { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function Home() {
  const filters = ['All', 'Music', 'Podcasts'];
  const [userName, setUserName] = useState('');

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

  // Demo recommended and top charts data
  const recommended = [
    { title: 'Fresh Finds', color: '#A8A6FC' },
    { title: 'Happy Hits', color: '#5EC2EA' },
  ];
  const topCharts = [
    { title: 'Top 50 Global', color: '#FFD880' },
    { title: 'Top 50 India', color: '#1A3164', textColor: '#fff' },
  ];

  // Demo now playing (replace with real state later)
  const nowPlaying = { title: "Imagine Dragons - Bones" };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
        {/* Top Section */}
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {userName ? userName[0].toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.greeting}>
            {getGreeting()}, {userName ? userName : 'there'} 👋
          </Text>
          <View style={styles.filters}>
            {filters.map((filter, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.filterButton, index === 0 && styles.activeFilter]}
              >
                <Text
                  style={[styles.filterText, index === 0 && styles.activeFilterText]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Grid Layout */}
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridItem}>
            <View style={styles.albumArt} />
            <Text style={styles.gridTitle}>Your Playlist 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem}>
            <View style={styles.albumArt} />
            <Text style={styles.gridTitle}>Your Playlist 2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem}>
            <View style={styles.albumArt} />
            <Text style={styles.gridTitle}>Favourites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem}>
            <View style={styles.albumArt} />
            <Text style={styles.gridTitle}>Chill Mix</Text>
          </TouchableOpacity>
        </View>

        {/* Personalized Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommended.map((rec, idx) => (
              <View key={idx} style={[styles.recommendCard, { backgroundColor: rec.color }]}>
                <Text style={styles.recommendText}>{rec.title}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Charts</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topCharts.map((chart, idx) => (
              <View key={idx} style={[styles.recommendCard, { backgroundColor: chart.color }]}>
                <Text style={[styles.recommendText, chart.textColor && { color: chart.textColor }]}>
                  {chart.title}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* New Release */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New release from</Text>
          <Text style={styles.artistName}>Wavvy</Text>

          <View style={styles.releaseCard}>
            <View style={styles.releaseArt} />
            <View>
              <Text style={styles.songTitle}>Sample Track</Text>
              <Text style={styles.songArtist}>Single · Wavvy</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Now Playing Mini Bar */}
      <View style={styles.miniBar}>
        <Text style={styles.miniBarText}>
          Now Playing: {nowPlaying.title}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { alignItems: 'center', marginBottom: 16 },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A3164',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A3164',
    marginBottom: 8,
  },
  filters: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#EDF0F7',
    borderRadius: 20,
  },
  filterText: { color: '#1A3164', fontSize: 14, fontWeight: '500' },
  activeFilter: { backgroundColor: '#1A3164' },
  activeFilterText: { color: '#fff' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 10,
    marginBottom: 16,
  },
  gridItem: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF0F7',
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 12,
  },
  albumArt: {
    width: 48,
    height: 48,
    backgroundColor: '#1A3164',
    borderRadius: 8,
    opacity: 0.13,
  },
  gridTitle: { color: '#1A3164', fontSize: 14, fontWeight: '600', flexShrink: 1 },

  section: { marginTop: 12, marginBottom: 20 },
  sectionTitle: { color: '#888', fontSize: 13, fontWeight: '500', marginBottom: 6 },
  artistName: { color: '#1A3164', fontSize: 16, fontWeight: '700', marginBottom: 10 },

  releaseCard: {
    flexDirection: 'row',
    backgroundColor: '#EDF0F7',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    gap: 12,
  },
  releaseArt: { width: 60, height: 60, backgroundColor: '#1A3164', borderRadius: 8, opacity: 0.12 },
  songTitle: { color: '#1A3164', fontWeight: '700', fontSize: 15 },
  songArtist: { color: '#333', fontSize: 13 },

  recommendCard: {
    borderRadius: 15,
    minWidth: width * 0.4,
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginRight: 12,
    marginBottom: 6,
  },
  recommendText: {
    color: '#1A3164',
    fontWeight: '700',
    fontSize: 15,
  },

  miniBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#EDF0F7',
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    zIndex: 999,
  },
  miniBarText: {
    color: '#1A3164',
    fontWeight: '600',
  },
});
