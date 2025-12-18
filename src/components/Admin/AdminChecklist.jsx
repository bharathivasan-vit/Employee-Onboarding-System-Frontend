import React, { useEffect, useState } from "react";
import "../../assets/adminUser.css";
import { MdMoreVert, MdCheckCircle } from "react-icons/md";
import axiosInstance from "../../api/axiosInstance";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import IconButton from "@mui/material/IconButton";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
import TablePagination from "@mui/material/TablePagination";
import LinearProgress from "@mui/material/LinearProgress";
import noData from '../../assets/not_found.gif';
import SearchIcon from '@mui/icons-material/Search';

const AdminChecklist = () => {
  // -----------------------------------------------
  const CustomeBtn = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText("#000"),
    textTransform: 'none',
    backgroundColor: "#000",
    '&:hover': { backgroundColor: "#000" },
  }));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event, ChecklistId) => {
    setAnchorEl(event.currentTarget);
    setSelectedChecklistId(ChecklistId);
  };
  // -----------------------------------------------
  const [checklist, setChecklist] = useState([]);
  const [selectedChecklistId, setSelectedChecklistId] = useState(null);

  const navigate = useNavigate();
  const [roleNames, setRoleNames] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [noDataError, setNoDataError] = useState(false)

  const fetchChecklist = async () => {
    try {
      setLoading(true);
      setNoDataError(false);
      const response = await axiosInstance.get("/admin/checklist/getAllChecklist");
      setChecklist(response.data.data);
    } catch (error) {
      setNoDataError(true);
      toast.error(error.response.data.message);
      console.error("Error fetching Checklist:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchChecklist();
  }, []);

  const handleSearchFilter = (e) => {
    setSearchName(e.target.value.toUpperCase())
  }
  const searchChecklistByName = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setNoDataError(false);
      const response = await axiosInstance.post("/admin/checklist/getChecklistByName", { checkListContent: searchName });
      setChecklist(response.data.data);
    } catch (error) {
      setNoDataError(true);
      toast.error(error.response.data.message);
      console.error("Error fetching Checklist:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = () => {
    navigate(`/admin/checklistform/${selectedChecklistId}`);
  };
  const handleCreateRolebtn = () => {
    navigate(`/admin/checklistform`);
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
      toast.error(err.response.data.message);
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
            href="/admin/checklist"
            aria-current="page"
          >
            Checklist
          </Link>
        </Breadcrumbs>
        <CustomeBtn variant="contained" className="add-user-button" onClick={handleCreateRolebtn}><AddIcon />Create Roles</CustomeBtn>
      </div>
      <div className="card">
        <div className="filter">
          <div className="search-filter">
            <form action="" onSubmit={searchChecklistByName}>
              <div className="input-collaps">
                <input placeholder="Search Roles" id="searchinput" className="search-filter-input" type="text" value={searchName} onChange={handleSearchFilter} />
                <Button type="submit"><SearchIcon /></Button>
              </div>
            </form>
          </div>
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
                <p>Checklist Not Found</p>
              </div>
            </>
          ) : (
            <>
              <thead>
                <tr>
                  <th>Role Id</th>
                  <th>Checklist Content</th>
                  <th>Checklist Description</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {checklist.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => {
                  getRoleName(data.roleid)
                  return (
                    <tr key={index}>
                      <td>{roleNames[data.roleid] || "Loading..."}</td>
                      <td>{data.checklistcontent}</td>
                      <td>{data.checklistdescription}</td>
                      <td>
                        <span className={`status-badge ${data.isactive}`}>
                          {data.isactive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <IconButton
                          id="fade-button"
                          aria-controls={open ? 'fade-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                          onClick={(e) => handleClick(e, data.checklistid)}
                        >
                          <MdMoreVert className="menu-icon" />
                        </IconButton >
                      </td>
                    </tr>
                  )
                }
                )}
              </tbody>
            </>
          )}
          <Menu id="fade-menu"
            slotProps={{
              list: {
                'aria-labelledby': 'fade-button',
              },
            }}
            slots={{ transition: Fade }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={() => {
              handleEdit(selectedChecklistId);
              handleClose();
            }} className="editbtn"><EditIcon className="icon" />Edit</MenuItem>
          </Menu>
        </table>

        <div className="table-footer">
          <TablePagination
            component="div"
            count={checklist.length}
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

export default AdminChecklist;
