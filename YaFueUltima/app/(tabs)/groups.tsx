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
  console.log('Rendering GroupCard with data:', group);
  return (
    <TouchableOpacity 
      style={styles.groupCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.groupDescription} numberOfLines={2}>
          {group.description}
        </Text>
        <View style={styles.groupMembers}>
          <Users size={16} color="#6B7280" />
          <Text style={styles.membersCount}>
            {group.users?.length || 0} miembros
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Grupos</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={24} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#8B5CF6']}
            tintColor="#8B5CF6"
          />
        }
      >
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#8B5CF6" style={styles.loader} />
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
            <Text style={styles.emptyStateText}>No perteneces a ningún grupo</Text>
            <Text style={styles.emptyStateSubtext}>
              Crea un grupo o pide que te inviten a uno
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Crear Grupo</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nombre del grupo"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCreateGroup}
            >
              <Text style={styles.createButtonText}>Crear Grupo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
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
    backgroundColor: 'white',
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
    color: '#1F2937',
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  groupMembers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
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
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
}); 