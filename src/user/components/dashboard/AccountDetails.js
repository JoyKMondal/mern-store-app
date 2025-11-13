import React, { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import Input from "../../../shared/components/FormElements/Input";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../shared/util/validators";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { useParams } from "react-router-dom";
import Button from "../../../shared/components/FormElements/Button";
import { useForm } from "../../../shared/hooks/form-hook";
import "./PlaceForm.css";
import Card from "../../../shared/components/UIElements/Card";

const AccountDetails = () => {
  const auth = useContext(AuthContext);
  const userId = useParams().userId;
  const [updateUser, setUpdateUser] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      }
    },
    false
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`
        );

        setUpdateUser(responseData.user);
        setFormData(
          {
            name: {
              value: responseData.user.name,
              isValid: true,
            },
            email: {
              value: responseData.user.email,
              isValid: true,
            },
            password: {
              value: responseData.user.password,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest, userId, setFormData]);

  const userUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // const formData = new FormData();
      // formData.append("name", formState.inputs.name.value);
      // formData.append("email", formState.inputs.email.value);
      // formData.append("password", formState.inputs.password.value);
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`,
        "PATCH",
        // formData,
        JSON.stringify({
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      navigate(`/user-dashboard/${userId}`);
    } catch (err) {}
  };

  if (!updateUser && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="acc-details">
        <h3>Logged in as {`${auth.userType}`}</h3>
      </div>
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && updateUser && (
        <form className="place-form" onSubmit={userUpdateSubmitHandler}>
          <div className="image-wrapper">
            <img
              className="wrap-image"
              src={`${updateUser.image}`}
              alt={updateUser.name}
            />
          </div>

          <Input
            element="input"
            id="name"
            type="text"
            label="Your Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name."
            onInput={inputHandler}
            initialValue={updateUser.name}
            initialValid={true}
          />
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
            initialValue={updateUser.email}
            initialValid={true}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PROFILE
          </Button>
        </form>
      )}
    </Fragment>
  );
};

export default AccountDetails;
