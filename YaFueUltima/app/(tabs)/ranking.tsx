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
import {
  Trophy,
  Star,
  TrendingUp,
  Award,
  Target,
  Calendar,
  Users,
  Crown,
} from 'lucide-react-native';

export default function RankingScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  
  const periods = [
    { id: 'weekly', label: 'Semanal' },
    { id: 'monthly', label: 'Mensual' },
    { id: 'total', label: 'Total' },
  ];

  const [rankings] = useState({
    weekly: [
      {
        id: 1,
        name: 'María García',
        nickname: 'Mari',
        points: 45,
        avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100',
        streak: 5,
        badges: ['🎯', '⚡', '🏠'],
        change: '+2',
      },
      {
        id: 2,
        name: 'Carlos Ruiz',
        nickname: 'Carlitos',
        points: 42,
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
        streak: 3,
        badges: ['🍕', '⚡'],
        change: '+1',
      },
      {
        id: 3,
        name: 'Juan Pérez',
        nickname: 'Juancito',
        points: 38,
        avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100',
        streak: 2,
        badges: ['🏠', '🎯'],
        change: '-1',
      },
      {
        id: 4,
        name: 'Ana López',
        nickname: 'Anita',
        points: 35,
        avatar: 'https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&w=100',
        streak: 4,
        badges: ['🍕'],
        change: '+3',
      },
      {
        id: 5,
        name: 'Pedro Silva',
        nickname: 'Pedrito',
        points: 32,
        avatar: 'https://images.pexels.com/photos/2379003/pexels-photo-2379003.jpeg?auto=compress&cs=tinysrgb&w=100',
        streak: 1,
        badges: ['⚡'],
        change: '0',
      },
    ],
  });

  const [achievements] = useState([
    {
      id: 1,
      title: 'Anfitrión Pro',
      description: 'Puso la casa 5 veces',
      icon: '🏠',
      color: '#8B5CF6',
      progress: 80,
    },
    {
      id: 2,
      title: 'Puntual',
      description: 'Llegó a tiempo 10 veces seguidas',
      icon: '⚡',
      color: '#F59E0B',
      progress: 60,
    },
    {
      id: 3,
      title: 'Chef del Grupo',
      description: 'Trajo comida 3 veces',
      icon: '🍕',
      color: '#10B981',
      progress: 100,
    },
  ]);

  const currentUserRank = 2;
  const currentUser = rankings.weekly[currentUserRank - 1];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ranking</Text>
        <TouchableOpacity style={styles.achievementsButton}>
          <Award size={24} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current User Stats */}
        <View style={styles.userStatsCard}>
          <LinearGradient colors={['#8B5CF6', '#EC4899']} style={styles.userStatsGradient}>
            <View style={styles.userStatsContent}>
              <Image source={{ uri: currentUser.avatar }} style={styles.userAvatar} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{currentUser.name}</Text>
                <Text style={styles.userNickname}>@{currentUser.nickname}</Text>
              </View>
              <View style={styles.userRankInfo}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{currentUserRank}</Text>
                </View>
                <View style={styles.pointsInfo}>
                  <Star size={16} color="#FEF3C7" />
                  <Text style={styles.userPoints}>{currentUser.points}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.userBadges}>
              {currentUser.badges.map((badge, index) => (
                <View key={index} style={styles.badge}>
                  <Text style={styles.badgeEmoji}>{badge}</Text>
                </View>
              ))}
              <View style={styles.streakInfo}>
                <Target size={16} color="#FEF3C7" />
                <Text style={styles.streakText}>{currentUser.streak} seguidas</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.activePeriodButton,
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.id && styles.activePeriodButtonText,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top 3 Podium */}
        <View style={styles.podiumSection}>
          <Text style={styles.sectionTitle}>Top 3 de la Semana</Text>
          <View style={styles.podium}>
            {/* Second Place */}
            <View style={styles.podiumPlace}>
              <View style={styles.podiumRank}>
                <Text style={styles.podiumRankText}>2</Text>
              </View>
              <Image source={{ uri: rankings.weekly[1].avatar }} style={styles.podiumAvatar} />
              <Text style={styles.podiumName}>{rankings.weekly[1].nickname}</Text>
              <Text style={styles.podiumPoints}>{rankings.weekly[1].points}</Text>
            </View>

            {/* First Place */}
            <View style={[styles.podiumPlace, styles.firstPlace]}>
              <Crown size={24} color="#F59E0B" style={styles.crownIcon} />
              <View style={[styles.podiumRank, styles.firstPlaceRank]}>
                <Text style={[styles.podiumRankText, styles.firstPlaceRankText]}>1</Text>
              </View>
              <Image source={{ uri: rankings.weekly[0].avatar }} style={[styles.podiumAvatar, styles.firstPlaceAvatar]} />
              <Text style={[styles.podiumName, styles.firstPlaceName]}>{rankings.weekly[0].nickname}</Text>
              <Text style={[styles.podiumPoints, styles.firstPlacePoints]}>{rankings.weekly[0].points}</Text>
            </View>

            {/* Third Place */}
            <View style={styles.podiumPlace}>
              <View style={styles.podiumRank}>
                <Text style={styles.podiumRankText}>3</Text>
              </View>
              <Image source={{ uri: rankings.weekly[2].avatar }} style={styles.podiumAvatar} />
              <Text style={styles.podiumName}>{rankings.weekly[2].nickname}</Text>
              <Text style={styles.podiumPoints}>{rankings.weekly[2].points}</Text>
            </View>
          </View>
        </View>

        {/* Full Ranking */}
        <View style={styles.fullRankingSection}>
          <Text style={styles.sectionTitle}>Ranking Completo</Text>
          
          {rankings.weekly.map((user, index) => (
            <View key={user.id} style={[styles.rankingItem, index === currentUserRank - 1 && styles.currentUserItem]}>
              <View style={styles.rankingLeft}>
                <View style={[
                  styles.rankNumber,
                  index === 0 && styles.goldRank,
                  index === 1 && styles.silverRank,
                  index === 2 && styles.bronzeRank,
                ]}>
                  <Text style={[styles.rankNumberText, index < 3 && styles.topRankText]}>
                    {index + 1}
                  </Text>
                </View>
                
                <Image source={{ uri: user.avatar }} style={styles.rankingAvatar} />
                
                <View style={styles.userDetails}>
                  <Text style={styles.rankingUserName}>{user.name}</Text>
                  <Text style={styles.rankingUserNickname}>@{user.nickname}</Text>
                  
                  <View style={styles.userBadgesSmall}>
                    {user.badges.slice(0, 3).map((badge, badgeIndex) => (
                      <Text key={badgeIndex} style={styles.badgeEmojiSmall}>{badge}</Text>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.rankingRight}>
                <View style={styles.pointsSection}>
                  <Star size={16} color="#F59E0B" />
                  <Text style={styles.rankingPoints}>{user.points}</Text>
                </View>
                
                <View style={[
                  styles.changeIndicator,
                  user.change.startsWith('+') && styles.positiveChange,
                  user.change.startsWith('-') && styles.negativeChange,
                ]}>
                  <TrendingUp size={12} color={
                    user.change.startsWith('+') ? '#10B981' :
                    user.change.startsWith('-') ? '#EF4444' : '#6B7280'
                  } />
                  <Text style={[
                    styles.changeText,
                    user.change.startsWith('+') && styles.positiveChangeText,
                    user.change.startsWith('-') && styles.negativeChangeText,
                  ]}>
                    {user.change}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Achievements Section */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Logros Disponibles</Text>
          
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={styles.achievementIcon} style={{ backgroundColor: `${achievement.color}20` }}>
                <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
              </View>
              
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[
                      styles.progressFill,
                      { width: `${achievement.progress}%`, backgroundColor: achievement.color }
                    ]} />
                  </View>
                  <Text style={styles.progressText}>{achievement.progress}%</Text>
                </View>
              </View>
            </View>
          ))}
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
  achievementsButton: {
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
  userStatsCard: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  userStatsGradient: {
    padding: 20,
  },
  userStatsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  userNickname: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userRankInfo: {
    alignItems: 'center',
  },
  rankBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  rankText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  pointsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userPoints: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FEF3C7',
    marginLeft: 4,
  },
  userBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeEmoji: {
    fontSize: 16,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FEF3C7',
    marginLeft: 4,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  activePeriodButton: {
    backgroundColor: '#8B5CF6',
  },
  periodButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activePeriodButtonText: {
    color: 'white',
  },
  podiumSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  podiumPlace: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 20,
  },
  firstPlace: {
    paddingVertical: 30,
  },
  crownIcon: {
    marginBottom: 8,
  },
  podiumRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  firstPlaceRank: {
    backgroundColor: '#F59E0B',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  podiumRankText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  firstPlaceRankText: {
    fontSize: 18,
  },
  podiumAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  firstPlaceAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#F59E0B',
  },
  podiumName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  firstPlaceName: {
    fontSize: 16,
  },
  podiumPoints: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  firstPlacePoints: {
    fontSize: 18,
  },
  fullRankingSection: {
    marginBottom: 32,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  rankingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goldRank: {
    backgroundColor: '#F59E0B',
  },
  silverRank: {
    backgroundColor: '#6B7280',
  },
  bronzeRank: {
    backgroundColor: '#CD7F32',
  },
  rankNumberText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#6B7280',
  },
  topRankText: {
    color: 'white',
  },
  rankingAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  rankingUserName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  rankingUserNickname: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  userBadgesSmall: {
    flexDirection: 'row',
    gap: 4,
  },
  badgeEmojiSmall: {
    fontSize: 12,
  },
  rankingRight: {
    alignItems: 'flex-end',
  },
  pointsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rankingPoints: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
    marginLeft: 4,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  positiveChange: {
    backgroundColor: '#D1FAE5',
  },
  negativeChange: {
    backgroundColor: '#FEE2E2',
  },
  changeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginLeft: 2,
  },
  positiveChangeText: {
    color: '#10B981',
  },
  negativeChangeText: {
    color: '#EF4444',
  },
  achievementsSection: {
    marginBottom: 32,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementEmoji: {
    fontSize: 20,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    minWidth: 35,
    textAlign: 'right',
  },
});