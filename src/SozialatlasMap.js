// Sozialatlas Frontend-Prototyp (React + MapLibre)
import React, { useEffect, useRef } from "react";
import maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const SozialatlasMap = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new maplibre.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [11.8, 51.8],
      zoom: 7
    });

    map.on("load", () => {
      map.addSource("kreise", {
        type: "geojson",
        data: "/data/sozialatlas_prototyp.geojson"
      });

      map.addLayer({
        id: "kreise-fill",
        type: "fill",
        source: "kreise",
        paint: {
          "fill-color": [
            "match",
            ["get", "Cluster"],
            "A", "#a6cee3",
            "B", "#1f78b4",
            "C", "#03396c",
            "#ccc"
          ],
          "fill-opacity": 0.6
        }
      });

      map.addLayer({
        id: "kreise-outline",
        type: "line",
        source: "kreise",
        paint: {
          "line-color": "#333",
          "line-width": 1
        }
      });

      map.on("click", "kreise-fill", (e) => {
        const props = e.features[0].properties;
        const popupHtml = `
          <strong>${props.Kreis}</strong><br/>
          Cluster: ${props.Cluster}<br/>
          Bevölkerung: ${props.Bevölkerung}<br/>
          Anteil 65+: ${props.Anteil_65plus}%<br/>
          Arbeitslosigkeit: ${props.Arbeitslosenquote}%<br/>
          Migrationsanteil: ${props.Migrationsanteil}%<br/>
          Hochschulabschluss: ${props.Hochschulabschlussquote}%
        `;

        new maplibre.Popup()
          .setLngLat(e.lngLat)
          .setHTML(popupHtml)
          .addTo(map);
      });
    });
  }, []);

  return <div ref={mapContainer} style={{ height: "100vh" }} />;
};

export default SozialatlasMap;
