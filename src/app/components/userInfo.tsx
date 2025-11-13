"use client";
import { useContext, useState } from "react";
import { AppContext, AppContextType } from "../contexts/appContext";

const UserInfo = () => {
  const {
    handleSubmit,
    setLoading,
    isSubmitted,
    errors,
    clearErrors,
    register,
    reset,
    resetField,
  } = useContext(AppContext) as AppContextType;
  const getSession = async () => {
    try {
      setLoading(1);
      fetch("/api/0-get-session", { method: "POST" }).then((res) => {
        console.log(res);
        setLoading(2);
        res.json().then((data) => {
          console.log(data);
          //setPalapas(data.palapas);
        });
      });
    } catch {
      (error: Error) => {
        console.log(error);
        setLoading(0);
      };
    }
  };
  const onFormSubmit = handleSubmit(async (data) => {
    console.log(data);
    getSession();
  });
  return (
    <form
      className="w-full grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2"
      onSubmit={onFormSubmit}
    >
      <div className="flex flex-col">
        <label htmlFor="roomNumber" className="mb-2 flex justify-between">
          Room Number
        </label>
        <input
          type="number"
          className="h-[50px] px-4 bg-white border border-blue-800 rounded"
          id="roomNumber"
          {...register("roomNumber", { required: true })}
        />
        {errors.roomNumber && errors.roomNumber.type === "required" && (
          <span className="text-red-400">Please provide your room number.</span>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="firstName" className="mb-2 flex justify-between">
          First Name
        </label>
        <input
          type="text"
          className="h-[50px] px-4 bg-white border border-blue-800 rounded"
          id="firstName"
          autoComplete="fname"
          {...register("firstName", { required: true })}
        />
        {errors.firstName && errors.firstName.type === "required" && (
          <span className="text-red-400">Please provide your first name.</span>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="lastName" className="mb-2 flex justify-between">
          Last Name
        </label>
        <input
          type="text"
          className="h-[50px] px-4 bg-white border border-blue-800 rounded"
          id="lastName"
          autoComplete="lname"
          {...register("lastName", { required: true })}
        />
        {errors.lastName && errors.lastName.type === "required" && (
          <span className="text-red-400">Please provide your last name.</span>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-2 flex justify-between">
          Email
        </label>
        <input
          type="email"
          className="h-[50px] px-4 bg-white border border-blue-800 rounded"
          id="email"
          autoComplete="email"
          {...register("email", { required: true })}
        />
        {errors.email && errors.email.type === "required" && (
          <span className="text-red-400">Please provide your email.</span>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="phone" className="mb-2 flex justify-between">
          Phone Number
        </label>
        <input
          type="tel"
          className="h-[50px] px-4 bg-white border border-blue-800 rounded"
          id="phone"
          autoComplete="tel"
          {...register("phone", { required: true })}
        />
        {errors.phone && errors.phone.type === "required" && (
          <span className="text-red-400">
            Please provide your phone number.
          </span>
        )}
      </div>
      <div className="flex-shrink-0 flex-grow-0 mt-1 lg:mt-8">
        {
          !isSubmitted && (
            <button
              type="submit"
              className="bg-blue-800 text-white border border-blue-800 hover:bg-white hover:text-blue-800 flex items-center font-semibold px-5 h-[50px] rounded-lg"
            >
              Submit
            </button>
          ) /* : (
          <button
            type="button"
            className="bg-blue-800 text-white border border-blue-800 hover:bg-white hover:text-blue-800 flex items-center font-semibold px-5 h-[50px] rounded-lg"
            onClick={() => {
              resetField("roomNumber");
              resetField("firstName");
              resetField("lastName");
              resetField("email");
              resetField("phone");
              clearErrors();
            }}
          >
            Clear form
          </button>
        )*/
        }
      </div>
    </form>
  );
};

export default UserInfo;
