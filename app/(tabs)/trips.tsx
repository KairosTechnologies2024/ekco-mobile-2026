import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TripMap from '../../components/TripMap';

// Simple Calendar Component
interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

function SimpleCalendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isSelectedDate = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const days = getDaysInMonth(currentMonth);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View className="p-4">
      {/* Month Navigation */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={() => navigateMonth('prev')} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#3b82f6" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">
          {formatMonth(currentMonth)}
        </Text>
        <TouchableOpacity onPress={() => navigateMonth('next')} className="p-2">
          <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Weekday Headers */}
      <View className="flex-row mb-2">
        {weekdays.map(day => (
          <View key={day} className="flex-1 items-center py-2">
            <Text className="text-sm font-medium text-gray-500">{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View className="w-full">
        {Array.from({ length: Math.ceil(days.length / 7) }, (_, weekIndex) => (
          <View key={weekIndex} className="flex-row justify-between mb-2">
            {Array.from({ length: 7 }, (_, dayIndex) => {
              const dayNumber = weekIndex * 7 + dayIndex;
              const date = days[dayNumber];

              return (
                <View key={dayNumber} className="w-10 h-10">
                  {date ? (
                    <TouchableOpacity
                      className={`w-full h-full items-center justify-center rounded-lg ${
                        isSelectedDate(date)
                          ? 'bg-blue-600'
                          : isToday(date)
                            ? 'bg-blue-100 border border-blue-300'
                            : 'hover:bg-gray-100'
                      }`}
                      onPress={() => onDateSelect(date)}
                    >
                      <Text className={`text-sm ${
                        isSelectedDate(date)
                          ? 'text-white font-bold'
                          : isToday(date)
                            ? 'text-blue-600 font-bold'
                            : 'text-gray-700'
                      }`}>
                        {date.getDate()}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View className="w-full h-full" />
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity
          onPress={() => onDateSelect(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))}
          className="bg-gray-100 px-3 py-2 rounded-lg"
        >
          <Text className="text-gray-700 font-medium">7 Days Ago</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDateSelect(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))}
          className="bg-gray-100 px-3 py-2 rounded-lg"
        >
          <Text className="text-gray-700 font-medium">30 Days Ago</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDateSelect(new Date())}
          className="bg-gray-100 px-3 py-2 rounded-lg"
        >
          <Text className="text-gray-700 font-medium">Today</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface Trip {
  id: number;
  vehicle: string;
  startAddress: string;
  endAddress: string;
  startDate: string;
  endDate: string;
  duration: string;
  distance: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  coordinates: {
    start: { latitude: number; longitude: number };
    end: { latitude: number; longitude: number };
  };
}

export default function Trips() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Date range state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end'>('start');
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Date | null>(null);

  
  const trips: Trip[] = [
    {
      id: 1,
      vehicle: 'Toyota Camry',
       startAddress: '123 Amazimntoti St, Durban, NZ 8004',
      endAddress: '456 King Shaka Road, Inkandla, NZ 11201',
      startDate: '2024-01-15T08:30:00Z',
      endDate: '2024-01-15T09:45:00Z',
      duration: '1h 15m',
      distance: '12.5 km',
      status: 'completed',
      coordinates: {
        start: { latitude: 40.7505, longitude: -73.9934 },
        end: { latitude: 40.6782, longitude: -73.9442 }
      }
    },
    {
      id: 2,
      vehicle: 'Honda Civic',
       startAddress: '123 Amazimntoti St, Durban, NZ 8004',
      endAddress: '456 King Shaka Road, Inkandla, NZ 11201',
      startDate: '2024-01-15T14:00:00Z',
      endDate: '2024-01-15T15:30:00Z',
      duration: '1h 30m',
      distance: '18.2 km',
      status: 'completed',
      coordinates: {
        start: { latitude: 40.7282, longitude: -73.7949 },
        end: { latitude: 40.7150, longitude: -73.9870 }
      }
    },
    {
      id: 3,
      vehicle: 'Toyota Camry',
       startAddress: '123 Amazimntoti St, Durban, NZ 8004',
      endAddress: '456 King Shaka Road, Inkandla, NZ 11201',
      startDate: '2024-01-16T10:00:00Z',
      endDate: '2024-01-16T10:45:00Z',
      duration: '45m',
      distance: '8.7 km',
      status: 'in-progress',
      coordinates: {
        start: { latitude: 40.7230, longitude: -73.9960 },
        end: { latitude: 40.7711, longitude: -73.9661 }
      }
    },/* ,
    {
      id: 4,
      vehicle: 'Ford Mustang',
    startAddress: '123 Amazimntoti St, Durban, NZ 8004',
      endAddress: '456 King Shaka Road, Inkandla, NZ 11201',
      startDate: '2024-01-17T16:00:00Z',
      endDate: '2024-01-17T17:15:00Z',
      duration: '1h 15m',
      distance: '15.3 miles',
      status: 'scheduled',
      coordinates: {
        start: { latitude: 40.7075, longitude: -74.0113 },
        end: { latitude: 40.7847, longitude: -73.9661 }
      }
    } */
    {
      id: 5,
      vehicle: 'Chevrolet Malibu',
    startAddress: '123 Amazimntoti St, Durban, NZ 8004',
      endAddress: '456 King Shaka Road, Inkandla, NZ 11201',
      startDate: '2024-01-14T12:00:00Z',
      endDate: '2024-01-14T13:30:00Z',
      duration: '1h 30m',
      distance: '22.1 km',
      status: 'completed',
      coordinates: {
        start: { latitude: 40.8158, longitude: -73.9296 },
        end: { latitude: 40.6429, longitude: -74.0760 }
      }
    }
  ];

  const vehicles = ['all', ...Array.from(new Set(trips.map(trip => trip.vehicle)))];

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'scheduled':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Trip['status']) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'in-progress':
        return 'time';
      case 'scheduled':
        return 'calendar';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateForDisplay = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const openDatePicker = (mode: 'start' | 'end') => {
    setDatePickerMode(mode);
    setShowDatePicker(true);
  };

  const handleCalendarDateSelect = (date: Date) => {
    setCalendarSelectedDate(date);
    if (datePickerMode === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setShowDatePicker(false);
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (datePickerMode === 'start') {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  const clearDateRange = () => {
    setStartDate(null);
    setEndDate(null);
    setCalendarSelectedDate(null);
  };

  const getDateRangeText = () => {
    if (!startDate && !endDate) return 'Select Date Range';
    if (startDate && !endDate) return `From ${formatDateForDisplay(startDate)}`;
    if (!startDate && endDate) return `Until ${formatDateForDisplay(endDate)}`;

    if (startDate && endDate) {
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)} (${daysDiff} days)`;
    }

    return 'Select Date Range';
  };

  const getSelectedDaysCount = () => {
    if (!startDate || !endDate) return 0;
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Export functions
  const generateCSV = (trips: Trip[]) => {
    const headers = ['ID', 'Vehicle', 'Start Address', 'End Address', 'Start Date', 'End Date', 'Duration', 'Distance', 'Status'];
    const csvContent = [
      headers.join(','),
      ...trips.map(trip => [
        trip.id,
        `"${trip.vehicle}"`,
        `"${trip.startAddress}"`,
        `"${trip.endAddress}"`,
        `"${formatDate(trip.startDate)}"`,
        `"${formatDate(trip.endDate)}"`,
        `"${trip.duration}"`,
        `"${trip.distance}"`,
        `"${trip.status}"`
      ].join(','))
    ].join('\n');
    return csvContent;
  };

  const generatePDFContent = (trips: Trip[]) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Trips Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4F46E5; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .status-completed { color: #059669; }
            .status-in-progress { color: #3B82F6; }
            .status-scheduled { color: #F59E0B; }
          </style>
        </head>
        <body>
          <h1>Vehicle Trips Report</h1>
          <p><strong>Total Trips:</strong> ${trips.length}</p>
          <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Vehicle</th>
                <th>Start Address</th>
                <th>End Address</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Duration</th>
                <th>Distance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${trips.map(trip => `
                <tr>
                  <td>${trip.id}</td>
                  <td>${trip.vehicle}</td>
                  <td>${trip.startAddress}</td>
                  <td>${trip.endAddress}</td>
                  <td>${formatDate(trip.startDate)}</td>
                  <td>${formatDate(trip.endDate)}</td>
                  <td>${trip.duration}</td>
                  <td>${trip.distance}</td>
                  <td class="status-${trip.status}">${trip.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    return htmlContent;
  };

  const getTripsForExport = () => {
    return trips.filter(trip => {
      const matchesSearch = trip.startAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trip.endAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trip.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVehicle = selectedVehicle === 'all' || trip.vehicle === selectedVehicle;

      // Date range filtering
      let matchesDateRange = true;
      if (startDate || endDate) {
        const tripDate = new Date(trip.startDate);
        if (startDate && tripDate < startDate) {
          matchesDateRange = false;
        }
        if (endDate && tripDate > endDate) {
          matchesDateRange = false;
        }
      }

      return matchesSearch && matchesVehicle && matchesDateRange;
    });
  };

  const exportToCSV = async () => {
    try {
      const tripsForExport = getTripsForExport();
      const csvContent = generateCSV(tripsForExport);

      // For now, we'll show the CSV content in an alert
      // In a real app, you would use a file sharing library or cloud storage
      Alert.alert(
        'CSV Export',
        'CSV content generated successfully!\n\n' + csvContent.substring(0, 500) + (csvContent.length > 500 ? '\n\n... (truncated)' : ''),
        [
          { text: 'Copy to Clipboard', onPress: () => {
            // In a real app, you would copy to clipboard
            Alert.alert('Info', 'Copy functionality would be implemented here');
          }},
          { text: 'OK' }
        ]
      );
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export CSV file. Please try again.');
      console.error('CSV Export Error:', error);
    }
  };

  const exportToPDF = async () => {
    try {
      const tripsForExport = getTripsForExport();
      const htmlContent = generatePDFContent(tripsForExport);

      Alert.alert(
        'PDF Export',
        'HTML content generated successfully! You can copy this content and save it as an HTML file, then open it in a browser to print or save as PDF.\n\n' + htmlContent.substring(0, 300) + (htmlContent.length > 300 ? '\n\n... (truncated)' : ''),
        [
          { text: 'Copy HTML', onPress: () => {
            Alert.alert('Info', 'Copy functionality would be implemented here');
          }},
          { text: 'OK' }
        ]
      );
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export PDF file. Please try again.');
      console.error('PDF Export Error:', error);
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.startAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.endAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVehicle = selectedVehicle === 'all' || trip.vehicle === selectedVehicle;

    // Date range filtering
    let matchesDateRange = true;
    if (startDate || endDate) {
      const tripDate = new Date(trip.startDate);
      if (startDate && tripDate < startDate) {
        matchesDateRange = false;
      }
      if (endDate && tripDate > endDate) {
        matchesDateRange = false;
      }
    }

    return matchesSearch && matchesVehicle && matchesDateRange;
  });

  const renderTripCard = (trip: Trip) => (
    <TouchableOpacity
      key={trip.id}
      className="bg-white rounded-lg p-4 m-2 shadow-md"
      onPress={() => setSelectedTrip(trip)}
    >
      {/* Header with date and status */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-sm text-gray-500 font-medium">
          {formatDate(trip.startDate)}
        </Text>
        <View className={`px-3 py-1 rounded-full ${getStatusColor(trip.status)}`}>
          <View className="flex-row items-center">
            <Ionicons name={getStatusIcon(trip.status) as any} size={16} />
            <Text className="ml-1 text-sm font-semibold capitalize">{trip.status}</Text>
          </View>
        </View>
      </View>

      {/* Vehicle info */}
      <View className="flex-row items-center mb-3">
        <Ionicons name="car" size={20} color="#3b82f6" />
        <Text className="text-lg font-bold ml-2">{trip.vehicle}</Text>
      </View>

      {/* Trip details */}
      <View className="mb-3">
        <View className="flex-row items-start mb-2">
          <Ionicons name="location" size={16} color="#10b981" />
          <View className="ml-2 flex-1">
            <Text className="text-sm text-gray-600">From:</Text>
            <Text className="text-gray-900 font-medium" numberOfLines={2}>
              {trip.startAddress}
            </Text>
          </View>
        </View>

        <View className="flex-row items-start mb-2">
          <Ionicons name="location" size={16} color="#ef4444" />
          <View className="ml-2 flex-1">
            <Text className="text-sm text-gray-600">To:</Text>
            <Text className="text-gray-900 font-medium" numberOfLines={2}>
              {trip.endAddress}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          <View className="flex-row items-center">
            <Ionicons name="time" size={16} color="#6b7280" />
            <Text className="text-gray-600 ml-1">{trip.duration}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="navigate" size={16} color="#6b7280" />
            <Text className="text-gray-600 ml-1">{trip.distance}</Text>
          </View>
        </View>
      </View>

      {/* Tap to view map indicator */}
      <View className="flex-row items-center justify-center pt-2 border-t border-gray-100">
        <Ionicons name="map" size={16} color="#3b82f6" />
        <Text className="text-blue-600 ml-1 text-sm">Tap to view on map</Text>
      </View>
    </TouchableOpacity>
  );

  const renderVehicleFilter = () => (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        style={{ maxHeight: 60 }}
      >
        {vehicles.map((vehicle) => (
          <TouchableOpacity
            key={vehicle}
            className={`px-4 py-2 rounded-lg mr-2 min-w-0 ${
              selectedVehicle === vehicle
                ? 'bg-blue-600'
                : 'bg-gray-200'
            }`}
            onPress={() => setSelectedVehicle(vehicle)}
            style={{ flexShrink: 1 }}
          >
            <Text className={`font-medium text-center ${
              selectedVehicle === vehicle
                ? 'text-white'
                : 'text-gray-700'
            }`} numberOfLines={1}>
              {vehicle === 'all' ? 'All Vehicles' : vehicle}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
     

      {/* Search Bar */}
      <View className="flex-row items-center bg-white mx-4 mt-4 rounded-full px-4 py-2 border border-gray-300">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search trips by address or vehicle..."
          className="flex-1 ml-2"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Vehicle Filter */}
      {renderVehicleFilter()}

      {/* Date Range Filter */}
      <View className="mx-4 mb-4">
        <TouchableOpacity
          onPress={() => openDatePicker('start')}
          className="bg-white rounded-lg p-3 border border-gray-300 flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <Ionicons name="calendar" size={20} color="#3b82f6" />
            <Text className="ml-2 text-gray-700">{getDateRangeText()}</Text>
          </View>
          {(startDate || endDate) && (
            <TouchableOpacity onPress={clearDateRange} className="p-1">
              <Ionicons name="close-circle" size={20} color="#ef4444" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-5">
            <View className="bg-white rounded-lg m-4 w-11/12 max-w-md max-h-96">
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <Text className="text-lg font-bold">
                  Select {datePickerMode === 'start' ? 'Start' : 'End'} Date
                </Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <SimpleCalendar
                selectedDate={calendarSelectedDate}
                onDateSelect={handleCalendarDateSelect}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Trip List */}
      {filteredTrips.length > 0 ? (
        <FlatList
          data={filteredTrips}
          renderItem={({ item }) => renderTripCard(item)}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center py-10">
          <Ionicons name="search" size={48} color="#9ca3af" />
          <Text className="text-gray-500 text-lg mt-4">No trips found</Text>
          <Text className="text-gray-400 text-center mt-2">
            Try adjusting your search terms or vehicle filter
          </Text>
        </View>
      )}

      {/* Trip Map Modal */}
      {selectedTrip && (
        <TripMapModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
    </SafeAreaView>
  );
}

// Trip Map Modal Component
interface TripMapModalProps {
  trip: Trip;
  onClose: () => void;
}

function TripMapModal({ trip, onClose }: TripMapModalProps) {
  return (
    <View className="absolute inset-0 bg-black bg-opacity-5 justify-center items-center z-50">
      <View className="bg-white rounded-lg w-11/12 h-4/5 p-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold">Trip Route</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

    
        <View className="flex-1">
          <TripMap trip={trip} />
        </View>

        <View className="mt-4">
          <Text className="font-semibold text-gray-900">{trip.vehicle}</Text>
          <Text className="text-gray-600">{trip.distance} • {trip.duration}</Text>
        </View>
      </View>
    </View>
  );
}
