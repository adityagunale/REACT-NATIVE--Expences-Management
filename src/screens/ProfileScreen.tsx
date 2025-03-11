import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../redux/slices/authSlice';
import { RootState, AppDispatch } from '../redux/store';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { totalIncome, totalExpense, balance } = useSelector(
    (state: RootState) => state.transaction as any
  );

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            dispatch(logout());
          },
        },
      ],
      { cancelable: false }
    );
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Balance</Text>
          <Text
            style={[
              styles.statValue,
              balance >= 0 ? styles.positiveBalance : styles.negativeBalance,
            ]}
          >
            {formatCurrency(balance || 0)}
          </Text>
        </View>

        <View style={styles.statRow}>
          <View style={[styles.statCard, styles.halfCard]}>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={[styles.statValue, styles.incomeText]}>
              {formatCurrency(totalIncome || 0)}
            </Text>
          </View>

          <View style={[styles.statCard, styles.halfCard]}>
            <Text style={styles.statLabel}>Expenses</Text>
            <Text style={[styles.statValue, styles.expenseText]}>
              {formatCurrency(totalExpense || 0)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="person-outline" size={22} color="#6200ee" />
          </View>
          <Text style={styles.menuText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="lock-closed-outline" size={22} color="#6200ee" />
          </View>
          <Text style={styles.menuText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="notifications-outline" size={22} color="#6200ee" />
          </View>
          <Text style={styles.menuText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="settings-outline" size={22} color="#6200ee" />
          </View>
          <Text style={styles.menuText}>Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="help-circle-outline" size={22} color="#6200ee" />
          </View>
          <Text style={styles.menuText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 20,
    alignItems: 'center',
    paddingBottom: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    padding: 16,
    marginTop: -20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfCard: {
    flex: 0.48,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  positiveBalance: {
    color: '#4CAF50',
  },
  negativeBalance: {
    color: '#F44336',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 16,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 20,
  },
});

export default ProfileScreen; 