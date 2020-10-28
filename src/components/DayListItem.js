import React from "react";

import "components/DayListItem.scss";

const classnames = require('classnames');

export default function DayListItem(props) {
  const dayClass = classnames("DayListItem", {
    'day-list__item': true,
    'day-list__item--selected': props.selected,
    'day-list__item--full': !props.spots
  })

  const formatSpots = function(spots) {
    if (spots === 0) {
      return 'no spots remaining';
    } else if (spots === 1) {
      return `${spots} spot remaining`;
    } else {
      return `${spots} spots remaining`;
    }
  };

  return (
    <li onClick={() => props.setDay(props.name)}>
      <div className={dayClass}>
        <h2>{props.name}</h2>
        <h3 className="text--light">{formatSpots(props.spots)}</h3>
      </div>
    </li>
  );
}