import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [monthlyEMI, setMonthlyEMI] = useState('');
  const [calculationType, setCalculationType] = useState<'emi' | 'rate' | 'term' | 'borrow'>('emi');
  const [result, setResult] = useState<{
    emi: number;
    totalInterest: number;
    totalPayment: number;
    interestRate?: number;
    loanTerm?: number;
    borrowAmount?: number;
  } | null>(null);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 12 / 100; // Monthly interest rate
    const time = parseFloat(loanTerm) * 12; // Total months

    if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
      Alert.alert('Error', 'Please enter valid numbers for all fields');
      return;
    }

    const emi = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
    const totalPayment = emi * time;
    const totalInterest = totalPayment - principal;

    setResult({
      emi,
      totalInterest,
      totalPayment,
    });
  };

  const calculateInterestRate = () => {
    const principal = parseFloat(loanAmount);
    const emi = parseFloat(monthlyEMI);
    const time = parseFloat(loanTerm) * 12;

    if (isNaN(principal) || isNaN(emi) || isNaN(time)) {
      Alert.alert('Error', 'Please enter valid numbers for all fields');
      return;
    }

    // Using binary search to find the interest rate
    let low = 0;
    let high = 100;
    let mid;
    let calculatedEMI;
    let tolerance = 0.01;

    while (high - low > tolerance) {
      mid = (low + high) / 2;
      const monthlyRate = mid / 12 / 100;
      calculatedEMI = (principal * monthlyRate * Math.pow(1 + monthlyRate, time)) / (Math.pow(1 + monthlyRate, time) - 1);

      if (Math.abs(calculatedEMI - emi) < tolerance) {
        break;
      }

      if (calculatedEMI > emi) {
        high = mid;
      } else {
        low = mid;
      }
    }

    const totalPayment = emi * time;
    const totalInterest = totalPayment - principal;

    setResult({
      emi,
      totalInterest,
      totalPayment,
      interestRate: mid,
    });
  };

  const calculateLoanTerm = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 12 / 100;
    const emi = parseFloat(monthlyEMI);

    if (isNaN(principal) || isNaN(rate) || isNaN(emi)) {
      Alert.alert('Error', 'Please enter valid numbers for all fields');
      return;
    }

    // Using binary search to find the loan term
    let low = 1;
    let high = 30 * 12; // Maximum 30 years
    let mid;
    let calculatedEMI;
    let tolerance = 0.01;

    while (high - low > tolerance) {
      mid = Math.floor((low + high) / 2);
      calculatedEMI = (principal * rate * Math.pow(1 + rate, mid)) / (Math.pow(1 + rate, mid) - 1);

      if (Math.abs(calculatedEMI - emi) < tolerance) {
        break;
      }

      if (calculatedEMI > emi) {
        high = mid;
      } else {
        low = mid;
      }
    }

    const totalPayment = emi * mid;
    const totalInterest = totalPayment - principal;

    setResult({
      emi,
      totalInterest,
      totalPayment,
      loanTerm: mid / 12, // Convert months to years
    });
  };

  const calculateBorrowAmount = () => {
    const emi = parseFloat(monthlyEMI);
    const rate = parseFloat(interestRate) / 12 / 100;
    const time = parseFloat(loanTerm) * 12;

    if (isNaN(emi) || isNaN(rate) || isNaN(time)) {
      Alert.alert('Error', 'Please enter valid numbers for all fields');
      return;
    }

    // Calculate maximum loan amount using the EMI formula
    const borrowAmount = (emi * (Math.pow(1 + rate, time) - 1)) / (rate * Math.pow(1 + rate, time));
    const totalPayment = emi * time;
    const totalInterest = totalPayment - borrowAmount;

    setResult({
      emi,
      totalInterest,
      totalPayment,
      borrowAmount,
    });
  };

  const handleCalculate = () => {
    switch (calculationType) {
      case 'emi':
        calculateEMI();
        break;
      case 'rate':
        calculateInterestRate();
        break;
      case 'term':
        calculateLoanTerm();
        break;
      case 'borrow':
        calculateBorrowAmount();
        break;
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹ ${amount.toFixed(2)}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Loan & EMI Calculator</Text>
          <Text style={styles.subtitle}>Calculate your loan details</Text>
        </View>

        <View style={styles.calculationTypeContainer}>
          <TouchableOpacity
            style={[
              styles.calculationTypeButton,
              calculationType === 'emi' && styles.calculationTypeButtonActive,
            ]}
            onPress={() => setCalculationType('emi')}
          >
            <Text style={[
              styles.calculationTypeText,
              calculationType === 'emi' && styles.calculationTypeTextActive,
            ]}>Calculate EMI</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.calculationTypeButton,
              calculationType === 'rate' && styles.calculationTypeButtonActive,
            ]}
            onPress={() => setCalculationType('rate')}
          >
            <Text style={[
              styles.calculationTypeText,
              calculationType === 'rate' && styles.calculationTypeTextActive,
            ]}>Calculate Rate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.calculationTypeButton,
              calculationType === 'term' && styles.calculationTypeButtonActive,
            ]}
            onPress={() => setCalculationType('term')}
          >
            <Text style={[
              styles.calculationTypeText,
              calculationType === 'term' && styles.calculationTypeTextActive,
            ]}>Calculate Term</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.calculationTypeButton,
              calculationType === 'borrow' && styles.calculationTypeButtonActive,
            ]}
            onPress={() => setCalculationType('borrow')}
          >
            <Text style={[
              styles.calculationTypeText,
              calculationType === 'borrow' && styles.calculationTypeTextActive,
            ]}>How Much Can I Borrow?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          {calculationType !== 'borrow' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Loan Amount</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter loan amount"
                  keyboardType="numeric"
                  value={loanAmount}
                  onChangeText={setLoanAmount}
                />
              </View>
            </View>
          )}

          {calculationType !== 'rate' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Interest Rate (% per year)</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter interest rate"
                  keyboardType="numeric"
                  value={interestRate}
                  onChangeText={setInterestRate}
                />
                <Text style={styles.percentageSymbol}>%</Text>
              </View>
            </View>
          )}

          {calculationType !== 'term' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Loan Term (Years)</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter loan term"
                  keyboardType="numeric"
                  value={loanTerm}
                  onChangeText={setLoanTerm}
                />
                <Text style={styles.percentageSymbol}>Years</Text>
              </View>
            </View>
          )}

          {(calculationType === 'rate' || calculationType === 'term' || calculationType === 'borrow') && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monthly EMI</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter monthly EMI"
                  keyboardType="numeric"
                  value={monthlyEMI}
                  onChangeText={setMonthlyEMI}
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.calculateButton}
            onPress={handleCalculate}
          >
            <Text style={styles.calculateButtonText}>Calculate</Text>
            <Ionicons name="calculator-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultContainer}>
            {calculationType === 'borrow' && result.borrowAmount && (
              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Maximum Loan Amount</Text>
                <Text style={[styles.resultValue, styles.borrowText]}>
                  {formatCurrency(result.borrowAmount)}
                </Text>
              </View>
            )}
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Monthly EMI</Text>
              <Text style={styles.resultValue}>{formatCurrency(result.emi)}</Text>
            </View>
            {calculationType === 'rate' && result.interestRate && (
              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Interest Rate</Text>
                <Text style={styles.resultValue}>{formatPercentage(result.interestRate)}</Text>
              </View>
            )}
            {calculationType === 'term' && result.loanTerm && (
              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Loan Term</Text>
                <Text style={styles.resultValue}>{result.loanTerm.toFixed(1)} Years</Text>
              </View>
            )}
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Total Interest</Text>
              <Text style={[styles.resultValue, styles.interestText]}>
                {formatCurrency(result.totalInterest)}
              </Text>
            </View>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Total Payment</Text>
              <Text style={[styles.resultValue, styles.paymentText]}>
                {formatCurrency(result.totalPayment)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  calculationTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  calculationTypeButton: {
    flex: 1,
    minWidth: '48%',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: '1%',
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calculationTypeButtonActive: {
    backgroundColor: '#6200ee',
  },
  calculationTypeText: {
    fontSize: 14,
    color: '#666',
  },
  calculationTypeTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  percentageSymbol: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  calculateButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  resultContainer: {
    marginTop: 30,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  interestText: {
    color: '#F44336',
  },
  paymentText: {
    color: '#4CAF50',
  },
  borrowText: {
    color: '#2196F3',
  },
});

export default LoanCalculator; 