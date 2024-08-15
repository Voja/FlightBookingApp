// Define types for the flight data
export type FlightType = {
  id: string;
  departureCity: string;
  destinationCity: string;
  date: string; // Use 'yyyy-MM-dd' format for consistency with MySQL
  numberOfPassengers: number;
  isDirectFlight: boolean;
};

export type Flight = {
  id?: number;
  arrivalDateTime?: string;
  departureCity?: string;
  departureCityId?: number;
  departureDateTime?: string;
  destinationCity?: string;
  destinationCityId?: number;
  numberOfAvailableSpots?: number;
  numberOfSeats?: number;
  numberOfStops?: number;
  status?: string;
};

export type City = {
  id: string;
  name: string;
};

export type ReservationType = {
  flightId: number;
  numberOfSeats: number;
};

export type Reservation = {
  id: number;
  departureCity: string;
  destinationCity: string;
  departureDateTime: string;
  destinationDateTime: string;
  fullName: string;
  numberOfSeats: number;
  status: string;
};

export type Roles = {
  id: number;
  name: string;
};
