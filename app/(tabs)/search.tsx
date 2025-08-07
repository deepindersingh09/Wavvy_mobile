import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DeezerTrack, searchDeezerTracks } from '../../lib/deezer';

const { width } = Dimensions.get('window');

export default function Search() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<DeezerTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const recommended = [
    { title: 'Punjabi Hits', image: require('../../assets/images/punjabi_hits.png') },
    { title: 'Lo-fi', image: require('../../assets/images/lofi.png') },
    { title: 'Chill Mix', image: require('../../assets/images/chill_mix.png') },
    { title: 'Punjabi Hits', image: require('../../assets/images/punjabi_hits.png') },
    { title: 'Lo-fi', image: require('../../assets/images/lofi.png') },
    { title: 'Chill Mix', image: require('../../assets/images/chill_mix.png') },
  ];

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

  useEffect(() => {
    const fetchResults = async () => {
      if (search.length < 2) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const data = await searchDeezerTracks(search);
        setResults(data);
      } catch (e) {
        setResults([]);
      }
      setIsSearching(false);
    };
    fetchResults();
  }, [search]);

  let filteredResults = results;
  if (selectedFilter === 'Artists') {
    filteredResults = results.filter(
      (item, idx, arr) =>
        arr.findIndex((a) => a.artist.name === item.artist.name) === idx // unique artists
    );
  } else if (selectedFilter === 'Albums') {
    filteredResults = results.filter(
      (item, idx, arr) =>
        item.album &&
        arr.findIndex((a) => a.album?.title === item.album?.title) === idx // unique albums
    );
  } else if (selectedFilter === 'Tracks') {
    filteredResults = results;
  } else if (selectedFilter === 'Playlists') {
    filteredResults = []; // Deezer's search API does not return playlists directly
  }

  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A3164" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore</Text>
        <View style={{ width: 24 }} />
      </View>

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
            <TouchableOpacity key={item} style={styles.suggestionChip} onPress={() => setSearch(item)}>
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Live Search Results */}
        {isSearching && <Text style={{ color: '#888', marginVertical: 10 }}>Searching...</Text>}
        {filteredResults.length > 0 && (
          <View>
            <Text style={styles.subTitle}>Results</Text>
            {selectedFilter === 'Artists' &&
              filteredResults.map((item) => (
                <TouchableOpacity
                  key={item.artist.name}
                  style={styles.resultRow}
                  onPress={() => setSearch(item.artist.name)}
                >
                  <Text style={styles.resultTitle}>{item.artist.name}</Text>
                  <Text style={styles.resultType}>Artist</Text>
                </TouchableOpacity>
              ))}
            {selectedFilter === 'Albums' &&
              filteredResults.map((item) => (
                <TouchableOpacity
                  key={item.album.title}
                  style={styles.resultRow}
                  onPress={() => setSearch(item.album.title)}
                >
                  <Text style={styles.resultTitle}>{item.album.title}</Text>
                  <Text style={styles.resultType}>Album</Text>
                </TouchableOpacity>
              ))}
            {(selectedFilter === 'Tracks' || selectedFilter === 'All') &&
              filteredResults.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.resultRow}
                  onPress={() => router.push(`/player/${item.id}`)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    {item.album?.cover_medium && (
                      <Image source={{ uri: item.album.cover_medium }} style={{ width: 38, height: 38, borderRadius: 7 }} />
                    )}
                    <View>
                      <Text style={styles.resultTitle}>{item.title}</Text>
                      <Text style={styles.resultType}>{item.artist.name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            {selectedFilter === 'Playlists' && (
              <Text style={{ color: "#888", marginLeft: 5 }}>Playlist search not supported with Deezer API.</Text>
            )}
          </View>
        )}

        {/* Discover Section */}
        <Text style={styles.subTitle}>Discover</Text>

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


        {/* <View style={styles.discoverRow}>
          {discover.map((item, i) => (
            <TouchableOpacity key={i} style={[styles.discoverCard, { backgroundColor: item.color }]} onPress={() => setSearch(item.label)}>
              <Text style={styles.discoverLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View> */}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 0,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A3164',
  },
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
  trendingRow: { flexDirection: 'row', gap: 15, marginBottom: 16 },
  trendingCard: { backgroundColor: '#fff', borderRadius: 12, elevation: 2, alignItems: 'center', width: width * 0.30, marginBottom: 10 },
  trendingImage: { width: '100%', height: 120, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  trendingText: { padding: 6, fontWeight: '700', color: '#1A3164', textAlign: 'center', fontSize: 12 },
});
