import mapboxgl from "mapbox-gl";
import Legend from "./components/Legend";
import Optionsfield from "./components/Optionsfield";
import React, { useEffect, useState, useRef } from "react";
import "./Map.css";
import data from "../hochiminh_population_geo.json";
import { options } from "./constants";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaG9hbmdxdW9jaHVuZzExMTAiLCJhIjoiY2w4Ym55OXRqMDB0bjNvcGRycDN2MGRuZSJ9.EEFhms7cuNTpkRH-TxfVPw";

const Map = () => {
  const mapContainerRef = useRef(null);
  const [active, setActive] = useState(options[0]); // property to display
  const [map, setMap] = useState(null);

  // Init map when component mounts
  useEffect(() => {
    // Init mapbox object
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [106, 10],
      zoom: 5,
    });

    map.on("load", () => {
      // load your data here
      console.log(data);
      map.addSource("districts", {
        type: "geojson",
        data,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Add symbol layer to display district name
      // Set layout property with text-field
      map.addLayer({
        id: "district-label",
        type: "symbol",
        source: "districts",
        layout: {
          "text-field": [
            "format",
            ["get", "name"],
            { "font-scale": 1.2 },
            "\n",
            {},
            ["get", active.property],
            {
              "font-scale": 0.9,
            },
          ],
        },
        paint: {
          "text-color": "#FFFFFF",
        },
      });

      // Add circle layer
      map.addLayer(
        {
          id: "districts",
          type: "circle",
          source: "districts",
          paint: {
            "circle-color": {
              property: active.property,
              stops: active.colorStops,
            },
            "circle-radius": {
              property: active.property,
              stops: active.radiusStops,
            },
          },
        },
        "district-label"
      );

      setMap(map);
    });

    map.on("click", "districts", (e) => {
      const feature = map.queryRenderedFeatures(e.point, {
        layers: ["districts"],
      });
      const districtName = feature[0].properties.name;

      map
        .getSource("districts")
        .getClusterExpansionZoom(districtName, (err, zoom) => {
          if (err) return;
          map.easeTo({
            center: feature[0].geometry.coordinates,
            zoom: zoom,
          });
        });
      // debugger;
    });
    // Clean up on unmount
    return () => map.remove();
  }, []);

  useEffect(() => {
    // Update layers when active is updated
    paint();
    console.log(map);
  }, [active]);

  const paint = () => {
    if (map) {
      map.setPaintProperty("districts", "circle-color", {
        property: active.property,
        stops: active.colorStops,
      });
      map.setPaintProperty("districts", "circle-radius", {
        property: active.property,
        stops: active.radiusStops,
      });
      map.setLayoutProperty("district-label", "text-field", [
        "format",
        ["get", "name"],
        { "font-scale": 1.2 },
        "\n",
        {},
        ["get", active.property],
        {
          "font-scale": 0.9,
        },
      ]);
    }
  };

  const changeState = (i) => {
    setActive(options[i]);
    map.setPaintProperty("districts", "circle-color", {
      // Update circle-color
      property: active.property,
      stops: active.colorStops,
    });
    map.setPaintProperty("districts", "circle-radius", {
      property: active.property,
      stops: active.radiusStops,
    });
  };

  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
      <Legend active={active} stops={active.colorStops} />
      <Optionsfield
        options={options}
        property={active.property}
        changeState={changeState}
      />
    </div>
  );
};

export default Map;
