import type { ReportItem } from "./types"

// Fixed coordinates for each report
const coordinates = [
  { latitude: 40.7128, longitude: -74.0060 },
  { latitude: 40.7217, longitude: -73.9872 },
  { latitude: 40.7027, longitude: -74.0171 },
  { latitude: 40.7282, longitude: -73.7949 },
  { latitude: 40.7589, longitude: -73.9851 },
  { latitude: 40.7829, longitude: -73.9654 },
  { latitude: 40.7282, longitude: -73.7949 },
  { latitude: 40.7589, longitude: -73.9851 },
  { latitude: 40.7829, longitude: -73.9654 },
  { latitude: 40.7128, longitude: -74.0060 },
]

// Fixed dates for each report
const dates = [
  new Date('2024-03-01'),
  new Date('2024-03-02'),
  new Date('2024-03-03'),
  new Date('2024-03-04'),
  new Date('2024-03-05'),
  new Date('2024-03-06'),
  new Date('2024-03-07'),
  new Date('2024-03-08'),
  new Date('2024-03-09'),
  new Date('2024-03-10'),
]

// Generate mock addresses
const mockAddresses = [
  "123 Main St, Springfield",
  "456 Oak Ave, Riverdale",
  "789 Pine Rd, Lakeside",
  "321 Maple Dr, Hillcrest",
  "654 Elm Blvd, Westview",
  "987 Cedar Ln, Eastwood",
  "741 Birch Ct, Northpoint",
  "852 Willow Way, Southside",
  "963 Spruce Path, Downtown",
  "159 Ash Circle, Uptown",
]

// Fixed verification statuses
const verificationStatuses = [
  "verified",
  "verified_by_ml",
  "waiting_ml_verification",
  "waiting_human_verification",
  "rejected",
  "verified",
  "verified_by_ml",
  "waiting_ml_verification",
  "waiting_human_verification",
  "rejected",
]

// Fixed report statuses
const reportStatuses = [
  "verified",
  "in_provision",
  "fixed",
  "verified",
  "in_provision",
  "fixed",
  "verified",
  "in_provision",
  "fixed",
  "verified",
]

// Fixed image URLs
const mockImageUrls = [
  "/placeholder.svg?height=400&width=400&text=Pothole",
  "/placeholder.svg?height=400&width=400&text=Damaged+Sign",
  "/placeholder.svg?height=400&width=400&text=Damaged+Sidewalk",
  "/placeholder.svg?height=400&width=400&text=Road+Debris",
  "/placeholder.svg?height=400&width=400&text=Broken+Light",
  "/placeholder.svg?height=400&width=400&text=Faded+Markings",
  "/placeholder.svg?height=400&width=400&text=Cracked+Pavement",
  "/placeholder.svg?height=400&width=400&text=Missing+Guardrail",
]

// Generate 50 mock reports with deterministic data
export const mockReports: ReportItem[] = Array.from({ length: 50 }, (_, i) => {
  const index = i % 10 // Use modulo to cycle through the fixed arrays
  return {
    id: `RPT-${(10000 + i).toString()}`,
    imageUrl: mockImageUrls[i % mockImageUrls.length],
    location: {
      latitude: coordinates[index].latitude,
      longitude: coordinates[index].longitude,
      address: mockAddresses[i % mockAddresses.length],
    },
    dateCreated: dates[index],
    verification: verificationStatuses[index] as any,
    status: reportStatuses[index] as any,
    description: `Report description ${i + 1}. This is a mock description for testing purposes.`,
  }
})
