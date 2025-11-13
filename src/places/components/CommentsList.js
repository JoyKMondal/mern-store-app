import React, { Fragment, useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./CommentsList.css";

import { format, parse } from "date-fns";

const formatDate = (dateString) => {
  const parsedDate = parse(dateString, "MM/dd/yyyy", new Date());
  return format(parsedDate, "EEEE, MMM dd, yyyy");
};

const CommentsList = (props) => {
  const [comments, setComments] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { id } = props.loadedProduct;

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/products/comments/${id}`
        );
        setComments(responseData.comments);
      } catch (err) {}
    };
    fetchWishlist();
  }, [sendRequest, id]);

  if (comments.length === 0) {
    return (
      <div className="place-list center">
        <p>No comments for the products yet!</p>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="Wishlist">
        <h3>User Comments</h3>
        <div className="wishlist-container">
          {comments.map((item) => (
            <div key={item.id} className="wishlist-item">
              <img
                src={`${item.userImageUrl}`}
                alt={item.title}
                className="wishlist-image"
              />
              <div className="wishlist-details">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <p>
                  Comment added on{" "}
                  {formatDate(new Date(item.createdAt).toLocaleDateString())}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default CommentsList;
