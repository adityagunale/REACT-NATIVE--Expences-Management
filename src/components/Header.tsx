import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface HeaderProps {
  title: string;
  showProfile?: boolean;
  showBack?: boolean;
}

const Header = ({ title, showProfile = true, showBack = false }: HeaderProps) => {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          {showBack && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              {/* <Ionicons name="arrow-back" size={24} color="white" /> */}
            </TouchableOpacity>
          )}
          <View>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSubtitle}>Welcome, <Text style={styles.username}>{user?.name || 'User'} !</Text></Text>
          </View>
        </View>
        {showProfile && (
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile' as never)}
          >
            <Ionicons name="person-circle-outline" size={41} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 10,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
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
});

export default Header; 