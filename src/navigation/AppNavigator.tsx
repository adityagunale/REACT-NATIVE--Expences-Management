import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { useTheme } from '@react-navigation/native';

// Auth Screens
import FlashScreen from '../screens/FlashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import BorrowScreen from '../screens/BorrowScreen';
import EMIScreen from '../screens/EMIScreen';
import EMIDetailsScreen from '../screens/EMIDetailsScreen';

// Calculator Screens
import DiscountCalculator from '../screens/calculators/DiscountCalculator';
import LoanCalculator from '../screens/calculators/LoanCalculator';
import MonthlyExpenses from '../screens/calculators/MonthlyExpenses';
import EmailReport from '../screens/calculators/EmailReport';

// Navigation Types
import { 
  AuthStackParamList, 
  MainStackParamList, 
  MainTabsParamList,
  AddTransactionScreenNavigationProp,
  TransactionDetailScreenNavigationProp
} from './types';

// Create navigators
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabsParamList>();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="FlashScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <AuthStack.Screen 
        name="FlashScreen" 
        component={FlashScreen} 
        options={{ headerShown: false }}
      />
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }}
      />
      <AuthStack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ headerShown: false }}
      />
      <AuthStack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};

// Main Tabs Navigator
const MainTabsNavigator = () => {
  return (
    <MainTabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Transactions':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'AddTransaction':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipsis-horizontal';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
      })}
    >
      <MainTabs.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <MainTabs.Screen 
        name="Transactions" 
        component={TransactionsScreen} 
        options={{ headerShown: false }}
      />
      <MainTabs.Screen 
        name="AddTransaction" 
        component={AddTransactionScreen} 
        options={{ headerShown: false }}
      />
      <MainTabs.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ headerShown: false }}
      />
      {/* <MainTabs.Screen 
        name="EMI" 
        component={EMIScreen}
        options={{ headerShown: false }}
      /> */}
    </MainTabs.Navigator>
  );
};

// Main Navigator
const MainNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <MainStack.Screen 
        name="MainTabs" 
        component={MainTabsNavigator} 
        options={{ headerShown: false }}
      />
      <MainStack.Screen 
        name="TransactionDetail" 
        component={TransactionDetailScreen} 
        options={{ title: 'Transaction Details' }}
      />
      <MainStack.Screen 
        name="AddTransaction" 
        component={AddTransactionScreen} 
        options={{ title: 'Add Transaction' }}
      />
      <MainStack.Screen 
        name="EditTransaction" 
        component={AddTransactionScreen} 
        options={{ title: 'Edit Transaction' }}
      />
      <MainStack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ title: 'Edit Profile' }}
      />
      <MainStack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen} 
        options={{ title: 'Change Password' }}
      />
      <MainStack.Screen 
        name="DiscountCalculator" 
        component={DiscountCalculator} 
        options={{ title: 'Discount Calculator' }}
      />
      <MainStack.Screen 
        name="LoanCalculator" 
        component={LoanCalculator} 
        options={{ title: 'Loan & EMI Calculator' }}
      />
      <MainStack.Screen 
        name="MonthlyExpenses" 
        component={MonthlyExpenses} 
        options={{ title: 'Monthly Expenses' }}
      />
      <MainStack.Screen 
        name="EmailReport" 
        component={EmailReport} 
        options={{ title: 'Email Report' }}
      />
      <MainStack.Screen 
        name="Borrow" 
        component={BorrowScreen}
        options={{ title: 'Borrow Money' }}
      />
      <MainStack.Screen 
        name="EMI" 
        component={EMIScreen}
        options={{ title: 'EMI Management' }}
      />
      <MainStack.Screen 
        name="EMIDetails" 
        component={EMIDetailsScreen}
        options={{
          title: 'EMI Details',
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
        }}
      />
    </MainStack.Navigator>
  );
};

// App Navigator
const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator; 