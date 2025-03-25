import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { updateEMI, deleteEMI, markEMIPaid, EMI } from '../redux/slices/emiSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatCurrency } from '../utils/formatters';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../navigation/types';

type EMIDetailsScreenProps = StackScreenProps<MainStackParamList, 'EMIDetails'>;

const EMIDetailsScreen: React.FC<EMIDetailsScreenProps> = ({ route, navigation }) => {
  const { emi } = route.params;
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState(emi.name);
  const [totalAmount, setTotalAmount] = useState(emi.totalAmount.toString());
  const [emiAmount, setEmiAmount] = useState(emi.emiAmount.toString());
  const [totalInstallments, setTotalInstallments] = useState(emi.totalInstallments.toString());
  const [startDate, setStartDate] = useState(new Date(emi.startDate));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [loanType, setLoanType] = useState(emi.loanType);
  const [interestRate, setInterestRate] = useState(emi.interestRate.toString());

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
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + emi.paidInstallments + 1);

    const updatedEMI: EMI = {
      ...emi,
      name: name.trim(),
      totalAmount: parseFloat(totalAmount),
      emiAmount: parseFloat(emiAmount),
      totalInstallments: parseInt(totalInstallments),
      startDate: startDate.toISOString(),
      nextPaymentDate: nextPaymentDate.toISOString(),
      loanType: loanType.trim(),
      interestRate: parseFloat(interestRate),
    };

    dispatch(updateEMI(updatedEMI));
    setIsModalVisible(false);
  };

  const handleMarkPaid = () => {
    dispatch(markEMIPaid({ id: emi.id }));
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete EMI',
      'Are you sure you want to delete this EMI?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteEMI(emi.id));
            navigation.goBack();
          },
        },
      ]
    );
  };

  const remainingAmount = emi.totalAmount - (emi.emiAmount * emi.paidInstallments);
  const progressPercentage = (emi.paidInstallments / emi.totalInstallments) * 100;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{emi.name}</Text>
          <View style={styles.statusContainer}>
            <Text style={[
              styles.status,
              emi.status === 'completed' ? styles.statusCompleted :
              emi.status === 'overdue' ? styles.statusOverdue :
              styles.statusActive
            ]}>
              {emi.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {emi.paidInstallments} of {emi.totalInstallments} installments paid
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Financial Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text style={styles.value}>{formatCurrency(emi.totalAmount)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>EMI Amount:</Text>
            <Text style={styles.value}>{formatCurrency(emi.emiAmount)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Remaining Amount:</Text>
            <Text style={styles.value}>{formatCurrency(remainingAmount)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Interest Rate:</Text>
            <Text style={styles.value}>{emi.interestRate}%</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Loan Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Loan Type:</Text>
            <Text style={styles.value}>{emi.loanType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>
              {new Date(emi.startDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Next Payment:</Text>
            <Text style={styles.value}>
              {new Date(emi.nextPaymentDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          {emi.status === 'active' && (
            <TouchableOpacity
              style={[styles.button, styles.payButton]}
              onPress={handleMarkPaid}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Mark Paid</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => setIsModalVisible(true)}
          >
            <Ionicons name="pencil" size={20} color="#fff" />
            <Text style={styles.buttonText}>Edit EMI</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Ionicons name="trash" size={20} color="#fff" />
            <Text style={styles.buttonText}>Delete EMI</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit EMI</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Loan Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter loan name"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Total Amount</Text>
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
                <Text style={styles.inputLabel}>EMI Amount</Text>
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
                <Text style={styles.inputLabel}>Total Installments</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter number of installments"
                  keyboardType="numeric"
                  value={totalInstallments}
                  onChangeText={setTotalInstallments}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Start Date</Text>
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
                <Text style={styles.inputLabel}>Loan Type</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter loan type"
                  value={loanType}
                  onChangeText={setLoanType}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Interest Rate (%)</Text>
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
                <Text style={styles.submitButtonText}>Update EMI</Text>
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: '#E3F2FD',
    color: '#2196F3',
  },
  statusCompleted: {
    backgroundColor: '#E8F5E9',
    color: '#4CAF50',
  },
  statusOverdue: {
    backgroundColor: '#FFEBEE',
    color: '#F44336',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6200ee',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  payButton: {
    backgroundColor: '#4CAF50',
  },
  editButton: {
    backgroundColor: '#6200ee',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
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
    maxHeight: '80%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
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
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EMIDetailsScreen; 