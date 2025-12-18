import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import "../assets/header.css";
import vitLogo from "../assets/vit-logo-white.png";
import { useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';


import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Logout from '@mui/icons-material/Logout';
import axiosInstance from "../api/axiosInstance";

const pages = [""];
function Header() {
  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem("userId");
    // localStorage.removeItem("jwtToken");
    navigate("/login");
  }
  const [users, setUsers] = useState([])
  const userId = localStorage.getItem("userId")
  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.post("/client/getUsersById", {
          "userId": userId,
        });
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <AppBar position="static" id='appbar-chd'>
      <Container maxWidth="xxl" id='appbar-container-chd'>
        <Toolbar disableGutters id='toolbar-chd'>
          {/* --- Desktop Logo --- */}
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} id='appbar-box-chd'>
            <img src={vitLogo} alt="vit-logo" className="vit-logo" id="vit-logo-chd" />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }} id='box-mobile-menu-chd'>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              onClick={handleOpenNavMenu}
              color="inherit"
              id="moblie-menu-btn-chd"
            >
              <MenuIcon id='menu-icon-mob-chd' />
            </IconButton>
            <Menu
              id="menu-appbar-chd"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu} id="menu-item-chd">
                  <Typography textAlign="center" id='menu-text-chd'>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* --- Mobile Logo --- */}
          <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} id='box-vit-logo-con-chd'>
            <img src={vitLogo} alt="vit-logo" className="vit-logo" id='vit-logo-img-chd' />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
          </Typography>
          {/* --- Desktop Menu --- */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} id='box-des-chd'>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
                id="menu-text-des-chd"
              >
                {page}
              </Button>
            ))}
          </Box>
          {/* --- User Menu --- */}
          <Tooltip title="Profile" id="tooltip-user-menu-chd">
            <IconButton
              id="user-menu-btn-chd"
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              className="profile-btn"
            >
              <Avatar id='menu-avatar-chd' sx={{ width: 32, height: 32, background: "#fff", color: "#2c476d" }}> {users?.[0]?.username ? users?.[0]?.username.charAt(0).toUpperCase() : ""}</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu-chd"
            open={open}
            onClose={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem id="user-menu-item-email-chd">
              <div className="profile-text" id="user-menu-con-email-chd"><div className="icon-container" id="user-menu-email-chd"><MailOutlineIcon className="profile-icon" /></div>{users?.[0]?.emailid}</div>
            </MenuItem>
            <MenuItem id="user-menu-item-username-chd">
              <div className="profile-text" id="user-menu-con-username-chd"><div className="icon-container" id="user-menu-username-chd"><PersonIcon className="profile-icon" /></div>{users?.[0]?.username}</div>
            </MenuItem>
            <MenuItem id="user-menu-item-rolename-chd">
              <div className="profile-text" id="user-menu-con-rolename-chd"><div className="icon-container" id="user-menu-rolename-chd"><EmojiFlagsIcon className="profile-icon" /></div>{users?.[0]?.rolename}</div>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} id="user-menu-item-logout-chd">
              <ListItemIcon id="user-menu-item-logout-icon-con-chd">
                <Logout fontSize="small" id="user-menu-item-logout-icon-chd" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
