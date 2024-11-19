"use client";
import React, { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";

export type PalapaListing = {
  active: number;
  hotel_id: string;
  id: number;
  long_name: string;
  multi_booking: boolean;
  name: string;
  order_idx: number;
  palapatypeActive: boolean;
  palapatype_availableName: string;
  palapatype_id: number;
  palapatype_name: string;
  short_name: null;
};

export type UserInfo = {
  roomNumber: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: number;
};

export interface AppContextType {
  anonymousId: string;
  setAnonymousId: (arg0: string) => void;
  palapas: PalapaListing[];
  setPalapas: (arg0: PalapaListing[]) => void;
  palapaIdMap: {
    [key: string]: string;
  };
  selectedPalapa: PalapaListing | null;
  setSelectedPalapa: (arg0: PalapaListing | null) => void;
  bookItemResponse: string | null;
  setBookItemResponse: (arg0: string | null) => void;
  checkCartResponse: string | null;
  setCheckCartResponse: (arg0: string | null) => void;
  checkFieldsResponse: string | null;
  setCheckFieldsResponse: (arg0: string | null) => void;
  bookFromCartResponse: string | null;
  setBookFromCartResponse: (arg0: string | null) => void;
  isSubmitted: boolean;
  handleSubmit: UseFormHandleSubmit<UserInfo, undefined>;
  errors: FieldErrors<UserInfo>;
  register: UseFormRegister<UserInfo>;
  watch: UseFormWatch<UserInfo>;
}

export const AppContext = React.createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [anonymousId, setAnonymousId] = useState<string>("");
  const [palapas, setPalapas] = useState<PalapaListing[]>([]);
  const [selectedPalapa, setSelectedPalapa] = useState<PalapaListing | null>(
    null
  );
  const [bookItemResponse, setBookItemResponse] = useState<string | null>("");
  const [checkCartResponse, setCheckCartResponse] = useState<string | null>("");
  const [checkFieldsResponse, setCheckFieldsResponse] = useState<string | null>(
    ""
  );
  const [bookFromCartResponse, setBookFromCartResponse] = useState<
    string | null
  >("");
  const palapaIdMap = {
    "108": "30125",
    "208": "62975",
    "308": "95825",
    "942": "497324",
    "944": "548425",
  };
  const {
    handleSubmit,
    formState: { errors, isSubmitted },
    register,
    watch,
  } = useForm<UserInfo>();

  return (
    <AppContext.Provider
      value={{
        anonymousId,
        setAnonymousId,
        palapas,
        palapaIdMap,
        setPalapas,
        selectedPalapa,
        setSelectedPalapa,
        bookItemResponse,
        setBookItemResponse,
        checkCartResponse,
        setCheckCartResponse,
        checkFieldsResponse,
        setCheckFieldsResponse,
        bookFromCartResponse,
        setBookFromCartResponse,
        isSubmitted,
        handleSubmit,
        errors,
        register,
        watch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
