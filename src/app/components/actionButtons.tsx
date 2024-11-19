"use client";
import { useContext } from "react";
import { AppContext, AppContextType } from "../contexts/appContext";
import Button from "./button";
import ResponseMessage from "./responseMessage";
import PalapaList from "./palapaList";

const ActionButtons = () => {
  const {
    isSubmitted,
    errors,
    selectedPalapa,
    bookItemResponse,
    checkCartResponse,
    checkFieldsResponse,
  } = useContext(AppContext) as AppContextType;
  const submitted = isSubmitted && !Object.keys(errors)?.length;
  return (
    <div className="w-full flex flex-col items-start gap-y-4">
      {submitted && (
        <span className="mb-8 lg:mb-16">
          Thank you for providing your information. We can now proceed with the
          palapa booking.
        </span>
      )}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-x-8 w-full items-start">
        {submitted && (
          <div className="flex flex-col items-start gap-4">
            <Button variant="getItems" />
            <PalapaList />
          </div>
        )}
        {submitted && !!selectedPalapa && (
          <div className="flex flex-col items-start gap-4">
            <Button variant="bookItem" />
            <span>Selected Palapa: {selectedPalapa?.name}</span>
            <ResponseMessage variant="bookItem" />
          </div>
        )}
        {submitted &&
          !!selectedPalapa &&
          !!bookItemResponse &&
          !!checkCartResponse &&
          !!checkFieldsResponse && <Button variant="bookFromCart" />}
      </div>
    </div>
  );
};

export default ActionButtons;
