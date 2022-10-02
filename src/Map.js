import mapboxgl from "mapbox-gl";
import React, { useEffect, useState, useRef } from 'react';
import "./Map.css";
import data from "../hochiminh_population_geo.json";

mapboxgl.accessToken = "pk.eyJ1IjoiaG9hbmdxdW9jaHVuZzExMTAiLCJhIjoiY2w4Ym55OXRqMDB0bjNvcGRycDN2MGRuZSJ9.EEFhms7cuNTpkRH-TxfVPw"

const Map = () => {
    const options = [
        {
            name: "Population",
            description: "Estimated total population in 2019",
            property: "population_in_2019",
            colorStops: [
                [0, '#f8d5cc'],
                [100000, '#f4bfb6'],
                [200000, '#f1a8a5'],
                [300000, '#ee8f9a'],
                [400000, '#ec739b'],
                [500000, '#dd5ca8'],
                [600000, '#c44cc0'],
                [700000, '#9f43d7'],
                [800000, '#6e40e6']
            ],
            radiusStops: [
                [100, 0.01],
                [1000, 1],
                [2000, 2],
                [3000, 3],
                [4000, 4],
                [5000, 5],
                [10000, 8],
                [20000, 16],
                [30000, 24],
                [40000, 50],
            ]
        }
    ]
    const mapContainerRef = useRef(null);
    const [active, setActive] = useState(options[0]) // property to display
    const [map, setMap] = useState(null)

    // Init map when component mounts
    useEffect(() => {
        // Init mapbox object
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [106, 10],
            zoom: 5
        });

        map.on("load", () => {
            // load your data here
            console.log(data);
            map.addSource("districts", {
                type: "geojson",
                data,
                cluster: true,
            });

            // Add symbol layer to display district name
            map.addLayer({
                id: "district-label",
                type: "symbol",
                source: "districts"   
            });
            // Set district name on circle layer
            map.setLayoutProperty("district-label", "text-field", [
                "format",
                ["get", "name"],
                {"font-scale": 1.2},
                "\n",
                {},
                ["get", "population_in_2019"],
                {
                    "font-scale": 0.9
                }
            ])
            
            // Add circle layer
            map.addLayer({
                id: "districts",
                type: "circle",
                source: "districts"
                },
                "district-label"
            );
            
            // Set Paint property for Layer
            map.setPaintProperty("districts", "circle-color", {
                property: active.property,
                stops: active.colorStops
            });
            map.setPaintProperty("districts", "circle-radius", {
                property: active.property,
                stops: active.radiusStops
            });

            setMap(map);
        });

        // Clean up on unmount
        return () => map.remove();
    }, []);

    useEffect(() => {
        paint();
    }, [active])

    const paint = () => {
        if (map){
            map.setPaintProperty("districts", "circle-color", {
                property: active.property,
                stops: active.stops
            });
        }
    }
    return (
        <div>
            <div ref={mapContainerRef} className="map-container" />
        </div>
    );
};

export default Map;
