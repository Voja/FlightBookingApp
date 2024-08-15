import { api } from "@/services/api";
import { City, FlightType, ReservationType } from "./types";

import { TOKEN_KEY } from "./constants";
import { decodeToken } from "react-jwt";

export const getFlights = async (
  DepartureCityId: number,
  DestinationCityId: number,
  NoStops: boolean
): Promise<FlightType[]> => {
  const queryParams = new URLSearchParams({
    DepartureCityId: DepartureCityId.toString(),
    DestinationCityId: DestinationCityId.toString(),
    NoStops: NoStops.toString(),
  });

  const res = await api({
    endpoint: `api/Flight/flights?${queryParams.toString()}`,
  });

  return res.data;
};

export const getCities = async (): Promise<City[]> => {
  const res = await api({ endpoint: "api/City" });
  return res.data;
};

export const login = async (
  email: string,
  password: string
): Promise<{ token: string }> => {
  try {
    console.log("Sending login request:", { email, password });

    const res = await api({
      endpoint: "api/Token",
      config: {
        method: "POST",
        data: {
          email,
          password,
        },
      },
    });

    console.log("Login response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const makeReservation = async ({
  flightId,
  numberOfSeats,
}: ReservationType): Promise<any> => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("User is not authenticated");
  }

  console.log(`${token}`);
  const decodedToken = decodeToken(token);
  console.log("Decoded token:", decodedToken);

  const res = await api({
    endpoint: "api/Reservation",
    config: {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: {
        flightId,
        numberOfSeats,
      },
    },
  });

  return res.data;
};

export const logoutRequest = async (): Promise<void> => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("User is not authenticated");
  }

  await api({
    endpoint: "api/Token",
    config: {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  });
};

export const getReservationsForUser = async (): Promise<any> => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await api({
    endpoint: "api/Reservation",
    config: {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  });

  return res.data;
};

export const getAllReservations = async (): Promise<any> => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await api({
    endpoint: "api/Reservation/all",
    config: {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  });

  return res.data;
};

export const deleteReservation = async (id: string): Promise<any> => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await api({
    endpoint: `api/Reservation/${id}`,
    config: {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  });

  return res.data;
};

export const getAllFlights = async (): Promise<any> => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await api({
    endpoint: "api/Flight",
    config: {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  });

  return res.data;
};

export const addFlight = async (
  departureCityId: string,
  destinationCityId: string,
  departureDateTime: string,
  arrivalDateTime: string,
  numberOfSeats: number,
  numberOfStops: number
): Promise<any> => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await api({
    endpoint: "api/Flight",
    config: {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        departureCityId,
        destinationCityId,
        departureDateTime,
        arrivalDateTime,
        numberOfSeats,
        numberOfStops,
      },
    },
  });

  return res.data;
};

export const approveReservation = async (id: string): Promise<any> => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await api({
    endpoint: `api/Reservation/approve/${id}`,
    config: {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  });

  return res.data;
};

export const rejectReservation = async (id: string): Promise<any> => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await api({
    endpoint: `api/Reservation/reject/${id}`,
    config: {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  });

  return res.data;
};

export const getRoles = async (): Promise<any> => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await api({
    endpoint: "api/Role",
    config: {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  });

  return res.data;
};

export const addNewUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  roleId: number
): Promise<any> => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await api({
    endpoint: "api/User",
    config: {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        firstName,
        lastName,
        email,
        password,
        roleId,
      },
    },
  });

  return res;
};

export const cancelFlight = async (id: string): Promise<any> => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await api({
    endpoint: `api/Flight/reject/${id}`,
    config: {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  });

  return res.data;
};

export const addFlightWrapper = async (flightDetails: {
  departureCityId: string;
  destinationCityId: string;
  departureDateTime: string;
  arrivalDateTime: string;
  numberOfSeats: number;
  numberOfStops: number;
}): Promise<any> => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await api({
    endpoint: "api/Flight",
    config: {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        departureCityId: flightDetails.departureCityId,
        destinationCityId: flightDetails.destinationCityId,
        departureDateTime: flightDetails.departureDateTime,
        arrivalDateTime: flightDetails.arrivalDateTime,
        numberOfSeats: flightDetails.numberOfSeats,
        numberOfStops: flightDetails.numberOfStops,
      },
    },
  });

  return res.data;
};

export const approveFlight = async (id: string): Promise<any> => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await api({
    endpoint: `api/Flight/approve/${id}`,
    config: {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  });

  return res.data;
};
