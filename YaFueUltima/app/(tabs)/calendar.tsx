import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, MapPin, Users, Clock, Plus, Camera, CircleCheck as CheckCircle, Circle, Star, MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useMeetingStore } from '../../store/meetingStore';
import { useUserStore } from '../../store/userStore';
import { useAppColors } from '../../context/ThemeContext';
import { ThemedButton, ThemedCard, ThemedText } from '../../components';
import { gradients } from '../../constants/colors';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  const router = useRouter();
  const user = useUserStore(state => state.user);
  const meetings = useMeetingStore(state => state.meetings);
  const fetchUserMeetings = useMeetingStore(state => state.fetchUserMeetings);
  const { colors } = useAppColors();

  useEffect(() => {
    if (user?.id) {
      fetchUserMeetings(user.id);
    }
  }, [user]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const selectedDateStr = selectedDate.toDateString();
    
    return meetings
      .filter(meeting => {
        const meetingDate = new Date(meeting.date);
        // Si hay una fecha seleccionada, filtrar por esa fecha
        // Si no, mostrar todas las futuras
        if (selectedDate.toDateString() !== new Date().toDateString()) {
          return meetingDate.toDateString() === selectedDateStr;
        }
        return meetingDate > now;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((meeting, index) => {
        const meetingDate = new Date(meeting.date);
        return {
          id: meeting.id,
          title: meeting.name,
          date: meetingDate.toLocaleDateString('es-ES'),
          time: meetingDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          location: meeting.place,
          attendees: meeting.users.map(user => user.firstName),
          confirmed: meeting.users.length,
          total: meeting.users.length,
          image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
          isNext: index === 0 && selectedDate.toDateString() === new Date().toDateString(),
        };
      });
  }, [meetings, selectedDate]);

  const pastEvents = useMemo(() => {
    const now = new Date();
    return meetings
      .filter(meeting => new Date(meeting.date) <= now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(meeting => {
        const meetingDate = new Date(meeting.date);
        return {
          id: meeting.id,
          title: meeting.name,
          date: meetingDate.toLocaleDateString('es-ES'),
          time: meetingDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          location: meeting.place,
          attendees: meeting.users.map(user => user.firstName),
          photos: 0, // Esto se podría implementar más adelante
          points: 5, // Esto se podría implementar más adelante
          image: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400',
        };
      });
  }, [meetings]);

  const handleCheckIn = () => {
    setCheckedIn(true);
    setShowCheckInModal(false);
    // Here you would typically send the check-in to your backend
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { 
        backgroundColor: colors.background.primary,
        borderBottomColor: colors.border.primary 
      }]}>
        <ThemedText variant="primary" size="xl" weight="bold" style={styles.headerTitle}>
          Calendario
        </ThemedText>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary[500] }]}
          onPress={() => router.push('/create-meeting')}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar Mini View */}
        <View style={styles.calendarSection}>
          <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.sectionTitle}>
            Enero 2024
          </ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarScroll}>
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              const isToday = i === 0;
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const hasEvent = meetings.some(meeting => 
                new Date(meeting.date).toDateString() === date.toDateString()
              );
              
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.calendarDay, 
                    isToday && { backgroundColor: colors.primary[500] },
                    isSelected && !isToday && { backgroundColor: colors.accent[500] }
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <ThemedText 
                    variant={(isToday || isSelected) ? "inverse" : "secondary"} 
                    size="xs" 
                    weight="medium"
                    style={styles.dayName}
                  >
                    {date.toLocaleDateString('es', { weekday: 'short' }).toUpperCase()}
                  </ThemedText>
                  <ThemedText 
                    variant={(isToday || isSelected) ? "inverse" : "primary"} 
                    size="base" 
                    weight="bold"
                    style={styles.dayNumber}
                  >
                    {date.getDate()}
                  </ThemedText>
                  {hasEvent && <View style={styles.eventDot} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.sectionTitle}>
            {selectedDate.toDateString() === new Date().toDateString() 
              ? 'Próximas Juntadas' 
              : `Juntadas del ${selectedDate.toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'long' 
                })}`
            }
          </ThemedText>
          
          {upcomingEvents.length === 0 ? (
            <View style={[styles.noEventsContainer, { backgroundColor: colors.background.secondary }]}>
              <ThemedText variant="secondary" size="base" style={styles.noEventsText}>
                {selectedDate.toDateString() === new Date().toDateString() 
                  ? 'No hay juntadas próximas'
                  : `No hay juntadas el ${selectedDate.toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'long' 
                    })}`
                }
              </ThemedText>
            </View>
          ) : (
            upcomingEvents.map((event) => (
            <ThemedCard 
              key={event.id} 
              variant={event.isNext ? "elevated" : "outlined"}
              padding="medium"
              style={styles.eventCard}
            >
              <TouchableOpacity 
                onPress={() => router.push(`/meeting-details?id=${event.id}`)}
                style={{ flex: 1 }}
              >
                {event.isNext && (
                  <View style={[styles.nextEventBadge, { backgroundColor: colors.primary[500] }]}>
                    <ThemedText variant="inverse" size="xs" weight="bold" style={styles.nextEventBadgeText}>
                      PRÓXIMA
                    </ThemedText>
                  </View>
                )}
                
                <View style={styles.eventHeader}>
                  <Image source={{ uri: event.image }} style={styles.eventImage} />
                  <View style={styles.eventInfo}>
                    <ThemedText variant="primary" size="base" weight="semiBold" style={styles.eventTitle}>
                      {event.title}
                    </ThemedText>
                    <View style={styles.eventDetails}>
                      <View style={styles.detailRow}>
                        <Calendar size={16} color={colors.text.secondary} />
                        <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                          {event.date}
                        </ThemedText>
                      </View>
                      <View style={styles.detailRow}>
                        <Clock size={16} color={colors.text.secondary} />
                        <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                          {event.time}
                        </ThemedText>
                      </View>
                      <View style={styles.detailRow}>
                        <MapPin size={16} color={colors.text.secondary} />
                        <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                          {event.location}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.attendeesSection}>
                  <View style={styles.attendeesInfo}>
                    <Users size={16} color={colors.text.secondary} />
                    <ThemedText variant="secondary" size="sm" style={styles.attendeesText}>
                      {event.confirmed}/{event.total} confirmados
                    </ThemedText>
                  </View>
                
                <View style={styles.attendeeAvatars}>
                  {event.attendees.slice(0, 4).map((attendee, index) => (
                    <View key={index} style={[styles.attendeeAvatar, { 
                      marginLeft: index > 0 ? -8 : 0,
                      backgroundColor: colors.primary[500]
                    }]}>
                      <ThemedText variant="inverse" size="xs" weight="medium" style={styles.attendeeInitial}>
                        {attendee[0]}
                      </ThemedText>
                    </View>
                  ))}
                  {event.attendees.length > 4 && (
                    <View style={[styles.attendeeAvatar, { 
                      marginLeft: -8,
                      backgroundColor: colors.text.secondary
                    }]}>
                      <ThemedText variant="inverse" size="xs" weight="medium" style={styles.moreAttendeesText}>
                        +{event.attendees.length - 4}
                      </ThemedText>
                    </View>
                  )}
                </View>
              </View>

              {event.isNext && (
                <View style={styles.eventActions}>
                  <ThemedButton
                    title={checkedIn ? 'Check-in realizado' : 'Hacer Check-in'}
                    onPress={() => setShowCheckInModal(true)}
                    variant="primary"
                    size="small"
                    disabled={checkedIn}
                    style={{
                      ...styles.actionButton,
                      backgroundColor: checkedIn ? colors.semantic.success : colors.primary[500]
                    }}
                  />
                  
                  <TouchableOpacity style={styles.cameraButton}>
                    <Camera size={20} color={colors.primary[500]} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.chatButton}>
                    <MessageCircle size={20} color={colors.primary[500]} />
                  </TouchableOpacity>
                </View>
              )}
              </TouchableOpacity>
            </ThemedCard>
          ))
          )}
        </View>

        {/* Past Events */}
        <View style={styles.section}>
          <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.sectionTitle}>
            Juntadas Pasadas
          </ThemedText>
          
          {pastEvents.map((event) => (
            <ThemedCard 
              key={event.id} 
              variant="outlined"
              padding="medium"
              style={styles.pastEventCard}
            >
              <TouchableOpacity 
                onPress={() => router.push(`/meeting-details?id=${event.id}`)}
                style={{ flex: 1 }}
              >
                <View style={styles.eventHeader}>
                  <Image source={{ uri: event.image }} style={styles.eventImage} />
                  <View style={styles.eventInfo}>
                    <ThemedText variant="primary" size="base" weight="semiBold" style={styles.eventTitle}>
                      {event.title}
                    </ThemedText>
                    <View style={styles.eventDetails}>
                      <View style={styles.detailRow}>
                        <Calendar size={16} color={colors.text.secondary} />
                        <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                          {event.date}
                        </ThemedText>
                      </View>
                      <View style={styles.detailRow}>
                        <Camera size={16} color={colors.text.secondary} />
                        <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                          {event.photos} fotos
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  <View style={styles.pointsEarned}>
                    <Star size={16} color={colors.secondary[500]} />
                    <ThemedText variant="accent" size="sm" weight="medium" style={styles.pointsText}>
                      +{event.points}
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            </ThemedCard>
          ))}
        </View>
      </ScrollView>

      {/* Check-in Modal */}
      <Modal
        visible={showCheckInModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCheckInModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.background.overlay }]}>
          <ThemedCard variant="elevated" padding="large" style={styles.modalContent}>
            <ThemedText variant="primary" size="xl" weight="bold" style={styles.modalTitle}>
              Check-in en la Juntada
            </ThemedText>
            <ThemedText variant="secondary" size="base" style={styles.modalText}>
              ¿Estás en "Asado en lo de Juan"? Confirma tu asistencia para ganar puntos.
            </ThemedText>
            
            <View style={styles.modalActions}>
              <ThemedButton
                title="Cancelar"
                onPress={() => setShowCheckInModal(false)}
                variant="secondary"
                size="medium"
                style={styles.cancelButton}
              />
              
              <ThemedButton
                title="Confirmar Check-in"
                onPress={handleCheckIn}
                variant="primary"
                size="medium"
                style={{
                  ...styles.confirmButton,
                  backgroundColor: colors.primary[500]
                }}
              />
            </View>
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
    borderBottomColor: '#E5E7EB',
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
  calendarSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  calendarScroll: {
    marginHorizontal: -4,
  },
  calendarDay: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    minWidth: 60,
  },
  todayDay: {
  },
  selectedDay: {
  },
  dayName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  todayText: {
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  eventCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  nextEventCard: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  nextEventBadge: {
    position: 'absolute',
    top: -1,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  nextEventBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  eventHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  eventDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
  },
  attendeesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  attendeesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  attendeeAvatars: {
    flexDirection: 'row',
  },
  attendeeAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  attendeeInitial: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  moreAttendees: {
  },
  moreAttendeesText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  eventActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  checkedInButton: {
  },
  actionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginLeft: 8,
  },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pastEventCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    opacity: 0.8,
  },
  pointsEarned: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  noEventsContainer: {
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  noEventsText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
}); 