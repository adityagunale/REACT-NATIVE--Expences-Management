import { EMI } from '../redux/slices/emiSlice';

export type RootStackParamList = {
  MainTabs: undefined;
  EMIDetails: { emi: EMI };
};

export type MainTabParamList = {
  Home: undefined;
  EMI: undefined;
  Profile: undefined;
}; 