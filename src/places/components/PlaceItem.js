import React, { Fragment, useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceItem.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { Link, useLocation } from "react-router-dom";
import { formatPrice } from "../../shared/util/converters";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { isLiked, onToggleLike } = props;

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
    console.log("delete warning!!!");
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>

      {isLoading && <LoadingSpinner asOverlay />}
      <div className="meal">
        <div className="stock">
          <FontAwesomeIcon
            icon={faHeart}
            style={{
              cursor: "pointer",
              fontSize: "20px",
              color: isLiked ? "red" : "gray",
            }}
            onClick={() => onToggleLike(props.id)}
          />
        </div>
        <div className="meal_item">
          <Link to={`/products/${props.id}`}>
            <header>
              <img
                src={`${props.image}`}
                alt={props.title}
                className="img"
              />
              <div className="rows">
                <div className="headerText">
                  <h2>{props.title}</h2>
                  <p>by {props.author}</p>
                </div>
                <h3>{formatPrice(props.price)}</h3>
              </div>
            </header>
            <div className="content">
              <p className="summary">{props.description}</p>
            </div>
          </Link>
          <div className="actions">
            {auth.userId === props.creatorId &&
              auth.userType === "Admin" &&
              location.pathname !== "/shop" && (
                <div>
                  <Button to={`/admin-dashboard/places/${props.id}`}>
                    EDIT
                  </Button>
                  <Button
                    danger
                    onClick={showDeleteWarningHandler}
                  >
                    DELETE
                  </Button>
                </div>
              )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PlaceItem;
