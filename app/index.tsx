import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import NotificationService from '../services/NotificationServices';




export default function index() {
useEffect(() => {
    NotificationService.initialize();
  }, []);



  return <Redirect href="/screens/auth/auth" />;
}
