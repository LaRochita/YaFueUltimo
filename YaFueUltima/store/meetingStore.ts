import { create } from 'zustand';
import { createMeeting, getMeetingsByUserId } from '../services/meetings';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  balance: number;
}

interface Currency {
  id: string;
  name: string;
  symbol: string;
}

interface Meeting {
  id: string;
  name: string;
  description: string;
  date: string;
  place: string;
  pay_type: 'EQUAL' | 'ASSIGN';
  amount: number;
  currency: Currency;
  expenseDescription: string;
  users: User[];
  createdAt: string;
  updatedAt: string;
}

interface CreateMeetingData {
  name: string;
  description: string;
  date: string;
  place: string;
  pay_type: 'EQUAL' | 'ASSIGN';
  amount: number;
  currency_id: string;
  users: User[];
  expenseDescription: string;
}

interface MeetingStore {
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
  selectedMeeting: Meeting | null;
  createMeetingDraft: CreateMeetingData | null;
  
  // Acciones
  setMeetings: (meetings: Meeting[]) => void;
  addMeeting: (meeting: Meeting) => void;
  setSelectedMeeting: (meeting: Meeting | null) => void;
  setCreateMeetingDraft: (draft: CreateMeetingData | null) => void;
  updateCreateMeetingDraft: (updates: Partial<CreateMeetingData>) => void;
  
  // Acciones asíncronas
  fetchUserMeetings: (userId: string) => Promise<void>;
  createNewMeeting: (meetingData: CreateMeetingData) => Promise<void>;
  clearMeetingDraft: () => void;
  
  // Selectores
  getAllMeetings: () => Meeting[];
  getUpcomingMeetings: () => Meeting[];
  getPastMeetings: () => Meeting[];
}

const initialMeetingDraft: CreateMeetingData = {
  name: '',
  description: '',
  date: new Date().toISOString(),
  place: '',
  pay_type: 'EQUAL',
  amount: 0,
  currency_id: '1',
  users: [],
  expenseDescription: '',
};

export const useMeetingStore = create<MeetingStore>((set, get) => ({
  meetings: [],
  loading: false,
  error: null,
  selectedMeeting: null,
  createMeetingDraft: null,

  setMeetings: (meetings) => set({ meetings }),
  
  addMeeting: (meeting) => 
    set((state) => ({ meetings: [...state.meetings, meeting] })),
  
  setSelectedMeeting: (meeting) => 
    set({ selectedMeeting: meeting }),
  
  setCreateMeetingDraft: (draft) => 
    set({ createMeetingDraft: draft }),
  
  updateCreateMeetingDraft: (updates) => 
    set((state) => ({
      createMeetingDraft: state.createMeetingDraft 
        ? { ...state.createMeetingDraft, ...updates }
        : { ...initialMeetingDraft, ...updates }
    })),

  clearMeetingDraft: () => 
    set({ createMeetingDraft: null }),

  fetchUserMeetings: async (userId) => {
    // Por ahora, solo mantenemos las meetings del store local
    console.log('Fetching meetings for user:', userId);
    console.log('Current meetings in store:', get().meetings);
  },

  createNewMeeting: async (meetingData) => {
    set({ loading: true, error: null });
    try {
      console.log('Creating meeting with data:', meetingData);
      
      // Crear meeting local sin backend
      const newMeeting: Meeting = {
        id: Date.now().toString(),
        name: meetingData.name,
        description: meetingData.description,
        date: meetingData.date,
        place: meetingData.place,
        pay_type: meetingData.pay_type,
        amount: meetingData.amount,
        currency: { id: meetingData.currency_id, name: 'Peso', symbol: '$' },
        expenseDescription: meetingData.expenseDescription,
        users: meetingData.users,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Created meeting:', newMeeting);
      set((state) => {
        console.log('Current meetings before:', state.meetings);
        const updatedMeetings = [...state.meetings, newMeeting];
        console.log('Current meetings after:', updatedMeetings);
        return {
          meetings: updatedMeetings,
          loading: false,
          createMeetingDraft: null
        };
      });
    } catch (error) {
      console.error('Error creating meeting:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error creating meeting',
        loading: false 
      });
    }
  },

  // Selectores
  getAllMeetings: () => {
    const state = get();
    console.log('All meetings:', state.meetings);
    return state.meetings;
  },

  getUpcomingMeetings: () => {
    const state = get();
    const now = new Date();
    return state.meetings
      .filter(meeting => new Date(meeting.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  getPastMeetings: () => {
    const state = get();
    const now = new Date();
    return state.meetings
      .filter(meeting => new Date(meeting.date) <= now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
}));
