import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList, TransactionDetailScreenNavigationProp } from '../navigation/types';
import {
  getTransaction,
  deleteTransaction,
  clearTransaction,
  TransactionType,
} from '../redux/slices/transactionSlice';
import { RootState, AppDispatch } from '../redux/store';

type TransactionDetailScreenRouteProp = RouteProp<
  MainStackParamList,
  'TransactionDetail'
>;

interface TransactionDetailScreenProps {
  navigation: TransactionDetailScreenNavigationProp;
  route: TransactionDetailScreenRouteProp;
}

const TransactionDetailScreen: React.FC<TransactionDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { id } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { transaction, isLoading } = useSelector(
    (state: RootState) => state.transaction as any
  );

  useEffect(() => {
    dispatch(getTransaction(id));

    return () => {
      dispatch(clearTransaction());
    };
  }, [dispatch, id]);

  const formatCurrency = (amount: number) => {
    return ` ₹ ${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  const handleEdit = () => {
    navigation.navigate('EditTransaction', { id });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteTransaction(id)).unwrap();
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete transaction');
            }
          },
        },
      ]
    );
  };

  if (isLoading || !transaction) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View
          style={[
            styles.typeIndicator,
            transaction.type === TransactionType.INCOME
              ? styles.incomeIndicator
              : styles.expenseIndicator,
          ]}
        >
          <Ionicons
            name={
              transaction.type === TransactionType.INCOME
                ? 'arrow-down-outline'
                : 'arrow-up-outline'
            }
            size={24}
            color="#fff"
          />
          <Text style={styles.typeText}>
            {transaction.type === TransactionType.INCOME ? 'Income' : 'Expense'}
          </Text>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amount,
            transaction.type === TransactionType.INCOME
              ? styles.incomeText
              : styles.expenseText,
          ]}
        >
          {transaction.type === TransactionType.INCOME ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </Text>
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Title</Text>
          <Text style={styles.detailValue}>{transaction.title}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Category</Text>
          <View style={styles.categoryContainer}>
            <View style={styles.categoryIconContainer}>
              <Ionicons
                name={getCategoryIcon(transaction.category)}
                size={20}
                color="#6200ee"
              />
            </View>
            <Text style={styles.detailValue}>{transaction.category}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{formatDate(transaction.date)}</Text>
        </View>

        {transaction.description && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{transaction.description}</Text>
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    alignItems: 'center',
    paddingVertical: 20,
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  incomeIndicator: {
    backgroundColor: '#4CAF50',
  },
  expenseIndicator: {
    backgroundColor: '#F44336',
  },
  typeText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 20,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#6200ee',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default TransactionDetailScreen; 