import React from "react";
import { useState, useEffect } from "react";
import styles from "./AccountManagement.module.css";
import NavBar from "../../components/NavBar";
import Button from "../../components/Button";

const baseUrl = "http://localhost:8080/api/v1";

const AccountManagement: React.FC = () => {
  const usersX = [
    {
      avatarSrc: "https://via.placeholder.com/150",
      id: "1",
      name: "John Doe",
      username: "johndoe",
      email: "johndoe@gmail.com",
      lastLogin: "2021-08-01",
      role: "user",
      isActived: false,
    },
    {
      avatarSrc: "https://via.placeholder.com/150",
      id: "2",
      name: "Jane Doe",
      username: "janedoe",
      email: "janedoe@example.com",
      lastLogin: "2021-08-01",
      role: "coordinator",
      isActived: true,
    },
    {
      avatarSrc: "https://via.placeholder.com/150",
      id: "3",
      name: "Admin",
      username: "admin",
      email: "admin@eduforces.com",
      lastLogin: "2021-08-01",
      role: "admin",
      isActived: true,
    },
  ];
  const [users, setUsers] = useState(usersX);
  const [roleSelected, setRoleSelected] = useState("all");
  const [activeSelected, setActiveSelected] = useState("all");
  const changeRole = async (user, e) => {
    const newRole = e.target.value;
    try {
      const response = await fetch(`${baseUrl}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("session_id") || "",
        },
        body: JSON.stringify({ role: newRole, id: user.id }),
      });

      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
      //fetch all Users
    } catch (error) {
      alert(`${error}`);
    }
  };
  const toggleBan = async (user) => {
    const currentStatus = user.isActived;
    try {
      const response = await fetch(`${baseUrl}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("session_id") || "",
        },
        body: JSON.stringify({ id: user.id, isActived: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
      //fetch all Users
    } catch (error) {
      alert(`${error}`);
    }
  };
  return (
    <main className={styles.accountManagement}>
      <NavBar />
      <div className={styles.searchAndFilter}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search for users"
            className={styles.searchInput}
          />
          <Button label="Search" onClick={() => {}} />
        </div>
        <div className={styles.filterRole}>
          <select
            className={styles.filterSelect}
            defaultValue="all"
            onChange={(e) => setRoleSelected(e.target.value)}
            value={roleSelected}
          >
            <option value="user">User</option>
            <option value="coordinator">Coordinator</option>
            <option value="admin">Admin</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className={styles.filterActive}>
          <select
            className={styles.filterSelect}
            defaultValue="all"
            onChange={(e) => setActiveSelected(e.target.value)}
            value={activeSelected}
          >
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>
      <div className={styles.table}>
        <table className={styles.tableElement}>
          <thead className={styles.tableHead}>
            <tr className={styles.tableRow}>
              <th className={styles.tableHeader}>Avatar</th>
              <th className={styles.tableHeader}>Username</th>
              <th className={styles.tableHeader}>Email</th>
              <th className={styles.tableHeader}>Last Login</th>
              <th className={styles.tableHeader}>Role</th>
              <th className={styles.tableHeader}>Active</th>
              <th className={styles.tableHeader}>Action</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {users.map((user) => (
              <tr key={user.id} className={styles.tableRow}>
                <td className={styles.tableData}>
                  <img
                    src={user.avatarSrc}
                    alt="avatar"
                    className={styles.avatar}
                  />
                </td>
                <td className={styles.tableData}>{user.username}</td>
                <td className={styles.tableData}>{user.email}</td>
                <td className={styles.tableData}>{user.lastLogin}</td>
                <td className={styles.tableData}>
                  <select
                    className={styles.roleSelect}
                    value={user.role}
                    onChange={
                      //   (e) => {
                      //   const newUsers = users.map((u) => {
                      //     if (u.id === user.id) {
                      //       return { ...u, role: e.target.value };
                      //     }
                      //     return u;
                      //   });
                      //   setUsers(newUsers);
                      // }
                      (e) => changeRole(user, e)
                    }
                  >
                    <option value="user">User</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className={styles.tableData}>
                  {user.isActived ? "Yes" : "No"}
                </td>
                <td className={styles.tableData}>
                  <Button
                    label={user.isActived ? "Ban" : "Unban"}
                    onClick={
                      // user.isActived
                      //   ? () => {
                      //       const newUsers = users.map((u) => {
                      //         if (u.id === user.id) {
                      //           return { ...u, isActived: false };
                      //         }
                      //         return u;
                      //       });
                      //       setUsers(newUsers);
                      //     }
                      //   : () => {
                      //       const newUsers = users.map((u) => {
                      //         if (u.id === user.id) {
                      //           return { ...u, isActived: true };
                      //         }
                      //         return u;
                      //       });
                      //       setUsers(newUsers);
                      //     }
                      () => toggleBan(user)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};
export default AccountManagement;
