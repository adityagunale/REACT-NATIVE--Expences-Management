import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EMI {
  id: string;
  name: string;
  totalAmount: number;
  emiAmount: number;
  totalInstallments: number;
  paidInstallments: number;
  startDate: string;
  nextPaymentDate: string;
  status: 'active' | 'completed' | 'overdue';
  loanType: string;
  interestRate: number;
}

interface EMIState {
  emis: EMI[];
  loading: boolean;
  error: string | null;
}

const initialState: EMIState = {
  emis: [],
  loading: false,
  error: null,
};

const emiSlice = createSlice({
  name: 'emi',
  initialState,
  reducers: {
    addEMI: (state, action: PayloadAction<EMI>) => {
      state.emis.push(action.payload);
    },
    updateEMI: (state, action: PayloadAction<EMI>) => {
      const index = state.emis.findIndex(emi => emi.id === action.payload.id);
      if (index !== -1) {
        state.emis[index] = action.payload;
      }
    },
    deleteEMI: (state, action: PayloadAction<string>) => {
      state.emis = state.emis.filter(emi => emi.id !== action.payload);
    },
    markEMIPaid: (state, action: PayloadAction<{ id: string }>) => {
      const emi = state.emis.find(e => e.id === action.payload.id);
      if (emi) {
        emi.paidInstallments += 1;
        if (emi.paidInstallments >= emi.totalInstallments) {
          emi.status = 'completed';
        }
        // Update next payment date
        const nextDate = new Date(emi.nextPaymentDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        emi.nextPaymentDate = nextDate.toISOString();
      }
    },
  },
});

export const { addEMI, updateEMI, deleteEMI, markEMIPaid } = emiSlice.actions;
export default emiSlice.reducer; 