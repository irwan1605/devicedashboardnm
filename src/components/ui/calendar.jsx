import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export function Calendar({ mode = "single", selected, onSelect, className = "" }) {
  return (
    <div className={`rounded-md border border-gray-200 p-2 bg-white ${className}`}>
      <DayPicker
        mode={mode}
        selected={selected}
        onSelect={onSelect}
        styles={{
          caption: { color: "#1e293b", fontWeight: "600" },
          day: { borderRadius: "6px", padding: "6px" },
        }}
      />
    </div>
  );
}
