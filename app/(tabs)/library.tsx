import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function Library() {
  const categories = ['Playlists', 'Albums', 'Artists'];
  const [activeCategory, setActiveCategory] = useState('Playlists');

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [sort, setSort] = useState('recent'); // Or 'name'
  const [showPinned, setShowPinned] = useState(false);

  // Fetch playlists on load and when dependencies change
  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        let query = supabase
          .from('playlists')
          .select('*')
          .eq('created_by', user.id);

        if (sort === 'name') query = query.order('name', { ascending: true });
        else query = query.order('created_at', { ascending: false });

        if (showPinned) query = query.eq('is_pinned', true);

        const { data, error } = await query;
        if (!error) setPlaylists(data || []);
      }
      setLoading(false);
    };
    fetchPlaylists();
  }, [sort, showPinned, showCreate]); // refetch when sorting/pinned/created

  // Pin/unpin logic
  const togglePin = async (playlistId, currentPinned) => {
    await supabase
      .from('playlists')
      .update({ is_pinned: !currentPinned })
      .eq('id', playlistId);
    setPlaylists((prev) =>
      prev.map((pl) => (pl.id === playlistId ? { ...pl, is_pinned: !currentPinned } : pl))
    );
  };

  // Delete playlist logic
  const deletePlaylist = async (playlistId) => {
    await supabase.from('playlists').delete().eq('id', playlistId);
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  };

  // Create playlist
  const handleCreatePlaylist = async () => {
    if (!newName.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('playlists').insert([
      { name: newName, created_by: user.id, is_pinned: false }
    ]);
    setShowCreate(false);
    setNewName('');
  };

  // Placeholder for album/artist (for future)
  const albums = [];
  const artists = [];

  // Render
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.title}>Your Library</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={() => setShowCreate(true)}>
              <Text style={[styles.topIcon, { marginLeft: 10 }]}>＋</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pill Categories */}
        <View style={styles.categoryRow}>
          {categories.map((cat, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.categoryPill, activeCategory === cat && styles.activeCategory]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.activeCategoryText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recents Header and Sorting */}
        <View style={styles.recentsHeader}>
          <Text style={styles.recentsLabel}>Recents</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity onPress={() => setSort('recent')}>
              <Text style={[styles.gridIcon, sort === 'recent' && styles.activeIcon]}>⏱️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSort('name')}>
              <Text style={[styles.gridIcon, sort === 'name' && styles.activeIcon]}>A-Z</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowPinned(!showPinned)}>
              <Text style={[styles.gridIcon, showPinned && styles.activeIcon]}>📌</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Library Items */}
        <View>
          {activeCategory === 'Playlists' && (
            loading ? (
              <ActivityIndicator color="#1A3164" />
            ) : playlists.length === 0 ? (
              <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>
                No playlists yet.
              </Text>
            ) : (
              playlists.map((item, idx) => (
                <TouchableOpacity key={item.id} style={styles.libraryItemRow}>
                  <View style={[styles.albumThumb, { backgroundColor: item.is_pinned ? '#FFD880' : '#EDF0F7' }]}>
                    {item.is_pinned && (
                      <Text style={{ fontSize: 18, color: '#1A3164', fontWeight: 'bold' }}>★</Text>
                    )}
                  </View>
                  <View style={styles.libraryInfo}>
                    <Text style={[styles.libraryTitle]}>{item.name}</Text>
                    <Text style={styles.librarySubtitle}>
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
            )
          )}
          {/* You can add Albums/Artists sections here in the future */}
        </View>
      </ScrollView>

      {/* Create Playlist Modal */}
      <Modal visible={showCreate} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create New Playlist</Text>
            <TextInput
              placeholder="Playlist Name"
              value={newName}
              onChangeText={setNewName}
              style={styles.modalInput}
              autoFocus
            />
            <View style={{ flexDirection: 'row', marginTop: 16, gap: 16 }}>
              <TouchableOpacity style={styles.modalBtn} onPress={handleCreatePlaylist}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#eee' }]} onPress={() => setShowCreate(false)}>
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
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
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
  gridIcon: { color: '#888', fontSize: 17, marginRight: 7 },
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

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A3164',
    marginBottom: 16,
  },
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
  modalBtn: {
    flex: 1,
    backgroundColor: '#1A3164',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
});
