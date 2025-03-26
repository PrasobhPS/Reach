import React, { useEffect, useState } from "react";
import L from "leaflet";
import "../assets/scss/weather.scss";
import { useLocation } from "react-router-dom";

interface Location {
  lat: number | null;
  lng: number | null;
}

// Extend the Window interface to include windyInit
declare global {
  interface Window {
    windyInit: (options: any, callback: (windyAPI: any) => void) => void;
  }
}

const WeatherComponent: React.FC = () => {
  const [isAnnouncementAbsent, setIsAnnouncementAbsent] = useState(false);
  const [location, setLocation] = useState<Location>({ lat: null, lng: null });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [time, setTime] = useState<string>("");
  const fallbackToIPLocation = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/"); // Replace with your preferred geolocation API
      if (!response.ok) {
        throw new Error("Failed to fetch IP location.");
      }
      const data = await response.json();
      const { latitude, longitude } = data;
      setLocation({ lat: latitude, lng: longitude });
      initializeMap(latitude, longitude); // Initialize map with fallback location
    } catch (error) {
      console.error("Fallback failed:", error);
      setErrorMessage(
        "Unable to retrieve location. Please check your connection."
      );
    }
  };

  const initializeMap = (lat: number, lng: number) => {
    const options = {
      key: "Emv4UOlkc3c1xZammChgPejw9Na4szAv",
      lat: lat,
      lon: lng,
      zoom: 6,
      verbose: true,
    };

    window.windyInit(options, (windyAPI: any) => {
      const { map, picker, utils, store, broadcast } = windyAPI;

      map.setView([lat, lng], 7);
      setMapInstance(map);

      // Ensure the time slider (progress bar) is displayed
      store.set("timestamp", Date.now() / 1000); // Current time
      store.set("product", "ecmwf"); // Ensure a forecast model is selected

      // Listen for time changes
      store.on("timestamp", (timestamp: number) => {
        setTime(new Date(timestamp * 1000).toLocaleTimeString());
      });

      // Open picker on map click
      map.on(
        "click",
        async (event: { latlng: { lat: number; lng: number } }) => {
          const { lat, lng } = event.latlng;
          picker.open({ lat, lon: lng });

          picker.on(
            "pickerOpened",
            ({
              lat,
              lng,
              values,
            }: {
              lat: number;
              lng: number;
              values: any;
            }) => {
              const windObject = utils.wind2obj(values);
            }
          );
        }
      );

      // Ensure the timeline slider updates
      broadcast.on("timestamp", (timestamp: number) => {

        setTime(new Date(timestamp * 1000).toLocaleTimeString());
      });
    });
  };

  useEffect(() => {
    if (!scriptLoaded) {

      // Load Windy API script
      const windyScript = document.createElement("script");
      windyScript.src = `https://api.windy.com/assets/map-forecast/libBoot.js`;
      windyScript.async = true;
      windyScript.onload = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            setLocation({ lat: userLat, lng: userLon });
            initializeMap(userLat, userLon);
          },
          (error) => {
            console.error(
              "Geolocation error:",
              error.message || "No message provided."
            );
            switch (error.code) {
              case error.PERMISSION_DENIED:
                setErrorMessage("Location access denied by the user.");
                break;
              case error.POSITION_UNAVAILABLE:
                setErrorMessage(
                  "Location information is unavailable. Using fallback..."
                );
                break;
              case error.TIMEOUT:
                setErrorMessage(
                  "The request to get user location timed out. Using fallback..."
                );
                break;
              default:
                setErrorMessage("An unknown error occurred. Using fallback...");
            }
            fallbackToIPLocation();
          },
          {
            enableHighAccuracy: true,
            timeout: 20000, // 20 seconds
            maximumAge: 0, // No cached location
          }
        );
        setScriptLoaded(true);
      };

      windyScript.onerror = () => {
        setErrorMessage("Failed to load Windy API");
      };

      // Append the script to the document head
      document.head.appendChild(windyScript);
    }
  }, [scriptLoaded]);
  const locations = useLocation();

  useEffect(() => {
    if (locations.pathname === "/weather") {
      document.body.classList.add("weatherbody");
    } else {
      document.body.classList.remove("weatherbody");
    }
    return () => {
      document.body.classList.remove("weatherbody");
    };
  }, [locations.pathname]);
  return (
    <div
      className={`weatherparent ${isAnnouncementAbsent ? "weather-class" : ""}`}
    >
      <div className="container-fluid">
        {/* {errorMessage && <p className="error-message">{errorMessage}</p>} */}
        <div
          id="windy"
          className="weather-section"
          style={{ width: "100%", height: "100%" }}
        ></div>
      </div>
    </div>
  );
};

export default WeatherComponent;
