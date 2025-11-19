"use client";
import { useCallback, useContext } from "react";
import { AppContext, AppContextType } from "../contexts/appContext";

const Button = ({ variant }: { variant: string }) => {
  const {
    anonymousId,
    bookFromCartResponse,
    palapaIdMap,
    selectedPalapa,
    setAnonymousId,
    setPalapas,
    setBookItemResponse,
    setCheckCartResponse,
    setCheckFieldsResponse,
    setBookFromCartResponse,
    success,
    setSuccess,
    watch,
  } = useContext(AppContext) as AppContextType;
  console.log(bookFromCartResponse);
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
  const postJSON = async <T = any,>(
    url: string,
    body?: unknown
  ): Promise<T> => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    // If upstream returns non-JSON errors, keep this resilient:
    const text = await res.text();
    if (!res.ok) {
      // Try to parse JSON error, otherwise throw text
      try {
        const json = JSON.parse(text);
        throw new Error(
          json?.message || json?.error || `Request failed: ${res.status}`
        );
      } catch {
        throw new Error(text || `Request failed: ${res.status}`);
      }
    }
    // Parse JSON if present, otherwise return empty object
    return text ? (JSON.parse(text) as T) : ({} as T);
  };

  const bookItem = useCallback(async () => {
    if (!selectedPalapa?.name) return;
    setSuccess(false);
    setBookItemResponse("");
    setCheckCartResponse("");
    setCheckFieldsResponse("");
    setBookFromCartResponse("");

    // Snapshot values so user edits mid-flight don’t change payloads
    const id = palapaIdMap[selectedPalapa.name];
    const email = watch("email");
    const firstName = watch("firstName");
    const lastName = watch("lastName");
    const roomNumber = String(watch("roomNumber") ?? "");
    const phone = String(watch("phone") ?? "");

    try {
      // STEP 2 — book-item
      const bookItemData = await postJSON<{
        booking?: any;
        message?: string;
      }>("/api/2-book-item", { id });

      /*
      setBookItemResponse(
        bookItemData?.booking
          ? `${selectedPalapa.name} successfully added to cart.`
          : (bookItemData?.message ?? "Unable to add to cart.")
      );
      */

      // STEP 3 — add-to-cart (must run after step 2)
      const addToCartData = await postJSON<{
        booking?: any;
        message?: string;
        anonymous_id?: string;
      }>("/api/3-add-to-cart", { id });

      setBookItemResponse(
        addToCartData?.booking
          ? `${selectedPalapa.name} successfully added to cart.`
          : (addToCartData?.message ?? "Add to cart failed.")
      );

      // Use the returned anonymous_id immediately to avoid stale state issues
      let localAnonymousId = addToCartData?.anonymous_id ?? anonymousId;
      if (addToCartData?.anonymous_id)
        setAnonymousId(addToCartData.anonymous_id);

      // STEP 4 — check-cart
      const checkCartData = await postJSON<{
        success?: string;
        message?: string;
      }>("/api/4-check-cart");
      setCheckCartResponse(
        checkCartData?.success === "ok"
          ? "Cart confirmed."
          : (checkCartData?.message ?? "Cart check failed.")
      );

      // STEP 5 — check-fields
      const checkFieldsData = await postJSON<{
        success?: string;
        message?: string;
      }>("/api/5-check-fields", { roomNumber });
      setCheckFieldsResponse(
        checkFieldsData?.success === "ok"
          ? "Fields confirmed."
          : (checkFieldsData?.message ?? "Field check failed.")
      );

      // STEP 6 — book-from-cart (must be last)
      const bookFromCartData = await postJSON<{ message?: string }>(
        "/api/6-book-from-cart",
        {
          anonymousId: localAnonymousId,
          email,
          lastName,
          firstName,
          roomNumber,
          phone,
        }
      );

      if (bookFromCartData?.message) {
        setBookFromCartResponse(bookFromCartData.message);
      } else {
        setSuccess(true);
        setBookFromCartResponse(
          `Palapa ${selectedPalapa.name} booked! Please check your email.`
        );
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("Booking flow failed:", msg);
      // Optional: set a single “global” error state if you have one
      setBookFromCartResponse(`Booking failed, please try again.`);
    }
  }, [
    anonymousId,
    setAnonymousId,
    palapaIdMap,
    selectedPalapa,
    setBookItemResponse,
    setCheckCartResponse,
    setCheckFieldsResponse,
    setBookFromCartResponse,
    setSuccess,
    watch,
  ]);

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
      fetch("/api/6-book-from-cart", {
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
        res.json().then((data) => {
          if (data.message) {
            setBookFromCartResponse(data.message);
          } else {
            setBookFromCartResponse(
              `Palapa ${selectedPalapa?.name} booked! Please check your email.`
            );
          }
        })
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
          See Palapa List
        </button>
      );
    case "bookItem":
      return (
        <button
          className="bg-blue-800 text-white border border-blue-800 hover:bg-white hover:text-blue-800 flex items-center font-semibold px-5 h-[50px] rounded-lg disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
          onClick={bookItem}
          disabled={!!success}
        >
          {`Book Selected Palapa: ${selectedPalapa?.name}`}
        </button>
      );
      {
        /*
    case "checkCart":
      return <button onClick={checkCart}>Check Cart Details</button>;
    case "checkFields":
      return (
        <button onClick={checkFields}>Double-Check Reservation Info</button>
      );
    
    case "bookFromCart":
      return (
        <button
          className="bg-blue-800 text-white border border-blue-800 hover:bg-white hover:text-blue-800 flex items-center font-semibold px-5 h-[50px] rounded-lg"
          onClick={bookFromCart}
        >
          Book Selected Palapa
        </button>
      );
      */
      }
    default:
      return;
  }
};

export default Button;
