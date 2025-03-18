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

const BorrowScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingBorrow, setEditingBorrow] = useState<Borrow | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const borrows = useSelector((state: RootState) => state.borrow.borrows);

  const handleSubmit = () => {
    if (!name.trim() || !amount.trim() || !reason.trim() || !dueDate.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newBorrow: Borrow = {
      id: Date.now().toString(),
      name: name.trim(),
      amount: parseFloat(amount),
      reason: reason.trim(),
      date: new Date().toISOString(),
      dueDate: dueDate.trim(),
      status: 'pending',
    };

    dispatch(addBorrow(newBorrow));
    resetFormFields();
    setIsModalVisible(false);
  };

  const handleUpdateBorrow = () => {
    if (!editingBorrow) return;

    if (!name.trim() || !amount.trim() || !reason.trim() || !dueDate.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const updatedBorrow: Borrow = {
      ...editingBorrow,
      name: name.trim(),
      amount: parseFloat(amount),
      reason: reason.trim(),
      dueDate: dueDate.trim(),
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
    setDueDate(borrow.dueDate);
    setIsModalVisible(true);
  };

  const resetFormFields = () => {
    setName('');
    setAmount('');
    setReason('');
    setDueDate('');
    setEditingBorrow(null);
  };

  const renderBorrowItem = ({ item }: { item: Borrow }) => (
    <View style={styles.borrowItem}>
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
      <Text style={styles.borrowReason}>{item.reason}</Text>
      <Text style={styles.borrowDate}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
      <View style={styles.borrowActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditBorrow(item)}
        >
          <Ionicons name="pencil" size={20} color="#6200ee" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteBorrow(item.id)}
        >
          <Ionicons name="trash" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={borrows}
        renderItem={renderBorrowItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
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
                    style={styles.input}
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
                <Text style={styles.label}>Due Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={dueDate}
                  onChangeText={setDueDate}
                />
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
    marginTop: 12,
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    flex: 1,
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
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BorrowScreen; 