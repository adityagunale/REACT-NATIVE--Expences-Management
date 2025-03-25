import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { addEMI, updateEMI, deleteEMI, markEMIPaid, EMI } from '../redux/slices/emiSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatCurrency } from '../utils/formatters';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../navigation/types';
import Header from '../components/Header';

type EMIScreenProps = StackScreenProps<MainStackParamList, 'EMI'>;

const EMIScreen: React.FC<EMIScreenProps> = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [emiAmount, setEmiAmount] = useState('');
  const [totalInstallments, setTotalInstallments] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [loanType, setLoanType] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [editingEMI, setEditingEMI] = useState<EMI | null>(null);

  const dispatch = useDispatch();
  const emis = useSelector((state: RootState) => state.emi.emis);

  const totalEMIAmount = emis.reduce((sum, emi) => sum + emi.totalAmount, 0);
  const totalPaidAmount = emis.reduce((sum, emi) => sum + (emi.emiAmount * emi.paidInstallments), 0);
  const totalPendingAmount = totalEMIAmount - totalPaidAmount;

  const activeEMIs = emis.filter(emi => emi.status === 'active').length;
  const completedEMIs = emis.filter(emi => emi.status === 'completed').length;
  const overdueEMIs = emis.filter(emi => emi.status === 'overdue').length;

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    if (!name || !totalAmount || !emiAmount || !totalInstallments || !loanType || !interestRate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const nextPaymentDate = new Date(startDate);
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    const newEMI: EMI = {
      id: editingEMI?.id || Date.now().toString(),
      name: name.trim(),
      totalAmount: parseFloat(totalAmount),
      emiAmount: parseFloat(emiAmount),
      totalInstallments: parseInt(totalInstallments),
      paidInstallments: editingEMI?.paidInstallments || 0,
      startDate: startDate.toISOString(),
      nextPaymentDate: nextPaymentDate.toISOString(),
      status: 'active',
      loanType: loanType.trim(),
      interestRate: parseFloat(interestRate),
    };

    if (editingEMI) {
      dispatch(updateEMI(newEMI));
    } else {
      dispatch(addEMI(newEMI));
    }

    resetForm();
    setIsModalVisible(false);
  };

  const handleMarkPaid = (emi: EMI) => {
    dispatch(markEMIPaid({ id: emi.id }));
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete EMI',
      'Are you sure you want to delete this EMI?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteEMI(id)) },
      ]
    );
  };

  const resetForm = () => {
    setName('');
    setTotalAmount('');
    setEmiAmount('');
    setTotalInstallments('');
    setStartDate(new Date());
    setLoanType('');
    setInterestRate('');
    setEditingEMI(null);
  };

  const handleEMIPress = (emi: EMI) => {
    navigation.navigate('EMIDetails', { emi });
  };

  const renderEMIItem = ({ item }: { item: EMI }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.emiCard}
      onPress={() => handleEMIPress(item)}
    >
      <View style={styles.emiHeader}>
        <Text style={styles.emiName}>{item.name}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'completed' ? styles.statusCompleted :
          item.status === 'overdue' ? styles.statusOverdue :
          styles.statusActive
        ]}>
          <Text style={[
            styles.statusBadgeText,
            item.status === 'completed' ? styles.statusCompletedText :
            item.status === 'overdue' ? styles.statusOverdueText :
            styles.statusActiveText
          ]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.emiDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Amount:</Text>
          <Text style={styles.detailValue}>{formatCurrency(item.totalAmount)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>EMI Amount:</Text>
          <Text style={styles.detailValue}>{formatCurrency(item.emiAmount)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Progress:</Text>
          <Text style={styles.detailValue}>
            {item.paidInstallments}/{item.totalInstallments} installments
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Next Payment:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.nextPaymentDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.emiActions}>
        {item.status === 'active' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.payButton]}
            onPress={() => handleMarkPaid(item)}
          >
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={[styles.actionButtonText, { color: '#4CAF50' }]}>Mark Paid</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            setEditingEMI(item);
            setName(item.name);
            setTotalAmount(item.totalAmount.toString());
            setEmiAmount(item.emiAmount.toString());
            setTotalInstallments(item.totalInstallments.toString());
            setStartDate(new Date(item.startDate));
            setLoanType(item.loanType);
            setInterestRate(item.interestRate.toString());
            setIsModalVisible(true);
          }}
        >
          <Ionicons name="pencil" size={20} color="#6200ee" />
          <Text style={[styles.actionButtonText, { color: '#6200ee' }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash" size={20} color="#F44336" />
          <Text style={[styles.actionButtonText, { color: '#F44336' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <Header title="EMI Management" /> */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total EMIs</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalEMIAmount)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Paid Amount</Text>
          <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
            {formatCurrency(totalPaidAmount)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Pending</Text>
          <Text style={[styles.summaryValue, { color: '#F44336' }]}>
            {formatCurrency(totalPendingAmount)}
          </Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Active: {activeEMIs}</Text>
        <Text style={styles.statusText}>Completed: {completedEMIs}</Text>
        <Text style={styles.statusText}>Overdue: {overdueEMIs}</Text>
      </View>

      <FlatList
        data={emis}
        renderItem={renderEMIItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetForm();
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
          resetForm();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingEMI ? 'Edit EMI' : 'Add New EMI'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  resetForm();
                }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Loan Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter loan name"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Total Amount</Text>
                <View style={styles.amountInput}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter total amount"
                    keyboardType="numeric"
                    value={totalAmount}
                    onChangeText={setTotalAmount}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMI Amount</Text>
                <View style={styles.amountInput}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter EMI amount"
                    keyboardType="numeric"
                    value={emiAmount}
                    onChangeText={setEmiAmount}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Total Installments</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter number of installments"
                  keyboardType="numeric"
                  value={totalInstallments}
                  onChangeText={setTotalInstallments}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {startDate.toLocaleDateString()}
                  </Text>
                  <Ionicons name="calendar" size={20} color="#6200ee" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Loan Type</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter loan type"
                  value={loanType}
                  onChangeText={setLoanType}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Interest Rate (%)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter interest rate"
                  keyboardType="numeric"
                  value={interestRate}
                  onChangeText={setInterestRate}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {editingEMI ? 'Update' : 'Add'} EMI
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    marginTop: 5,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#fff',
    marginTop: 1,
    elevation: 2,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  emiCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  emiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  emiName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: '#E3F2FD',
  },
  statusCompleted: {
    backgroundColor: '#E8F5E9',
  },
  statusOverdue: {
    backgroundColor: '#FFEBEE',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusActiveText: {
    color: '#2196F3',
  },
  statusCompletedText: {
    color: '#4CAF50',
  },
  statusOverdueText: {
    color: '#F44336',
  },
  emiDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  emiActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginLeft: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: '#E8F5E9',
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
    maxHeight: '90%',
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
    maxHeight: '95%',
  },
  inputGroup: {
    marginBottom: 16,
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
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
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

export default EMIScreen; 