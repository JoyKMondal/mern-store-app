// Cart.js
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from "../FormElements/Button";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatPrice } from "../../util/converters";

const Cart = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [cartItems, setCartItems] = useState([]);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/product/cart/${auth.userId}`
        );

        setCartItems(responseData.products);
        setTotalPrice(responseData.total);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest, auth.userId, totalPrice]);

  const deleteCartItem = async (productId) => {
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
    toast("Product removed from the cart!");
  };

  const placeOrderHandler = async () => {
    if (!auth.isLoggedIn) {
      navigate("/auth");
    }

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/products/order/${auth.userId}`,
        "POST",
        JSON.stringify({}),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(responseData);
      props.onCloseCart();
      navigate(`/user-dashboard/${auth.userId}/orders`);
    } catch (err) {}
  };

  if (cartItems?.length <= 0) {
    return (
      <div className="empty-cart">
        <div className="icon"><HiOutlineShoppingBag /></div>
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <Fragment>
      {isLoading && <LoadingSpinner />}
      <div className="cart-container">
        <div className="btn-container">
          {/* <button className="clear-cart-button">clear cart</button> */}
          <button className="close-cart-button" onClick={props.onCloseCart}>
            close
          </button>
        </div>
        <div className="cart-item-container">
          {cartItems.map((item, index) => (
            <div className="cart-item" key={index}>
              <div className="item-header" key={index}>
                <div className="header-left">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/${item.productId.imageUrl}`}
                    alt={item.title}
                  />
                  <div className="item-name">{item.title}</div>
                </div>
                <button
                  className="delete-button"
                  onClick={() =>
                    deleteCartItem(
                      item.productId && item.productId._id
                    )
                  }
                >
                  <RiDeleteBin6Line />
                </button>
              </div>
              <div className="item-wrapper">
                <div className="item-price">
                  <p>Price</p>
                  <p>{formatPrice(item.productId.price)}</p>
                </div>
                <div className="item-quantity">
                  <p>Quantity</p>
                  <p>{item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-footer">
          <div className="cart-summary">
            <div>Total:</div>
            <div className="total">{formatPrice(totalPrice)}</div>
          </div>
          <div className="cart-actions">
            <Button 
              inverse 
              onClick={() => {
                props.onCloseCart();
                navigate("/shop");
              }
            }>
              Continue Shopping
            </Button>
            <Button danger onClick={placeOrderHandler}>
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Cart;
