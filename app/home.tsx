import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const filters = ['All', 'Music', 'Podcasts'];
  const playlists = [
    { title: 'Your Playlist 1' },
    { title: 'Your Playlist 2' },
    { title: 'Favourites' },
    { title: 'Chill Mix' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Section */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>D</Text>
        </View>
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
        {playlists.map((item, index) => (
          <TouchableOpacity key={index} style={styles.gridItem}>
            <View style={styles.albumArt} />
            <Text style={styles.gridTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  header: { marginBottom: 20 },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A3164',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  filters: { flexDirection: 'row', gap: 10 },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
  },
  filterText: { color: '#bbb', fontSize: 14 },
  activeFilter: { backgroundColor: '#1DB954' },
  activeFilterText: { color: '#000', fontWeight: 'bold' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 20,
  },
  gridItem: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 10,
    borderRadius: 8,
    gap: 10,
  },
  albumArt: {
    width: 48,
    height: 48,
    backgroundColor: '#444',
    borderRadius: 6,
  },
  gridTitle: { color: '#fff', fontSize: 13, flexShrink: 1 },

  section: { marginTop: 30 },
  sectionTitle: { color: '#aaa', fontSize: 14 },
  artistName: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 10 },

  releaseCard: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    gap: 12,
  },
  releaseArt: { width: 60, height: 60, backgroundColor: '#444', borderRadius: 6 },
  songTitle: { color: '#fff', fontWeight: '600', fontSize: 15 },
  songArtist: { color: '#aaa', fontSize: 13 },
});
