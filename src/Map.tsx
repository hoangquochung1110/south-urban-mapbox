import mapboxgl from "mapbox-gl";
import { GeoJSONSource, MapboxGeoJSONFeature } from "mapbox-gl";
import {WardLegend, Legend} from "./components/Legend";
import Optionsfield from "./components/Optionsfield";
import React, { useEffect, useState, useRef } from "react";
import "./Map.css";
import data from "../hochiminh_population_geo.json";
import { options, colorMapping, pixelMapping } from "./constants";
import { HoChiMinh } from "./helpers/data";


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_SECRET_KEY || "";

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(options[0]); // property to display (population, density ...)
  const [districtOnClick, setDistrictOnClick] = useState(null); // to store the name of on-clicked district
  const [wards, setWards] = useState(null); // store data of on-clicked district

  // Init map when component mounts
  useEffect(() => {
    // Init mapbox object
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [106, 10],
      zoom: 7,
    });

    map.on("load", () => {
      // load your data here
      console.log(data);
      map.addSource("districts", {
        type: "geojson",
        data: HoChiMinh,
        cluster: true,
        clusterMaxZoom: 15,
        clusterRadius: 40,
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
            {"font-scale": 0.9 },
          ],
        },
        paint: {
          "text-color": "#FFFFFF",
        },
      });

      // Add circle layer above `district-label` layer
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
      
      // cluster layer
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "districts",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 5
          //   * Yellow, 30px circles when point count is between 5 and 15
          //   * Pink, 40px circles when point count is greater than or equal to 15
          "circle-color": [
            "step",
            ["get", "point_count"],
            colorMapping.shakespeare,
            5,
            colorMapping.manz,
            15,
            colorMapping.mauvelous,
          ],
          "circle-radius": ["step", ["get", "point_count"], pixelMapping.px20, 5, pixelMapping.px30, 15, pixelMapping.px40],
        },
      });

      // Add symbol layer to display clusters count
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "districts",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

    });

    // inspect a cluster on click
    map.on("click", "clusters", (e) => {
      const features: MapboxGeoJSONFeature[] = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties?.cluster_id;
      const source: GeoJSONSource = map.getSource("districts") as GeoJSONSource
      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          if (features[0].geometry.type == "Point"){
            map.easeTo({
              center: [features[0].geometry.coordinates[0], features[0].geometry.coordinates[1]],
              zoom: zoom,
            });
          }
        });
    });

    map.on("click", "districts", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["districts"],
      });
      if (features[0].properties?.hasOwnProperty("wards")){
        console.log(features[0].properties);
        setWards(JSON.parse(features[0].properties.wards))
        setDistrictOnClick(features[0].properties.name);
      }
    })

    // Clean up on unmount
    return () => map.remove();
  }, []);


  // useEffect(() => {
  //   // Update layers when active is updated
  //   paint();
  //   console.log(map);
  // }, [active]);

  // const paint = () => {
  //   if (map) {
  //     map.setPaintProperty("districts", "circle-color", {
  //       property: active.property,
  //       stops: active.colorStops,
  //     });
  //     map.setPaintProperty("districts", "circle-radius", {
  //       property: active.property,
  //       stops: active.radiusStops,
  //     });
  //     map.setLayoutProperty("district-label", "text-field", [
  //       "format",
  //       ["get", "name"],
  //       { "font-scale": 1.2 },
  //       "\n",
  //       {},
  //       ["get", active.property],
  //       {
  //         "font-scale": 0.9,
  //       },
  //     ]);
  //   }
  // };

  // const changeState = (i) => {
  //   setActive(options[i]);
  //   if (map){
  //     map.setPaintProperty("districts", "circle-color", {
  //       // Update circle-color
  //       property: active.property,
  //       stops: active.colorStops,
  //     });
  //     map.setPaintProperty("districts", "circle-radius", {
  //       property: active.property,
  //       stops: active.radiusStops,
  //     });
  //   }
  // };

  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
      <Legend active={active} stops={active.colorStops} />
      {districtOnClick && <WardLegend districtOnClick={districtOnClick} wards={wards} active={active}/>}
      
      <Optionsfield
        options={options}
        property={active.property}
        // changeState={changeState}
      />
    </div>
  );
};

export default Map;
