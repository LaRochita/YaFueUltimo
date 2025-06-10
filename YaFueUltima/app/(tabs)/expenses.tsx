import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DollarSign, Plus, Users, Calendar, ArrowUpRight, ArrowDownLeft, Receipt, CircleCheck as CheckCircle, X } from 'lucide-react-native';

export default function ExpensesScreen() {
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [balances] = useState([
    {
      id: 1,
      name: 'María García',
      nickname: 'Mari',
      avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100',
      balance: 350,
      isPositive: true,
    },
    {
      id: 2,
      name: 'Juan Pérez',
      nickname: 'Juancito',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100',
      balance: -150,
      isPositive: false,
    },
    {
      id: 3,
      name: 'Carlos Ruiz',
      nickname: 'Carlitos',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      balance: 80,
      isPositive: true,
    },
    {
      id: 4,
      name: 'Ana López',
      nickname: 'Anita',
      avatar: 'https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&w=100',
      balance: -280,
      isPositive: false,
    },
  ]);

  const [recentExpenses] = useState([
    {
      id: 1,
      description: 'Pizza para todos',
      amount: 2400,
      paidBy: 'María García',
      splitBetween: ['María', 'Juan', 'Carlos', 'Ana'],
      date: '2024-01-24',
      event: 'Pizza & Películas',
      settled: false,
    },
    {
      id: 2,
      description: 'Bebidas y hielo',
      amount: 800,
      paidBy: 'Carlos Ruiz',
      splitBetween: ['María', 'Carlos', 'Ana'],
      date: '2024-01-20',
      event: 'Cumpleaños de Ana',
      settled: true,
    },
    {
      id: 3,
      description: 'Asado completo',
      amount: 3200,
      paidBy: 'Juan Pérez',
      splitBetween: ['Juan', 'María', 'Carlos', 'Ana', 'Pedro'],
      date: '2024-01-18',
      event: 'Asado de fin de año',
      settled: false,
    },
  ]);

  const [events] = useState([
    'Pizza & Películas',
    'Cumpleaños de Ana',
    'Asado de fin de año',
    'Juntada casual',
  ]);

  const [settlements] = useState([
    {
      id: 1,
      from: 'Juan',
      to: 'María',
      amount: 150,
      description: 'Pizza & Películas',
      suggested: true,
    },
    {
      id: 2,
      from: 'Ana',
      to: 'Carlos',
      amount: 280,
      description: 'Varios gastos',
      suggested: true,
    },
  ]);

  const handleAddExpense = () => {
    console.log('Adding expense:', { selectedEvent, amount, description });
    setShowAddExpenseModal(false);
    setSelectedEvent('');
    setAmount('');
    setDescription('');
  };

  const totalBalance = balances.reduce((sum, user) => sum + user.balance, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gastos</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddExpenseModal(true)}
        >
          <Plus size={24} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Summary */}
        <View style={styles.summaryCard}>
          <LinearGradient colors={['#10B981', '#059669']} style={styles.summaryGradient}>
            <View style={styles.summaryContent}>
              <View style={styles.summaryHeader}>
                <DollarSign size={24} color="white" />
                <Text style={styles.summaryTitle}>Balance del Grupo</Text>
              </View>
              <Text style={styles.totalAmount}>${Math.abs(totalBalance).toLocaleString()}</Text>
              <Text style={styles.summarySubtitle}>
                {totalBalance >= 0 ? 'Todo equilibrado' : 'Hay deudas pendientes'}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Suggested Settlements */}
        {settlements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Liquidaciones Sugeridas</Text>
            
            {settlements.map((settlement) => (
              <View key={settlement.id} style={styles.settlementCard}>
                <View style={styles.settlementInfo}>
                  <View style={styles.settlementUsers}>
                    <Text style={styles.settlementFrom}>{settlement.from}</Text>
                    <ArrowUpRight size={16} color="#8B5CF6" />
                    <Text style={styles.settlementTo}>{settlement.to}</Text>
                  </View>
                  <Text style={styles.settlementDescription}>{settlement.description}</Text>
                </View>
                
                <View style={styles.settlementRight}>
                  <Text style={styles.settlementAmount}>${settlement.amount}</Text>
                  <TouchableOpacity style={styles.settleButton}>
                    <CheckCircle size={16} color="#10B981" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Individual Balances */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Balances Individuales</Text>
          
          {balances.map((user) => (
            <View key={user.id} style={styles.balanceCard}>
              <View style={styles.balanceLeft}>
                <Image source={{ uri: user.avatar }} style={styles.balanceAvatar} />
                <View style={styles.balanceUserInfo}>
                  <Text style={styles.balanceUserName}>{user.name}</Text>
                  <Text style={styles.balanceUserNickname}>@{user.nickname}</Text>
                </View>
              </View>
              
              <View style={styles.balanceRight}>
                <View style={[
                  styles.balanceAmount,
                  user.isPositive ? styles.positiveBalance : styles.negativeBalance
                ]}>
                  {user.isPositive ? (
                    <ArrowDownLeft size={16} color="#10B981" />
                  ) : (
                    <ArrowUpRight size={16} color="#EF4444" />
                  )}
                  <Text style={[
                    styles.balanceAmountText,
                    user.isPositive ? styles.positiveBalanceText : styles.negativeBalanceText
                  ]}>
                    ${Math.abs(user.balance)}
                  </Text>
                </View>
                <Text style={styles.balanceStatus}>
                  {user.isPositive ? 'Le deben' : 'Debe'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Expenses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gastos Recientes</Text>
          
          {recentExpenses.map((expense) => (
            <View key={expense.id} style={styles.expenseCard}>
              <View style={styles.expenseHeader}>
                <View style={styles.expenseLeft}>
                  <View style={styles.expenseIcon}>
                    <Receipt size={20} color="#8B5CF6" />
                  </View>
                  <View style={styles.expenseInfo}>
                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                    <Text style={styles.expenseEvent}>{expense.event}</Text>
                    <Text style={styles.expenseDate}>{expense.date}</Text>
                  </View>
                </View>
                
                <View style={styles.expenseRight}>
                  <Text style={styles.expenseAmount}>${expense.amount.toLocaleString()}</Text>
                  <View style={[
                    styles.expenseStatus,
                    expense.settled ? styles.settledStatus : styles.pendingStatus
                  ]}>
                    <Text style={[
                      styles.expenseStatusText,
                      expense.settled ? styles.settledStatusText : styles.pendingStatusText
                    ]}>
                      {expense.settled ? 'Liquidado' : 'Pendiente'}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.expenseDetails}>
                <Text style={styles.paidByText}>Pagado por: <Text style={styles.paidByName}>{expense.paidBy}</Text></Text>
                
                <View style={styles.splitBetween}>
                  <Users size={14} color="#6B7280" />
                  <Text style={styles.splitText}>
                    Dividido entre: {expense.splitBetween.join(', ')}
                  </Text>
                </View>
                
                <Text style={styles.perPersonAmount}>
                  ${Math.round(expense.amount / expense.splitBetween.length)} por persona
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Expense Modal */}
      <Modal
        visible={showAddExpenseModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddExpenseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar Gasto</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddExpenseModal(false)}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Descripción</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="¿Qué compraste?"
                  value={description}
                  onChangeText={setDescription}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Monto</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="$0"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Evento</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.eventButtons}>
                    {events.map((event) => (
                      <TouchableOpacity
                        key={event}
                        style={[
                          styles.eventButton,
                          selectedEvent === event && styles.selectedEventButton
                        ]}
                        onPress={() => setSelectedEvent(event)}
                      >
                        <Text style={[
                          styles.eventButtonText,
                          selectedEvent === event && styles.selectedEventButtonText
                        ]}>
                          {event}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={() => setShowAddExpenseModal(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmModalButton}
                onPress={handleAddExpense}
              >
                <Text style={styles.confirmModalButtonText}>Agregar Gasto</Text>
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
  summaryCard: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  summaryGradient: {
    padding: 24,
  },
  summaryContent: {
    alignItems: 'center',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginLeft: 8,
  },
  totalAmount: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 8,
  },
  summarySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  settlementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settlementInfo: {
    flex: 1,
  },
  settlementUsers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  settlementFrom: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginRight: 8,
  },
  settlementTo: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  settlementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  settlementRight: {
    alignItems: 'flex-end',
  },
  settlementAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  settleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
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
  balanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  balanceAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  balanceUserInfo: {
    flex: 1,
  },
  balanceUserName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  balanceUserNickname: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  balanceRight: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  positiveBalance: {
    backgroundColor: '#D1FAE5',
  },
  negativeBalance: {
    backgroundColor: '#FEE2E2',
  },
  balanceAmountText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
  },
  positiveBalanceText: {
    color: '#10B981',
  },
  negativeBalanceText: {
    color: '#EF4444',
  },
  balanceStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  expenseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  expenseLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  expenseEvent: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    marginTop: 2,
  },
  expenseDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  expenseStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  settledStatus: {
    backgroundColor: '#D1FAE5',
  },
  pendingStatus: {
    backgroundColor: '#FEF3C7',
  },
  expenseStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  settledStatusText: {
    color: '#10B981',
  },
  pendingStatusText: {
    color: '#F59E0B',
  },
  expenseDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  paidByText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 6,
  },
  paidByName: {
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  splitBetween: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  splitText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  perPersonAmount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalForm: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eventButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  eventButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectedEventButton: {
    backgroundColor: '#8B5CF6',
  },
  eventButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  selectedEventButtonText: {
    color: 'white',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelModalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelModalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  confirmModalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
  },
  confirmModalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
});