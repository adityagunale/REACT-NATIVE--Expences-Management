import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { addBorrow, updateBorrow, deleteBorrow, Borrow } from '../redux/slices/borrowSlice';
import { formatCurrency } from '../utils/formatters';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

const BorrowScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [dateGiven, setDateGiven] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [showDateGivenPicker, setShowDateGivenPicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [editingBorrow, setEditingBorrow] = useState<Borrow | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const borrows = useSelector((state: RootState) => state.borrow.borrows);

  // Setup notification handler
  React.useEffect(() => {
    const configurePushNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Please enable notifications to receive due date reminders.');
      }
    };

    configurePushNotifications();
  }, []);

  const scheduleNotification = async (borrowName: string, dueDate: Date) => {
    try {
      // Schedule notification 1 day before due date
      const trigger = new Date(dueDate);
      trigger.setDate(trigger.getDate() - 1);
      trigger.setHours(9, 0, 0); // Set to 9 AM

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Borrow Due Tomorrow',
          body: `Your borrow "${borrowName}" is due tomorrow!`,
          sound: true,
        },
        trigger: {
          type: 'date',
          date: trigger,
        },
      });
    } catch (error) {
      console.log('Error scheduling notification:', error);
    }
  };

  const handleDateGivenChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDateGivenPicker(false);
    }
    if (selectedDate) {
      setDateGiven(selectedDate);
      // If given date is after due date, update due date
      if (selectedDate > dueDate) {
        setDueDate(selectedDate);
      }
    }
  };

  const handleDueDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDueDatePicker(false);
    }
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !amount.trim() || !reason.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newBorrow: Borrow = {
      id: Date.now().toString(),
      name: name.trim(),
      amount: parseFloat(amount),
      reason: reason.trim(),
      date: dateGiven.toISOString(),
      dueDate: dueDate.toISOString(),
      status: 'pending',
    };

    dispatch(addBorrow(newBorrow));
    await scheduleNotification(name.trim(), dueDate);
    resetFormFields();
    setIsModalVisible(false);
  };

  const handleUpdateBorrow = () => {
    if (!editingBorrow) return;

    if (!name.trim() || !amount.trim() || !reason.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const updatedBorrow: Borrow = {
      ...editingBorrow,
      name: name.trim(),
      amount: parseFloat(amount),
      reason: reason.trim(),
    };

    dispatch(updateBorrow(updatedBorrow));
    resetFormFields();
    setIsModalVisible(false);
  };

  const handleDeleteBorrow = (id: string) => {
    Alert.alert(
      'Delete Borrow',
      'Are you sure you want to delete this borrow?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteBorrow(id)) },
      ]
    );
  };

  const handleEditBorrow = (borrow: Borrow) => {
    setEditingBorrow(borrow);
    setName(borrow.name);
    setAmount(borrow.amount.toString());
    setReason(borrow.reason);
    setDateGiven(new Date(borrow.date));
    setDueDate(new Date(borrow.dueDate));
    setIsModalVisible(true);
  };

  const resetFormFields = () => {
    setName('');
    setAmount('');
    setReason('');
    setDateGiven(new Date());
    setDueDate(new Date());
    setEditingBorrow(null);
  };

  const renderBorrowItem = ({ item }: { item: Borrow }) => (
    <TouchableOpacity 
      style={styles.borrowItem}
      onPress={() => setExpandedItemId(expandedItemId === item.id ? null : item.id)}
    >
      <View style={styles.borrowItemHeader}>
        <Text style={styles.borrowName}>{item.name}</Text>
        <Text style={[
          styles.borrowStatus,
          item.status === 'paid' ? styles.statusPaid : styles.statusPending
        ]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.borrowAmount}>{formatCurrency(item.amount)}</Text>
      
      {expandedItemId === item.id && (
        <View style={styles.expandedContent}>
          <View style={styles.detailRow}>
            <Ionicons name="document-text" size={20} color="#666" />
            <Text style={styles.detailLabel}>Reason:</Text>
            <Text style={styles.detailText}>{item.reason}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={20} color="#666" />
            <Text style={styles.detailLabel}>Given:</Text>
            <Text style={styles.detailText}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={20} color="#666" />
            <Text style={styles.detailLabel}>Due:</Text>
            <Text style={styles.detailText}>
              {new Date(item.dueDate).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.borrowActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => handleEditBorrow(item)}
            >
              <Ionicons name="pencil" size={20} color="#6200ee" />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteBorrow(item.id)}
            >
              <Ionicons name="trash" size={20} color="#F44336" />
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={borrows}
        renderItem={renderBorrowItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No borrows yet. Click + to add one.</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetFormFields();
          setIsModalVisible(true);
        }}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setIsModalVisible(false);
          resetFormFields();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingBorrow ? 'Edit Borrow' : 'Add New Borrow'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  resetFormFields();
                }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter name"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Amount</Text>
                <View style={styles.amountInput}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Reason</Text>
                <TextInput
                  style={[styles.input, styles.reasonInput]}
                  placeholder="Enter reason"
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date Given</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDateGivenPicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {dateGiven.toLocaleDateString()}
                  </Text>
                  <Ionicons name="calendar" size={20} color="#6200ee" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Due Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDueDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {dueDate.toLocaleDateString()}
                  </Text>
                  <Ionicons name="calendar" size={20} color="#6200ee" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={editingBorrow ? handleUpdateBorrow : handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {editingBorrow ? 'Update' : 'Add'} Borrow
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {(showDateGivenPicker || showDueDatePicker) && (
              <DateTimePicker
                value={showDateGivenPicker ? dateGiven : dueDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={showDateGivenPicker ? handleDateGivenChange : handleDueDateChange}
                minimumDate={showDueDatePicker ? dateGiven : undefined}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  borrowItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  borrowItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  borrowName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  borrowStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
    color: '#F57C00',
  },
  statusPaid: {
    backgroundColor: '#E8F5E9',
    color: '#4CAF50',
  },
  borrowAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 4,
  },
  borrowReason: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  borrowDate: {
    fontSize: 12,
    color: '#999',
  },
  borrowActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginLeft: 12,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#F3E5F5',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    paddingHorizontal: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 16,
    marginRight: 8,
    color: '#333',
  },
  reasonInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginRight: 8,
    fontWeight: '600',
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});

export default BorrowScreen; 