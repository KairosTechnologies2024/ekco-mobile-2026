import notifee from '@notifee/react-native';

// Register the app
AppRegistry.registerComponent(appName, () => App);

// Initialize notifee
notifee.registerForegroundService(() => {
  return new Promise(() => {
    // Background service handler
  });
});
