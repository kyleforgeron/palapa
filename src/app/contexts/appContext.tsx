"use client";
import React, { useEffect, useState } from "react";
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

export type Booking = {
  id: number;
  advanced_booking_time: string;
  palapatype_name: string;
  palapa_name: string;
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
  success: boolean;
  setSuccess: (arg0: boolean) => void;
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
  const [success, setSuccess] = useState(false);
  const [palapaIdMap, setPalapaIdMap] = useState<PalapaId>({});
  useEffect(() => {
    const getPalapas = async () => {
      try {
        fetch("/api/-1-get-palapas", { method: "POST" }).then((res) =>
          res.json().then((data) => {
            console.log(data);
            const palapaIds: PalapaId = {};
            data.bookings.forEach((b: Booking) => {
              if (
                b.advanced_booking_time === "17:30" &&
                b.palapatype_name.includes("Next day reservation") &&
                ["1", "2", "3"].includes(b.palapa_name[0]) &&
                ["6", "7", "8"].includes(b.palapa_name[2])
              ) {
                palapaIds[b.palapa_name] = b.id.toString();
              }
            });
            console.log(palapaIds);
            setPalapaIdMap(palapaIds);
          })
        );
      } catch {
        (error: Error) => console.log(error);
      }
    };
    if (loading === 2) getPalapas();
  }, [loading]);
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
        success,
        setSuccess,
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
