import messaging from '@react-native-firebase/messaging';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { authApi } from '../store/api/authApi';
import { setVehicles } from '../store/slices/userSlice';
import { store } from '../store/store';
import NotificationService from './NotificationServices';
class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private isConnecting = false;
  private heartbeat: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private async setupNotifications() {
    try {
      const initialized = await NotificationService.initialize();
      if (!initialized) {
        console.error('Failed to initialize notifications');
        return;
      }

      // Get FCM token
      this.token = await messaging().getToken();
      console.log('FCM Token:', this.token);
Alert.alert('FCM Token', this.token);
      // Handle foreground messages
      messaging().onMessage(async remoteMessage => {
        await NotificationService.displayAlert(
          remoteMessage.notification?.title || 'Vehicle Alert',
          remoteMessage.notification?.body || 'You have a new alert'
        );
      });

      // Handle background messages
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        await NotificationService.displayAlert(
          remoteMessage.notification?.title || 'Vehicle Alert',
          remoteMessage.notification?.body || 'You have a new alert'
        );
      });

      // Handle notification press
      messaging().onNotificationOpenedApp(() => {
        router.push('/alerts');
      });

      messaging().getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
          router.push('/alerts');
        }
      });
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeat = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: 'ping' });
      }
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
      this.heartbeat = null;
    }
  }

  public async connect() {
    if (this.ws || this.isConnecting) return;
    
    await this.setupNotifications();
    
    this.isConnecting = true;
    try {
      this.ws = new WebSocket('ws://192.168.10.26:3003');
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.startHeartbeat();
        
        // Send FCM token to server
        if (this.token) {
          this.send({
            type: 'token',
            token: this.token
          });
        } else {
          console.error('Failed to get FCM token');
        }
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.ws = null;
        this.isConnecting = false;
        this.stopHeartbeat();
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        this.stopHeartbeat();
      };

    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'gps_update':
          this.handleGPSUpdate(data.data);
          break;
        case 'speed_update':
          this.handleSpeedUpdate(data.data);
          break;
        case 'engine_update':
          this.handleEngineUpdate(data.data);
          break;
        case 'alert_update':
          this.handleAlertUpdate(data);
          break;
        case 'all_tickets_update':
          this.handleTicketsUpdate(data.data);
          break;
        case 'all_alerts_update':
          this.handleAllAlertsUpdate(data.data);
          break;
        case 'all_risks_update':
          this.handleRisksUpdate(data.data);
          break;
        case 'pong':
          // Handle pong response if needed
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private handleGPSUpdate(data: any[]) {
    const state = store.getState();
    const vehicles = state.user.vehicles || [];
    
    const updatedVehicles = vehicles.map(vehicle => {
      const update = data.find(d => d.device_serial === (vehicle as any).serial);
      if (update) {
        return {
          ...vehicle,
          latitude: update.latitude,
          longitude: update.longitude,
          latestSpeed: update.speed
        };
      }
      return vehicle;
    });
    
    store.dispatch(setVehicles(updatedVehicles));
    data.forEach(update => {
      store.dispatch(authApi.util.invalidateTags([
        { type: 'GPS', id: update.device_serial }
      ]));
    });
  }

  private handleSpeedUpdate(data: any[]) {
    const state = store.getState();
    const vehicles = state.user.vehicles || [];
    
    const updatedVehicles = vehicles.map(vehicle => {
      const update = data.find(d => d.device_serial === (vehicle as any).serial);
      if (update) {
        return {
          ...vehicle,
          latestSpeed: update.speed,
          status: update.speed > 0 ? 'Moving' : 'Parked'
        };
      }
      return vehicle;
    });
    
    store.dispatch(setVehicles(updatedVehicles));
    data.forEach(update => {
      store.dispatch(authApi.util.invalidateTags([
        { type: 'Speed', id: update.device_serial }
      ]));
    });
  }

  private handleEngineUpdate(data: any[]) {
    const state = store.getState();
    const vehicles = state.user.vehicles || [];
    
    const updatedVehicles = vehicles.map(vehicle => {
      const update = data.find(d => d.device_serial === (vehicle as any).serial);
      if (update) {
        return {
          ...vehicle,
          ignitionStatus: this.normalizeIgnition(update.ignition_status)
        };
      }
      return vehicle;
    });
    
    store.dispatch(setVehicles(updatedVehicles));
    data.forEach(update => {
      store.dispatch(authApi.util.invalidateTags([
        { type: 'Ignition', id: update.device_serial }
      ]));
    });
  }

  private handleAlertUpdate(data: any) {
    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((alert: any) => {
        if (alert.device_serial) {
          store.dispatch(authApi.util.invalidateTags([
            { type: 'Alerts', id: alert.device_serial }
          ]));
          
          // Show notification for new alerts
          NotificationService.displayAlert(
            'New Alert',
            alert.alert || 'You have a new alert'
          );
        }
      });
    }
  }

  private handleTicketsUpdate(data: any[]) {
    // Handle tickets update if needed
    console.log('Received tickets update:', data);
  }

  private handleAllAlertsUpdate(data: any[]) {
    // Handle all alerts update if needed
    console.log('Received all alerts update:', data);
  }

  private handleRisksUpdate(data: any[]) {
    // Handle risks update if needed
    console.log('Received risks update:', data);
  }

  private normalizeIgnition(val: any): string {
    if (val === null || val === undefined) return 'Off';
    const s = String(val).trim().toLowerCase();
    if (s === '1' || s === 'on' || s === 'true' || s === 'yes') return 'On';
    return 'Off';
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public send(data: any) {
    if (!this.ws) {
      console.error('WebSocket not initialized');
      return;
    }
    if (this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not open');
      return;
    }
    this.ws.send(JSON.stringify(data));
  }

  public disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = 0;
  }

  public getConnectionStatus(): string {
    if (!this.ws) return 'disconnected';
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'unknown';
    }
  }
}

export default WebSocketService;
