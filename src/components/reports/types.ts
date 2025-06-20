export type VerificationStatus =
  | "verified"
  | "pending_verification"

export type ReportStatus =
  | "pending"
  | "in_provision"
  | "fixed"
  | "rejected"

export interface Location {
  latitude: number
  longitude: number
  address: string
}

export interface ReportItem {
  id: string
  imageUrl: string
  location: Location
  dateCreated: Date
  verification: VerificationStatus
  status: ReportStatus
  description?: string
  name: string
  type?: string
  username?: string
}
