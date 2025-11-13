import React, { useContext, useState } from "react";

import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceItemAdmin.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const PlaceItemAdmin = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
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
      <tr key={props.id}>
        <td>
          <img
            style={{ height: "30px", width: "30px" }}
            src={`${props.image}`}
            alt={props.title}
          />
        </td>
        <td>{props.title}</td>
        <td>{props.author}</td>
        <td>{props.stock}</td>
        <td>{props.id}</td>
        <td>
          {auth.userId === props.creatorId && (
            <Button size="small" to={`/admin-dashboard/places/${props.id}`}>
              EDIT
            </Button>
          )}
        </td>
        <td>
          {auth.userId === props.creatorId && (
            <Button size="small" danger onClick={showDeleteWarningHandler}>
              DELETE
            </Button>
          )}
        </td>
      </tr>
    </React.Fragment>
  );
};

export default PlaceItemAdmin;
