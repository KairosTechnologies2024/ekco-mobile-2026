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
      this.ws = new WebSocket('ws://192.168.10.37:3003');

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
      
      // Handle vehicle updates
      if (data.type === 'vehicle_update' || data.speed !== undefined || data.ignition !== undefined) {
        this.updateVehicleData(data);
      }
      
      // Handle alert updates
      if (data.type === 'alert_update' && data.data) {
        this.handleAlertUpdate(data);
      }
      
      // Handle generic data (fallback)
      if (!data.type && (data.data || data.speed || data.ignition)) {
        this.updateVehicleData(data);
      }
    } catch (error) {
      console.log('Error parsing WebSocket message:', error);
    }
  }

  private updateVehicleData(data: any) {
    const state = store.getState();
    const currentVehicles = state.user.vehicles && Array.isArray(state.user.vehicles) 
      ? state.user.vehicles.slice() 
      : [];

    let updated = false;

    const updatedVehicles = currentVehicles.map(vehicle => {
      const vehicleSerial = (vehicle as any).serial?.toString();
      
      // Extract data based on your API structure
      const payload = data.data || data;
      let vehicleUpdate = null;

      if (payload.device_serial === vehicleSerial) {
        vehicleUpdate = {
          speed: Number(payload.speed ?? payload.s ?? 0),
          ignition: payload.ignition_status ?? payload.ignition ?? false,
          latitude: payload.latitude ?? payload.lat,
          longitude: payload.longitude ?? payload.lng ?? payload.lon
        };
      } else if (Array.isArray(payload)) {
        const match = payload.find((item: any) => item.device_serial === vehicleSerial);
        if (match) {
          vehicleUpdate = {
            speed: Number(match.speed ?? match.s ?? 0),
            ignition: match.ignition_status ?? match.ignition ?? false,
            latitude: match.latitude ?? match.lat,
            longitude: match.longitude ?? match.lng ?? match.lon
          };
        }
      }
console.log('Received vehicle update:', data);
console.log('Updated vehicle data:', vehicleUpdate);
      if (vehicleUpdate) {
        updated = true;
        return {
          ...vehicle,
          latestSpeed: vehicleUpdate.speed,
          ignitionStatus: this.normalizeIgnition(vehicleUpdate.ignition),
          status: vehicleUpdate.speed > 0 ? 'Moving' : 'Parked',
          ...(vehicleUpdate.latitude && { latitude: vehicleUpdate.latitude }),
          ...(vehicleUpdate.longitude && { longitude: vehicleUpdate.longitude })
        };
      }

      return vehicle;
    });

    if (updated) {
      store.dispatch(setVehicles(updatedVehicles as any));
    }
  }

  private handleAlertUpdate(data: any) {
    const alerts = Array.isArray(data.data) ? data.data : [data.data];
    alerts.forEach((alert: any) => {
      if (alert.device_serial) {
        // Invalidate the cache for this serial to trigger refetch
        store.dispatch(authApi.util.invalidateTags([{ type: 'Alerts', id: alert.device_serial }]));
      }
    });
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

  // Optional: Method to manually send messages if needed
  sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  // Optional: Method to check connection status
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