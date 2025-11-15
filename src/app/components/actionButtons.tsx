"use client";
import { useContext } from "react";
import { AppContext, AppContextType } from "../contexts/appContext";
import Button from "./button";
import ResponseMessage from "./responseMessage";
import PalapaList from "./palapaList";

const ActionButtons = () => {
  const {
    anonymousId,
    loading,
    isSubmitted,
    errors,
    selectedPalapa,
    setSelectedPalapa,
    bookItemResponse,
    setBookItemResponse,
    bookFromCartResponse,
    setBookFromCartResponse,
    checkCartResponse,
    setCheckCartResponse,
    checkFieldsResponse,
    setCheckFieldsResponse,
  } = useContext(AppContext) as AppContextType;
  const submitted = isSubmitted && !Object.keys(errors)?.length;
  console.log("isSubmitted", isSubmitted, "errors", errors);
  const onClear = () => {
    setSelectedPalapa(null);
    setBookItemResponse("");
    setCheckCartResponse("");
    setCheckFieldsResponse("");
    setBookFromCartResponse("");
  };
  if (!submitted) return null;
  return (
    <div className="w-full flex flex-col items-start gap-y-4">
      <span className="mb-8 lg:mb-16">
        Thank you for providing your information. We can now proceed with the
        palapa booking.
        <button
          onClick={onClear}
          className="mt-8 bg-white text-blue-800 hover:bg-blue-800 hover:text-white border border-blue-800 flex items-center font-semibold px-5 h-[50px] rounded-lg"
        >
          Start Over
        </button>
      </span>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-x-8 w-full items-start">
        {!!selectedPalapa &&
        !!anonymousId &&
        !!bookItemResponse &&
        !!checkCartResponse &&
        !!checkFieldsResponse ? (
          <Button variant="bookFromCart" />
        ) : !!selectedPalapa ? (
          <div className="flex flex-col items-start gap-4">
            <Button variant="bookItem" />
            <span>Selected Palapa: {selectedPalapa?.name}</span>
            <ResponseMessage variant="bookItem" />
          </div>
        ) : (
          loading === 2 && (
            <div className="flex flex-col items-start gap-4">
              <Button variant="getItems" />
              <PalapaList />
            </div>
          )
        )}
        {loading === 1 && <p className="text-lg">Loading...</p>}
        {!!bookItemResponse && <p className="text-lg">{bookItemResponse}</p>}
        {!!checkCartResponse && <p className="text-lg">{checkCartResponse}</p>}
        {!!checkFieldsResponse && (
          <p className="text-lg">{checkFieldsResponse}</p>
        )}
        {!!bookFromCartResponse && (
          <p className="text-lg">{bookFromCartResponse}</p>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
