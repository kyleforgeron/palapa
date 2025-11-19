"use client";
import { useContext } from "react";
import { AppContext, AppContextType } from "../contexts/appContext";
import Button from "./button";
import ResponseMessage from "./responseMessage";
import PalapaList from "./palapaList";
import clsx from "clsx";

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
    success,
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
      <div className="flex flex-col gap-4 lg:gap-8 w-full items-start">
        {/*!!selectedPalapa &&
        !!anonymousId &&
        !!bookItemResponse &&
        !!checkCartResponse &&
        !!checkFieldsResponse ? (
          <Button variant="bookFromCart" />
        )*/}
        {loading === 2 &&
          (!selectedPalapa ? (
            <div className="flex flex-col items-start gap-4">
              <Button variant="getItems" />
              <PalapaList />
            </div>
          ) : (
            !!selectedPalapa && (
              <div className="flex flex-col items-start gap-4">
                <Button variant="bookItem" />
                {/*<ResponseMessage variant="bookItem" />*/}
              </div>
            )
          ))}
        {loading === 1 && <p className="text-lg">Loading...</p>}
        {!!bookItemResponse && <p className="text-lg">{bookItemResponse}</p>}
        {!!bookFromCartResponse && (
          <p
            className={clsx("font-semibold text-lg", {
              "text-green-700": success,
              "text-red-700": !success,
            })}
          >
            {bookFromCartResponse}
          </p>
        )}
      </div>
      {!!selectedPalapa && (
        <button
          onClick={onClear}
          className="mt-2 bg-white text-blue-800 hover:bg-blue-800 hover:text-white border border-blue-800 flex items-center font-semibold px-5 h-[50px] rounded-lg"
        >
          Select a Different Palapa
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
