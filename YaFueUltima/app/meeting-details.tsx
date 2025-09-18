import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  Receipt,
  Plus
} from 'lucide-react-native';
import { useMeetingStore } from '../store/meetingStore';
import { useAppColors } from '../context/ThemeContext';
import { ThemedButton, ThemedCard, ThemedText } from '../components';
import { gradients } from '../constants/colors';

export default function MeetingDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const meetings = useMeetingStore(state => state.meetings);
  const { colors } = useAppColors();
  
  // Encontrar la juntada por ID
  const meeting = meetings.find(m => m.id === id);

  if (!meeting) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={[styles.header, { 
          backgroundColor: colors.background.primary,
          borderBottomColor: colors.border.primary 
        }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <ThemedText variant="primary" size="xl" weight="bold" style={styles.headerTitle}>
            Juntada no encontrada
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const meetingDate = new Date(meeting.date);
  const isUpcoming = meetingDate > new Date();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { 
        backgroundColor: colors.background.primary,
        borderBottomColor: colors.border.primary 
      }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <ThemedText variant="primary" size="xl" weight="bold" style={styles.headerTitle}>
          Detalles de Juntada
        </ThemedText>
      </View>

      <ScrollView style={styles.content}>
        {/* Meeting Info Card */}
        <ThemedCard variant="elevated" padding="none" style={styles.meetingCard}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400' }} 
            style={styles.meetingImage} 
          />
          <View style={styles.meetingInfo}>
            <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.meetingTitle}>
              {meeting.name}
            </ThemedText>
            <ThemedText variant="secondary" size="base" style={styles.meetingDescription}>
              {meeting.description}
            </ThemedText>
            
            <View style={styles.meetingDetails}>
              <View style={styles.detailRow}>
                <Calendar size={16} color={colors.text.secondary} />
                <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                  {meetingDate.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </ThemedText>
              </View>
              
              <View style={styles.detailRow}>
                <Clock size={16} color={colors.text.secondary} />
                <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                  {meetingDate.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </ThemedText>
              </View>
              
              <View style={styles.detailRow}>
                <MapPin size={16} color={colors.text.secondary} />
                <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                  {meeting.place}
                </ThemedText>
              </View>
              
              <View style={styles.detailRow}>
                <DollarSign size={16} color={colors.text.secondary} />
                <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                  {meeting.currency.symbol}{meeting.amount.toFixed(2)} - {meeting.pay_type === 'EQUAL' ? 'Partes iguales' : 'Montos asignados'}
                </ThemedText>
              </View>
            </View>

            <View style={[styles.statusBadge, { 
              backgroundColor: isUpcoming ? colors.primary[500] : colors.text.secondary,
              opacity: isUpcoming ? 1 : 0.7
            }]}>
              <ThemedText variant="inverse" size="xs" weight="bold" style={styles.statusText}>
                {isUpcoming ? 'Próxima' : 'Pasada'}
              </ThemedText>
            </View>
          </View>
        </ThemedCard>

        {/* Participants */}
        <ThemedCard variant="elevated" padding="medium" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={colors.text.secondary} />
            <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.sectionTitle}>
              Participantes
            </ThemedText>
            <View style={[styles.participantsCount, { backgroundColor: colors.primary[500] }]}>
              <ThemedText variant="inverse" size="sm" weight="medium" style={styles.participantsCountText}>
                {meeting.users.length}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.participantsList}>
            {meeting.users.map((user, index) => (
              <View key={user.id} style={styles.participantItem}>
                <View style={[styles.participantAvatar, { backgroundColor: colors.primary[500] }]}>
                  <ThemedText variant="inverse" size="sm" weight="medium" style={styles.participantInitials}>
                    {user.firstName[0]}{user.lastName[0]}
                  </ThemedText>
                </View>
                <View style={styles.participantInfo}>
                  <ThemedText variant="primary" size="base" weight="medium" style={styles.participantName}>
                    {user.firstName} {user.lastName}
                  </ThemedText>
                  <ThemedText variant="secondary" size="sm" style={styles.participantUsername}>
                    @{user.username}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </ThemedCard>

        {/* Expenses Section */}
        <ThemedCard variant="elevated" padding="medium" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Receipt size={20} color={colors.text.secondary} />
            <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.sectionTitle}>
              Gastos
            </ThemedText>
            <View style={[styles.expensesCount, { backgroundColor: colors.primary[500] }]}>
              <ThemedText variant="inverse" size="sm" weight="medium" style={styles.expensesCountText}>
                0
              </ThemedText>
            </View>
            <TouchableOpacity style={[styles.addExpenseButton, { backgroundColor: colors.semantic.success }]}>
              <Plus size={18} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Empty state for expenses */}
          <View style={styles.emptyExpensesContainer}>
            <Receipt size={48} color={colors.text.secondary} />
            <ThemedText variant="secondary" size="base" weight="medium" style={styles.emptyExpensesTitle}>
              No hay gastos registrados
            </ThemedText>
            <ThemedText variant="secondary" size="sm" style={styles.emptyExpensesText}>
              Los gastos de esta juntada aparecerán aquí cuando se agreguen
            </ThemedText>
            <ThemedButton
              title="Agregar primer gasto"
              onPress={() => {}}
              variant="primary"
              size="medium"
              style={styles.addFirstExpenseButton}
            />
          </View>
        </ThemedCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
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
    padding: 20,
  },
  meetingCard: {
    borderRadius: 16,
    marginBottom: 20,
  },
  meetingImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  meetingInfo: {
    gap: 12,
  },
  meetingTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  meetingDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  meetingDetails: {
    gap: 8,
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
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
    flex: 1,
  },
  participantsCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  participantsCountText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  expensesCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  expensesCountText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  addExpenseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantsList: {
    gap: 12,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  participantInitials: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  participantUsername: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  emptyExpensesContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyExpensesTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyExpensesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addFirstExpenseButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
