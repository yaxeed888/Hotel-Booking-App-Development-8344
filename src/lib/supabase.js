import { createClient } from '@supabase/supabase-js';

// Demo configuration - replace with your actual Supabase credentials
const supabaseUrl = 'https://demo.supabase.co';
const supabaseAnonKey = 'demo-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock data for demo purposes
export const mockProperties = [
  {
    id: 1,
    name: "Grand Palace Hotel",
    city: "New York",
    country: "USA",
    address: "123 Broadway, New York, NY",
    type: "hotel",
    description: "Luxury hotel in the heart of Manhattan with stunning city views and world-class amenities.",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800"
    ],
    amenities: ["WiFi", "Pool", "Gym", "Restaurant", "Room Service", "Parking"],
    avgRating: 4.5,
    reviewCount: 1247,
    minPrice: 299,
    rooms: [
      {
        id: 1,
        name: "Deluxe Room",
        price_per_night: 299,
        max_guests: 2,
        amenities: ["WiFi", "TV", "Air Conditioning", "Mini Bar"]
      },
      {
        id: 2,
        name: "Executive Suite",
        price_per_night: 499,
        max_guests: 4,
        amenities: ["WiFi", "TV", "Air Conditioning", "Mini Bar", "Living Area", "City View"]
      }
    ],
    reviews: [
      {
        id: 1,
        user_name: "John Doe",
        rating: 5,
        comment: "Excellent service and beautiful rooms!",
        created_at: "2024-01-15"
      }
    ]
  },
  {
    id: 2,
    name: "Seaside Resort",
    city: "Miami",
    country: "USA",
    address: "456 Ocean Drive, Miami, FL",
    type: "resort",
    description: "Beachfront resort with private beach access and tropical paradise vibes.",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800"
    ],
    amenities: ["WiFi", "Beach Access", "Pool", "Spa", "Restaurant", "Bar"],
    avgRating: 4.7,
    reviewCount: 892,
    minPrice: 189,
    rooms: [
      {
        id: 3,
        name: "Ocean View Room",
        price_per_night: 189,
        max_guests: 2,
        amenities: ["WiFi", "TV", "Ocean View", "Balcony"]
      },
      {
        id: 4,
        name: "Beach Villa",
        price_per_night: 399,
        max_guests: 6,
        amenities: ["WiFi", "TV", "Private Beach", "Kitchen", "Living Area"]
      }
    ],
    reviews: [
      {
        id: 2,
        user_name: "Sarah Smith",
        rating: 5,
        comment: "Perfect beach vacation spot!",
        created_at: "2024-01-10"
      }
    ]
  },
  {
    id: 3,
    name: "Mountain Lodge",
    city: "Aspen",
    country: "USA",
    address: "789 Mountain View Rd, Aspen, CO",
    type: "lodge",
    description: "Cozy mountain lodge perfect for skiing and outdoor adventures.",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
    ],
    amenities: ["WiFi", "Fireplace", "Ski Storage", "Restaurant", "Hot Tub"],
    avgRating: 4.3,
    reviewCount: 456,
    minPrice: 159,
    rooms: [
      {
        id: 5,
        name: "Standard Room",
        price_per_night: 159,
        max_guests: 2,
        amenities: ["WiFi", "Fireplace", "Mountain View"]
      },
      {
        id: 6,
        name: "Family Cabin",
        price_per_night: 259,
        max_guests: 4,
        amenities: ["WiFi", "Fireplace", "Kitchen", "Living Area"]
      }
    ],
    reviews: [
      {
        id: 3,
        user_name: "Mike Johnson",
        rating: 4,
        comment: "Great location for skiing!",
        created_at: "2024-01-05"
      }
    ]
  }
];