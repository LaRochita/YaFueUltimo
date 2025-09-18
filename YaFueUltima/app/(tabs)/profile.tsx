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
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { User, CreditCard as Edit3, Settings, Trophy, Calendar, Star, TrendingUp, Award, MapPin, Camera, Share, LogOut, X, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useUserStore } from '../../store/userStore';
import { getGroupsByUserId } from '../../services/groups';
import { gradients } from '@/constants/colors';
import { defaultColors } from '@/constants/defaultColors';
import { useAppColors } from '../../context/ThemeContext';
import { ThemedButton, ThemedCard, ThemedText, ThemeToggle } from '../../components';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const logout = useUserStore(state => state.logout);
  const user = useUserStore(state => state.user);
  const { colors: themeColors } = useAppColors();
  const colors = themeColors || defaultColors;
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  // Datos dinámicos que se actualizan cuando el usuario cambia
  const userStats = useMemo(() => ({
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
  }), [user]);

  useEffect(() => {
    const loadUserGroups = async () => {
      try {
        if (user?.id) {
          const groups = await getGroupsByUserId(user.id);
          setUserGroups(groups);
        }
      } catch (error) {
        console.error('Error loading user groups:', error);
      }
    };

    loadUserGroups();
  }, [user]);

  const [achievements] = useState([
    {
      id: 1,
      title: 'Anfitrión Pro',
      description: 'Puso la casa 5 veces',
      icon: '🏠',
      color: colors.primary[500],
      earned: true,
      earnedDate: '15 Dic 2023',
    },
    {
      id: 2,
      title: 'Puntual',
      description: 'Llegó a tiempo 10 veces seguidas',
      icon: '⚡',
      color: colors.secondary[500],
      earned: true,
      earnedDate: '20 Nov 2023',
    },
    {
      id: 3,
      title: 'Chef del Grupo',
      description: 'Trajo comida 3 veces',
      icon: '🍕',
      color: colors.accent[500],
      earned: false,
      progress: 66,
    },
    {
      id: 4,
      title: 'Organizador',
      description: 'Creó 5 juntadas',
      icon: '📅',
      color: colors.semantic.error,
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { 
        backgroundColor: colors.background.primary,
        borderBottomColor: colors.border.primary 
      }]}>
        <ThemedText variant="primary" size="xl" weight="bold" style={styles.headerTitle}>
          Mi Perfil
        </ThemedText>
        <View style={styles.headerActions}>
          <ThemeToggle size="large" />
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.background.tertiary }]}>
            <Share size={24} color={colors.primary[500]} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.background.tertiary }]}>
            <Settings size={24} color={colors.primary[500]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileCard}>
          <LinearGradient colors={gradients.hero as any} style={styles.profileGradient}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: userStats.avatar }} style={styles.profileAvatar} />
                <TouchableOpacity style={styles.cameraButton}>
                  <Camera size={16} color="white" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileInfo}>
                <ThemedText variant="inverse" size="lg" weight="bold" style={styles.profileName}>
                  {userStats.name}
                </ThemedText>
                <ThemedText variant="inverse" size="base" style={styles.profileNickname}>
                  @{userStats.nickname}
                </ThemedText>
                <View style={styles.profileLocation}>
                  <MapPin size={14} color="rgba(255, 255, 255, 0.8)" />
                  <ThemedText variant="inverse" size="sm" style={styles.locationText}>
                    {userStats.city}
                  </ThemedText>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setShowBalanceModal(true)}
              >
                <Edit3 size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Groups Carousel */}
            <View style={styles.groupsCarousel}>
              {userGroups.length > 0 ? (
                <View style={styles.groupCarouselContainer}>
                  <View style={styles.groupInfo}>
                    <ThemedText variant="inverse" size="base" weight="medium" style={styles.groupName}>
                      {userGroups[currentGroupIndex]?.name}
                    </ThemedText>
                    <ThemedText variant="inverse" size="sm" style={styles.memberSince}>
                      {userGroups[currentGroupIndex]?.users?.length || 0} miembros
                    </ThemedText>
                  </View>
                  
                  {userGroups.length > 1 && (
                    <View style={styles.carouselControls}>
                      <TouchableOpacity
                        style={styles.carouselButton}
                        onPress={() => setCurrentGroupIndex(prev => 
                          prev === 0 ? userGroups.length - 1 : prev - 1
                        )}
                      >
                        <ChevronLeft size={16} color="rgba(255, 255, 255, 0.8)" />
                      </TouchableOpacity>
                      
                      <View style={styles.carouselIndicators}>
                        {userGroups.map((_, index) => (
                          <View
                            key={index}
                            style={[
                              styles.indicator,
                              index === currentGroupIndex && styles.activeIndicator
                            ]}
                          />
                        ))}
                      </View>
                      
                      <TouchableOpacity
                        style={styles.carouselButton}
                        onPress={() => setCurrentGroupIndex(prev => 
                          prev === userGroups.length - 1 ? 0 : prev + 1
                        )}
                      >
                        <ChevronRight size={16} color="rgba(255, 255, 255, 0.8)" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.groupInfo}>
                  <ThemedText variant="inverse" size="base" weight="medium" style={styles.groupName}>
                    Sin grupos
                  </ThemedText>
                  <ThemedText variant="inverse" size="sm" style={styles.memberSince}>
                    Únete a un grupo para empezar
                  </ThemedText>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <ThemedCard variant="outlined" padding="medium" style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.secondary[500]}20` }]}>
              <Star size={24} color={colors.secondary[500]} />
            </View>
            <ThemedText variant="primary" size="2xl" weight="bold" style={styles.statNumber}>
              {userStats.totalPoints}
            </ThemedText>
            <ThemedText variant="secondary" size="sm" style={styles.statLabel}>
              Puntos Totales
            </ThemedText>
          </ThemedCard>

          <ThemedCard variant="outlined" padding="medium" style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.primary[500]}20` }]}>
              <Trophy size={24} color={colors.primary[500]} />
            </View>
            <ThemedText variant="primary" size="2xl" weight="bold" style={styles.statNumber}>
              #{userStats.rank}
            </ThemedText>
            <ThemedText variant="secondary" size="sm" style={styles.statLabel}>
              Ranking
            </ThemedText>
          </ThemedCard>

          <ThemedCard variant="outlined" padding="medium" style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.accent[500]}20` }]}>
              <Calendar size={24} color={colors.accent[500]} />
            </View>
            <ThemedText variant="primary" size="2xl" weight="bold" style={styles.statNumber}>
              {userStats.eventsAttended}
            </ThemedText>
            <ThemedText variant="secondary" size="sm" style={styles.statLabel}>
              Juntadas
            </ThemedText>
          </ThemedCard>

          <ThemedCard variant="outlined" padding="medium" style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.semantic.error}20` }]}>
              <TrendingUp size={24} color={colors.semantic.error} />
            </View>
            <ThemedText variant="primary" size="2xl" weight="bold" style={styles.statNumber}>
              {userStats.currentStreak}
            </ThemedText>
            <ThemedText variant="secondary" size="sm" style={styles.statLabel}>
              Racha
            </ThemedText>
          </ThemedCard>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.sectionTitle}>
              Logros
            </ThemedText>
            <TouchableOpacity style={styles.seeAllButton}>
              <ThemedText variant="accent" size="sm" weight="medium" style={styles.seeAllText}>
                Ver todos
              </ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.achievementsScroll}>
              {achievements.map((achievement) => (
                <ThemedCard 
                  key={achievement.id} 
                  variant="outlined" 
                  padding="medium" 
                  style={styles.achievementCard}
                >
                  <View style={[
                    styles.achievementIcon,
                    { backgroundColor: achievement.earned ? `${achievement.color}20` : colors.background.tertiary }
                  ]}>
                    <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                  </View>
                  
                  <ThemedText 
                    variant={achievement.earned ? "primary" : "tertiary"} 
                    size="sm" 
                    weight="medium"
                    style={styles.achievementTitle}
                  >
                    {achievement.title}
                  </ThemedText>
                  
                  {achievement.earned ? (
                    <ThemedText variant="secondary" size="xs" style={styles.earnedDate}>
                      {achievement.earnedDate}
                    </ThemedText>
                  ) : (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View style={[
                          styles.progressFill,
                          { width: achievement.progress ? `${achievement.progress}%` : '0%', backgroundColor: achievement.color }
                        ]} />
                      </View>
                      <ThemedText variant="secondary" size="xs" style={styles.progressText}>
                        {achievement.progress}%
                      </ThemedText>
                    </View>
                  )}
                </ThemedCard>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.sectionTitle}>
            Actividad Reciente
          </ThemedText>
          
          {recentActivity.map((activity) => (
            <ThemedCard key={activity.id} variant="outlined" padding="small" style={styles.activityItem}>
              <View style={styles.activityIcon}>
                {activity.type === 'attendance' && <Calendar size={16} color={colors.primary[500]} />}
                {activity.type === 'hosting' && <User size={16} color={colors.accent[500]} />}
                {activity.type === 'punctuality' && <Star size={16} color={colors.secondary[500]} />}
                {activity.type === 'food' && <Trophy size={16} color={colors.semantic.error} />}
              </View>
              
              <View style={styles.activityInfo}>
                <ThemedText variant="primary" size="sm" weight="medium" style={styles.activityDescription}>
                  {activity.description}
                </ThemedText>
                <ThemedText variant="secondary" size="xs" style={styles.activityDate}>
                  {activity.date}
                </ThemedText>
              </View>
              
              <View style={styles.pointsEarned}>
                <ThemedText variant="accent" size="sm" weight="bold" style={styles.pointsText}>
                  {activity.points}
                </ThemedText>
              </View>
            </ThemedCard>
          ))}
        </View>

        {/* Additional Stats */}
        <View style={styles.section}>
          <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.sectionTitle}>
            Estadísticas Detalladas
          </ThemedText>
          
          <ThemedCard variant="outlined" padding="medium" style={styles.detailedStatsCard}>
            <View style={styles.detailedStatRow}>
              <ThemedText variant="secondary" size="sm" style={styles.detailedStatLabel}>
                Juntadas asistidas
              </ThemedText>
              <ThemedText variant="primary" size="sm" weight="medium" style={styles.detailedStatValue}>
                {userStats.eventsAttended}
              </ThemedText>
            </View>
            
            <View style={styles.detailedStatRow}>
              <ThemedText variant="secondary" size="sm" style={styles.detailedStatLabel}>
                Veces que puso la casa
              </ThemedText>
              <ThemedText variant="primary" size="sm" weight="medium" style={styles.detailedStatValue}>
                {userStats.eventsHosted}
              </ThemedText>
            </View>
            
            <View style={styles.detailedStatRow}>
              <ThemedText variant="secondary" size="sm" style={styles.detailedStatLabel}>
                Racha actual
              </ThemedText>
              <ThemedText variant="primary" size="sm" weight="medium" style={styles.detailedStatValue}>
                {userStats.currentStreak} juntadas
              </ThemedText>
            </View>
            
            <View style={styles.detailedStatRow}>
              <ThemedText variant="secondary" size="sm" style={styles.detailedStatLabel}>
                Tasa de asistencia
              </ThemedText>
              <ThemedText variant="primary" size="sm" weight="medium" style={styles.detailedStatValue}>
                85%
              </ThemedText>
            </View>
          </ThemedCard>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.sectionTitle}>
            Cuenta
          </ThemedText>
          
          <View style={styles.accountActions}>
            <TouchableOpacity style={styles.accountAction} onPress={() => router.push('/edit-profile')}>
              <View style={styles.actionIcon}>
                <User size={20} color={colors.text.secondary} />
              </View>
              <ThemedText variant="primary" size="base" style={styles.actionText}>
                Editar Perfil
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.accountAction}>
              <View style={styles.actionIcon}>
                <Settings size={20} color={colors.text.secondary} />
              </View>
              <ThemedText variant="primary" size="base" style={styles.actionText}>
                Configuración
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.accountAction, styles.logoutAction]}
              onPress={handleLogout}
            >
              <View style={styles.actionIcon}>
                <LogOut size={20} color={colors.semantic.error} />
              </View>
              <ThemedText variant="primary" size="base" style={styles.actionText}>
                Cerrar Sesión
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Balance Modal */}
      <Modal
        visible={showBalanceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBalanceModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.background.overlay }]}>
          <ThemedCard variant="elevated" padding="large" style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText variant="primary" size="xl" weight="bold" style={styles.modalTitle}>
                Mi Balance
              </ThemedText>
              <TouchableOpacity
                onPress={() => setShowBalanceModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.balanceContainer}>
              <View style={[styles.balanceIconContainer, { backgroundColor: `${colors.accent[500]}20` }]}>
                <DollarSign size={32} color={colors.accent[500]} />
              </View>
              <ThemedText variant="primary" size="3xl" weight="bold" style={styles.balanceAmount}>
                ${user?.balance?.toFixed(2) || '0.00'}
              </ThemedText>
              <ThemedText variant="secondary" size="base" style={styles.balanceLabel}>
                Balance Actual
              </ThemedText>
            </View>

            <View style={styles.balanceInfo}>
              <ThemedText variant="secondary" size="sm" style={styles.balanceInfoText}>
                Este es tu balance actual basado en las juntadas y gastos compartidos.
              </ThemedText>
              {(user?.balance || 0) > 0 ? (
                <ThemedText variant="primary" size="sm" weight="medium" style={styles.positiveBalanceText}>
                  ¡Tienes un balance positivo! Te deben dinero.
                </ThemedText>
              ) : (user?.balance || 0) < 0 ? (
                <ThemedText variant="primary" size="sm" weight="medium" style={styles.negativeBalanceText}>
                  Tienes deudas pendientes por pagar.
                </ThemedText>
              ) : (
                <ThemedText variant="primary" size="sm" weight="medium" style={styles.neutralBalanceText}>
                  Estás al día con todos los pagos.
                </ThemedText>
              )}
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
  },
  headerTitle: {
    // Estilos manejados por ThemedText
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
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
  groupsCarousel: {
    marginTop: 16,
  },
  groupCarouselContainer: {
    alignItems: 'center',
  },
  groupInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  groupName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
    textAlign: 'center',
  },
  memberSince: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  carouselControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  carouselButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselIndicators: {
    flexDirection: 'row',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
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
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
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
  },
  achievementsScroll: {
    flexDirection: 'row',
    gap: 16,
  },
  achievementCard: {
    width: 120,
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
    textAlign: 'center',
    marginBottom: 4,
  },
  lockedText: {
  },
  earnedDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
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
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
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
  },
  detailedStatsCard: {
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
  },
  detailedStatValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  accountActions: {
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
  },
  logoutText: {
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  closeButton: {
    padding: 4,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  balanceInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  balanceInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 12,
  },
  positiveBalanceText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  negativeBalanceText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  neutralBalanceText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});