import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function Search() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Filter chips
  const filters = ['All', 'Artists', 'Albums', 'Playlists', 'Tracks'];

  // Recent/trending searches (static demo for now)
  const trending = ['#recession pop', '#afrobeats', '#bollywood', '#clean girl'];

  // Discover demo cards
  const discover = [
    { label: 'Punjabi Hits', color: '#EC51B6' },
    { label: 'Chill Mix', color: '#5EC2EA' },
    { label: 'Lo-fi', color: '#233B7A' },
  ];

  // Fetch search results as user types
  useEffect(() => {
    const fetchResults = async () => {
      if (search.length === 0) {
        setResults([]);
        return;
      }
      setIsSearching(true);

      // Example: "tracks" table, filter by selectedFilter (add your real columns)
      let query = supabase.from('tracks').select('*');
      if (selectedFilter === 'Artists') query = query.ilike('artist', `%${search}%`);
      else if (selectedFilter === 'Albums') query = query.ilike('album', `%${search}%`);
      else if (selectedFilter === 'Playlists') query = query.ilike('playlist', `%${search}%`);
      else query = query.ilike('title', `%${search}%`);

      const { data, error } = await query.limit(10);
      setResults(data || []);
      setIsSearching(false);
    };
    fetchResults();
  }, [search, selectedFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {/* Search bar */}
        <View style={styles.searchBar}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="What do you want to listen to?"
            placeholderTextColor="#888"
            style={styles.input}
          />
        </View>

        {/* Filter chips */}
        <View style={styles.filterRow}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.activeChip,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter && styles.activeChipText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trending/recent searches */}
        <Text style={styles.subTitle}>Trending searches</Text>
        <View style={styles.suggestionRow}>
          {trending.map((item) => (
            <TouchableOpacity key={item} style={styles.suggestionChip}>
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Live Search Results */}
        {isSearching && <Text style={{ color: '#888', marginVertical: 10 }}>Searching...</Text>}
        {results.length > 0 && (
          <View>
            <Text style={styles.subTitle}>Results</Text>
            {results.map((item) => (
              <TouchableOpacity key={item.id} style={styles.resultRow}>
                <Text style={styles.resultTitle}>{item.title || item.artist || item.album}</Text>
                <Text style={styles.resultType}>{item.artist || item.album || ''}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Discover Section */}
        <Text style={styles.subTitle}>Discover</Text>
        <View style={styles.discoverRow}>
          {discover.map((item, i) => (
            <TouchableOpacity key={i} style={[styles.discoverCard, { backgroundColor: item.color }]}>
              <Text style={styles.discoverLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16, backgroundColor: '#fff' },
  searchBar: {
    backgroundColor: '#EDF0F7',
    borderRadius: 13,
    paddingHorizontal: 14,
    height: 46,
    justifyContent: 'center',
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    color: '#1A3164',
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    backgroundColor: '#EDF0F7',
    borderRadius: 19,
  },
  filterChipText: { color: '#1A3164', fontWeight: '500' },
  activeChip: { backgroundColor: '#1A3164' },
  activeChipText: { color: '#fff' },
  subTitle: { marginTop: 18, marginBottom: 7, fontWeight: '700', color: '#1A3164', fontSize: 16 },
  suggestionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  suggestionChip: {
    backgroundColor: '#EDF0F7',
    borderRadius: 15,
    paddingHorizontal: 13,
    paddingVertical: 6,
    marginBottom: 6,
    marginRight: 8,
  },
  suggestionText: { color: '#1A3164', fontWeight: '700', fontSize: 13 },
  resultRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultTitle: { color: '#1A3164', fontWeight: '700', fontSize: 15 },
  resultType: { color: '#666', fontSize: 13, marginTop: 1 },
  discoverRow: { flexDirection: 'row', gap: 11, marginTop: 8, marginBottom: 15 },
  discoverCard: {
    width: 105,
    height: 120,
    borderRadius: 15,
    justifyContent: 'flex-end',
    padding: 12,
  },
  discoverLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
