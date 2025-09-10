import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { User, CreditCard as Edit3, Settings, Trophy, Calendar, Star, TrendingUp, Award, MapPin, Camera, Share, LogOut } from 'lucide-react-native';
import { useUserStore } from '../../store/userStore';

export default function ProfileScreen() {
  const router = useRouter();
  const logout = useUserStore(state => state.logout);
  const user = useUserStore(state => state.user);

  const [userStats] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'Carlos Ruiz',
    nickname: user?.username || 'Carlitos',
    email: user?.email || 'carlos@example.com',
    city: 'Buenos Aires',
    avatar: user?.image || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    totalPoints: 542,
    eventsAttended: 24,
    eventsHosted: 8,
    currentStreak: 5,
    joinedDate: 'Enero 2023',
    rank: 2,
    groupName: 'Los Pibes',
  });

  const [achievements] = useState([
    {
      id: 1,
      title: 'Anfitrión Pro',
      description: 'Puso la casa 5 veces',
      icon: '🏠',
      color: '#8B5CF6',
      earned: true,
      earnedDate: '15 Dic 2023',
    },
    {
      id: 2,
      title: 'Puntual',
      description: 'Llegó a tiempo 10 veces seguidas',
      icon: '⚡',
      color: '#F59E0B',
      earned: true,
      earnedDate: '20 Nov 2023',
    },
    {
      id: 3,
      title: 'Chef del Grupo',
      description: 'Trajo comida 3 veces',
      icon: '🍕',
      color: '#10B981',
      earned: false,
      progress: 66,
    },
    {
      id: 4,
      title: 'Organizador',
      description: 'Creó 5 juntadas',
      icon: '📅',
      color: '#EF4444',
      earned: false,
      progress: 40,
    },
  ]);

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'attendance',
      description: 'Asistió a "Pizza & Películas"',
      points: '+2',
      date: '24 Ene',
    },
    {
      id: 2,
      type: 'hosting',
      description: 'Puso la casa para "Asado de Año Nuevo"',
      points: '+2',
      date: '20 Ene',
    },
    {
      id: 3,
      type: 'punctuality',
      description: 'Llegó puntual al cumpleaños de Ana',
      points: '+1',
      date: '18 Ene',
    },
    {
      id: 4,
      type: 'food',
      description: 'Trajo bebidas para todos',
      points: '+1',
      date: '15 Ene',
    },
  ]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Share size={24} color="#8B5CF6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Settings size={24} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileCard}>
          <LinearGradient colors={['#8B5CF6', '#EC4899']} style={styles.profileGradient}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: userStats.avatar }} style={styles.profileAvatar} />
                <TouchableOpacity style={styles.cameraButton}>
                  <Camera size={16} color="white" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userStats.name}</Text>
                <Text style={styles.profileNickname}>@{userStats.nickname}</Text>
                <View style={styles.profileLocation}>
                  <MapPin size={14} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.locationText}>{userStats.city}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.editButton}>
                <Edit3 size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{userStats.groupName}</Text>
              <Text style={styles.memberSince}>Miembro desde {userStats.joinedDate}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Star size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statNumber}>{userStats.totalPoints}</Text>
            <Text style={styles.statLabel}>Puntos Totales</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Trophy size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.statNumber}>#{userStats.rank}</Text>
            <Text style={styles.statLabel}>Ranking</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Calendar size={24} color="#10B981" />
            </View>
            <Text style={styles.statNumber}>{userStats.eventsAttended}</Text>
            <Text style={styles.statLabel}>Juntadas</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp size={24} color="#EF4444" />
            </View>
            <Text style={styles.statNumber}>{userStats.currentStreak}</Text>
            <Text style={styles.statLabel}>Racha</Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Logros</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.achievementsScroll}>
              {achievements.map((achievement) => (
                <View key={achievement.id} style={[
                  styles.achievementCard,
                  !achievement.earned && styles.lockedAchievement
                ]}>
                  <View style={[
                    styles.achievementIcon,
                    { backgroundColor: achievement.earned ? `${achievement.color}20` : '#F3F4F6' }
                  ]}>
                    <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                  </View>
                  
                  <Text style={[
                    styles.achievementTitle,
                    !achievement.earned && styles.lockedText
                  ]}>
                    {achievement.title}
                  </Text>
                  
                  {achievement.earned ? (
                    <Text style={styles.earnedDate}>{achievement.earnedDate}</Text>
                  ) : (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View style={[
                          styles.progressFill,
                          { width: achievement.progress ? `${achievement.progress}%` : '0%', backgroundColor: achievement.color }
                        ]} />
                      </View>
                      <Text style={styles.progressText}>{achievement.progress}%</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                {activity.type === 'attendance' && <Calendar size={16} color="#8B5CF6" />}
                {activity.type === 'hosting' && <User size={16} color="#10B981" />}
                {activity.type === 'punctuality' && <Star size={16} color="#F59E0B" />}
                {activity.type === 'food' && <Trophy size={16} color="#EF4444" />}
              </View>
              
              <View style={styles.activityInfo}>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
              
              <View style={styles.pointsEarned}>
                <Text style={styles.pointsText}>{activity.points}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Additional Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas Detalladas</Text>
          
          <View style={styles.detailedStatsCard}>
            <View style={styles.detailedStatRow}>
              <Text style={styles.detailedStatLabel}>Juntadas asistidas</Text>
              <Text style={styles.detailedStatValue}>{userStats.eventsAttended}</Text>
            </View>
            
            <View style={styles.detailedStatRow}>
              <Text style={styles.detailedStatLabel}>Veces que puso la casa</Text>
              <Text style={styles.detailedStatValue}>{userStats.eventsHosted}</Text>
            </View>
            
            <View style={styles.detailedStatRow}>
              <Text style={styles.detailedStatLabel}>Racha actual</Text>
              <Text style={styles.detailedStatValue}>{userStats.currentStreak} juntadas</Text>
            </View>
            
            <View style={styles.detailedStatRow}>
              <Text style={styles.detailedStatLabel}>Tasa de asistencia</Text>
              <Text style={styles.detailedStatValue}>85%</Text>
            </View>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          
          <View style={styles.accountActions}>
            <TouchableOpacity style={styles.accountAction} onPress={() => router.push('/edit-profile')}>
              <View style={styles.actionIcon}>
                <User size={20} color="#6B7280" />
              </View>
              <Text style={styles.actionText}>Editar Perfil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.accountAction}>
              <View style={styles.actionIcon}>
                <Settings size={20} color="#6B7280" />
              </View>
              <Text style={styles.actionText}>Configuración</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.accountAction, styles.logoutAction]}
              onPress={handleLogout}
            >
              <View style={styles.actionIcon}>
                <LogOut size={20} color="#EF4444" />
              </View>
              <Text style={[styles.actionText, styles.logoutText]}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
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
  profileCard: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileGradient: {
    padding: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  profileNickname: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  profileLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupInfo: {
    alignItems: 'center',
  },
  groupName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
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
  achievementsScroll: {
    flexDirection: 'row',
    gap: 16,
  },
  achievementCard: {
    width: 120,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementEmoji: {
    fontSize: 20,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  lockedText: {
    color: '#6B7280',
  },
  earnedDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  pointsEarned: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pointsText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  detailedStatsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailedStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailedStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  detailedStatValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  accountActions: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  accountAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logoutAction: {
    borderBottomWidth: 0,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  logoutText: {
    color: '#EF4444',
  },
});