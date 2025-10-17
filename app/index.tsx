import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import WebSocketService from '../services/WebSocketService';

export default function Index() {
  useEffect(() => {
 
    WebSocketService.getInstance().connect();
    
    return () => {
      // Optional: disconnect on unmount
     WebSocketService.getInstance().disconnect();
    };
  }, []);

  return <Redirect href="/screens/auth/auth" />;
}