import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Borrow {
  id: string;
  name: string;
  amount: number;
  reason: string;
  date: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}

interface BorrowState {
  borrows: Borrow[];
  loading: boolean;
  error: string | null;
}

const initialState: BorrowState = {
  borrows: [],
  loading: false,
  error: null,
};

const borrowSlice = createSlice({
  name: 'borrow',
  initialState,
  reducers: {
    addBorrow: (state, action: PayloadAction<Borrow>) => {
      state.borrows.push(action.payload);
    },
    updateBorrow: (state, action: PayloadAction<Borrow>) => {
      const index = state.borrows.findIndex(borrow => borrow.id === action.payload.id);
      if (index !== -1) {
        state.borrows[index] = action.payload;
      }
    },
    deleteBorrow: (state, action: PayloadAction<string>) => {
      state.borrows = state.borrows.filter(borrow => borrow.id !== action.payload);
    },
    setBorrowStatus: (state, action: PayloadAction<{ id: string; status: Borrow['status'] }>) => {
      const borrow = state.borrows.find(b => b.id === action.payload.id);
      if (borrow) {
        borrow.status = action.payload.status;
      }
    },
  },
});

export const { addBorrow, updateBorrow, deleteBorrow, setBorrowStatus } = borrowSlice.actions;
export default borrowSlice.reducer; 