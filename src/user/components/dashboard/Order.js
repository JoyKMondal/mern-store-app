import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import Button from "../../../shared/components/FormElements/Button";
import Card from "../../../shared/components/UIElements/Card";
import "./Order.css";
import "./wishlist.css";
import { format, parse } from "date-fns";

const formatDate = (dateString) => {
  const parsedDate = parse(dateString, "MM/dd/yyyy", new Date());
  return format(parsedDate, "EEEE, MMM dd, yyyy");
};

const Order = () => {
  const [loadedOrders, setLoadedOrders] = useState();
  const [totalPrice, setTotalPrice] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const param = useParams();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/products/order/${param.userId}`
        );

        setLoadedOrders(responseData.orders);
        setTotalPrice(responseData.total);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest, param.userId]);

  if (loadedOrders?.length <= 0) {
    return (
      <div className="place-list center">
        <Card>
          <h4>No products found. Maybe create one?</h4>
          <h5>you should be an admin to create product.</h5>
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

  // const handleInvoice = async (orderId) => {
  //   const responseData = await sendRequest(
  //     `${process.env.REACT_APP_BACKEND_URL}/api/products/user/${param.userId}/orders/${orderId}`,
  //     "GET",
  //     null,
  //     {
  //       "Content-Type": "application/pdf",
  //     }
  //   );
  //   if (!responseData.ok) {
  //     throw new Error("Failed to fetch invoice.");
  //   }
  //   const blob = responseData.blob();
  //   const url = window.URL.createObjectURL(
  //     new Blob([blob], { type: "application/pdf" })
  //   );
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.setAttribute("download", `invoice-${orderId}.pdf`);
  //   document.body.appendChild(link);
  //   link.click();
  //   link.parentNode.removeChild(link);
  // };

  return (
    <div className="Wishlist">
      <h3>Orders</h3>
      <div className="wishlist-container">
        {loadedOrders &&
          loadedOrders.map((order) => (
            <div className="orders__item">
              <Link to={`/orders/${order.id}`}>
                <h1>
                  Order Id - #{order.id}
                  {/* <a
                  href={`${process.env.REACT_APP_BACKEND_URL}/api/products/user/${param.userId}/orders/${order.id}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  Invoice
                </a> */}
                  {/* <button onClick={() => handleInvoice(order.id)}>Invoice</button> */}
                </h1>
                <p>
                  Ordered on{" "}
                  {formatDate(new Date(order.createdAt).toLocaleDateString())}
                </p>
                <p>Order Total: ${totalPrice}</p>
                {/* <div className="wishlist-item">
                {order.products.map((p) => (
                  <>
                    <img
                      src={`${p.product.imageUrl}`}
                      alt={p.product.title}
                      className="wishlist-image"
                    />
                    <div className="wishlist-details">
                      <h2>
                        {p.product.title}(x{p.quantity})
                      </h2>
                      <p>${p.product.price}</p>
                    </div>
                  </>
                ))}
              </div> */}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Order;
