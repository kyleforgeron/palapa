"use client";
import { useCallback, useContext } from "react";
import { AppContext, AppContextType } from "../contexts/appContext";

const Button = ({ variant }: { variant: string }) => {
  const {
    anonymousId,
    palapaIdMap,
    selectedPalapa,
    setAnonymousId,
    setPalapas,
    setBookItemResponse,
    setCheckCartResponse,
    setCheckFieldsResponse,
    setBookFromCartResponse,
    watch,
  } = useContext(AppContext) as AppContextType;
  const getSession = async () => {
    try {
      fetch("/api/0-get-session", { method: "POST" }).then((res) => {
        console.log(res);
        res.json().then((data) => {
          console.log(data);
          //setPalapas(data.palapas);
        });
      });
    } catch {
      (error: Error) => console.log(error);
    }
  };
  const getItems = async () => {
    try {
      fetch("/api/1-get-items", { method: "POST" }).then((res) =>
        res.json().then((data) => {
          setPalapas(data.palapas);
        })
      );
    } catch {
      (error: Error) => console.log(error);
    }
  };
  const bookItem = async () => {
    if (!selectedPalapa?.name) return;
    console.log("bookItem", palapaIdMap[selectedPalapa.name]);
    try {
      fetch("/api/2-book-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: palapaIdMap[selectedPalapa.name] }),
      }).then((res) =>
        res.json().then((data) => {
          console.log(data, data.booking, data.message, data.anonymous_id);
          setBookItemResponse(
            !!data.booking
              ? `${selectedPalapa.name} successfully added to cart.`
              : data.message
          );
          if (data.anonymous_id) setAnonymousId(data.anonymous_id);
        })
      );
    } catch {
      (error: Error) => console.log(error);
    }
    try {
      fetch("/api/3-check-cart", { method: "POST" }).then((res) =>
        res
          .json()
          .then((data) =>
            setCheckCartResponse(
              data.success === "ok" ? `Cart confirmed.` : data.message
            )
          )
      );
    } catch {
      (error: Error) => console.log(error);
    }
    try {
      fetch("/api/4-check-fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomNumber: watch("roomNumber") }),
      }).then((res) =>
        res
          .json()
          .then((data) =>
            setCheckFieldsResponse(
              data.success === "ok" ? `Fields confirmed.` : data.message
            )
          )
      );
    } catch {
      (error: Error) => console.log(error);
    }
  };
  /*
  const checkCart = async () => {
    if (!selectedPalapa?.name) return;
    
  };
  const checkFields = async () => {
    if (!selectedPalapa?.name) return;
    try {
      fetch("/api/3-check-fields", { method: "POST" }).then((res) =>
        res
          .json()
          .then((data) =>
            setCheckFieldsResponse(
              data.success === "ok" ? `Fields confirmed.` : data.message
            )
          )
      );
    } catch {
      (error: Error) => console.log(error);
    }
  };
  */
  const bookFromCart = useCallback(async () => {
    console.log("bookFromCart", watch("email"), anonymousId);
    if (!selectedPalapa?.name) return;
    try {
      fetch("/api/5-book-from-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymousId,
          email: watch("email"),
          lastName: watch("lastName"),
          firstName: watch("firstName"),
          roomNumber: watch("roomNumber").toString(),
          phone: watch("phone").toString(),
        }),
      }).then((res) =>
        res.json().then((data) => setBookFromCartResponse(JSON.stringify(data)))
      );
    } catch {
      (error: Error) => console.log(error);
    }
  }, [anonymousId, selectedPalapa, setBookFromCartResponse, watch]);
  switch (variant) {
    case "getSession":
      return (
        <button
          className="bg-blue-800 text-white border border-blue-800 hover:bg-white hover:text-blue-800 flex items-center font-semibold px-5 h-[50px] rounded-lg"
          onClick={getSession}
        >
          Begin Session
        </button>
      );
    case "getItems":
      return (
        <button
          className="bg-blue-800 text-white border border-blue-800 hover:bg-white hover:text-blue-800 flex items-center font-semibold px-5 h-[50px] rounded-lg"
          onClick={getItems}
        >
          See Available Palapas
        </button>
      );
    case "bookItem":
      return (
        <button
          className="bg-blue-800 text-white border border-blue-800 hover:bg-white hover:text-blue-800 flex items-center font-semibold px-5 h-[50px] rounded-lg"
          onClick={bookItem}
        >
          Add Palapa to Cart
        </button>
      );
    /*
    case "checkCart":
      return <button onClick={checkCart}>Check Cart Details</button>;
    case "checkFields":
      return (
        <button onClick={checkFields}>Double-Check Reservation Info</button>
      );
    */
    case "bookFromCart":
      return (
        <button
          className="bg-blue-800 text-white border border-blue-800 hover:bg-white hover:text-blue-800 flex items-center font-semibold px-5 h-[50px] rounded-lg"
          onClick={bookFromCart}
        >
          Book From Cart
        </button>
      );
    default:
      return;
  }
};

export default Button;
