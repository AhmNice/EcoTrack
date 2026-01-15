import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const useGeolocation = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper to fetch coordinates
  const fetchLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const msg = "Geolocation is not supported by this browser";
        setError(msg);
        toast.error(msg);
        return reject(msg);
      }

      setLoading(true);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };

          setLocation(coords);
          setError(null);
          setLoading(false);
          resolve(coords); // SAFE
        },
        (err) => {
          setError(err.message);
          setLoading(false);
          toast.error(err.message);
          reject(err);
        },
        {
          enableHighAccuracy: true,
          // timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  // Helper to get address
  const getAddress = async (coords = location) => {
    // If coords aren't available yet, we can't proceed
    if (!coords.latitude || !coords.longitude) {
      toast.warn("Please fetch location coordinates first.");
      return;
    }

    const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API;
    setLoading(true);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}&units=metric`;
      const { data } = await axios.get(url);

      const addressData = {
        city: data.name,
        country: data.sys.country,
        description: data.weather[0].description,
      };

      setAddress(addressData);
      return addressData;
    } catch (err) {
      setError("Failed to fetch address");
      toast.error("Could not retrieve city information");
    } finally {
      setLoading(false);
    }
  };

  return { location, address, error, loading, fetchLocation, getAddress };
};
