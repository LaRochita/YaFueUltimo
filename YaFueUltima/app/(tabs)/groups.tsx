import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Plus, X, Users } from 'lucide-react-native';
import { createGroup, getGroupsByUserId } from '../../services/groups';
import { useUserStore } from '../../store/userStore';
import { useRouter } from 'expo-router';
import { useAppColors } from '../../context/ThemeContext';
import { ThemedButton, ThemedCard, ThemedText } from '../../components';

interface Group {
  id: string;
  name: string;
  description: string;
  users: Array<{
    id: string;
    username: string;
  }>;
}

const GroupCard = ({ group, onPress }: { group: Group; onPress: () => void }) => {
  const { colors } = useAppColors();
  console.log('Rendering GroupCard with data:', group);
  
  return (
    <ThemedCard variant="outlined" padding="medium" style={styles.groupCard}>
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.7}
        style={{ flex: 1 }}
      >
        <View style={styles.groupInfo}>
          <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.groupName}>
            {group.name}
          </ThemedText>
          <ThemedText variant="secondary" size="sm" style={styles.groupDescription}>
            {group.description}
          </ThemedText>
          <View style={styles.groupMembers}>
            <Users size={16} color={colors.text.secondary} />
            <ThemedText variant="secondary" size="sm" style={styles.membersCount}>
              {group.users?.length || 0} miembros
            </ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    </ThemedCard>
  );
};

export default function GroupsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const { colors } = useAppColors();

  const fetchGroups = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const fetchedGroups = await getGroupsByUserId(user.id);
      console.log('Fetched groups from backend:', fetchedGroups);
      setGroups(Array.isArray(fetchedGroups) ? fetchedGroups : []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      Alert.alert('Error', 'No se pudieron cargar los grupos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchGroups();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('User in effect:', user);
    fetchGroups();
  }, [user]);

  const handleCreateGroup = async () => {
    if (!name || !description || !user) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const newGroup = await createGroup({
        name,
        description,
        image: '',
        userId: user.id,
      });
      console.log('Created new group:', newGroup);
      setModalVisible(false);
      setName('');
      setDescription('');
      Alert.alert('Éxito', 'Grupo creado correctamente');
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', 'No se pudo crear el grupo');
    }
  };

  const handleGroupPress = (groupId: string) => {
    router.push(`/group-details?id=${groupId}`);
  };

  console.log('Current groups state:', groups);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { 
        backgroundColor: colors.background.primary,
        borderBottomColor: colors.border.primary 
      }]}>
        <ThemedText variant="primary" size="xl" weight="bold" style={styles.headerTitle}>
          Grupos
        </ThemedText>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary[500] }]}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={24} color={colors.text.inverse} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary[500]]}
            tintColor={colors.primary[500]}
          />
        }
      >
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color={colors.primary[500]} style={styles.loader} />
        ) : groups && groups.length > 0 ? (
          groups.map((group) => (
            <GroupCard 
              key={group.id} 
              group={group} 
              onPress={() => handleGroupPress(group.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <ThemedText variant="secondary" size="lg" weight="medium" style={styles.emptyStateText}>
              No perteneces a ningún grupo
            </ThemedText>
            <ThemedText variant="secondary" size="base" style={styles.emptyStateSubtext}>
              Crea un grupo o pide que te inviten a uno
            </ThemedText>
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background.overlay }]}>
          <ThemedCard variant="elevated" padding="large" style={{...styles.modalContent, backgroundColor: colors.background.primary}}>
            <View style={styles.modalHeader}>
              <ThemedText variant="primary" size="xl" weight="bold" style={styles.modalTitle}>
                Crear Grupo
              </ThemedText>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
                color: colors.text.primary
              }]}
              placeholder="Nombre del grupo"
              placeholderTextColor={colors.text.secondary}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={[styles.input, styles.textArea, { 
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
                color: colors.text.primary
              }]}
              placeholder="Descripción"
              placeholderTextColor={colors.text.secondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <ThemedButton
              title="Crear Grupo"
              onPress={handleCreateGroup}
              variant="primary"
              size="large"
              style={styles.createButton}
            />
          </ThemedCard>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loader: {
    marginTop: 20,
  },
  groupCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  groupMembers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersCount: {
    fontSize: 14,
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  closeButton: {
    padding: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
}); 