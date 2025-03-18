import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
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
  Budget: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Transactions: undefined;
  AddTransaction: undefined;
  Profile: undefined;
  Budget: undefined;
};

export type AddTransactionScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackParamList, 'AddTransaction' | 'EditTransaction'>,
  BottomTabNavigationProp<MainTabsParamList>
>;

export type TransactionDetailScreenNavigationProp = StackNavigationProp<MainStackParamList, 'TransactionDetail'>; 