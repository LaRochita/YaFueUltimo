import React, { useState } from 'react';
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

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  const [upcomingEvents] = useState([
    {
      id: 1,
      title: 'Asado en lo de Juan',
      date: '2024-01-25',
      time: '20:00',
      location: 'Casa de Juan',
      attendees: ['María', 'Carlos', 'Ana', 'Pedro'],
      confirmed: 8,
      total: 12,
      image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
      isNext: true,
    },
    {
      id: 2,
      title: 'Pizza & Películas',
      date: '2024-01-28',
      time: '19:30',
      location: 'Casa de María',
      attendees: ['Juan', 'Carlos', 'Ana'],
      confirmed: 6,
      total: 10,
      image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400',
      isNext: false,
    },
  ]);

  const [pastEvents] = useState([
    {
      id: 3,
      title: 'Cumpleaños de Ana',
      date: '2024-01-20',
      time: '21:00',
      location: 'Bar Central',
      attendees: ['Juan', 'María', 'Carlos', 'Pedro', 'Lucía'],
      photos: 15,
      points: 5,
      image: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ]);

  const handleCheckIn = () => {
    setCheckedIn(true);
    setShowCheckInModal(false);
    // Here you would typically send the check-in to your backend
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendario</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar Mini View */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Enero 2024</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarScroll}>
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              const isToday = i === 0;
              const hasEvent = i === 1 || i === 4;
              
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.calendarDay, isToday && styles.todayDay]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={[styles.dayName, isToday && styles.todayText]}>
                    {date.toLocaleDateString('es', { weekday: 'short' }).toUpperCase()}
                  </Text>
                  <Text style={[styles.dayNumber, isToday && styles.todayText]}>
                    {date.getDate()}
                  </Text>
                  {hasEvent && <View style={styles.eventDot} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximas Juntadas</Text>
          
          {upcomingEvents.map((event) => (
            <View key={event.id} style={[styles.eventCard, event.isNext && styles.nextEventCard]}>
              {event.isNext && (
                <View style={styles.nextEventBadge}>
                  <Text style={styles.nextEventBadgeText}>PRÓXIMA</Text>
                </View>
              )}
              
              <View style={styles.eventHeader}>
                <Image source={{ uri: event.image }} style={styles.eventImage} />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventDetails}>
                    <View style={styles.detailRow}>
                      <Calendar size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{event.date}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{event.time}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MapPin size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{event.location}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.attendeesSection}>
                <View style={styles.attendeesInfo}>
                  <Users size={16} color="#6B7280" />
                  <Text style={styles.attendeesText}>
                    {event.confirmed}/{event.total} confirmados
                  </Text>
                </View>
                
                <View style={styles.attendeeAvatars}>
                  {event.attendees.slice(0, 4).map((attendee, index) => (
                    <View key={index} style={[styles.attendeeAvatar, { marginLeft: index > 0 ? -8 : 0 }]}>
                      <Text style={styles.attendeeInitial}>{attendee[0]}</Text>
                    </View>
                  ))}
                  {event.attendees.length > 4 && (
                    <View style={[styles.attendeeAvatar, styles.moreAttendees, { marginLeft: -8 }]}>
                      <Text style={styles.moreAttendeesText}>+{event.attendees.length - 4}</Text>
                    </View>
                  )}
                </View>
              </View>

              {event.isNext && (
                <View style={styles.eventActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, checkedIn && styles.checkedInButton]}
                    onPress={() => setShowCheckInModal(true)}
                    disabled={checkedIn}
                  >
                    {checkedIn ? (
                      <CheckCircle size={20} color="white" />
                    ) : (
                      <MapPin size={20} color="white" />
                    )}
                    <Text style={styles.actionButtonText}>
                      {checkedIn ? 'Check-in realizado' : 'Hacer Check-in'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.cameraButton}>
                    <Camera size={20} color="#8B5CF6" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.chatButton}>
                    <MessageCircle size={20} color="#8B5CF6" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Past Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Juntadas Pasadas</Text>
          
          {pastEvents.map((event) => (
            <View key={event.id} style={styles.pastEventCard}>
              <View style={styles.eventHeader}>
                <Image source={{ uri: event.image }} style={styles.eventImage} />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventDetails}>
                    <View style={styles.detailRow}>
                      <Calendar size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{event.date}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Camera size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{event.photos} fotos</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.pointsEarned}>
                  <Star size={16} color="#F59E0B" />
                  <Text style={styles.pointsText}>+{event.points}</Text>
                </View>
              </View>
            </View>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Check-in en la Juntada</Text>
            <Text style={styles.modalText}>
              ¿Estás en "Asado en lo de Juan"? Confirma tu asistencia para ganar puntos.
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCheckInModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleCheckIn}
              >
                <Text style={styles.confirmButtonText}>Confirmar Check-in</Text>
              </TouchableOpacity>
            </View>
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
  calendarSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
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
    backgroundColor: 'white',
    minWidth: 60,
  },
  todayDay: {
    backgroundColor: '#8B5CF6',
  },
  dayName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  todayText: {
    color: 'white',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  eventCard: {
    backgroundColor: 'white',
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
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  nextEventBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: 'white',
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
    color: '#1F2937',
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
    color: '#6B7280',
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
    color: '#6B7280',
    marginLeft: 8,
  },
  attendeeAvatars: {
    flexDirection: 'row',
  },
  attendeeAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  attendeeInitial: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  moreAttendees: {
    backgroundColor: '#6B7280',
  },
  moreAttendeesText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: 'white',
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
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 12,
  },
  checkedInButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginLeft: 8,
  },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pastEventCard: {
    backgroundColor: 'white',
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
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
}); 