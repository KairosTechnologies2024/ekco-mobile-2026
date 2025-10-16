import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

class NotificationService {
  static async initialize() {
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('alerts', {
        name: 'Vehicle Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  static async displayAlert(title: string, body: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger: null,
    });
  }
}

export default NotificationService;
