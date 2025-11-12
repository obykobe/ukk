export interface BoardingHouse {
  id: number
  name: string
  price: number
  location: string
  image: string
  facilities: string[]
  rating: number
  reviews: number
  description: string
  gender: "male" | "female" | "mixed"
  available: boolean
}

export const mockBoardingHouses: BoardingHouse[] = [
  {
    id: 1,
    name: "Kos Melati Jakarta Pusat",
    price: 800,
    location: "Jakarta Pusat",
    image: "/modern-boarding-house.jpg",
    facilities: ["WiFi", "AC", "Shared Kitchen", "Laundry"],
    rating: 4.5,
    reviews: 23,
    description: "Modern boarding house with complete facilities in the heart of Jakarta",
    gender: "mixed",
    available: true,
  },
  {
    id: 2,
    name: "Kos Mawar Bandung",
    price: 600,
    location: "Bandung",
    image: "/cozy-boarding-house.jpg",
    facilities: ["WiFi", "Parking", "Security 24/7", "Near Campus"],
    rating: 4.2,
    reviews: 18,
    description: "Cozy and affordable boarding house near ITB campus",
    gender: "female",
    available: true,
  },
  {
    id: 3,
    name: "Kos Anggrek Surabaya",
    price: 750,
    location: "Surabaya",
    image: "/affordable-boarding-house.jpg",
    facilities: ["AC", "WiFi", "Shared Kitchen", "Gym Access"],
    rating: 4.7,
    reviews: 31,
    description: "Premium boarding house with gym access and modern amenities",
    gender: "male",
    available: true,
  },
  {
    id: 4,
    name: "Kos Dahlia Yogyakarta",
    price: 500,
    location: "Yogyakarta",
    image: "/modern-boarding-house.jpg",
    facilities: ["WiFi", "Shared Kitchen", "Near Mall", "Parking"],
    rating: 4.0,
    reviews: 15,
    description: "Budget-friendly boarding house near Malioboro Street",
    gender: "mixed",
    available: false,
  },
  {
    id: 5,
    name: "Kos Tulip Jakarta Selatan",
    price: 1200,
    location: "Jakarta Selatan",
    image: "/cozy-boarding-house.jpg",
    facilities: ["AC", "WiFi", "Private Bathroom", "Parking", "Security"],
    rating: 4.8,
    reviews: 42,
    description: "Luxury boarding house with private bathroom in South Jakarta",
    gender: "mixed",
    available: true,
  },
  {
    id: 6,
    name: "Kos Kenanga Bandung",
    price: 450,
    location: "Bandung",
    image: "/affordable-boarding-house.jpg",
    facilities: ["WiFi", "Shared Kitchen", "Near Campus"],
    rating: 3.8,
    reviews: 12,
    description: "Simple and clean boarding house perfect for students",
    gender: "male",
    available: true,
  },
]
