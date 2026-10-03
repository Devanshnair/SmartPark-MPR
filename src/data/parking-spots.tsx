export interface ParkingUser {
  id: number;
  name: string;
  phone: string | null;
  email: string;
  parking_name: string;
  address: string;
  hourlyRate: number;
  openingHours: string;
  dailyRate: number;
  monthlyRate: number;
  rating: number;
  image_url: string;
  availableTypes: string;
}

export interface ParkingSpot {
  id: number;
  latitude: number;
  longitude: number;
  available_slots: number;
  distance: number;
  parking_user: ParkingUser;
}

export const PARKING_SPOTS: ParkingSpot[] = [
  {
    id: 1,
    latitude: 19.0760,
    longitude: 72.8777,
    available_slots: 92,
    distance: 2.5,
    parking_user: {
      id: 1,
      name: "John Doe",
      phone: "9876543210",
      email: "john@example.com",
      parking_name: "Trios Fashion Mall Parking",
      address: "Hill Road, Bandra West, Mumbai, Maharashtra 400050",
      hourlyRate: 50,
      openingHours: "24/7",
      dailyRate: 500,
      monthlyRate: 5000,
      rating: 4.2,
      image_url: "/Parkingspots/1A.png",
      availableTypes: "Compact,SUV,Bike"
    }
  },
  {
    id: 2,
    latitude: 19.0286635,
    longitude: 72.8407931,
    available_slots: 85,
    distance: 4.0,
    parking_user: {
      id: 3,
      name: "Ravi Deshmukh",
      phone: "9876543210",
      email: "ravi.deshmukh@example.com",
      parking_name: "Shivaji Park Public Parking",
      address: "140, Dr Madhukar B Raut Marg, Shivaji Park, Dadar West, Mumbai, Maharashtra 400028",
      hourlyRate: 50,
      openingHours: "6 AM - 11 PM",
      dailyRate: 500,
      monthlyRate: 5000,
      rating: 4.0,
      image_url: "/Parkingspots/1B.png",
      availableTypes: "Compact,SUV"
    }
  },
  {
    id: 3,
    latitude: 19.0800,
    longitude: 72.8500,
    available_slots: 89,
    distance: 4.5,
    parking_user: {
      id: 3,
      name: "Alice Johnson",
      phone: "9876543212",
      email: "alice@example.com",
      parking_name: "Indiabulls Finance Center Parking",
      address: "Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013",
      hourlyRate: 70,
      openingHours: "24/7",
      dailyRate: 700,
      monthlyRate: 7000,
      rating: 4.3,
      image_url: "/Parkingspots/1C.png",
      availableTypes: "Compact,Bike"
    }
  }
];
