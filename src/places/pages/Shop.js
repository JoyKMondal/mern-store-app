import React, { Fragment, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./Shop.css";
import ProgressBar from "../../shared/components/UIElements/ProgressBar";
import SortOrderSelect from "../../shared/components/UIElements/SortOrderSelect";

const Shop = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const location = useLocation();
  const param = useParams();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/products`
        );

        setLoadedPlaces(responseData.products);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  // console.log(loadedPlaces)

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  const [priceRange, setPriceRange] = useState(10000);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const sortedProducts =
    loadedPlaces &&
    loadedPlaces
      .filter((product) => product.price <= priceRange)
      .sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );

  const shopProductsByBrand =
    loadedPlaces &&
    loadedPlaces.filter((item) => item.author === param.brand_name);

  const shopProductsByCategory =
    loadedPlaces &&
    loadedPlaces.filter((item) => item.category === param.cat_name);

  return (
    <Fragment>
      <ErrorModal error={error} onCancel={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <div className="shopProducts">
        <div className="filters">
          <p className="range">Price Range</p>
          <SortOrderSelect
            sortOrder={sortOrder}
            handleSortOrderChange={handleSortOrderChange}
          />
          <ProgressBar priceRange={priceRange} setPriceRange={setPriceRange} />
        </div>
        <div className="products">
          <div className="prodHeader">
            Showing: 1-{sortedProducts && sortedProducts.length} products of{" "}
            {loadedPlaces && loadedPlaces.length} products
          </div>
          {!isLoading && loadedPlaces && (
            <PlaceList
              items={
                location.pathname.startsWith("/shop/brands")
                  ? shopProductsByBrand
                  : location.pathname.startsWith("/shop/category")
                  ? shopProductsByCategory
                  : loadedPlaces
              }
              products={sortedProducts}
              onDeletePlace={placeDeletedHandler}
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Shop;
