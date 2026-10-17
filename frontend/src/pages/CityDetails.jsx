

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import PlaceCard from "../components/PlaceCard";

export default function CityDetails() {
  const { id } = useParams();

  const [city, setCity] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCityDetails() {
      setLoading(true);
      setError("");
      setCity(null);
      setPlaces([]);
      setImageFailed(false);

      try {
        const [cityResponse, placeResponse] = await Promise.all([
          API.get("/cities"),
          API.get("/places"),
        ]);

        if (!active) return;

        // Support APIs that return either arrays or { content: [...] }.
        const cityData = Array.isArray(cityResponse.data)
          ? cityResponse.data
          : cityResponse.data?.content || cityResponse.data?.data || [];

        const placeData = Array.isArray(placeResponse.data)
          ? placeResponse.data
          : placeResponse.data?.content || placeResponse.data?.data || [];

        const selectedCity = cityData.find(
          (item) => String(item.id) === String(id)
        );

        setCity(selectedCity || null);
        setPlaces(placeData);
      } catch (err) {
        console.error("Could not load city details:", err);

        if (active) {
          setError(
            "Could not load destination details. Check that the backend is running and try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCityDetails();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="city-details-page">
        <p>Loading destination...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="city-details-page">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <Link to="/explore" className="back-link">
          ← Back to Explore
        </Link>
      </main>
    );
  }

  if (!city) {
    return (
      <main className="city-details-page">
        <h1>Destination not found</h1>
        <p>This city could not be found. Please select a destination again.</p>
        <Link to="/explore" className="back-link">
          ← Back to Explore
        </Link>
      </main>
    );
  }

  const cityName = String(city.name || "").trim().toLowerCase();

  // Read the city name or ID from different common API formats.
  const cityPlaces = places.filter((place) => {
    const placeCity =
      place.city && typeof place.city === "object"
        ? place.city.name
        : place.city;

    const placeCityId =
      place.city && typeof place.city === "object"
        ? place.city.id
        : place.cityId ??
          place.city_id ??
          place.cityID;

    const possibleNames = [
      placeCity,
      place.cityName,
      place.city_name,
      place.city?.cityName,
    ];

    const matchesName = possibleNames.some(
      (name) =>
        typeof name === "string" &&
        name.trim().toLowerCase() === cityName
    );

    const matchesId =
      placeCityId !== undefined &&
      placeCityId !== null &&
      String(placeCityId) === String(city.id);

    return matchesName || matchesId;
  });

  const imageUrl = city.imageUrl || city.image_url;

  const location = [city.state, city.country]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="city-details-page">
      <Link to="/explore" className="back-link">
        ← Back to Explore
      </Link>

      {/* Destination hero */}
      <section className="city-hero">
        <div className="city-hero-image">
          {imageUrl && !imageFailed ? (
            <img
              src={imageUrl}
              alt={city.name}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="destination-placeholder">
              <span>🌍</span>
              <p>{city.name}</p>
            </div>
          )}
        </div>

        <div className="city-hero-content">
          <span className="eyebrow">YOUR DESTINATION GUIDE</span>

          <h1>{city.name}</h1>

          {location && (
            <p className="city-hero-location">
              📍 {location}
            </p>
          )}

          <p className="city-hero-description">
            {city.description ||
              `Discover the attractions, culture and local experiences of ${city.name}.`}
          </p>

          <a href="#city-attractions" className="destination-button">
            Discover places ↓
          </a>
        </div>
      </section>

      {/* About the destination */}
      <section className="city-about">
        <span className="eyebrow">GET TO KNOW THE CITY</span>

        <h2>Discover {city.name}</h2>

        <p>
          Explore popular attractions, discover local experiences,
          and find interesting places to visit during your trip to{" "}
          {city.name}.
        </p>
      </section>

      {/* Tourist attractions */}
      <section
        id="city-attractions"
        className="city-attractions"
      >
        <span className="eyebrow">EXPLORE & EXPERIENCE</span>

        <h2>Places to Visit in {city.name}</h2>

        <p>
          Find attractions and experiences to include in your travel plan.
        </p>

        {cityPlaces.length > 0 ? (
          <div className="grid">
            {cityPlaces.map((place, index) => (
              <PlaceCard
                key={place.id ?? `${city.id}-${index}`}
                place={place}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>No places found for {city.name}</h3>

            <p>
              No tourist places matched this city. Check the city
              relationship in your places API response and ensure
              the places are linked to the correct city in your database.
            </p>

            <Link to="/explore" className="destination-button">
              Explore other destinations
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
