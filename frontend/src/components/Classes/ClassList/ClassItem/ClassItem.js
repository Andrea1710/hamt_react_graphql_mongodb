import React from "react";

import "./ClassItem.css";

const ClassItem = props => {
  return (
    <li key={props.classId} className="class__list-item">
      <div>
        <h1>{props.title}</h1>
        <h2>{props.date}</h2>
        <h2>{props.time}</h2>
      </div>
      <div>
        <button className="btn" onClick={() => props.onDetail(props.classId)}>
          View Details
        </button>
        {props.userId === props.creatorId && (
          <p style={{ textAlign: "center" }}>Creator</p>
        )}
      </div>
    </li>
  );
};

export default ClassItem;
