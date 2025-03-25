import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/api';

interface Payment {
  amount: number;
  date: Date;
  note?: string;
}

interface Borrow {
  _id: string;
  user: string;
  borrowerName: string;
  amount: number;
  purpose: string;
  date: Date;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  interestRate: number;
  paymentHistory: Payment[];
  notes?: string;
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

// Async thunks
export const fetchBorrows = createAsyncThunk(
  'borrow/fetchBorrows',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/borrows');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch borrows');
    }
  }
);

export const addBorrow = createAsyncThunk(
  'borrow/addBorrow',
  async (borrowData: Omit<Borrow, '_id' | 'user' | 'paymentHistory'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/borrows', borrowData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add borrow');
    }
  }
);

export const updateBorrow = createAsyncThunk(
  'borrow/updateBorrow',
  async ({ id, borrowData }: { id: string; borrowData: Partial<Borrow> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/borrows/${id}`, borrowData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update borrow');
    }
  }
);

export const deleteBorrow = createAsyncThunk(
  'borrow/deleteBorrow',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/borrows/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete borrow');
    }
  }
);

export const addPayment = createAsyncThunk(
  'borrow/addPayment',
  async ({ id, payment }: { id: string; payment: Omit<Payment, 'date'> }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/borrows/${id}/payments`, payment);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add payment');
    }
  }
);

export const markOverdue = createAsyncThunk(
  'borrow/markOverdue',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/borrows/${id}/mark-overdue`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as overdue');
    }
  }
);

const borrowSlice = createSlice({
  name: 'borrow',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch borrows
      .addCase(fetchBorrows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBorrows.fulfilled, (state, action: PayloadAction<Borrow[]>) => {
        state.loading = false;
        state.borrows = action.payload;
      })
      .addCase(fetchBorrows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add borrow
      .addCase(addBorrow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBorrow.fulfilled, (state, action: PayloadAction<Borrow>) => {
        state.loading = false;
        state.borrows.push(action.payload);
      })
      .addCase(addBorrow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update borrow
      .addCase(updateBorrow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBorrow.fulfilled, (state, action: PayloadAction<Borrow>) => {
        state.loading = false;
        const index = state.borrows.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.borrows[index] = action.payload;
        }
      })
      .addCase(updateBorrow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete borrow
      .addCase(deleteBorrow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBorrow.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.borrows = state.borrows.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBorrow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add payment
      .addCase(addPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPayment.fulfilled, (state, action: PayloadAction<Borrow>) => {
        state.loading = false;
        const index = state.borrows.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.borrows[index] = action.payload;
        }
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Mark overdue
      .addCase(markOverdue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markOverdue.fulfilled, (state, action: PayloadAction<Borrow>) => {
        state.loading = false;
        const index = state.borrows.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.borrows[index] = action.payload;
        }
      })
      .addCase(markOverdue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default borrowSlice.reducer; 