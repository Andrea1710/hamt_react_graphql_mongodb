import React from "react";
import ClassItem from "./ClassItem/ClassItem";

import "./ClassList.css";

const ClassList = props => {
  const classes = props.classes.map(mtclass => {
    return (
      <ClassItem
        key={mtclass._id}
        classId={mtclass._id}
        title={mtclass.title}
        date={mtclass.date}
        time={mtclass.time}
        userId={props.authUserId}
        creatorId={mtclass.creator._id}
        onDetail={props.onViewDetail}
      />
    );
  });

  return <ul className="class__list">{classes}</ul>;
};

export default ClassList;
