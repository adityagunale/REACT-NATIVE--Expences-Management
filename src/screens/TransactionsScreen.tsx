import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../navigation/AppNavigator';
import { getTransactions, TransactionType } from '../redux/slices/transactionSlice';
import { RootState, AppDispatch } from '../redux/store';

type TransactionsScreenNavigationProp = StackNavigationProp<MainStackParamList>;

interface TransactionsScreenProps {
  navigation: TransactionsScreenNavigationProp;
}

const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, isLoading } = useSelector((state: RootState) => state.transaction as any);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    dispatch(getTransactions());
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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

  const filteredTransactions = transactions.filter((transaction: any) => {
    if (filter === 'all') return true;
    if (filter === 'income') return transaction.type === TransactionType.INCOME;
    if (filter === 'expense') return transaction.type === TransactionType.EXPENSE;
    return true;
  });

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => navigation.navigate('TransactionDetail', { id: item._id })}
    >
      <View style={styles.transactionIconContainer}>
        <Ionicons name={getCategoryIcon(item.category)} size={24} color="#6200ee" />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionCategory}>{item.category}</Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text
          style={[
            styles.transactionAmount,
            item.type === TransactionType.INCOME
              ? styles.incomeText
              : styles.expenseText,
          ]}
        >
          {item.type === TransactionType.INCOME ? '+' : '-'}
          {formatCurrency(item.amount)}
        </Text>
        <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilterButton]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'all' && styles.activeFilterButtonText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'income' && styles.activeIncomeButton,
          ]}
          onPress={() => setFilter('income')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'income' && styles.activeFilterButtonText,
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'expense' && styles.activeExpenseButton,
          ]}
          onPress={() => setFilter('expense')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'expense' && styles.activeFilterButtonText,
            ]}
          >
            Expense
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && transactions.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={loadTransactions} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No transactions found</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddTransaction')}
              >
                <Text style={styles.addButtonText}>Add Transaction</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
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
  listContainer: {
    padding: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
  },
  activeFilterButton: {
    backgroundColor: '#6200ee',
  },
  activeIncomeButton: {
    backgroundColor: '#4CAF50',
  },
  activeExpenseButton: {
    backgroundColor: '#F44336',
  },
  filterButtonText: {
    fontWeight: '500',
    color: '#666',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
  },
  transactionDetails: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default TransactionsScreen; 