import React, { useEffect, useState, useRef } from 'react';
import "../../assets/adminUser.css";
import axiosInstance from "../../api/axiosInstance";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import MenuItem from '@mui/material/MenuItem';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Menu from '@mui/material/Menu';
import noData from '../../assets/not_found.gif';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DescriptionIcon from '@mui/icons-material/Description';

const AdminOnboarding = () => {
    // -----------------------------------------------
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = useState(null);
    const ITEM_HEIGHT = 48;
    const open = Boolean(anchorEl);
    const handlefilter = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    // -----------------------------------------------
    const [roles, setRoles] = useState([]);
    const [onboarding, setOnboarding] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noDataError, setNoDataError] = useState(false)
    const [openUserId, setOpenUserId] = useState(null);

    const handleRowClick = (id) => {
        setOpenUserId(openUserId === id ? null : id);
    };

    const [userInputField, setUserInputField] = useState({
        startDate: null,
        endDate: null,
        roleId: null,
        status: null,
        emailId: null,
    });

    const handelUser = (e) => {
        let { name, value } = e.target;
        setUserInputField(prev => ({ ...prev, [name]: value }));
    }

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setNoDataError(false);
            const response = await axiosInstance.post("/admin/getOnboardingBulkRecordsByFilter", {
                startDate: null,
                endDate: null,
                roleId: null,
                status: null,
                emailId: null
            });
            setOnboarding(response.data.data);
        } catch (error) {
            setNoDataError(true);
            toast.error(error.response.data.message);
            console.error("Error loading all data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleFilterSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setNoDataError(false);
            const response = await axiosInstance.post("/admin/getOnboardingBulkRecordsByFilter", {
                startDate: userInputField.startDate,
                endDate: userInputField.endDate,
                roleId: userInputField.roleId,
                status: userInputField.status,
                emailId: userInputField.emailId
            }
            );
            setOnboarding(response.data.data);
        } catch (error) {
            setNoDataError(true);
            toast.error(error.response.data.message);
            console.error("Error fetching filtered data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axiosInstance.get("/auth/getAllRoleList");
                setRoles(response.data.data);
            } catch (error) {
                toast.error(error.response.data.message);
                console.error("Error fetching roles:", error);
            }
        };
        fetchRoles();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const excelOnboardingDatas = onboarding.flatMap(user =>
        user.checkList.map(item => ({
            "User Name": user.userName,
            "Email Id": user.emailId,
            "Phone Number": user.phoneNumber,
            "Role Name": user.roleName,
            "Checklist Content": item.checkListContent,
            "Checklist Description": item.checklistDescription,
            "Checklist Status": item.status ? "Completed" : "Pending",
            "Created Date": formatDate(item.createdDate),
        }))
    );

    const exportToExcel = () => {
        if (!onboarding || onboarding.length === 0) {
            alert("No data to export");
            return;
        }

        // Convert JSON to worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelOnboardingDatas);

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        // Save file
        const blob = new Blob(
            [excelBuffer],
            { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
        );

        saveAs(blob, "getAllData.xlsx");
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
                        href="/admin/onboarding"
                        aria-current="page"
                    >
                        Onboarding
                    </Link>
                </Breadcrumbs>
            </div>
            <div className="filter-bar mobile-hide">
                <form action="" className="filter-container" onSubmit={handleFilterSubmit}>
                    <div className="filter-bar-inputs">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Start Date"
                                value={userInputField.startDate ? dayjs(userInputField.startDate) : null}
                                onChange={(newValue) =>
                                    setUserInputField(prev => ({
                                        ...prev,
                                        startDate: newValue ? newValue.format("YYYY-MM-DD") : ""
                                    }))
                                }
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="filter-bar-inputs">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="End Date"
                                value={userInputField.endDate ? dayjs(userInputField.endDate) : null}
                                onChange={(newValue) =>
                                    setUserInputField(prev => ({
                                        ...prev,
                                        endDate: newValue ? newValue.format("YYYY-MM-DD") : ""
                                    }))
                                }
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="filter-bar-inputs">
                        <Autocomplete
                            options={roles}
                            getOptionLabel={(option) => option.rolename || ""}
                            value={roles.find((item) => item.roleid === userInputField.roleId) || null}
                            onChange={(event, newValue) =>
                                setUserInputField((prev) => ({
                                    ...prev,
                                    roleId: newValue ? newValue.roleid : "",
                                }))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Role"
                                    variant="outlined"
                                    name="roleId"
                                />
                            )}
                        />
                    </div>
                    <div className="filter-bar-inputs">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Status"
                                name='status'
                                onChange={handelUser}
                                value={userInputField.status}
                            >
                                <MenuItem value={true}>Completed</MenuItem>
                                <MenuItem value={false}>Pending</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="filter-bar-inputs">
                        <TextField
                            className='flter-email'
                            id="searchOnboarding"
                            label="Search Onboarding"
                            variant="outlined"
                            name='emailId'
                            value={userInputField.emailId}
                            onChange={handelUser}
                        />
                    </div>
                    <div className="filter-bar-submit">
                        <Button type='submit'><FilterAltIcon />Filter</Button>
                    </div>
                </form>
            </div>
            <div className="card">
                <div className="filter-bar-btn mobile-show">
                    <IconButton
                        size="small"
                        sx={{ ml: 2 }}
                        className="filter-icon"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handlefilter}
                    >
                        <FilterAltIcon />
                    </IconButton>

                    <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                            paper: {
                                style: {
                                    width: '20ch',
                                },
                            },
                            list: {
                                'aria-labelledby': 'long-button',
                            },
                        }}
                    >
                        <form action="" className="filter-container-mob" onSubmit={handleFilterSubmit}>
                            <div className="filter-bar-inputs-mob">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Start Date"
                                        value={userInputField.startDate ? dayjs(userInputField.startDate) : null}
                                        onChange={(newValue) =>
                                            setUserInputField(prev => ({
                                                ...prev,
                                                startDate: newValue ? newValue.format("YYYY-MM-DD") : ""
                                            }))
                                        }
                                    />
                                </LocalizationProvider>
                            </div>
                            <div className="filter-bar-inputs-mob">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="End Date"
                                        value={userInputField.endDate ? dayjs(userInputField.endDate) : null}
                                        onChange={(newValue) =>
                                            setUserInputField(prev => ({
                                                ...prev,
                                                endDate: newValue ? newValue.format("YYYY-MM-DD") : ""
                                            }))
                                        }
                                    />
                                </LocalizationProvider>
                            </div>
                            <div className="filter-bar-inputs-mob">
                                <Autocomplete
                                    options={roles}
                                    getOptionLabel={(option) => option.rolename || ""}
                                    value={roles.find((item) => item.roleid === userInputField.roleId) || null}
                                    onChange={(event, newValue) =>
                                        setUserInputField((prev) => ({
                                            ...prev,
                                            roleId: newValue ? newValue.roleid : "",
                                        }))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Role"
                                            variant="outlined"
                                            name="roleId"
                                        />
                                    )}
                                />
                            </div>
                            <div className="filter-bar-inputs-mob">
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Status"
                                        name='status'
                                        onChange={handelUser}
                                        value={userInputField.status}
                                    >
                                        <MenuItem value={true}>Completed</MenuItem>
                                        <MenuItem value={false}>Pending</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="filter-bar-inputs-mob">
                                <TextField
                                    className='flter-email'
                                    id="searchOnboarding"
                                    label="Search Onboarding"
                                    variant="outlined"
                                    name='emailId'
                                    value={userInputField.emailId}
                                    onChange={handelUser}
                                />
                            </div>
                            <div className="filter-bar-submit-mob">
                                <Button type='submit'>Filter</Button>
                            </div>
                        </form>
                    </Menu>
                </div>
                <div className="download-con">
                    <Button size="small" onClick={exportToExcel} color="success" variant="outlined" ><DescriptionIcon style={{marginRight:"7px"}}/>Export</Button>
                </div>
                <table className="custom-table" >
                    {noDataError ? (
                        <>
                            <div className="no-data">
                                <img src={noData} alt="no data" />
                                <p>Onboarding Data Not Found</p>
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
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>

                                {onboarding.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => {
                                    const total = user.checkList.length;
                                    const completed = user.checkList.filter(i => i.status == true).length;
                                    const color = completed === total ? "#eeffec" : "";

                                    return (
                                        <React.Fragment key={index}>
                                            <tr onClick={() => handleRowClick(user.userId)} style={{ cursor: "pointer", backgroundColor: color }}>
                                                <td><span className='acc-title'>{user.userName}</span></td>
                                                <td><span className='acc-title'>{user.phoneNumber}</span></td>
                                                <td><span className='acc-title'>{user.emailId}</span></td>
                                                <td><span className='acc-title'>{user.roleName}</span></td>
                                                <td>
                                                    <span className='acc-title'>
                                                        {completed} / {total}
                                                    </span>
                                                </td>
                                            </tr>
                                            {openUserId === user.userId && (
                                                <tr>
                                                    <td colSpan="6" style={{ background: "#f7f7f7" }}>
                                                        {user.checkList.map((item, idx) => (
                                                            <div key={idx} className="acc-title-container">
                                                                <div className="acc-title">{item.checkListContent}</div>
                                                                <span className={`status-badge-onboarding ${item.status}`}>
                                                                    {item.status ? "Completed" : "Pending"}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                            </tbody>
                        </>
                    )}
                </table>

                <div className="table-footer">
                    <TablePagination
                        component="div"
                        count={onboarding.length}
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
    )
}

export default AdminOnboarding