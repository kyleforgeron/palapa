"use client";
import { useCallback, useContext } from "react";
import { AppContext, AppContextType } from "../contexts/appContext";

const ResponseMessage = ({ variant }: { variant: string }) => {
  const {
    selectedPalapa,
    bookItemResponse,
    checkCartResponse,
    checkFieldsResponse,
    bookFromCartResponse,
  } = useContext(AppContext) as AppContextType;
  const message = useCallback(() => {
    switch (variant) {
      case "bookItem":
        if (bookItemResponse) {
          if (!!checkCartResponse && !!checkFieldsResponse) {
            return bookItemResponse;
          } else {
            return `There was an error adding palapa ${selectedPalapa?.name} to your cart. Please try again or come back later.`;
          }
        }
      case "bookFromCart":
        return bookFromCartResponse;
    }
  }, [
    bookItemResponse,
    checkCartResponse,
    checkFieldsResponse,
    bookFromCartResponse,
    selectedPalapa,
    variant,
  ]);
  return <div className="flex w-full">{message()}</div>;
};

export default ResponseMessage;
