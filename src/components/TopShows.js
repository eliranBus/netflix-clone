import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ShowBox from "./sub-components/ShowBox";
import loader from "../assets/images/loader.gif";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const TopShows = () => {
  const storageData = JSON.parse(sessionStorage.getItem("tenBestRatedShowsPerGenre"));
  const [allShows, setAllShows] = useState([]);
  const [tenBestRatedShowsPerGenre, setTenBestRatedShowsPerGenre] = useState(storageData ? storageData : []);
  const [loading, setLoading] = useState(true);
  const width = window.innerWidth;
  let ArrOfShowsByGenres = [];

  const getData = useCallback(async() => {
    //Utility functions for fetch.
    let pageNumber = 0;
    const url = `https://api.tvmaze.com/shows?page=`;
    const checkStatus = (res) =>
      res.ok ? Promise.resolve(res) : Promise.reject(new Error(res.statusText));
    const parseJSON = (response) => response.json();

    // Get a single endpoint.
    const getPage = async (url) => {
      try {
        const res = await fetch(`${url}${pageNumber}`);
        const response = await checkStatus(res);
        return parseJSON(response);
      } catch (error) {
        return console.log("There was a problem!", error);
      }
    };

    // Keep getting the pages until the next key is null.
    const getAllPages = async (url, collection = []) => {
      const results = await getPage(url);
      pageNumber++;
      if (results !== undefined) {
        collection = [...collection, ...results];
        return getAllPages(url, collection);
      }

      return collection;
    };

    // Select data out of all the pages gotten.
    const fetchedShows = await getAllPages(url);

    // Filter shows without rating or genre type.
    const ratedFetchedShows = await fetchedShows.filter(
      (show) => show.rating.average && show.genres.length
    );

    setAllShows(ratedFetchedShows);
  }, [])

  const createArrOfGenres = () => {
    let AllGenresArr = [];
    let uniqueGenresArr = [];

    allShows.forEach((show) => {
      AllGenresArr.push(...show.genres);
    });

    //Create a set of unique genres - remove duplicates.
    uniqueGenresArr = new Set(AllGenresArr);
    uniqueGenresArr = [...uniqueGenresArr];

    createArrOfShowsByGenres(uniqueGenresArr);
    getTenBestRatedShows(ArrOfShowsByGenres);
  };

  const createArrOfShowsByGenres = (arr) => {
    //Push the new arr all genres.
    arr.forEach((genre) => {
      ArrOfShowsByGenres.push({
        name: genre,
        shows: [],
      });
    });

    //Push every genre in arr the relevant shows.
    allShows.forEach((show) => {
      ArrOfShowsByGenres.forEach((genre) => {
        if (show.genres.includes(genre.name)) {
          genre.shows.push(show);
        }
      });
    });
  };

  const getTenBestRatedShows = (arr) => {
    let newArr = [];

    //Sort each genre shows arr by rating.
    arr.forEach((item) => {
      item.shows.sort((a, b) => {
        return a.rating.average - b.rating.average;
      });
    });

    //populate tenBestRatedShowsPerGenre with only 10 top rated shows per genre
    arr.forEach((item) => {
      newArr.push({ name: item.name, shows: item.shows.slice(-10) });
    });

    setTenBestRatedShowsPerGenre(newArr);
    sessionStorage.setItem("tenBestRatedShowsPerGenre", JSON.stringify(newArr));
  };

  useEffect(() => {
    tenBestRatedShowsPerGenre.length ?
    setTenBestRatedShowsPerGenre(storageData) : 
    getData();
  }, []);

  useEffect(() => {
    !tenBestRatedShowsPerGenre.length &&
    createArrOfGenres();
  }, [allShows]);

  useEffect(() => {
    tenBestRatedShowsPerGenre.length && setLoading(false);
  }, [tenBestRatedShowsPerGenre]);

  return (
  <>
  <h1>TV Shows Library</h1>
  {loading ? 
    <div className="loader">
      <img src={loader} className="loading-gif" alt="loading gif"/>
    </div>
    :
    <div className="shows-library">
      {tenBestRatedShowsPerGenre.map((genre) => (
        <div className="genre-wrapper" key={genre.name}>
          <h5>Top 10 {genre.name}</h5>
          <div className="box-wrapper">
            <Swiper
              slidesPerView={width > 1800 ? 6 : width < 1350 ? 3 : 4}
              slidesPerGroup={1}
              spaceBetween={0}
              loop={true}
              className="mySwiper"
            >
              {genre.shows.map((show) => (
                <SwiperSlide key={show.id}>
                  <ShowBox show={show} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      ))}
    </div>
    }
    </>
  );
};

export default TopShows;
