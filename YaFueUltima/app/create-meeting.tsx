import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Platform,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  FileText,
  DollarSign,
  Users,
  Clock,
  X,
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUserStore } from '../store/userStore';
import { useMeetingStore } from '../store/meetingStore';
import { getGroupsByUserId } from '../services/groups';
import { useAppColors } from '../context/ThemeContext';
import { ThemedButton, ThemedCard, ThemedText } from '../components';
import { gradients } from '../constants/colors';

interface Group {
  id: string;
  name: string;
  description: string;
  image: string;
  users: any[];
}

export default function CreateMeetingScreen() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const user = useUserStore(state => state.user);
  const { colors } = useAppColors();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date(),
    place: '',
    pay_type: 'EQUAL' as 'EQUAL' | 'ASSIGN',
    amount: '',
    currency_id: '1', // Default currency
    expenseDescription: '',
  });
  
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [dateInputs, setDateInputs] = useState({
    day: '',
    month: '',
    year: ''
  });

  const getDaysInMonth = (month: number, year: number) => {
    // Los meses en JavaScript son 0-11
    return new Date(year, month, 0).getDate();
  };

  const validateAndUpdateDate = (
    newDay: string | null = null,
    newMonth: string | null = null,
    newYear: string | null = null
  ) => {
    const day = newDay ?? dateInputs.day;
    const month = newMonth ?? dateInputs.month;
    const year = newYear ?? dateInputs.year;

    let validDay = parseInt(day);
    let validMonth = parseInt(month);
    let validYear = parseInt(year);

    // Validar mes primero
    if (month && !isNaN(validMonth)) {
      validMonth = Math.min(Math.max(1, validMonth), 12);
    }

    // Validar año
    if (year && !isNaN(validYear)) {
      validYear = Math.min(Math.max(2024, validYear), 2100);
    }

    // Validar día según el mes
    if (day && !isNaN(validDay) && month && !isNaN(validMonth) && year && !isNaN(validYear)) {
      const maxDays = getDaysInMonth(validMonth, validYear);
      validDay = Math.min(Math.max(1, validDay), maxDays);
    }

    // Actualizar los inputs con los valores validados
    setDateInputs(prev => ({
      day: day && !isNaN(validDay) ? validDay.toString() : day,
      month: month && !isNaN(validMonth) ? validMonth.toString() : month,
      year: year && !isNaN(validYear) ? validYear.toString() : year
    }));

    // Solo actualizar tempDate si tenemos todos los valores válidos
    if (!isNaN(validDay) && !isNaN(validMonth) && !isNaN(validYear)) {
      const newDate = new Date(tempDate);
      newDate.setFullYear(validYear, validMonth - 1, validDay);
      setTempDate(newDate);
    }
  };
  const [timeInputs, setTimeInputs] = useState({
    hours: '',
    minutes: ''
  });

  useEffect(() => {
    loadUserGroups();
  }, []);

  // Preseleccionar grupo si viene como parámetro
  useEffect(() => {
    if (groupId && groups.length > 0) {
      const preselectedGroup = groups.find(group => group.id === groupId);
      if (preselectedGroup) {
        setSelectedGroup(preselectedGroup);
      }
    }
  }, [groupId, groups]);

  const loadUserGroups = async () => {
    try {
      if (user?.id) {
        const userGroups = await getGroupsByUserId(user.id);
        setGroups(userGroups);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
      Alert.alert('Error', 'No se pudieron cargar los grupos');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const validateForm = () => {
    // Validar campos de texto requeridos
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre de la juntada es obligatorio');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return false;
    }
    if (!formData.place.trim()) {
      Alert.alert('Error', 'El lugar es obligatorio');
      return false;
    }

    // Validar monto
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'El monto debe ser un número mayor a 0');
      return false;
    }

    // Validar descripción del gasto
    if (!formData.expenseDescription.trim()) {
      Alert.alert('Error', 'La descripción del gasto es obligatoria');
      return false;
    }

    // Validar grupo seleccionado
    if (!selectedGroup || !selectedGroup.users || selectedGroup.users.length === 0) {
      Alert.alert('Error', 'Debes seleccionar un grupo con usuarios');
      return false;
    }

    // Validar fecha
    const currentDate = new Date();
    if (formData.date < currentDate) {
      Alert.alert('Error', 'La fecha de la juntada no puede ser en el pasado');
      return false;
    }

    // Validar tipo de pago
    if (!['EQUAL', 'ASSIGN'].includes(formData.pay_type)) {
      Alert.alert('Error', 'El tipo de pago debe ser EQUAL o ASSIGN');
      return false;
    }

    // Validar currency_id
    if (!formData.currency_id) {
      Alert.alert('Error', 'Debe seleccionar una moneda');
      return false;
    }

    return true;
  };

  const createNewMeeting = useMeetingStore(state => state.createNewMeeting);
  const updateMeetingDraft = useMeetingStore(state => state.updateCreateMeetingDraft);
  const clearMeetingDraft = useMeetingStore(state => state.clearMeetingDraft);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Formatear la fecha como string ISO
      const formattedDate = formData.date.toISOString();

      const meetingData = {
        name: formData.name,
        description: formData.description,
        date: formattedDate,
        place: formData.place,
        pay_type: formData.pay_type,
        amount: parseFloat(formData.amount),
        currency_id: formData.currency_id,
        expenseDescription: formData.expenseDescription,
        users: selectedGroup!.users.map(user => ({
          ...user,
          amount: formData.pay_type === 'ASSIGN' ? 0 : undefined
        })),
      };

      // Guardar en el store y crear la juntada
      updateMeetingDraft(meetingData);
      await createNewMeeting(meetingData);
      clearMeetingDraft();
      
      Alert.alert('Éxito', 'Juntada creada correctamente', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error creating meeting:', error);
      Alert.alert('Error', 'No se pudo crear la juntada');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <LinearGradient colors={gradients.hero as any} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <ThemedText variant="inverse" size="xl" weight="bold" style={styles.headerTitle}>
            Nueva Juntada
          </ThemedText>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.sectionTitle}>
            Información Básica
          </ThemedText>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <FileText size={20} color={colors.primary[500]} />
              <ThemedText variant="primary" size="base" weight="medium" style={styles.inputLabel}>
                Nombre de la Juntada
              </ThemedText>
            </View>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
                color: colors.text.primary
              }]}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Ej: Asado en lo de Juan"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <FileText size={20} color={colors.primary[500]} />
              <ThemedText variant="primary" size="base" weight="medium" style={styles.inputLabel}>
                Descripción
              </ThemedText>
            </View>
            <TextInput
              style={[styles.textInput, styles.textArea, { 
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
                color: colors.text.primary
              }]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Describe la juntada..."
              placeholderTextColor={colors.text.secondary}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.section}>
          <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.sectionTitle}>
            Fecha y Hora
          </ThemedText>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <View style={styles.inputHeader}>
                <Calendar size={20} color={colors.primary[500]} />
                <ThemedText variant="primary" size="base" weight="medium" style={styles.inputLabel}>
                  Fecha
                </ThemedText>
              </View>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => {
                  const currentDate = new Date(formData.date);
                  setTempDate(currentDate);
                  setDateInputs({
                    day: currentDate.getDate().toString(),
                    month: (currentDate.getMonth() + 1).toString(),
                    year: currentDate.getFullYear().toString()
                  });
                  setShowDatePicker(true);
                }}
              >
                <ThemedText variant="primary" size="base" style={styles.dateText}>
                  {formatDate(formData.date)}
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <View style={styles.inputHeader}>
                <Clock size={20} color={colors.primary[500]} />
                <ThemedText variant="primary" size="base" weight="medium" style={styles.inputLabel}>
                  Hora
                </ThemedText>
              </View>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => {
                  const currentDate = new Date(formData.date);
                  setTempDate(currentDate);
                  setTimeInputs({
                    hours: currentDate.getHours().toString().padStart(2, '0'),
                    minutes: currentDate.getMinutes().toString().padStart(2, '0')
                  });
                  setShowTimePicker(true);
                }}
              >
                <ThemedText variant="primary" size="base" style={styles.dateText}>
                  {formatTime(formData.date)}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <MapPin size={20} color={colors.primary[500]} />
              <ThemedText variant="primary" size="base" weight="medium" style={styles.inputLabel}>
                Lugar
              </ThemedText>
            </View>
            <TextInput
              style={styles.textInput}
              value={formData.place}
              onChangeText={(value) => handleInputChange('place', value)}
              placeholder="Ej: Casa de Juan"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <ThemedText variant="primary" size="lg" weight="semiBold" style={styles.sectionTitle}>
            Información de Pago
          </ThemedText>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <DollarSign size={20} color={colors.primary[500]} />
              <ThemedText variant="primary" size="base" weight="medium" style={styles.inputLabel}>
                Monto Total
              </ThemedText>
            </View>
            <TextInput
              style={styles.textInput}
              value={formData.amount}
              onChangeText={(value) => handleInputChange('amount', value)}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <FileText size={20} color={colors.primary[500]} />
              <ThemedText variant="primary" size="base" weight="medium" style={styles.inputLabel}>
                Descripción del Gasto
              </ThemedText>
            </View>
            <TextInput
              style={styles.textInput}
              value={formData.expenseDescription}
              onChangeText={(value) => handleInputChange('expenseDescription', value)}
              placeholder="Ej: Comida y bebidas"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText variant="primary" size="base" weight="medium" style={styles.inputLabel}>
              Tipo de División
            </ThemedText>
            <View style={styles.payTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.payTypeButton,
                  formData.pay_type === 'EQUAL' && styles.payTypeButtonActive
                ]}
                onPress={() => handleInputChange('pay_type', 'EQUAL')}
              >
                <ThemedText 
                  variant={formData.pay_type === 'EQUAL' ? "inverse" : "secondary"} 
                  size="base" 
                  weight="medium"
                  style={styles.payTypeText}
                >
                  Partes Iguales
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.payTypeButton,
                  formData.pay_type === 'ASSIGN' && styles.payTypeButtonActive
                ]}
                onPress={() => handleInputChange('pay_type', 'ASSIGN')}
              >
                <ThemedText 
                  variant={formData.pay_type === 'ASSIGN' ? "inverse" : "secondary"} 
                  size="base" 
                  weight="medium"
                  style={styles.payTypeText}
                >
                  Asignar Montos
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Group Selection */}
        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Users size={20} color={colors.primary[500]} />
              <ThemedText variant="primary" size="base" weight="medium" style={styles.inputLabel}>
                Seleccionar Grupo
              </ThemedText>
            </View>
            
            {groups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.groupOption,
                  selectedGroup?.id === group.id && styles.groupOptionSelected
                ]}
                onPress={() => setSelectedGroup(group)}
              >
                <View style={styles.groupInfo}>
                  <ThemedText variant="primary" size="base" weight="medium" style={styles.groupName}>
                    {group.name}
                  </ThemedText>
                  <ThemedText variant="secondary" size="sm" style={styles.groupDescription}>
                    {group.description}
                  </ThemedText>
                  <ThemedText variant="secondary" size="sm" style={styles.groupMembers}>
                    {group.users.length} miembros
                  </ThemedText>
                </View>
                <View style={[
                  styles.radioButton,
                  selectedGroup?.id === group.id && styles.radioButtonSelected
                ]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <LinearGradient
            colors={loading ? [colors.text.secondary, colors.text.secondary] : gradients.primary as any}
            style={styles.submitGradient}
          >
            <ThemedText variant="inverse" size="base" weight="semiBold" style={styles.submitText}>
              {loading ? 'Creando...' : 'Crear Juntada'}
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Fecha</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.datePickerContainer}>
              <Text style={styles.dateLabel}>Fecha seleccionada:</Text>
              <Text style={styles.selectedDateText}>
                {tempDate.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
              
              <View style={styles.dateInputRow}>
                <View style={styles.dateInputGroup}>
                  <Text style={styles.inputLabel}>Día</Text>
                  <TextInput
                    style={styles.dateInput}
                    value={dateInputs.day}
                    onChangeText={(day) => validateAndUpdateDate(day, null, null)}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="DD"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                
                <View style={styles.dateInputGroup}>
                  <Text style={styles.inputLabel}>Mes</Text>
                  <TextInput
                    style={styles.dateInput}
                    value={dateInputs.month}
                    onChangeText={(month) => validateAndUpdateDate(null, month, null)}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="MM"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                
                <View style={styles.dateInputGroup}>
                  <Text style={styles.inputLabel}>Año</Text>
                  <TextInput
                    style={styles.dateInput}
                    value={dateInputs.year}
                    onChangeText={(year) => validateAndUpdateDate(null, null, year)}
                    keyboardType="numeric"
                    maxLength={4}
                    placeholder="AAAA"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              onPress={() => {
                setFormData(prev => ({
                  ...prev,
                  date: new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), 
                                prev.date.getHours(), prev.date.getMinutes())
                }));
                setShowDatePicker(false);
              }}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Hora</Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.timePickerContainer}>
              <Text style={styles.dateLabel}>Hora seleccionada:</Text>
              <Text style={styles.selectedTimeText}>
                {tempDate.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              
              <View style={styles.timeInputRow}>
                <View style={styles.timeInputGroup}>
                  <Text style={styles.inputLabel}>Hora</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={timeInputs.hours}
                    onChangeText={(hour) => {
                      setTimeInputs(prev => ({ ...prev, hours: hour }));
                      if (hour && !isNaN(parseInt(hour))) {
                        const hourNum = parseInt(hour);
                        if (hourNum >= 0 && hourNum <= 23) {
                          const newDate = new Date(tempDate);
                          newDate.setHours(hourNum);
                          setTempDate(newDate);
                        }
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="HH"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                
                <Text style={styles.timeSeparator}>:</Text>
                
                <View style={styles.timeInputGroup}>
                  <Text style={styles.inputLabel}>Minutos</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={timeInputs.minutes}
                    onChangeText={(minute) => {
                      setTimeInputs(prev => ({ ...prev, minutes: minute }));
                      if (minute && !isNaN(parseInt(minute))) {
                        const minuteNum = parseInt(minute);
                        if (minuteNum >= 0 && minuteNum <= 59) {
                          const newDate = new Date(tempDate);
                          newDate.setMinutes(minuteNum);
                          setTempDate(newDate);
                        }
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="MM"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              onPress={() => {
                setFormData(prev => ({
                  ...prev,
                  date: new Date(prev.date.getFullYear(), prev.date.getMonth(), prev.date.getDate(),
                                tempDate.getHours(), tempDate.getMinutes())
                }));
                setShowTimePicker(false);
              }}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  textInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  dateButton: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  payTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  payTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payTypeButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  payTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  payTypeTextActive: {
  },
  groupOption: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupOptionSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F8FAFF',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  groupMembers: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginLeft: 12,
  },
  radioButtonSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#8B5CF6',
  },
  submitButton: {
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  closeButton: {
    padding: 8,
  },
  picker: {
    height: 200,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  timePickerContainer: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  selectedDateText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  selectedTimeText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dateInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dateInputGroup: {
    flex: 1,
    alignItems: 'center',
  },
  dateInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    minWidth: 60,
  },
  timeInputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  timeInputGroup: {
    alignItems: 'center',
  },
  timeInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    minWidth: 80,
  },
  timeSeparator: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
});
