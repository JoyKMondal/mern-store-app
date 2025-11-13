import React, { useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import Button from "../../../shared/components/FormElements/Button";
import Card from "../../../shared/components/UIElements/Card";
import "./Order.css";
import "./wishlist.css";
import { format, parse } from "date-fns";
import { AuthContext } from "../../../shared/context/auth-context";
import { IoMdArrowBack } from "react-icons/io";
import "./OrderDetails.css";

const formatDate = (dateString) => {
  const parsedDate = parse(dateString, "MM/dd/yyyy", new Date());
  return format(parsedDate, "EEEE, MMM dd, yyyy");
};

const OrderDetails = () => {
  const [loadedOrders, setLoadedOrders] = useState();
  const [totalPrice, setTotalPrice] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/products/order/${auth.userId}`
        );

        setLoadedOrders(responseData.orders);
        setTotalPrice(responseData.total);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest, auth.userId]);

  const cancelOrderHandler = async (orderId) => {
    await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/api/products/order/${orderId}`,
      "DELETE",
      null,
      {
        Authorization: "Bearer " + auth.token,
      }
    );

    setLoadedOrders((prevOrderItems) =>
      prevOrderItems.filter((order) => order.id !== orderId)
    );
  };

  if (loadedOrders?.length <= 0) {
    return (
      <div className="place-list center">
        <Card>
          <h4>No orders found.</h4>
          <h5>Please go to shop and order your favourite products.</h5>
          <Button to="/shop">Purchase your favourite product</Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    <div className="center">
      <LoadingSpinner />
    </div>;
  }

  return (
    <div className="order-details">
      <div className="detail-title">
        <h3>Orders Details</h3>
        <Link to={`/user-dashboard/${auth.userId}/orders`}>
          <IoMdArrowBack />
          Back to Orders
        </Link>
      </div>
      <hr />

      {loadedOrders &&
        loadedOrders.map((order) => (
          <div className="about-order">
            <div className="about-order-left">
              <p>
                <p>Order Id:</p>
                <p>{order.id}</p>
              </p>
              <p>
                <p>Order Date:</p>
                <p>
                  {formatDate(new Date(order.createdAt).toLocaleDateString())}
                </p>
              </p>
            </div>
            <div className="about-order-right">
              <Button inverse onClick={() => cancelOrderHandler(order.id)}>
                Cancel Order
              </Button>
            </div>
          </div>
        ))}
      <hr />

      <div className="order-lists-container">
        {loadedOrders &&
          loadedOrders.map((order) => (
            <div className="main-order-section">
              <div className="orders__items">
                <h3>Order Items</h3>
                <hr />
                <div className="order-lists">
                  {order.products.map((p) => (
                    <div className="single-item">
                      <img
                        src={`${p.product.imageUrl}`}
                        alt={p.product.title}
                        className="order-list-image"
                      />
                      <div className="order-list-details">
                        <div>
                          <h3>{p.product.title}</h3>
                          <p>${p.product.price}</p>
                        </div>
                        <div>
                          <h3>{p.quantity}</h3>
                          <p>Quantity</p>
                        </div>
                        <div>
                          <h3>{p.product.price * p.quantity}</h3>
                          <p>Total Price</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-summary">
                <h3>Order Summary</h3>
                <hr />
                <div className="order-summery-calc">
                  <p>
                    <p>Subtotal:</p>
                    <p>${totalPrice}</p>
                  </p>
                  <p>
                    <p>Est. Sales Tax:</p>
                    <p>${order.products && order.products.length * 1}</p>
                  </p>
                  <hr />
                  <p>
                    <p>Total:</p>
                    <p>${+totalPrice + order.products.length}</p>
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrderDetails;
