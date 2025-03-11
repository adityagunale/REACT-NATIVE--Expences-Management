import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MainStackParamList, MainTabsParamList } from '../navigation/AppNavigator';
import { 
  addTransaction, 
  updateTransaction, 
  getTransaction, 
  clearTransaction,
  clearError,
  TransactionType
} from '../redux/slices/transactionSlice';
import { RootState, AppDispatch } from '../redux/store';

type AddTransactionScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackParamList, 'AddTransaction' | 'EditTransaction'>,
  BottomTabNavigationProp<MainTabsParamList>
>;

type AddTransactionScreenRouteProp = RouteProp<MainStackParamList, 'AddTransaction' | 'EditTransaction'> | RouteProp<MainTabsParamList, 'AddTransaction'>;

interface AddTransactionScreenProps {
  navigation: AddTransactionScreenNavigationProp;
  route: AddTransactionScreenRouteProp;
}

const CATEGORIES = [
  'Food',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Housing',
  'Income',
  'Salary',
  'Other',
];

const AddTransactionScreen: React.FC<AddTransactionScreenProps> = ({
  navigation,
  route,
}) => {
  const isEditing = route.name === 'EditTransaction';
  const transactionId = isEditing && route.params && 'id' in route.params ? route.params.id : null;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { transaction, isLoading, error } = useSelector(
    (state: RootState) => state.transaction as any
  );

  useEffect(() => {
    if (isEditing && transactionId) {
      dispatch(getTransaction(transactionId));
    }

    return () => {
      dispatch(clearTransaction());
    };
  }, [dispatch, isEditing, transactionId]);

  useEffect(() => {
    if (transaction && isEditing) {
      setTitle(transaction.title);
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setCategory(transaction.category);
      setDescription(transaction.description || '');
      setDate(new Date(transaction.date));
    }
  }, [transaction, isEditing]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Function to reset all form fields
  const resetFormFields = () => {
    setTitle('');
    setAmount('');
    setType(TransactionType.EXPENSE);
    setCategory('');
    setDescription('');
    setDate(new Date());
    setShowCategories(false);
    setShowDatePicker(false);
  };

  const handleSubmit = () => {
    if (!title || !amount || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const transactionData = {
      title,
      amount: parseFloat(amount),
      type,
      category,
      date: date.toISOString(),
      description: description || undefined,
    };

    if (isEditing && transactionId) {
      dispatch(updateTransaction({ id: transactionId, transactionData }));
    } else {
      dispatch(addTransaction(transactionData as any));
      
      // Reset form fields in case user returns to this screen
      resetFormFields();
    }
    
    // Navigate back to home screen
    navigation.goBack();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </Text>

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === TransactionType.EXPENSE && styles.activeTypeButton,
              ]}
              onPress={() => setType(TransactionType.EXPENSE)}
            >
              <Ionicons
                name="arrow-up-outline"
                size={20}
                color={type === TransactionType.EXPENSE ? '#fff' : '#F44336'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  type === TransactionType.EXPENSE && styles.activeTypeButtonText,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === TransactionType.INCOME && styles.activeIncomeButton,
              ]}
              onPress={() => setType(TransactionType.INCOME)}
            >
              <Ionicons
                name="arrow-down-outline"
                size={20}
                color={type === TransactionType.INCOME ? '#fff' : '#4CAF50'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  type === TransactionType.INCOME && styles.activeTypeButtonText,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter title"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category *</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowCategories(!showCategories)}
            >
              <Text style={category ? styles.inputText : styles.placeholderText}>
                {category || 'Select category'}
              </Text>
              <Ionicons name="chevron-down-outline" size={20} color="#666" />
            </TouchableOpacity>
            {showCategories && (
              <View style={styles.categoriesContainer}>
                <ScrollView 
                  style={styles.categoriesList}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                  contentContainerStyle={styles.categoriesScrollContent}
                >
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={styles.categoryItem}
                      onPress={() => {
                        setCategory(cat);
                        setShowCategories(false);
                      }}
                    >
                      <Text style={styles.categoryText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.inputText}>{formatDate(date)}</Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isEditing ? 'Update Transaction' : 'Add Transaction'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  activeTypeButton: {
    backgroundColor: '#F44336',
  },
  activeIncomeButton: {
    backgroundColor: '#4CAF50',
  },
  typeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  activeTypeButtonText: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 200,
  },
  categoriesList: {
    maxHeight: 200,
  },
  categoriesScrollContent: {
    flexGrow: 1,
  },
  categoryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTransactionScreen; 