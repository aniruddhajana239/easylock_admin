import { useEffect, useState } from "react";

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export const formatToDDMMYYYY=(date)=> {
    if (!date) return ''; // return empty string if no date is provided
  
    const validDate = new Date(date); // Convert the input to a Date object
  
    // Check if the conversion to Date object was successful
    if (isNaN(validDate)) {
      return ''; // Return empty string if date is invalid
    }
  
    const day = String(validDate.getDate()).padStart(2, '0');
    const month = String(validDate.getMonth() + 1).padStart(2, '0');
    const year = validDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

// Returns string format: "21/Mar/2026 07:26:23 AM"
export const convertUTCToLocal = (dateString) => {
  if (!dateString) return "";

  // Convert to proper ISO UTC format
  const isoString = dateString.replace(/\//g, "-") + "Z";
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  hours = String(hours).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
};

// Returns object format: { date: "21 Mar, 2026", time: "07:26:23 AM" }
export const convertUTCToLocalWithObject = (dateString) => {
  if (!dateString) return { date: "", time: "" };

  try {
    const [datePart, timePart, modifier] = dateString.split(" ");
    const [month, day, year] = datePart.split("/").map(Number);
    let [hour, minute, second] = timePart.split(":").map(Number);

    if (modifier === "PM" && hour !== 12) hour += 12;
    if (modifier === "AM" && hour === 12) hour = 0;

    const utcDate = new Date(
      Date.UTC(year, month - 1, day, hour, minute, second),
    );

    const date = utcDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });

    const time = utcDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });

    return { date, time };
  } catch {
    return { date: "", time: "" };
  }
};
