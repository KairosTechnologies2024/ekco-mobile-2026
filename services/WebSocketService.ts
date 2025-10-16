// services/WebSocketService.ts
import { authApi } from '../store/api/authApi';
import { setVehicles } from '../store/slices/userSlice';
import { store } from '../store/store';


class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect() {
    try {
      this.ws = new WebSocket('ws://192.168.10.26:3003');

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event);
      };

      this.ws.onerror = (error) => {
        console.log('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.handleReconnect();
      };
    } catch (error) {
      console.log('WebSocket connection error:', error);
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
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.log('Error parsing WebSocket message:', error);
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
        }
      });
    }
  }

  private handleTicketsUpdate(data: any[]) {
    // Handle tickets update if needed
    //console.log('Received tickets update:', data);
  }

  private handleAllAlertsUpdate(data: any[]) {
    // Handle all alerts update if needed
   // console.log('Received all alerts update:', data);
  }

  private handleRisksUpdate(data: any[]) {
    // Handle risks update if needed
    //console.log('Received risks update:', data);
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
      setTimeout(() => this.connect(), 3000);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  getConnectionStatus(): string {
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
