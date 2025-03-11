import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/api';

// Types
export enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description?: string;
  userId: string;
}

interface TransactionState {
  transactions: Transaction[];
  transaction: Transaction | null;
  isLoading: boolean;
  error: string | null;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const initialState: TransactionState = {
  transactions: [],
  transaction: null,
  isLoading: false,
  error: null,
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
};

// Calculate totals
const calculateTotals = (transactions: Transaction[]) => {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === TransactionType.INCOME) {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }
  });

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};

// Async thunks
export const getTransactions = createAsyncThunk(
  'transaction/getTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/transactions');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const getTransaction = createAsyncThunk(
  'transaction/getTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/transactions/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transaction');
    }
  }
);

export const addTransaction = createAsyncThunk(
  'transaction/addTransaction',
  async (transactionData: Omit<Transaction, '_id' | 'userId'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/transactions', transactionData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add transaction');
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transaction/updateTransaction',
  async ({ id, transactionData }: { id: string; transactionData: Partial<Transaction> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/transactions/${id}`, transactionData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update transaction');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transaction/deleteTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/transactions/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete transaction');
    }
  }
);

// Slice
const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTransaction: (state) => {
      state.transaction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Transactions
      .addCase(getTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.isLoading = false;
        state.transactions = action.payload;
        const { totalIncome, totalExpense, balance } = calculateTotals(action.payload);
        state.totalIncome = totalIncome;
        state.totalExpense = totalExpense;
        state.balance = balance;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get Transaction
      .addCase(getTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.isLoading = false;
        state.transaction = action.payload;
      })
      .addCase(getTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Add Transaction
      .addCase(addTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.isLoading = false;
        state.transactions = [action.payload, ...state.transactions];
        const { totalIncome, totalExpense, balance } = calculateTotals(state.transactions);
        state.totalIncome = totalIncome;
        state.totalExpense = totalExpense;
        state.balance = balance;
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update Transaction
      .addCase(updateTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.isLoading = false;
        state.transactions = state.transactions.map((transaction) =>
          transaction._id === action.payload._id ? action.payload : transaction
        );
        const { totalIncome, totalExpense, balance } = calculateTotals(state.transactions);
        state.totalIncome = totalIncome;
        state.totalExpense = totalExpense;
        state.balance = balance;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete Transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.transactions = state.transactions.filter(
          (transaction) => transaction._id !== action.payload
        );
        const { totalIncome, totalExpense, balance } = calculateTotals(state.transactions);
        state.totalIncome = totalIncome;
        state.totalExpense = totalExpense;
        state.balance = balance;
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearTransaction } = transactionSlice.actions;
export default transactionSlice.reducer; 