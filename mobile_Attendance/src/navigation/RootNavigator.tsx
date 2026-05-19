import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../store/authStore';
import { HomeScreen } from '../screens/HomeScreen';
import { AttendanceScreen } from '../screens/AttendanceScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { LeaveScreen } from '../screens/LeaveScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LoginScreen } from '../screens/LoginScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: true,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = 'home';

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Attendance') {
          iconName = focused ? 'calendar-check' : 'calendar-outline';
        } else if (route.name === 'History') {
          iconName = focused ? 'history' : 'history';
        } else if (route.name === 'Leave') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'account' : 'account-outline';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#0066cc',
      tabBarInactiveTintColor: '#999',
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Dashboard' }}
    />
    <Tab.Screen
      name="Attendance"
      component={AttendanceScreen}
      options={{ title: 'Attendance' }}
    />
    <Tab.Screen
      name="History"
      component={HistoryScreen}
      options={{ title: 'History' }}
    />
    <Tab.Screen
      name="Leave"
      component={LeaveScreen}
      options={{ title: 'Leaves' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Tab.Navigator>
);

export const RootNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
