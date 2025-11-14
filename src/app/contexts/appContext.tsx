"use client";
import React, { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import * as Palapas from "./palapas.json";
import type {
  FieldErrors,
  UseFormClearErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormResetField,
  UseFormSetValue,
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

export type PalapaId = {
  [k: string]: string;
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
  loading: number;
  setLoading: (arg0: number) => void;
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
  clearErrors: UseFormClearErrors<UserInfo>;
  register: UseFormRegister<UserInfo>;
  reset: UseFormReset<UserInfo>;
  resetField: UseFormResetField<UserInfo>;
  setValue: UseFormSetValue<UserInfo>;
  watch: UseFormWatch<UserInfo>;
}

export const AppContext = React.createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(0);
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
  const palapaIdMap: PalapaId = {};
  Palapas.bookings.forEach(
    (b) => (palapaIdMap[b.palapa_name] = b.id.toString())
  );
  console.log(palapaIdMap);
  const {
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitted },
    register,
    reset,
    resetField,
    setValue,
    watch,
  } = useForm<UserInfo>();

  return (
    <AppContext.Provider
      value={{
        anonymousId,
        setAnonymousId,
        loading,
        setLoading,
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
        clearErrors,
        register,
        reset,
        resetField,
        setValue,
        watch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
