import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import Card from "react-bootstrap/Card";
import "./wishlist.css";
import { AuthContext } from "../../../shared/context/auth-context";

import { format, parse } from "date-fns";

const formatDate = (dateString) => {
  const parsedDate = parse(dateString, "MM/dd/yyyy", new Date());
  return format(parsedDate, "EEEE, MMM dd, yyyy");
};

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/list/${auth.userId}`
        );
        setWishlist(responseData.products);
      } catch (err) {}
    };
    fetchWishlist();
  }, [setWishlist, sendRequest, auth.userId]);

  const handleRemoveWishlist = async (item) => {
    try {
      const existingItem = wishlist.find((list) => list.itemId === item.itemId);
      console.log(existingItem);
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/wishlist/${existingItem._id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setWishlist((prevWishlist) =>
        prevWishlist.filter((list) => list.itemId !== item.itemId)
      );
    } catch (error) {}
  };

  if (wishlist.length === 0) {
    return (
      <div className="place-list center">
        <p>You have no items in the wishlist yet!</p>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="Wishlist">
        <h3>Wishlist</h3>
        <div className="wishlist-container">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-item">
              <img
                src={`${item.imageUrl}`}
                alt={item.title}
                className="wishlist-image"
              />
              <div className="wishlist-details">
                <h2>{item.title}</h2>
                <p>{item.price}</p>
                <p>
                  Wishlist Added on{" "}
                  {formatDate(new Date(item.createdAt).toLocaleDateString())}
                </p>
              </div>
              <button
                className="remove-button"
                onClick={() => handleRemoveWishlist(item)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default Wishlist;
