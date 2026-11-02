export interface TravelRequest {
  query: string;
  thread_id?: string;
}

export interface TravelResponse {
  thread_id: string;
  answer: string;
  flight_results?: string;
  hotel_results?: string;
  itinerary?: string;
  llm_calls?: number;
  isDemo?: boolean;
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  destination?: string;
  activities?: string;
  transport?: string;
  accommodation?: string;
  rawText: string;
  content?: string;
}

export interface BudgetBreakdown {
  headers: string[];
  rows: string[][];
  preNotes?: string;
  postNotes?: string;
  totalCost?: string;
}

export interface TripSummaryData {
  destination?: string;
  origin?: string;
  duration?: string;
  travelers?: string;
  budget?: string;
  style?: string;
  otherText?: string;
  raw: string;
}

export interface ParsedTravelPlan {
  summary: TripSummaryData;
  flightInfo: string;
  hotelSuggestions: string;
  days: DayItinerary[];
  budget: BudgetBreakdown;
  recommendations: string[];
  rawAnswer: string;
}
