import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList, MainTabsParamList } from '../navigation/types';
import { getTransactions } from '../redux/slices/transactionSlice';
import { RootState, AppDispatch } from '../redux/store';
import { Transaction, TransactionType } from '../redux/slices/transactionSlice';
import { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { formatCurrency } from '../utils/formatters';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabsParamList, 'Home'>,
  StackNavigationProp<MainStackParamList>
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { 
    transactions, 
    isLoading, 
    totalIncome, 
    totalExpense, 
    balance 
  } = useSelector((state: RootState) => state.transaction as any);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      await dispatch(getTransactions());
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRecentTransactions = () => {
    return transactions.slice(0, 5);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food':
        return 'fast-food-outline';
      case 'shopping':
        return 'cart-outline';
      case 'transportation':
        return 'car-outline';
      case 'entertainment':
        return 'film-outline';
      case 'utilities':
        return 'flash-outline';
      case 'housing':
        return 'home-outline';
      case 'income':
        return 'cash-outline';
      case 'salary':
        return 'wallet-outline';
      default:
        return 'ellipsis-horizontal-outline';
    }
  };

  if (isLoading && transactions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <>
    
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Welcome, <Text style={styles.username}>{user?.name || 'User'} !</Text></Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle-outline" size={41} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >

      <View style={styles.toolsSection}>
        <Text style={styles.sectionTitle}>Financial Tools</Text>
        <View style={styles.toolsGrid}>

        <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('Borrow')}
          >
            <View style={styles.toolIcon}>
              <Ionicons name="wallet-outline" size={24} color="#6200ee" />
            </View>
            <Text style={styles.toolTitle}>Borrow Money</Text>
            <Text style={styles.toolDescription}>Track borrowed money and dues</Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('DiscountCalculator')}
          >
            <View style={styles.toolIcon}>
              <Ionicons name="calculator-outline" size={24} color="#6200ee" />
            </View>
            <Text style={styles.toolTitle}>Discount Calculator</Text>
            <Text style={styles.toolDescription}>Calculate discounts and savings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('LoanCalculator')}
          >
            <View style={styles.toolIcon}>
              <Ionicons name="cash-outline" size={24} color="#6200ee" />
            </View>
            <Text style={styles.toolTitle}>Loan & EMI Calculator</Text>
            <Text style={styles.toolDescription}>Calculate loan payments and EMIs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('EMI')}
          >
            <View style={styles.toolIcon}>
              <Ionicons name="calendar-outline" size={24} color="#6200ee" />
            </View>
            <Text style={styles.toolTitle}>EMI Management</Text>
            <Text style={styles.toolDescription}>Track and manage your EMIs</Text>
          </TouchableOpacity>

         

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('MonthlyExpenses')}
          >
            <View style={styles.toolIcon}>
              <Ionicons name="bar-chart-outline" size={24} color="#6200ee" />
            </View>
            <Text style={styles.toolTitle}>Monthly Expenses</Text>
            <Text style={styles.toolDescription}>Track and analyze monthly spending</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('EmailReport')}
          >
            <View style={styles.toolIcon}>
              <Ionicons name="mail-outline" size={24} color="#6200ee" />
            </View>
            <Text style={styles.toolTitle}>Email Report</Text>
            <Text style={styles.toolDescription}>Get detailed expense reports</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
        <View style={styles.balanceDetails}>
          <View style={styles.balanceItem}>
            <Ionicons name="arrow-down-outline" size={20} color="#4CAF50" />
            <Text style={styles.balanceItemLabel}>Income</Text>
            <Text style={[styles.balanceItemAmount, styles.incomeText]}>
              {formatCurrency(totalIncome)}
            </Text>
          </View>
          <View style={styles.balanceItem}>
            <Ionicons name="arrow-up-outline" size={20} color="#F44336" />
            <Text style={styles.balanceItemLabel}>Expenses</Text>
            <Text style={[styles.balanceItemAmount, styles.expenseText]}>
              {formatCurrency(totalExpense)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MainTabs')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {getRecentTransactions().length > 0 ? (
          getRecentTransactions().map((transaction: Transaction) => (
            <TouchableOpacity
              key={transaction._id}
              style={styles.transactionItem}
              onPress={() => navigation.navigate('TransactionDetail', { id: transaction._id })}
            >
              <View style={styles.transactionIconContainer}>
                <Ionicons
                  name={getCategoryIcon(transaction.category)}
                  size={24}
                  color="#6200ee"
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionCategory}>{transaction.category}</Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.type === TransactionType.INCOME
                      ? styles.incomeText
                      : styles.expenseText,
                  ]}
                >
                  {transaction.type === TransactionType.INCOME ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </Text>
                <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions yet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddTransaction')}
            >
              <Text style={styles.addButtonText}>Add Transaction</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddTransaction')}
        >
          <Ionicons name="add-circle" size={65} color="#6200ee" />
          <Text style={styles.actionText}>Add Transaction</Text>
        </TouchableOpacity>
        
      </View>

     
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#6200ee',
    paddingTop: 60,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom:10
   
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  username: {
    fontSize: 17,
    color: '#4CAF50',
     fontWeight: 'bold',
  },
  profileButton: {
    padding: 5,
  },
  balanceCard: {
    backgroundColor: '#6200ee',
    borderRadius: 15,
    padding: 20,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 15,
  },
  balanceItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  balanceItemLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  balanceItemAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    margin: 15,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#6200ee',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  transactionDetails: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  actionButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
  },
  toolsSection: {
    padding: 20,
    marginTop: 10,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  toolCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toolIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  toolDescription: {
    fontSize: 12,
    color: '#666',
  },
});

export default HomeScreen; 