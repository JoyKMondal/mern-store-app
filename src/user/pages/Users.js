import React, { useEffect, useState } from "react";

// import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/users`
        );

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {/* {!isLoading && loadedUsers && <UsersList items={loadedUsers} />} */}
      {!isLoading && loadedUsers && (
        <div>
          <Container>
            <Form>
              <InputGroup className="my-3">
                <Form.Control
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users"
                />
              </InputGroup>
            </Form>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>E-mail</th>
                  <th>User Type</th>
                  <th>User Id</th>
                </tr>
              </thead>
              <tbody>
                {loadedUsers
                  .filter((item) => {
                    return search.toLowerCase() === ""
                      ? item
                      : item.name.toLowerCase().includes(search);
                  })
                  .map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          style={{ height: "30px", width: "30px" }}
                          src={`${item.image}`}
                          alt={item.name}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.userType}</td>
                      <td>{item.id}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Container>
        </div>
      )}
    </React.Fragment>
  );
};

export default Users;
