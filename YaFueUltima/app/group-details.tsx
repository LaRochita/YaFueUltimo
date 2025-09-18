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
import { Users, ArrowLeft, Calendar, MapPin, Clock, Plus } from 'lucide-react-native';
import { getGroupById } from '../services/groups';
import { useMeetingStore } from '../store/meetingStore';

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
  const meetings = useMeetingStore(state => state.meetings);

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

  // Filtrar meetings de este grupo
  const groupMeetings = React.useMemo(() => {
    return meetings.filter(meeting => 
      meeting.users.some(user => group?.users.some(groupUser => groupUser.id === user.id))
    );
  }, [meetings, group]);

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

            {/* Juntadas del Grupo */}
            <View style={styles.meetingsSection}>
              <View style={styles.meetingsSectionHeader}>
                <Calendar size={20} color="#6B7280" />
                <Text style={styles.meetingsSectionTitle}>Juntadas</Text>
                <View style={styles.meetingsCount}>
                  <Text style={styles.meetingsCountText}>
                    {groupMeetings.length}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.createMeetingButton}
                  onPress={() => router.push(`/create-meeting?groupId=${group?.id}`)}
                >
                  <Plus size={18} color="#8B5CF6" />
                </TouchableOpacity>
              </View>

              {groupMeetings.length > 0 ? (
                <View style={styles.meetingsList}>
                  {groupMeetings.map((meeting) => {
                    const meetingDate = new Date(meeting.date);
                    const isUpcoming = meetingDate > new Date();
                    
                    return (
                      <TouchableOpacity 
                        key={meeting.id} 
                        style={[styles.meetingItem, !isUpcoming && styles.pastMeetingItem]}
                        onPress={() => router.push(`/meeting-details?id=${meeting.id}`)}
                      >
                        <View style={styles.meetingInfo}>
                          <Text style={styles.meetingName}>{meeting.name}</Text>
                          <View style={styles.meetingDetails}>
                            <View style={styles.meetingDetailRow}>
                              <Calendar size={14} color="#6B7280" />
                              <Text style={styles.meetingDetailText}>
                                {meetingDate.toLocaleDateString('es-ES')}
                              </Text>
                            </View>
                            <View style={styles.meetingDetailRow}>
                              <Clock size={14} color="#6B7280" />
                              <Text style={styles.meetingDetailText}>
                                {meetingDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                              </Text>
                            </View>
                            <View style={styles.meetingDetailRow}>
                              <MapPin size={14} color="#6B7280" />
                              <Text style={styles.meetingDetailText}>{meeting.place}</Text>
                            </View>
                          </View>
                        </View>
                        <View style={[styles.meetingStatus, isUpcoming ? styles.upcomingStatus : styles.pastStatus]}>
                          <Text style={[styles.meetingStatusText, isUpcoming ? styles.upcomingStatusText : styles.pastStatusText]}>
                            {isUpcoming ? 'Próxima' : 'Pasada'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.noMeetingsContainer}>
                  <Text style={styles.noMeetingsText}>No hay juntadas en este grupo</Text>
                </View>
              )}
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
    marginBottom: 12,
  },
  groupName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  groupDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  membersSection: {
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
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  memberUsername: {
    fontSize: 14,
  },
  meetingsSection: {
    paddingVertical: 16,
    marginTop: 12,
  },
  meetingsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  createMeetingButton: {
    marginLeft: 'auto',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  meetingsSectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  meetingsCount: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  meetingsCountText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  meetingsList: {
    paddingHorizontal: 20,
  },
  meetingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pastMeetingItem: {
    opacity: 0.7,
  },
  meetingInfo: {
    flex: 1,
  },
  meetingName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  meetingDetails: {
    gap: 4,
  },
  meetingDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meetingDetailText: {
    fontSize: 14,
    marginLeft: 6,
  },
  meetingStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  upcomingStatus: {
    backgroundColor: '#DBEAFE',
  },
  pastStatus: {
    backgroundColor: '#F3F4F6',
  },
  meetingStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  upcomingStatusText: {
  },
  pastStatusText: {
  },
  noMeetingsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  noMeetingsText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 