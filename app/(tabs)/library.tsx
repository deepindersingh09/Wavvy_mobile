import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Library() {
  // Demo categories for the pill nav
  const categories = ['Playlists', 'Albums', 'Artists'];
  // Example library items (replace with your data or fetch from Supabase later)
  const libraryItems = [
    { title: 'Liked Songs', subtitle: 'Playlist • 46 songs', color: '#A8A6FC', isPinned: true },
    { title: 'My Favourites', subtitle: 'Playlist • 20 songs', color: '#5EC2EA' },
    { title: 'Lo-Fi Beats', subtitle: 'Playlist • 37 songs', color: '#FFD880' },
    { title: 'Chill Vibes', subtitle: 'Playlist • 14 songs', color: '#1A3164', textColor: '#fff' },
    { title: 'Arijit Singh', subtitle: 'Artist', color: '#EDF0F7', textColor: '#1A3164' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.title}>Your Library</Text>
          <View style={styles.iconRow}>
           
            <Text style={[styles.topIcon, { marginLeft: 10 }]}>＋</Text>
          </View>
        </View>

        {/* Pill Categories */}
        <View style={styles.categoryRow}>
          {categories.map((cat, i) => (
            <TouchableOpacity key={i} style={[styles.categoryPill, i === 0 && styles.activeCategory]}>
              <Text style={[styles.categoryText, i === 0 && styles.activeCategoryText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recents Header */}
        <View style={styles.recentsHeader}>
          <Text style={styles.recentsLabel}>Recents</Text>
          <Text style={styles.gridIcon}>☰</Text>
        </View>

        {/* Library Items */}
        <View>
          {libraryItems.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.libraryItemRow}>
              <View style={[styles.albumThumb, { backgroundColor: item.color }]}>
                {item.isPinned && (
                  <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>★</Text>
                )}
              </View>
              <View style={styles.libraryInfo}>
                <Text style={[styles.libraryTitle, item.textColor && { color: item.textColor }]}>
                  {item.title}
                </Text>
                <Text style={styles.librarySubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A3164',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  title: { fontSize: 22, fontWeight: '700', color: '#1A3164', flex: 1 },
  iconRow: { flexDirection: 'row' },
  topIcon: { fontSize: 20, color: '#1A3164' },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 12,
  },
  categoryPill: {
    backgroundColor: '#EDF0F7',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    color: '#1A3164',
    fontWeight: '500',
  },
  activeCategory: { backgroundColor: '#1A3164' },
  activeCategoryText: { color: '#fff', fontWeight: '700' },
  recentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  recentsLabel: { color: '#888', fontWeight: '600', fontSize: 16 },
  gridIcon: { color: '#888', fontSize: 17 },
  libraryItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    borderRadius: 13,
    backgroundColor: '#fff',
    paddingVertical: 2,
    paddingRight: 8,
  },
  albumThumb: {
    width: 56,
    height: 56,
    borderRadius: 11,
    marginRight: 13,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  libraryInfo: { flex: 1 },
  libraryTitle: { fontSize: 16, fontWeight: '700', color: '#1A3164' },
  librarySubtitle: { color: '#888', fontWeight: '500', fontSize: 13 },
});
