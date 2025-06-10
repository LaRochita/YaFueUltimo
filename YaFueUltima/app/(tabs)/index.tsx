import React, { useState } from 'react';
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

export default function HomeScreen() {
  const [notifications] = useState([
    { id: 1, text: 'María llegó puntual, +1 punto 🎉', time: '5 min' },
    { id: 2, text: 'Próxima juntada mañana a las 20:00', time: '1h' },
    { id: 3, text: 'Carlos puso la casa, +2 puntos 🏠', time: '2h' },
  ]);

  const [nextMeetup] = useState({
    title: 'Asado en lo de Juan',
    date: 'Sábado 25 Enero',
    time: '20:00',
    location: 'Casa de Juan',
    attendees: 8,
    total: 12,
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400'
  });

  const [topRanking] = useState([
    { id: 1, name: 'María', nickname: 'Mari', points: 45, avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: 2, name: 'Carlos', nickname: 'Carlitos', points: 42, avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: 3, name: 'Juan', nickname: 'Juancito', points: 38, avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100' },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#8B5CF6', '#EC4899']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>¡Hola!</Text>
            <Text style={styles.username}>@tuapodo</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="white" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Next Meetup Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Calendar size={20} color="#8B5CF6" />
            <Text style={styles.cardTitle}>Próxima Juntada</Text>
          </View>
          
          <View style={styles.meetupCard}>
            <Image source={{ uri: nextMeetup.image }} style={styles.meetupImage} />
            <View style={styles.meetupInfo}>
              <Text style={styles.meetupTitle}>{nextMeetup.title}</Text>
              <View style={styles.meetupDetails}>
                <View style={styles.detailRow}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{nextMeetup.date} - {nextMeetup.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{nextMeetup.location}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Users size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{nextMeetup.attendees}/{nextMeetup.total} confirmados</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.checkInButton}>
            <MapPin size={20} color="white" />
            <Text style={styles.checkInText}>Check-in cuando llegues</Text>
          </TouchableOpacity>
        </View>

        {/* Ranking Preview */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Trophy size={20} color="#F59E0B" />
            <Text style={styles.cardTitle}>Ranking Semanal</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          {topRanking.map((user, index) => (
            <View key={user.id} style={styles.rankingItem}>
              <View style={styles.rankingLeft}>
                <View style={[styles.rankingNumber, { backgroundColor: index === 0 ? '#F59E0B' : index === 1 ? '#6B7280' : '#CD7F32' }]}>
                  <Text style={styles.rankingNumberText}>{index + 1}</Text>
                </View>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userNickname}>@{user.nickname}</Text>
                </View>
              </View>
              <View style={styles.pointsContainer}>
                <Star size={16} color="#F59E0B" />
                <Text style={styles.points}>{user.points}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Notifications */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <TrendingUp size={20} color="#10B981" />
            <Text style={styles.cardTitle}>Actividad Reciente</Text>
          </View>

          {notifications.map((notification) => (
            <View key={notification.id} style={styles.notificationItem}>
              <Text style={styles.notificationText}>{notification.text}</Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient colors={['#8B5CF6', '#EC4899']} style={styles.actionGradient}>
              <Calendar size={24} color="white" />
            </LinearGradient>
            <Text style={styles.actionText}>Nueva Juntada</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient colors={['#10B981', '#059669']} style={styles.actionGradient}>
              <Users size={24} color="white" />
            </LinearGradient>
            <Text style={styles.actionText}>Invitar Amigos</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  username: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  seeAllText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
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
    color: '#1F2937',
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
    color: '#6B7280',
    marginLeft: 8,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 12,
  },
  checkInText: {
    color: 'white',
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
    color: 'white',
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
    color: '#1F2937',
  },
  userNickname: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
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
    color: '#1F2937',
    marginRight: 12,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
    color: '#6B7280',
    textAlign: 'center',
  },
});