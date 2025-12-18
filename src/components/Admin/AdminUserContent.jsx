import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TablePagination from "@mui/material/TablePagination";
import LinearProgress from "@mui/material/LinearProgress";
import noData from '../../assets/not_found.gif';
import Button from "@mui/material/Button";
import SearchIcon from '@mui/icons-material/Search';

const AdminUserContent = () => {
  // -----------------------------------------------
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // -----------------------------------------------
  const [users, setUsers] = useState([]);
  const [roleNames, setRoleNames] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [noDataError, setNoDataError] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setNoDataError(false);
      const response = await axiosInstance.get("/admin/getAllUsersByVerified");
      setUsers(response.data.data);
    } catch (error) {
      setNoDataError(true);
      toast.error(error.response.data.message);
      console.error("Error fetching Users:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleSearchFilter = (e) => {
    setSearchName(e.target.value)
  }
  const searchUserByName = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setNoDataError(false);
      const response = await axiosInstance.post("/admin/getUsersByName", { userName: searchName });
      setUsers(response.data.data);
    } catch (error) {
      setNoDataError(true);
      toast.error(error.response.data.message);
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  }
  const getRoleName = async (roleId) => {
    if (roleNames[roleId]) return;

    try {
      const res = await axiosInstance.post("/admin/role/getRoleById", {
        "roleId": roleId
      });
      const roleName = res.data.data[0]?.rolename || "N/A";

      setRoleNames(prev => ({ ...prev, [roleId]: roleName }));
    } catch (err) {
      setRoleNames(prev => ({ ...prev, [roleId]: "N/A" }));
    }
  };

  return (
    <div>
      {loading && (
        <div className="loading-bar">
          <LinearProgress />
        </div>
      )}
      <div className="content-header">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/admin/">
            Admin
          </Link>
          <Link
            underline="hover"
            color="text.primary"
            href="/admin/user"
            aria-current="page"
          >
            User
          </Link>
        </Breadcrumbs>
      </div>
      <div className="card">
        <div className="filter">
          <form action="" onSubmit={searchUserByName}>
            <div className="input-collaps">
              <input placeholder="Search Roles" id="searchinput" className="search-filter-input" type="text" value={searchName} onChange={handleSearchFilter} />
              <Button type="submit"><SearchIcon /></Button>
            </div>
          </form>
          <div className="filter-bar-btn mobile-show">
            <IconButton
              size="small"
              sx={{ ml: 2 }}
              className="filter-icon">
              <FilterAltIcon />
            </IconButton>
          </div>
        </div>

        <table className="custom-table">
          {noDataError ? (
            <>
              <div className="no-data">
                <img src={noData} alt="no data" />
                <p>User Not Found</p>
              </div>
            </>
          ) : (
            <>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Phone Number</th>
                  <th>Email ID</th>
                  <th>Role Name</th>
                  <th>User Verification</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => {
                  getRoleName(data.roleid)
                  return (
                    <tr key={index}>
                      <td>{data.username}</td>
                      <td>{data.phonenumber}</td>
                      <td>{data.emailid}</td>
                      <td>{roleNames[data.roleid] || "Loading..."}</td>
                      <td>
                        <span className={`status-badge ${data.otpverified}`}>
                          {data.otpverified ? "Verified" : "Not Verified"}
                        </span>
                      </td>
                    </tr>
                  )
                }
                )}
              </tbody>
            </>
          )}
        </table>

        <div className="table-footer">
          <TablePagination
            component="div"
            count={users.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminUserContent;
