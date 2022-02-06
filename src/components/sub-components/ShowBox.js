import React from 'react';
import { Link } from "react-router-dom";

const ShowBox = ({show}) => {
  return (
    <Link to={`/${show.id}`} className='show-box'>
      <div className='box-content' style={{backgroundImage: `url(${show.image.original})`}}>
        <span className='box-text'>
          {show.name}
        </span>
      </div>
    </Link>
  )
};

export default ShowBox;
