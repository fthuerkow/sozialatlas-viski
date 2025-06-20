import { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";

export default function SozialatlasMap() {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const mapInstance = new maplibregl.Map({
      container: "map",
      style: "https://demotiles.maplibre.org/style.json",
      center: [11.97, 51.47], // Halle
      zoom: 11,
    });

    mapInstance.on("load", () => {
      fetch("/data/export.geojson")
        .then((res) => res.json())
        .then((geojson) => {
          mapInstance.addSource("halle", {
            type: "geojson",
            data: geojson,
          });

          mapInstance.addLayer({
            id: "halle-fill",
            type: "fill",
            source: "halle",
            paint: {
              "fill-color": "#088",
              "fill-opacity": 0.4,
            },
          });

          mapInstance.addLayer({
            id: "halle-outline",
            type: "line",
            source: "halle",
            paint: {
              "line-color": "#000",
              "line-width": 1,
            },
          });
        });
    });

    setMap(mapInstance);
    return () => mapInstance.remove();
  }, []);

  return <div id="map" style={{ width: "100%", height: "100vh" }} />;
}
