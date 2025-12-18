import React, { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";
import TablePagination from '@mui/material/TablePagination';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import IconButton from '@mui/material/IconButton';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import noData from '../../assets/not_found.gif';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  // ------------------------------Roles----------------------------------------
  const [roles, setRoles] = useState([]);
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/role/getAllRole");
      setRoles(response.data.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRoles();
  }, []);

  const totalRoles = roles.length;
  const activeRoles = roles.filter(role => role.isactive === true).length;
  const inactiveRoles = roles.filter(role => role.isactive === false).length;
  const dataRoles = {
    labels: [
      `Active Roles - ${activeRoles}`,
      `Inactive Roles - ${inactiveRoles}`,
      `Total Roles - ${totalRoles}`
    ],
    datasets: [
      {
        data: [activeRoles, inactiveRoles],
        backgroundColor: [
          '#DAC0A3',
          '#102C57'
        ],
      }
    ]
  };
  // --------------------------------Checklist--------------------------------------
  const [checklist, setChecklist] = useState([]);
  const fetchChecklist = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/checklist/getAllChecklist");
      setChecklist(response.data.data);
    } catch (error) {
      console.error("Error fetching Checklist:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchChecklist();
  }, []);

  const totalChecklist = checklist.length;
  const activeChecklist = checklist.filter(check => check.isactive == true).length;
  const inactiveChecklist = checklist.filter(check => check.isactive == false).length;
  const dataChecklist = {
    labels: [
      `Active Checklist - ${activeChecklist}`,
      `Inactive Checklist - ${inactiveChecklist}`,
      `Total Checklist - ${totalChecklist}`
    ],
    datasets: [
      {
        data: [activeChecklist, inactiveChecklist],
        backgroundColor: [
          '#AA96DA',
          '#FCBAD3'
        ],
      }
    ]
  };
  // ---------------------------------Users-------------------------------------
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/getAllUsersByVerified");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching Users:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const totalUsers = users.length
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyUserCount = Array(12).fill(0);
  users.forEach(user => {
    const month = new Date(user.createddate).getMonth();
    monthlyUserCount[month]++;
  });
  const dataUsers = {
    labels,
    datasets: [
      {
        label: `Users - ${totalUsers}`,
        data: monthlyUserCount,
        backgroundColor: [
          'rgba(118, 159, 205, 0.5)',
          'rgba(192, 108, 132, 0.5)',
          'rgba(252, 216, 212, 0.5)',
          'rgba(17, 153, 158, 0.5)',
          'rgba(211, 117, 107, 0.5)',
          'rgba(190, 159, 225, 0.5)',
          'rgba(169, 144, 126, 0.5)',
          'rgba(169, 203, 115, 0.5)',
          'rgba(133, 88, 111, 0.5)',
          'rgba(255, 210, 105, 0.5)',
          'rgba(236, 179, 144, 0.5)',
          'rgba(63, 113, 175, 0.5)'
        ],
        borderColor: [
          '#769FCD',
          '#C06C84',
          '#FCD8D4',
          '#11999E',
          '#D3756B',
          '#BE9FE1',
          '#A9907E',
          '#AACB73',
          '#85586F',
          '#FFD369',
          '#ECB390',
          '#3f71afff'
        ],
        borderWidth: 2
      }
    ]
  };
  const optionsUsers = {
    responsive: true,
    ticks: {
          stepSize: 1,
          precision: 0
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  // ---------------------------------Onboarding-------------------------------------
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [onboarding, setOnboarding] = useState([]);
  const [onboardingError, setOnboardingError] = useState(false);
  const [userInputField, setUserInputField] = useState({
    startDate: null,
    endDate: null,
    roleId: null,
    status: "",
    emailId: null,
  });
  const formatDate = (date) => {
    if (!date) return null;
    return date.toISOString().split("T")[0];
  };
  const handelUser = (e) => {
    let { name, value } = e.target;
    setUserInputField(prev => ({ ...prev, [name]: value }));
  }
  const getLastWeekDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return formatDate(date);
  };

  const getTodayDate = () => {
    return formatDate(new Date());
  };

  const fetchAllOnboardingData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/admin/getOnboardingBulkRecordsByFilter", {
        startDate: getLastWeekDate(),
        endDate: getTodayDate(),
        roleId: null,
        status: userInputField.status === "" ? null : userInputField.status,
        emailId: null
      });
      setOnboarding(response.data.data);
    } catch (error) {
      console.error("Error loading all data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOnboardingData();
  }, []);

  const handleOnboardingFilterSubmit = async (e) => {
    e.preventDefault();
    try {
      setOnboardingError(false);
      setLoading(true);
      const response = await axiosInstance.post("/admin/getOnboardingBulkRecordsByFilter", {
        startDate: userInputField.startDate,
        endDate: userInputField.endDate,
        roleId: userInputField.roleId,
        status: userInputField.status === "" ? null : userInputField.status,
        emailId: userInputField.emailId
      }
      );
      setOnboarding(response.data.data);
    } catch (error) {
      setOnboardingError(true);
      console.error("Error fetching filtered data:", error);
      toast.info(error.response.data.message)
    } finally {
      setLoading(false);
    }
  };

  const labelsOnboarding = onboarding.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(
    item => item.userName ?? `User-${item.userId}`
  );
  const completedCount = onboarding.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(
    item => item.checkList.filter(c => c.status === true).length
  );
  const pendingCount = onboarding.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(
    item => item.checkList.filter(c => c.status === false).length
  );

  const dataOnboarding = {
    labels: labelsOnboarding,
    datasets: [
      {
        label: "Completed",
        data: completedCount,
        backgroundColor: "rgba(115, 175, 111, 0.7)",
        borderColor: "#0b4906b3",
        borderWidth: 2
      },
      {
        label: "Pending",
        data: pendingCount,
        backgroundColor: "rgba(207, 15, 15, 0.7)",
        borderColor: "#5e0505b3",
        borderWidth: 2
      }
    ]
  };
  const optionsOnboarding = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      }
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Users"
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: "Checklist Count"
        }
      }
    }
  };

  // ---------------------------------------
  const [pageOnboardRole, setPageOnboardRole] = useState(0);
  const [rowsPerPageOnboardRole, setRowsPerPageOnboardRole] = useState(10);
  const [onboardingRoles, setOnboardingRoles] = useState([]);
  const [onboardingRolesError, setOnboardingRolesError] = useState(false);
  const [onboardUserInputField, setOnboardUserInputField] = useState({
    startDate: null,
    endDate: null,
    roleId: null,
    status: "",
    emailId: null,
  });
  const handelOnboardRoleUser = (e) => {
    let { name, value } = e.target;
    setUserInputField(prev => ({ ...prev, [name]: value }));
  }
  const fetchAllOnboardRoleData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/admin/getOnboardingBulkRecordsByFilter", {
        startDate: getLastWeekDate(),
        endDate: getTodayDate(),
        roleId: null,
        status: onboardUserInputField.status === "" ? null : onboardUserInputField.status,
        emailId: null
      });
      setOnboardingRoles(response.data.data);
    } catch (error) {
      console.error("Error loading all data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllOnboardRoleData();
  }, []);
  const handleOnboardRoleFilterSubmit = async (e) => {
    e.preventDefault();
    try {
      setOnboardingRolesError(false);
      setLoading(true);
      const response = await axiosInstance.post("/admin/getOnboardingBulkRecordsByFilter", {
        startDate: onboardUserInputField.startDate,
        endDate: onboardUserInputField.endDate,
        roleId: onboardUserInputField.roleId,
        status: onboardUserInputField.status === "" ? null : onboardUserInputField.status,
        emailId: onboardUserInputField.emailId
      }
      );
      setOnboardingRoles(response.data.data);
    } catch (error) {
      setOnboardingRolesError(true);
      toast.info(error.response.data.message)
      console.error("Error fetching filtered data:", error);
    } finally {
      setLoading(false);
    }
  };

  const roleCountMap = {};
  onboardingRoles.slice(pageOnboardRole * rowsPerPageOnboardRole, pageOnboardRole * rowsPerPageOnboardRole + rowsPerPageOnboardRole).map(item => {
    roleCountMap[item.roleName] = (roleCountMap[item.roleName] || 0) + 1;
  });
  const labelsOnboardingRoles = Object.keys(roleCountMap);
  const onboardingRolesCount = Object.values(roleCountMap);

  const dataOnboardingRoles = {
    labels: labelsOnboardingRoles,
    datasets: [
      {
        label: "Roles",
        data: onboardingRolesCount,
        backgroundColor: "rgba(178, 198, 213, 0.7)",
        borderColor: "#732255",
        borderWidth: 2
      }
    ]
  };
  const optionsOnboardingRoles = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        position: "top"
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          stepSize: 1,
          precision: 0
        },
        title: {
          display: true,
          text: "Roles Count"
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: "Roles"
        }
      }
    }
  };

  // ----------------------------------------------------------------------
  return (
    <div>
      <div className='chart-container'>
        <div className="chart-items bar-chart">
          <div className="chart-wrapper">
            <div className="chart-header-con">
              <div className="chart-title">Onboarding Roles</div>
              <div className="chart-filter">
                <form action="" className="chart-filter-container" onSubmit={handleOnboardRoleFilterSubmit}>
                  <div className="chart-filter-bar-inputs">
                    <DatePicker
                      id="startDate"
                      selected={onboardUserInputField.startDate}
                      onChange={(date) =>
                        setOnboardUserInputField(prev => ({
                          ...prev,
                          startDate: formatDate(date)
                        }))
                      }
                      placeholderText="Start Date"
                    />
                  </div>
                  <div className="chart-filter-bar-inputs">
                    <DatePicker
                      id="endDate"
                      selected={onboardUserInputField.endDate}
                      onChange={(date) =>
                        setOnboardUserInputField(prev => ({
                          ...prev,
                          endDate: formatDate(date)
                        }))
                      }
                      placeholderText="End Date"
                    />
                  </div>
                  <div className="chart-filter-bar-inputs">
                    <Button type='submit'><FilterAltIcon style={{ fontSize: "20px", marginRight: "3px" }} /> Filter</Button>
                  </div>
                </form>
              </div>
            </div>
            {onboardingRolesError ? (
              <>
                <div className="no-data chart bar-chart">
                  <img src={noData} alt="no data" />
                  <p>No Data Found</p>
                </div>
              </>
            )
              : (
                <>
                  <div className="chart bar-chart">
                    <Bar data={dataOnboardingRoles} options={optionsOnboardingRoles} />
                  </div>
                  <TablePagination
                    component="div"
                    count={onboardingRoles.length}
                    page={pageOnboardRole}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPageOnboardRole}
                    onRowsPerPageChange={(event) => {
                      setRowsPerPageOnboardRole(parseInt(event.target.value, 10));
                      setPageOnboardRole(0);
                    }}
                    rowsPerPageOptions={[5, 10, 20]}
                  />
                </>
              )}
          </div>
        </div>
        <div className="chart-items bar-chart">
          <div className="chart-wrapper">
            <div className="chart-header-con">
              <div className="chart-title">Onboarding</div>
              <div className="chart-filter">
                <form action="" className="chart-filter-container" onSubmit={handleOnboardingFilterSubmit}>
                  <div className="chart-filter-bar-inputs">
                    <DatePicker
                      id="startDate"
                      selected={userInputField.startDate}
                      onChange={(date) =>
                        setUserInputField(prev => ({
                          ...prev,
                          startDate: formatDate(date)
                        }))
                      }
                      placeholderText="Start Date"
                    />
                  </div>
                  <div className="chart-filter-bar-inputs">
                    <DatePicker
                      id="endDate"
                      selected={userInputField.endDate}
                      onChange={(date) =>
                        setUserInputField(prev => ({
                          ...prev,
                          endDate: formatDate(date)
                        }))
                      }
                      placeholderText="End Date"
                    />
                  </div>
                  <div className="chart-filter-bar-inputs">
                    <select name='status' onChange={handelUser} value={userInputField.status} >
                      <option value={""} selected>All Status</option>
                      <option value={true}>Completed</option>
                      <option value={false}>Pending</option>
                    </select>
                  </div>
                  <div className="chart-filter-bar-inputs">
                    <Button type='submit'><FilterAltIcon style={{ fontSize: "20px", marginRight: "3px" }} /> Filter</Button>
                  </div>
                </form>
              </div>
            </div>
            {onboardingError ? (
              <>
                <div className="no-data chart bar-chart">
                  <img src={noData} alt="no data" />
                  <p>Data Not Found</p>
                </div>
              </>
            )
              : (
                <>
                  <div className="chart bar-chart">
                    <Bar data={dataOnboarding} options={optionsOnboarding} />
                  </div>
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
                </>
              )}
          </div>
        </div>
        <div className="chart-items">
          <div className="chart-wrapper">
            <div className="chart-header-con">
              <div className="chart-title">Roles</div>
              <div className="chart-filter">
                <IconButton
                  size="small"
                  sx={{ ml: 2 }}
                  className="filter-icon"
                >
                  <FilterAltIcon />
                </IconButton>
              </div>
            </div>
            <div className="chart">
              <Doughnut data={dataRoles} />
            </div>
          </div>
        </div>
        <div className="chart-items">
          <div className="chart-wrapper">
            <div className="chart-header-con">
              <div className="chart-title">Checklist</div>
              <div className="chart-filter">
                <IconButton
                  size="small"
                  sx={{ ml: 2 }}
                  className="filter-icon"
                >
                  <FilterAltIcon />
                </IconButton>
              </div>
            </div>
            <div className="chart">
              <Doughnut data={dataChecklist} />
            </div>
          </div>
        </div>
        <div className="chart-items bar-chart">
          <div className="chart-wrapper">
            <div className="chart-header-con">
              <div className="chart-title">Users</div>
              <div className="chart-filter">
                <IconButton
                  size="small"
                  sx={{ ml: 2 }}
                  className="filter-icon"
                >
                  <FilterAltIcon />
                </IconButton>
              </div>
            </div>
            <div className="chart bar-chart">
              <Bar data={dataUsers} options={optionsUsers} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard