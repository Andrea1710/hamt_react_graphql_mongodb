import React from "react";

import "./JoiningList.css";

const JoiningList = props => {
  return (
    <ul className="joinings__list">
      {props.joinings.map(joining => {
        return (
          <li key={joining._id} className="joinings__item">
            <div className="joinings__item-data">
              {joining.mtclass.title} - {joining.mtclass.date}
            </div>
            <div className="joinings__item-actions">
              <button className="btn" onClick={props.onDelete}>
                Cancel
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default JoiningList;
