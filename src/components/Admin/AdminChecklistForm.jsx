import React, { useEffect, useState } from 'react';
import "../../assets/adminForm.css";
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate, useParams } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
import LinearProgress from '@mui/material/LinearProgress';

const AdminChecklistForm = () => {
    // -----------------------------------------------
    const CustomeBtn = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText("#2c476d"),
        textTransform: 'none',
        backgroundColor: "#2c476d",
        '&:hover': { backgroundColor: "#2c476d" },
    }));
    // -----------------------------------------------

    const { checklistId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [userInputField, setUserInputField] = useState({
        roleId: '',
        checkListContent: '',
        createdUser: '',
        modifiedUser: '',
        checklistDescription: '',
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
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axiosInstance.get("/auth/getAllRoleList");
                setRoles(response.data.data);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };
        fetchRoles();
    }, []);
    const fetchChecklist = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.post("/admin/checklist/getChecklistById", {
                "checkListId": checklistId
            });
            console.log(response);

            const checklist = response.data.data[0];

            setUserInputField({
                roleId: checklist.roleid || "",
                checkListContent: checklist.checklistcontent || "",
                createdUser: checklist.createduser || "",
                modifiedUser: checklist.modifieduser || "",
                checklistDescription: checklist.checklistdescription || "",
                active: checklist.isactive
            });
        } catch (error) {
            console.error("Error loading role:", error);
            toast.error("Failed to load role data");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (checklistId) {
            fetchChecklist();
        } else {
            setUserInputField({
                roleId: "",
                checkListContent: "",
                createdUser: "",
                modifiedUser: "",
                checklistDescription: "",
                active: true
            });
        }
    }, [checklistId]);
    const handelSubmit = async (e) => {
        e.preventDefault();
        let submitUser = { ...userInputField };

        if (checklistId) {
            delete submitUser.createdUser;
        } else {
            delete submitUser.modifiedUser;
        }
        try {
            setLoading(true);
            if (checklistId) {
                const response = await axiosInstance.put("/admin/checklist/updateChecklist", {
                    "checkListId": checklistId,
                    ...submitUser
                });
                toast.success(response.data.message || "Check List updated successfully");
            } else {
                const response = await axiosInstance.post("/admin/checklist/createChecklist", submitUser);
                toast.success(response.data.message || "Check List created successfully");
                setUserInputField({
                    roleId: "",
                    checkListContent: "",
                    createdUser: "",
                    modifiedUser: "",
                    checklistDescription: "",
                    active: true
                });
            }
            navigate('/admin/checklist');
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
            <h2>{checklistId ? "Edit Check List" : "Create Check List"}</h2>
            <form onSubmit={handelSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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

                <TextField
                    id="checkListContent"
                    label="Checklist Name"
                    variant="outlined"
                    name='checkListContent'
                    value={userInputField.checkListContent}
                    onChange={handelUser}
                    required
                />
                <TextareaAutosize
                    aria-label="minimum height"
                    minRows={5}
                    placeholder="Checklist Description"
                    name='checklistDescription'
                    value={userInputField.checklistDescription}
                    onChange={handelUser}
                    style={{ padding: "10px" }}
                />
                {!checklistId ? (
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
                    {checklistId ? "Update Check List" : "Create Check List"}
                </CustomeBtn>
            </form>
        </div>
    );
}

export default AdminChecklistForm;
