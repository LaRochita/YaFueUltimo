import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Calendar, 
  Trophy, 
  Users, 
  MapPin, 
  Clock,
  Bell,
  Star,
  TrendingUp
} from 'lucide-react-native';
import { useUserStore } from '../../store/userStore';
import { useMeetingStore } from '../../store/meetingStore';
import { useRouter } from 'expo-router';
import { gradients } from '@/constants/colors';
import { defaultColors } from '@/constants/defaultColors';
import { useAppColors } from '../../context/ThemeContext';
import { ThemedButton, ThemedCard, ThemedText } from '../../components';

export default function HomeScreen() {
  const user = useUserStore(state => state.user);
  const router = useRouter();
  const { colors: themeColors } = useAppColors();

  // Usar los colores del tema o los valores por defecto
  const colors = themeColors || defaultColors;
  const [notifications] = useState([
    { id: 1, text: 'María llegó puntual, +1 punto 🎉', time: '5 min' },
    { id: 2, text: 'Próxima juntada mañana a las 20:00', time: '1h' },
    { id: 3, text: 'Carlos puso la casa, +2 puntos 🏠', time: '2h' },
  ]);

  const meetings = useMeetingStore(state => state.meetings);
  const fetchUserMeetings = useMeetingStore(state => state.fetchUserMeetings);

  useEffect(() => {
    if (user?.id) {
      fetchUserMeetings(user.id);
    }
  }, [user]);

  // Obtener la próxima juntada (la más cercana en el futuro)
  const nextMeetup = useMemo(() => {
    if (!meetings.length) return null;

    const now = new Date();
    const futureMeetings = meetings
      .filter(meeting => new Date(meeting.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (!futureMeetings.length) return null;

    const next = futureMeetings[0];
    const meetingDate = new Date(next.date);

    return {
      title: next.name,
      date: meetingDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }),
      time: meetingDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      location: next.place,
      attendees: next.users.length,
      total: next.users.length,
      image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
  }, [meetings]);

  const [topRanking] = useState([
    { id: 1, name: 'María', nickname: 'Mari', points: 45, avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: 2, name: 'Carlos', nickname: 'Carlitos', points: 42, avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: 3, name: 'Juan', nickname: 'Juancito', points: 38, avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100' },
  ]);
  console.log(user);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <LinearGradient colors={gradients.hero as any} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <ThemedText variant="inverse" size="2xl" weight="bold" style={styles.greeting}>
              ¡Hola!
            </ThemedText>
            <ThemedText variant="inverse" size="base" style={styles.username}>
              @{user?.username || 'Invitado'}
            </ThemedText>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="white" />
            <View style={[styles.notificationBadge, { backgroundColor: colors.semantic.error }]}>
              <ThemedText variant="inverse" size="xs" weight="bold" style={styles.badgeText}>
                3
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Next Meetup Card */}
        <ThemedCard variant="elevated" padding="medium" style={styles.card}>
          <View style={styles.cardHeader}>
            <Calendar size={20} color={colors.primary[500]} />
            <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.cardTitle}>
              Próxima Juntada
            </ThemedText>
          </View>
          
          {nextMeetup ? (
            <TouchableOpacity 
              style={styles.meetupCard}
              onPress={() => router.push(`/meeting-details?id=${meetings.find(m => m.name === nextMeetup.title)?.id}`)}
            >
              <Image source={{ uri: nextMeetup.image }} style={styles.meetupImage} />
              <View style={styles.meetupInfo}>
                <ThemedText variant="primary" size="base" weight="semiBold" style={styles.meetupTitle}>
                  {nextMeetup.title}
                </ThemedText>
                <View style={styles.meetupDetails}>
                  <View style={styles.detailRow}>
                    <Clock size={16} color={colors.text.secondary} />
                    <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                      {nextMeetup.date} - {nextMeetup.time}
                    </ThemedText>
                  </View>
                  <View style={styles.detailRow}>
                    <MapPin size={16} color={colors.text.secondary} />
                    <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                      {nextMeetup.location}
                    </ThemedText>
                  </View>
                  <View style={styles.detailRow}>
                    <Users size={16} color={colors.text.secondary} />
                    <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                      {nextMeetup.attendees}/{nextMeetup.total} confirmados
                    </ThemedText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.noMeetupCard, { backgroundColor: colors.background.secondary }]}>
              <ThemedText variant="secondary" size="base" style={styles.noMeetupText}>
                No hay juntadas próximas
              </ThemedText>
              <ThemedText variant="tertiary" size="sm" style={styles.noMeetupSubtext}>
                ¡Crea una nueva juntada!
              </ThemedText>
            </View>
          )}

          <ThemedButton
            title="Check-in cuando llegues"
            onPress={() => {}}
            variant="primary"
            size="medium"
            gradient={true}
            style={styles.checkInButton}
          />
        </ThemedCard>

        {/* Ranking Preview */}
        <ThemedCard variant="elevated" padding="medium" style={styles.card}>
          <View style={styles.cardHeader}>
            <Trophy size={20} color={colors.secondary[500]} />
            <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.cardTitle}>
              Ranking Semanal
            </ThemedText>
            <TouchableOpacity style={styles.seeAllButton}>
              <ThemedText variant="accent" size="sm" weight="medium" style={styles.seeAllText}>
                Ver todo
              </ThemedText>
            </TouchableOpacity>
          </View>

          {topRanking.map((user, index) => (
            <View key={user.id} style={styles.rankingItem}>
              <View style={styles.rankingLeft}>
                <View style={[styles.rankingNumber, { 
                  backgroundColor: index === 0 ? colors.secondary[500] : 
                                  index === 1 ? colors.text.secondary : 
                                  colors.semantic.warning 
                }]}>
                  <ThemedText variant="inverse" size="sm" weight="bold" style={styles.rankingNumberText}>
                    {index + 1}
                  </ThemedText>
                </View>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View>
                  <ThemedText variant="primary" size="sm" weight="medium" style={styles.userName}>
                    {user.name}
                  </ThemedText>
                  <ThemedText variant="secondary" size="xs" style={styles.userNickname}>
                    @{user.nickname}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.pointsContainer}>
                <Star size={16} color={colors.secondary[500]} />
                <ThemedText variant="primary" size="sm" weight="medium" style={styles.points}>
                  {user.points}
                </ThemedText>
              </View>
            </View>
          ))}
        </ThemedCard>

        {/* Recent Notifications */}
        <ThemedCard variant="elevated" padding="medium" style={styles.card}>
          <View style={styles.cardHeader}>
            <TrendingUp size={20} color={colors.accent[500]} />
            <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.cardTitle}>
              Actividad Reciente
            </ThemedText>
          </View>

          {notifications.map((notification) => (
            <View key={notification.id} style={styles.notificationItem}>
              <ThemedText variant="primary" size="sm" style={styles.notificationText}>
                {notification.text}
              </ThemedText>
              <ThemedText variant="secondary" size="xs" style={styles.notificationTime}>
                {notification.time}
              </ThemedText>
            </View>
          ))}
        </ThemedCard>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/create-meeting')}
          >
            <LinearGradient colors={gradients.primary as any} style={styles.actionGradient}>
              <Calendar size={24} color="white" />
            </LinearGradient>
            <ThemedText variant="primary" size="sm" weight="medium" style={styles.actionText}>
              Nueva Juntada
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient colors={gradients.accent as any} style={styles.actionGradient}>
              <Users size={24} color="white" />
            </LinearGradient>
            <ThemedText variant="primary" size="sm" weight="medium" style={styles.actionText}>
              Invitar Amigos
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    // Estilos manejados por ThemedText
  },
  username: {
    opacity: 0.9,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    // Estilos manejados por ThemedText
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
    flex: 1,
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  seeAllText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  meetupCard: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  meetupImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  meetupInfo: {
    flex: 1,
  },
  meetupTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  meetupDetails: {
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
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  checkInText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginLeft: 8,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rankingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankingNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankingNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  userNickname: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 12,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  actionGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  noMeetupCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  noMeetupText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  noMeetupSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});