import React, { useContext, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { ThemeContext } from '../../lib/ThemeContext';  // import context

export default function Library() {
  const router = useRouter();
  const { darkMode } = useContext(ThemeContext);  // get darkMode from context

  const categories = ['Playlists', 'Albums', 'Artists'];
  const [activeCategory, setActiveCategory] = useState('Playlists');

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [sort, setSort] = useState('recent'); // Or 'name'
  const [showPinned, setShowPinned] = useState(false);

  const fetchPlaylists = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      let query = supabase.from('playlists').select('*').eq('created_by', user.id);

      if (sort === 'name') query = query.order('name', { ascending: true });
      else query = query.order('created_at', { ascending: false });

      if (showPinned) query = query.eq('is_pinned', true);

      const { data, error } = await query;
      if (!error) setPlaylists(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlaylists();
  }, [sort, showPinned, showCreate]);

  const togglePin = async (playlistId, currentPinned) => {
    await supabase.from('playlists').update({ is_pinned: !currentPinned }).eq('id', playlistId);
    await fetchPlaylists();
  };

  const deletePlaylist = async (playlistId) => {
    await supabase.from('playlists').delete().eq('id', playlistId);
    await fetchPlaylists();
  };

  const handleCreatePlaylist = async () => {
    if (!newName.trim()) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('playlists').insert([{ name: newName, created_by: user.id, is_pinned: false }]);
      setShowCreate(false);
      setNewName('');
      await fetchPlaylists();
    }
  };

  const albums = [];
  const artists = [];

  return (
    <SafeAreaView style={[styles.safeArea, darkMode && styles.darkSafeArea]}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={darkMode ? '#fff' : '#1A3164'}
          style={{ marginTop: 45, marginLeft: 15 }}
        />
      </TouchableOpacity>

      <ScrollView style={[styles.container, darkMode && styles.darkContainer]} showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={[styles.title, darkMode && styles.darkTitle]}>Your Library</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={() => setShowCreate(true)}>
              <Text style={[styles.topIcon, { marginLeft: 10 }, darkMode && styles.darkTopIcon]}>＋</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pill Categories */}
        <View style={styles.categoryRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryPill,
                activeCategory === cat && styles.activeCategory,
                darkMode && styles.darkCategoryPill,
                darkMode && activeCategory === cat && styles.darkActiveCategory,
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat && styles.activeCategoryText,
                  darkMode && styles.darkCategoryText,
                  darkMode && activeCategory === cat && styles.darkActiveCategoryText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recents Header and Sorting */}
        <View style={styles.recentsHeader}>
          <Text style={[styles.recentsLabel, darkMode && styles.darkRecentsLabel]}>Recents</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity onPress={() => setSort('recent')}>
              <Text style={[styles.gridIcon, sort === 'recent' && styles.activeIcon, darkMode && styles.darkGridIcon]}>
                ⏱️
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSort('name')}>
              <Text style={[styles.gridIcon, sort === 'name' && styles.activeIcon, darkMode && styles.darkGridIcon]}>
                A-Z
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowPinned(!showPinned)}>
              <Text style={[styles.gridIcon, showPinned && styles.activeIcon, darkMode && styles.darkGridIcon]}>📌</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Library Items */}
        <View>
          {activeCategory === 'Playlists' &&
            (loading ? (
              <ActivityIndicator color={darkMode ? '#fff' : '#1A3164'} />
            ) : playlists.length === 0 ? (
              <Text style={[{ color: '#888', textAlign: 'center', marginTop: 40 }, darkMode && { color: '#bbb' }]}>
                No playlists yet.
              </Text>
            ) : (
              playlists.map((item) => (
                <TouchableOpacity key={item.id} style={[styles.libraryItemRow, darkMode && styles.darkLibraryItemRow]} activeOpacity={0.8}>
                  <View style={[styles.albumThumb, { backgroundColor: item.is_pinned ? '#FFD880' : darkMode ? '#222' : '#EDF0F7' }]}>
                    {item.is_pinned && (
                      <Text style={{ fontSize: 18, color: '#1A3164', fontWeight: 'bold' }}>★</Text>
                    )}
                  </View>
                  <View style={styles.libraryInfo}>
                    <Text style={[styles.libraryTitle, darkMode && styles.darkLibraryTitle]}>{item.name}</Text>
                    <Text style={[styles.librarySubtitle, darkMode && styles.darkLibrarySubtitle]}>
                      Playlist • {item.track_count || 0} songs
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => togglePin(item.id, item.is_pinned)}>
                    <Text style={{ fontSize: 18, color: item.is_pinned ? '#FFC800' : '#bbb' }}>📌</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deletePlaylist(item.id)}>
                    <Text style={{ fontSize: 18, color: '#F55' }}>🗑️</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ))}
          {/* You can add Albums/Artists sections here in the future */}
        </View>
      </ScrollView>

      {/* Create Playlist Modal */}
      <Modal visible={showCreate} animationType="slide" transparent>
        <View style={[styles.modalBackdrop, darkMode && styles.darkModalBackdrop]}>
          <View style={[styles.modalCard, darkMode && styles.darkModalCard]}>
            <Text style={[styles.modalTitle, darkMode && styles.darkModalTitle]}>Create New Playlist</Text>
            <TextInput
              placeholder="Playlist Name"
              value={newName}
              onChangeText={setNewName}
              style={[styles.modalInput, darkMode && styles.darkModalInput]}
              autoFocus
              placeholderTextColor={darkMode ? '#aaa' : '#888'}
            />
            <View style={{ flexDirection: 'row', marginTop: 16, gap: 16 }}>
              <TouchableOpacity style={styles.modalBtn} onPress={handleCreatePlaylist}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#eee' }]}
                onPress={() => setShowCreate(false)}
              >
                <Text style={{ color: '#1A3164', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  darkSafeArea: { backgroundColor: '#000' },

  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  darkContainer: { backgroundColor: '#000' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#1A3164', flex: 1 },
  darkTitle: { color: '#fff' },

  iconRow: { flexDirection: 'row' },
  topIcon: { fontSize: 20, color: '#1A3164' },
  darkTopIcon: { color: '#bbb' },

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
  darkCategoryPill: { backgroundColor: '#222' },
  categoryText: {
    fontSize: 14,
    color: '#1A3164',
    fontWeight: '500',
  },
  darkCategoryText: { color: '#bbb' },
  activeCategory: { backgroundColor: '#1A3164' },
  darkActiveCategory: { backgroundColor: '#3E65B6' },
  activeCategoryText: { color: '#fff', fontWeight: '700' },
  darkActiveCategoryText: { color: '#fff' },

  recentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  recentsLabel: { color: '#888', fontWeight: '600', fontSize: 16 },
  darkRecentsLabel: { color: '#bbb' },

  gridIcon: { color: '#888', fontSize: 17, marginRight: 7 },
  darkGridIcon: { color: '#bbb' },

  activeIcon: { color: '#1A3164', fontWeight: 'bold' },

  libraryItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    borderRadius: 13,
    backgroundColor: '#fff',
    paddingVertical: 2,
    paddingRight: 8,
  },
  darkLibraryItemRow: { backgroundColor: '#111' },

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
  darkLibraryTitle: { color: '#fff' },

  librarySubtitle: { color: '#888', fontWeight: '500', fontSize: 13 },
  darkLibrarySubtitle: { color: '#bbb' },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkModalBackdrop: { backgroundColor: 'rgba(255,255,255,0.1)' },

  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  darkModalCard: { backgroundColor: '#222' },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A3164',
    marginBottom: 16,
  },
  darkModalTitle: { color: '#fff' },

  modalInput: {
    backgroundColor: '#EDF0F7',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    width: '100%',
    fontSize: 16,
    marginBottom: 4,
    color: '#1A3164',
  },
  darkModalInput: {
    backgroundColor: '#333',
    color: '#ccc',
  },

  modalBtn: {
    flex: 1,
    backgroundColor: '#1A3164',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
});
