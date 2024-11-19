"use client";
import { useContext } from "react";
import { AppContext, AppContextType } from "../contexts/appContext";
import type { PalapaListing } from "../contexts/appContext";

const PalapaList = () => {
  const { palapas, palapaIdMap, selectedPalapa, setSelectedPalapa } =
    useContext(AppContext) as AppContextType;
  if (!palapas?.length) return null;
  return (
    <div className="flex flex-col w-full max-w-5xl">
      <div className="flex w-full mb-4">
        Please select one of these available palapas:
      </div>
      <table className="flex flex-col w-full items-start justify-start">
        {palapas
          .filter(
            (p: PalapaListing) =>
              !!p.active &&
              p.palapatype_availableName === "AVAILABLE NOW" &&
              Object.keys(palapaIdMap).includes(p.name.toString())
          )
          .map((p: PalapaListing) => (
            <tr key={`palapa-${p.id}`} className="mb-2">
              <td>
                <button
                  key={p.id}
                  className="bg-blue-200 text-blue-800 border border-blue-800 hover:bg-white hover:text-blue-800 flex items-center font-semibold p-2 rounded-lg"
                  onClick={() => setSelectedPalapa(p)}
                >
                  {p.name}
                </button>
              </td>
            </tr>
          ))}
      </table>
    </div>
  );
};

export default PalapaList;
