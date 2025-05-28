export type VerificationStatus =
  | "verified"
  | "verified_by_ml"
  | "waiting_ml_verification"
  | "waiting_human_verification"
  | "rejected"

export type ReportStatus = "verified" | "in_provision" | "fixed"

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
}
