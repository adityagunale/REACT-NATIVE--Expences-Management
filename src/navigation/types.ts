import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NavigatorScreenParams } from '@react-navigation/native';
import { EMI } from '../redux/slices/emiSlice';

export type AuthStackParamList = {
  FlashScreen: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  TransactionDetail: { id: string };
  AddTransaction: undefined;
  EditTransaction: { id: string };
  EditProfile: undefined;
  ChangePassword: undefined;
  DiscountCalculator: undefined;
  LoanCalculator: undefined;
  MonthlyExpenses: undefined;
  EmailReport: undefined;
  Borrow: undefined;
  EMI: undefined;
  EMIDetails: { emi: EMI };
};

export type MainTabsParamList = {
  Home: undefined;
  Transactions: undefined;
  AddTransaction: undefined;
  Profile: undefined;
  EMI: undefined;
};

export type AddTransactionScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackParamList, 'AddTransaction' | 'EditTransaction'>,
  BottomTabNavigationProp<MainTabsParamList>
>;

export type TransactionDetailScreenNavigationProp = StackNavigationProp<MainStackParamList, 'TransactionDetail'>; 