import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Budget {
  id: string;
  category: string;
  amount: number;
  description: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: string;
  spent: number;
}

interface BudgetState {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  loading: false,
  error: null,
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    addBudget: (state, action: PayloadAction<Budget>) => {
      state.budgets.push(action.payload);
    },
    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = state.budgets.findIndex(budget => budget.id === action.payload.id);
      if (index !== -1) {
        state.budgets[index] = action.payload;
      }
    },
    deleteBudget: (state, action: PayloadAction<string>) => {
      state.budgets = state.budgets.filter(budget => budget.id !== action.payload);
    },
    updateSpent: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const budget = state.budgets.find(b => b.id === action.payload.id);
      if (budget) {
        budget.spent += action.payload.amount;
      }
    },
  },
});

export const { addBudget, updateBudget, deleteBudget, updateSpent } = budgetSlice.actions;
export default budgetSlice.reducer; 