const options = [
    {
      name: "Population",
      description: "Estimated total population in 2019",
      property: "population_in_2019",
      colorStops: [
        [0, "#f8d5cc"],
        [100000, "#f4bfb6"],
        [200000, "#f1a8a5"],
        [300000, "#ee8f9a"],
        [400000, "#ec739b"],
        [500000, "#dd5ca8"],
        [600000, "#c44cc0"],
        [700000, "#9f43d7"],
        [800000, "#6e40e6"],
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
      ],
    },
    {
      name: "Density",
      description: "Population per kilometer square",
      property: "density",
      colorStops: [
        [100, "#fafa6e"],
        [1000, "#aae479"],
        [2000, "#98de7c"],
        [3000, "#75d084"],
        [4000, "#54c18a"],
        [5000, "#34b28e"],
        [10000, "#10a18f"],
        [15000, "#00918d"],
        [20000, "#008087"],
        [25000, "#0d707d"],
        [30000, "#1f5f70"],
        [35000, "#285061"],
        [40000, "#2a4858"],
      ],
      radiusStops: [
        [100, 1],
        [1000, 1],
        [2000, 2],
        [3000, 3],
        [4000, 4],
        [5000, 5],
        [10000, 8],
        [15000, 14],
        [20000, 16],
        [25000, 20],
        [30000, 24],
        [35000, 30],
        [40000, 50],
      ],
    },
    {
      name: "Area",
      description: "Unit: kilometer square",
      property: "area",
      colorStops: [
        [6, "#d8b8a3"],
        [8, "#dfb091"],
        [15, "#eb955b"],
        [20, "#ee8e50"],
        [30, "#f18844"],
        [50, "#f48138"],
        [100, "#f7792b"],
        [150, "#f9711c"],
        [200, "#fc6907"],
      ],
      radiusStops: [
        [6, 3],
        [8, 5],
        [15, 8],
        [20, 12],
        [30, 16],
        [50, 25],
        [100, 50],
        [150, 70],
        [200, 100],
      ]
    }
];

const colorMapping = {
  "shakespeare": "#51bbd6",
  "manz": "#f1f075",
  "mauvelous": "#f28cb1"
}

const pixelMapping = {
  "px20": 20,
  "px30": 30,
  "px40": 40
}
export {options, colorMapping, pixelMapping};