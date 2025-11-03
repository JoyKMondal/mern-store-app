import React, { Fragment, useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./ProductDetails.css";
import Button from "../../shared/components/FormElements/Button";
import Comments from "../components/Comments";
import CommentsList from "../components/CommentsList";
import { FaShoppingCart } from "react-icons/fa";
import { AuthContext } from "../../shared/context/auth-context";
import { FaRegMinusSquare } from "react-icons/fa";
import { FaRegPlusSquare } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatPrice } from "../../shared/util/converters";

const ProductDetails = () => {
  const [loadedProduct, setLoadedProduct] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);

  const param = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/products/${param.pid}`
        );

        setLoadedProduct(responseData.product);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest, param.pid]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/product/cart/${auth.userId}`
        );

        setCartItems(responseData.products);

        const currentItem = responseData.products.find(
          (item) => item.productId && item.productId._id === param.pid
        );
        if (currentItem) {
          setQuantity(currentItem.quantity);
          setIsInCart(true);
        }
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest, auth.userId, param.pid, isInCart]);

  const handleAddToCart = async (productId) => {
    if (!auth.isLoggedIn) {
      navigate("/auth");
      return;
    }
    try {
      const existingItem =
        cartItems &&
        cartItems.find(
          (item) => item.productId && item.productId._id === productId
        );

      if (existingItem) {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/${auth.userId}/cart/${productId}`,
          "DELETE",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );

        setCartItems((prevCartItems) =>
          prevCartItems.filter(
            (item) => item.productId && item.productId._id !== productId
          )
        );
        setIsInCart(false);
        toast("Product removed from the cart!");
      } else {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/cart/add`,
          "POST",
          JSON.stringify({
            productId: productId,
            userId: auth.userId,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(responseData);
        setCartItems((prevWishlist) => [...prevWishlist, responseData.cart]);
        setIsInCart(true);
        toast("Product added to the cart!");
      }
    } catch (error) {}
  };

  const increaseQuantityHandler = async (productId) => {
    if (!auth.isLoggedIn) {
      navigate("/auth");
      return;
    }
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/cart/increase-quantity`,
        "PATCH",
        JSON.stringify({
          productId,
          userId: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setQuantity((prev) => prev + 1);
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item.productId._id === productId ? { ...item, quantity } : item
        )
      );
      toast("Product quantity increased by 1!");
    } catch (error) {}
  };

  const decreaseQuantityHandler = async (productId) => {
    if (!auth.isLoggedIn) {
      navigate("/auth");
      return;
    }
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/cart/decrease-quantity`,
        "PATCH",
        JSON.stringify({
          productId,
          userId: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setQuantity((prev) => Math.max(prev - 1, 1));
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item.productId._id === productId ? { ...item, quantity } : item
        )
      );
      toast("Product quantity decreased by 1!");
    } catch (error) {}
  };

  if (!loadedProduct) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  const {
    id,
    creator,
    title,
    author,
    description,
    stock,
    price,
    category,
    imageUrl,
  } = loadedProduct;

  return (
    <Fragment>
      {/* {isLoading && <LoadingSpinner />} */}
      <ToastContainer />
      <div className="headers">
        <div className="image">
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}/${imageUrl}`}
            alt={title}
            className="imgs"
          />
          <div className="stocks">{stock}</div>
        </div>
        <div className="header--text">
          <p className="head">{title}</p>
          <div className="creators">by {author}</div>
          <div className="horizontal-line"></div>
          <p className="more">
            See More From <Link to={`/shop/brand/${author}`}>{author}</Link>
          </p>
          <div className="summaryy">{category}</div>
          <div className="summaryy">{description}</div>
          <div className="prices">{formatPrice(price)}</div>
          <div className="quantityEl">
            <p className="title">Adjust Quantity</p>
            <div className="btns">
              <Button
                inverse
                disabled={quantity === 1}
                onClick={() => decreaseQuantityHandler(id)}
              >
                <FaRegMinusSquare /> Decrease
              </Button>
              <Button inverse onClick={() => increaseQuantityHandler(id)}>
                <FaRegPlusSquare /> Increase
              </Button>
            </div>
          </div>
          <div className="horizontal-line"></div>
          <Button
            // disabled={loadingCart}
            onClick={() => handleAddToCart(id)}
          >
            <div className="add-cart-btn">
              <FaShoppingCart />
              <span>{isInCart ? "REMOVE FROM CART" : "ADD TO CART"}</span>
            </div>
          </Button>
        </div>
      </div>
      <div className="comments-section">
        <Comments loadedProduct={loadedProduct} />
        <CommentsList loadedProduct={loadedProduct} />
      </div>
    </Fragment>
  );
};

export default ProductDetails;
