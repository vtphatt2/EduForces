import React from "react";
import { useState, useEffect } from "react";
import styles from "./AccountManagement.module.css";
import NavBar from "../../components/NavBar";
import Button from "../../components/Button";
import { AccountRowProps } from "./Type";
import { getTrueImageSrc, formatTimestamp } from "../../components/Common";

const baseUrl = "http://localhost:8080/api/v1";

const AccountManagement: React.FC = () => {
  const [users, setUsers] = useState<AccountRowProps[]>([]);
  const [roleSelected, setRoleSelected] = useState("all");
  const [activeSelected, setActiveSelected] = useState("all");

  const fetchUsers = async (role, isDeactivated: boolean | null) => {
    if (role === "all") {
      role = "";
    }
    try {
      const response = await fetch(
        `${baseUrl}/accounts/list-accounts?isDeactivated=${isDeactivated}?role=${role}`,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("session_id") || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      alert(`${error}`);
    }
  };

  useEffect(() => {
    fetchUsers("all", null);
  }, []);
  const changeRole = async (user, e) => {
    try {
      const response = await fetch(`${baseUrl}/accounts/update-role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("session_id") || "",
        },
        body: JSON.stringify({
          account_id: user.account_id,
          role: e.target.value,
        }),
      });

      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
      fetchUsers(
        roleSelected,
        activeSelected === "active"
          ? false
          : activeSelected === "banned"
          ? true
          : null
      );
    } catch (error) {
      alert(`${error}`);
    }
  };
  const toggleBan = async (user) => {
    try {
      const response = await fetch(`${baseUrl}/accounts/update-deactivation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("session_id") || "",
        },
        body: JSON.stringify({
          account_id: user.account_id,
          is_deactivated: !user.is_deactivated ? 1 : 2,
        }),
      });

      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
      fetchUsers(
        roleSelected,
        activeSelected === "active"
          ? false
          : activeSelected === "banned"
          ? true
          : null
      );
    } catch (error) {
      alert(`${error}`);
    }
  };
  const filterRole = async (role) => {
    fetchUsers(
      role,
      activeSelected === "active"
        ? false
        : activeSelected === "banned"
        ? true
        : null
    );
    setRoleSelected(role);
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
            onChange={(e) => filterRole(e.target.value)}
            value={roleSelected}
          >
            <option value="User">User</option>
            <option value="Coordinator">Coordinator</option>
            <option value="Admin">Admin</option>
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
              <tr key={user.account_id} className={styles.tableRow}>
                <td className={styles.tableData}>
                  <img
                    src={getTrueImageSrc(user.avatar_path)}
                    alt="avatar"
                    className={styles.avatar}
                  />
                </td>
                <td className={styles.tableData}>{user.username}</td>
                <td className={styles.tableData}>{user.email}</td>
                <td className={styles.tableData}>
                  {user.last_active.Valid
                    ? formatTimestamp(user.last_active.Time)
                    : "Online"}
                </td>
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
                    <option value="User">User</option>
                    <option value="Coordinator">Coordinator</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td className={styles.tableData}>
                  {user.is_deactivated ? "Banned" : "Active"}
                </td>
                <td className={styles.tableData}>
                  <Button
                    label={user.is_deactivated ? "Unban" : "Ban"}
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
