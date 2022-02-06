import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import loader from "../assets/images/loader.gif";

const ShowInfo = () => {
  const { id } = useParams();
  const [showsData, setShowsData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchShowsData = async (id) => {
    const url = `https://api.tvmaze.com/shows/${id}`;

    await fetch(url)
      .then((res) => res.json())
      .then((result) => setShowsData(result));
  };

  useEffect(() => {
    fetchShowsData(id);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [id]);

  return (
    <div className="show-info">
      <h1>{showsData.name}</h1>
      <Link to={"/"} className="back-button">
        Back
      </Link>
      <div className="show-info-container">
        {loading ? (
          <div className="loader">
            <img src={loader} className="loading-gif" alt="loading gif" />
          </div>
        ) : (
          <>
            <div className="text">
              <div className="rating">
                <p className="sub-title">Rating:&nbsp;</p>
                <p>{showsData.rating && showsData.rating.average}</p>
              </div>
              <div className="summary">
                <p className="sub-title">Summary:</p>
                <span
                  dangerouslySetInnerHTML={{ __html: showsData.summary }}
                ></span>{" "}
                {}
              </div>
            </div>
            <div className="image">
              {showsData.image && (
                <img src={showsData.image.original} alt="Show's cover" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShowInfo;
