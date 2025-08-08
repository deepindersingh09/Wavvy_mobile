import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { DeezerTrack, searchDeezerTracks } from '../../lib/deezer';
import { ThemeContext } from '../../lib/ThemeContext';

const { width } = Dimensions.get('window');

export default function Search() {
  const { darkMode } = useContext(ThemeContext);

  const params = useSearchParams();
  const [search, setSearch] = useState('');
  const query = params.get('q') || '';

  useEffect(() => {
    if (query && query !== search) {
      setSearch(query);
    }
  }, [query]);


  const [results, setResults] = useState<DeezerTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const recommended = [
    { title: 'Punjabi Hits', image: require('../../assets/images/punjabi_hits.png') },
    { title: 'Lo-fi', image: require('../../assets/images/lofi.png') },
    { title: 'Chill Mix', image: require('../../assets/images/chill_mix.png') },
  ];

  const filters = ['All', 'Artists', 'Albums', 'Playlists', 'Tracks'];

  const trending = ['#recession pop', '#afrobeats', '#bollywood', '#clean girl'];

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: darkMode ? '#121212' : '#fff' }]}>
      <View style={[styles.header, { backgroundColor: darkMode ? '#121212' : '#fff' }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={darkMode ? '#fff' : '#1A3164'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: darkMode ? '#fff' : '#1A3164' }]}>Explore</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#fff' }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search bar */}
        <View
          style={[
            styles.searchBar,
            { backgroundColor: darkMode ? '#222' : '#EDF0F7' },
          ]}
        >
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="What do you want to listen to?"
            placeholderTextColor={darkMode ? '#aaa' : '#888'}
            style={[styles.input, { color: darkMode ? '#fff' : '#1A3164' }]}
          />
        </View>

        {/* Filter chips */}
        <View style={styles.filterRow}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && {
                  backgroundColor: '#1A3164',
                },
                !darkMode && selectedFilter !== filter && styles.filterChip,
                darkMode && selectedFilter !== filter && { backgroundColor: '#222' },
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter
                    ? { color: '#fff' }
                    : { color: darkMode ? '#ddd' : '#1A3164' },
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trending/recent searches */}
        <Text style={[styles.subTitle, { color: darkMode ? '#eee' : '#1A3164' }]}>
          Trending searches
        </Text>
        <View style={styles.suggestionRow}>
          {trending.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.suggestionChip,
                { backgroundColor: darkMode ? '#222' : '#EDF0F7' },
              ]}
              onPress={() => setSearch(item)}
            >
              <Text
                style={[
                  styles.suggestionText,
                  { color: darkMode ? '#ddd' : '#1A3164' },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Live Search Results */}
        {isSearching && (
          <Text style={{ color: darkMode ? '#aaa' : '#888', marginVertical: 10 }}>
            Searching...
          </Text>
        )}
        {filteredResults.length > 0 && (
          <View>
            <Text style={[styles.subTitle, { color: darkMode ? '#eee' : '#1A3164' }]}>
              Results
            </Text>
            {selectedFilter === 'Artists' &&
              filteredResults.map((item) => (
                <TouchableOpacity
                  key={item.artist.name}
                  style={[
                    styles.resultRow,
                    { borderBottomColor: darkMode ? '#333' : '#eee' },
                  ]}
                  onPress={() => setSearch(item.artist.name)}
                >
                  <Text style={[styles.resultTitle, { color: darkMode ? '#fff' : '#1A3164' }]}>
                    {item.artist.name}
                  </Text>
                  <Text style={[styles.resultType, { color: darkMode ? '#bbb' : '#666' }]}>
                    Artist
                  </Text>
                </TouchableOpacity>
              ))}
            {selectedFilter === 'Albums' &&
              filteredResults.map((item) => (
                <TouchableOpacity
                  key={item.album.title}
                  style={[
                    styles.resultRow,
                    { borderBottomColor: darkMode ? '#333' : '#eee' },
                  ]}
                  onPress={() => setSearch(item.album.title)}
                >
                  <Text style={[styles.resultTitle, { color: darkMode ? '#fff' : '#1A3164' }]}>
                    {item.album.title}
                  </Text>
                  <Text style={[styles.resultType, { color: darkMode ? '#bbb' : '#666' }]}>
                    Album
                  </Text>
                </TouchableOpacity>
              ))}
            {(selectedFilter === 'Tracks' || selectedFilter === 'All') &&
              filteredResults.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.resultRow,
                    { borderBottomColor: darkMode ? '#333' : '#eee' },
                  ]}
                  onPress={() => router.push(`/player/${item.id}`)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    {item.album?.cover_medium && (
                      <Image
                        source={{ uri: item.album.cover_medium }}
                        style={{ width: 38, height: 38, borderRadius: 7 }}
                      />
                    )}
                    <View>
                      <Text
                        style={[styles.resultTitle, { color: darkMode ? '#fff' : '#1A3164' }]}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={[styles.resultType, { color: darkMode ? '#bbb' : '#666' }]}
                      >
                        {item.artist.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            {selectedFilter === 'Playlists' && (
              <Text style={{ color: darkMode ? '#888' : '#888', marginLeft: 5 }}>
                Playlist search not supported with Deezer API.
              </Text>
            )}
          </View>
        )}

        {/* Discover Section */}
        <Text style={[styles.subTitle, { color: darkMode ? '#eee' : '#1A3164' }]}>Discover</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendingRow}
        >
          {recommended.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.trendingCard,
                { backgroundColor: darkMode ? '#222' : '#fff' },
              ]}
              onPress={() => router.push(`/search?q=${encodeURIComponent(item.title)}`)}
            >
              <Image source={item.image} style={styles.trendingImage} />
              <Text
                style={[styles.trendingText, { color: darkMode ? '#ddd' : '#1A3164' }]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>


        {/* Uncomment if you want to re-enable Discover cards */}
        {/* <View style={styles.discoverRow}>
          {discover.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.discoverCard, { backgroundColor: item.color }]}
              onPress={() => setSearch(item.label)}
            >
              <Text style={styles.discoverLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 16, flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 0,
    marginTop: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  searchBar: {
    borderRadius: 13,
    paddingHorizontal: 14,
    height: 46,
    justifyContent: 'center',
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
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
    borderRadius: 19,
  },
  filterChipText: {
    fontWeight: '500',
  },
  subTitle: {
    marginTop: 18,
    marginBottom: 7,
    fontWeight: '700',
    fontSize: 16,
  },
  suggestionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  suggestionChip: {
    borderRadius: 15,
    paddingHorizontal: 13,
    paddingVertical: 6,
    marginBottom: 6,
    marginRight: 8,
  },
  suggestionText: {
    fontWeight: '700',
    fontSize: 13,
  },
  resultRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  resultTitle: {
    fontWeight: '700',
    fontSize: 15,
  },
  resultType: {
    fontSize: 13,
    marginTop: 1,
  },
  discoverRow: {
    flexDirection: 'row',
    gap: 11,
    marginTop: 8,
    marginBottom: 15,
  },
  discoverCard: {
    width: 105,
    height: 120,
    borderRadius: 15,
    justifyContent: 'flex-end',
    padding: 12,
  },
  discoverLabel: {
    fontWeight: '700',
    fontSize: 15,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  trendingRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 16,
  },
  trendingCard: {
    borderRadius: 12,
    elevation: 2,
    alignItems: 'center',
    width: width * 0.3,
    marginBottom: 10,
  },
  trendingImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  trendingText: {
    padding: 6,
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
  },
});
