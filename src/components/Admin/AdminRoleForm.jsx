import React, { useEffect, useState } from 'react';
import "../../assets/adminForm.css";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate, useParams } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';

const AdminRoleForm = () => {
    // -----------------------------------------------
    const CustomeBtn = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText("#2c476d"),
        textTransform: 'none',
        backgroundColor: "#2c476d",
        '&:hover': { backgroundColor: "#2c476d" },
    }));
    // -----------------------------------------------

    const { roleId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userInputField, setUserInputField] = useState({
        roleName: '',
        createdUser: '',
        modifiedUser: '',
        active: true
    });

    const handelUser = (e) => {
        let { name, value } = e.target;
        if (name == 'active') {
            setUserInputField(prev => ({ ...prev, [name]: value }));
        } else {
            setUserInputField(prev => ({ ...prev, [name]: value.toUpperCase() }));
        }
    }

    const fetchRole = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.post("/admin/role/getRoleById", {
                "roleId": roleId
            });

            const role = response.data.data[0];

            setUserInputField({
                roleName: role.rolename || "",
                createdUser: role.createduser || "",
                modifiedUser: role.modifieduser || "",
                active: role.isactive
            });
        } catch (error) {
            console.error("Error loading role:", error);
            toast.error(error.response?.data?.message || "Failed to load role data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (roleId) {
            fetchRole();
        } else {
            setUserInputField({
                roleName: "",
                createdUser: "",
                modifiedUser: "",
                active: true
            });
        }
    }, [roleId]);

    const handelSubmit = async (e) => {
        e.preventDefault();
        let submitUser = { ...userInputField };

        if (roleId) {
            delete submitUser.createdUser;
        } else {
            delete submitUser.modifiedUser;
        }
        try {
            setLoading(true);
            if (roleId) {
                const response = await axiosInstance.put("/admin/role/updateRole", {
                    "roleId": roleId,
                    ...submitUser
                });
                toast.success(response.data.message || "Role updated successfully");
            } else {
                const response = await axiosInstance.post("/admin/role/createRole", submitUser);
                toast.success(response.data.message || "Role created successfully");
                setUserInputField({
                    roleName: "",
                    createdUser: "",
                    active: true
                });
            }
            navigate('/admin/role');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-form-container">
            {loading && (
                <div className="loading-bar">
                    <LinearProgress />
                </div>
            )}
            <h2>{roleId ? "Edit Role" : "Create Role"}</h2>
            <form onSubmit={handelSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <TextField
                    id="roleName"
                    label="Role Name"
                    variant="outlined"
                    name='roleName'
                    value={userInputField.roleName}
                    onChange={handelUser}
                    required
                />
                {!roleId ? (
                    <TextField
                        id="createdUser"
                        label="Created User"
                        variant="outlined"
                        name='createdUser'
                        value={userInputField.createdUser}
                        onChange={handelUser}
                        required
                    />
                ) : (
                    <TextField
                        id="modifiedUser"
                        label="Modified User"
                        variant="outlined"
                        name='modifiedUser'
                        value={userInputField.modifiedUser}
                        onChange={handelUser}
                        required
                    />
                )}

                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Status"
                        name='active'
                        value={userInputField.active}
                        onChange={handelUser}
                    >
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                    </Select>
                </FormControl>

                <CustomeBtn type='submit' variant="contained">
                    {roleId ? "Update Role" : "Create Role"}
                </CustomeBtn>
            </form>
        </div>
    );
}

export default AdminRoleForm;
