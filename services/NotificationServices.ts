import messaging from '@react-native-firebase/messaging';
import { router } from 'expo-router';
import { Alert } from 'react-native';

class NotificationService {
  static async initialize() {
    try {
      // Request permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('Notification permissions not granted');
        return false;
      }

      // Get FCM token
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      
      // Optional: Show token for testing
      if (__DEV__) {
        Alert.alert('FCM Token', token);
      }

      return true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  static async displayAlert(title: string, body: string, data?: any) {
    // For local notifications, you can use a different approach
    // or rely on FCM for all notifications
    Alert.alert(title, body);
    
    // Alternatively, you can use React Native's PushNotification if needed
    // but FCM should handle most cases
  }

  // Setup notification listeners (call this in your WebSocket service)
  static setupNotificationListeners() {
    // Foreground messages
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground FCM:', remoteMessage);
      
      // Show local alert or custom in-app notification
     /*  Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || 'New message'
      ); */
    });

    // Background/Quit state message handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background FCM:', remoteMessage);
      // Background messages are handled automatically by FCM
    });

    // Notification opened app
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app:', remoteMessage);
      router.push('/alerts');
    });

    // Check if app was opened by notification
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('App opened by notification:', remoteMessage);
        router.push('/alerts');
      }
    });
  }

  static async getToken(): Promise<string | null> {
    try {
      return await messaging().getToken();
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }
}

export default NotificationService;