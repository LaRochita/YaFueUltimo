import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Users, ArrowLeft } from 'lucide-react-native';
import { getGroupById } from '../services/groups';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  image: string | null;
}

interface Group {
  id: string;
  name: string;
  description: string;
  users: User[];
}

export default function GroupDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [group, setGroup] = React.useState<Group | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        setLoading(true);
        const groupData = await getGroupById(id as string);
        console.log('Group details:', groupData);
        setGroup(groupData);
      } catch (error) {
        console.error('Error fetching group details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Grupo</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Cargando...</Text>
          </View>
        ) : group ? (
          <>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupDescription}>{group.description}</Text>
            </View>

            <View style={styles.membersSection}>
              <View style={styles.membersSectionHeader}>
                <Users size={20} color="#6B7280" />
                <Text style={styles.membersSectionTitle}>Miembros</Text>
                <View style={styles.membersCount}>
                  <Text style={styles.membersCountText}>
                    {group.users.length}
                  </Text>
                </View>
              </View>

              <View style={styles.membersList}>
                {group.users.map((user) => (
                  <View key={user.id} style={styles.memberItem}>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberInitials}>
                        {user.firstName[0]}{user.lastName[0]}
                      </Text>
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>
                        {user.firstName} {user.lastName}
                      </Text>
                      <Text style={styles.memberUsername}>
                        @{user.username}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Text>No se pudo cargar el grupo</Text>
          </View>
        )}
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  groupInfo: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  groupName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  groupDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  membersSection: {
    backgroundColor: 'white',
    paddingVertical: 16,
  },
  membersSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  membersSectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  membersCount: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  membersCountText: {
    color: '#6366F1',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  membersList: {
    paddingHorizontal: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInitials: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#4B5563',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  memberUsername: {
    fontSize: 14,
    color: '#6B7280',
  },
}); 