import React from "react";
import data from "../../hochiminh_population_geo.json";

const Legend = (props) => {
  const renderLegendKeys = (stop, i) => {
    return (
      <div key={i} className="txt-s">
        <span
          className="mr6 round-full w12 h12 inline-block align-middle"
          style={{ backgroundColor: stop[1] }}
        />
        <span>{`${stop[0].toLocaleString()}`}</span>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white absolute bottom right mr12 mb24 py12 px12 shadow-darken10 round z1 wmax180">
        <div className="mb6">
          <h2 className="txt-bold txt-s block">{props.active.name}</h2>
          <p className="txt-s color-gray">{props.active.description}</p>
        </div>
        {props.stops.map(renderLegendKeys)}
      </div>
    </>
  );
};


const WardLegend = (props) => {

  const renderWard = (ward, i) => {
    return (
      <div key={i} className="txt-s">
        <span>{`${i+1}. `}</span>
        <span>{`${ward.name}: ${ward[props.active.property]}`}</span>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white absolute bottom left ml12 mb24 py12 px12 shadow-darken10 round z1 wmax240">
        <div className="mb6">
          <h2 className="txt-bold txt-s block">{props.districtOnClick}</h2>
          <p className="txt-s color-gray">{props.active.name} in each ward</p>
        </div>
        {props.wards
        .sort((a, b) => a[props.active.property] - b[props.active.property])
        .map(renderWard)}
      </div>
    </>
  );
};
export {WardLegend, Legend};
