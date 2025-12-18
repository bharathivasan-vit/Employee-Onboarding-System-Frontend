import React, { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import '../../assets/dashboard.css'
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import UseAlert from '../CustomeHooks/UseAlert';
import Skeleton from '@mui/material/Skeleton';

function Dashboard() {
    const [checkList, setCheckList] = useState([]);
    const { showConfirm } = UseAlert();
    const [loadingContent, setLoadingContent] = useState(false);

    const handleStatus = async (userId, checkListId, e) => {
        e.stopPropagation();

        const confirmed = await showConfirm({
            title: "Confirmation?",
            text: "Once marked done, this cannot be undone.",
            icon: "question"
        });

        if (confirmed) {
            try {
                const statusResponse = await axiosInstance.put("/client/setChecklistStatusTrue", {
                    "userId": userId,
                    "checkListId": checkListId
                });
                toast.success("Status changed successfully");

                const newChecklistDatas = await axiosInstance.post("/client/getChecklistForUser", {
                    "userId": userId
                });
                setCheckList(newChecklistDatas.data.data);
            } catch (error) {
                toast.error(error.response.data.message || "Failed to update status. Please try again.");
            }
        }

    };
    const userId = localStorage.getItem("userId");
    useEffect(() => {
        const fetchCheckList = async () => {
            try {
                setLoadingContent(true);
                const response = await axiosInstance.post("/client/getChecklistForUser", {
                    "userId": userId
                });
                setTimeout(() => {
                    setCheckList(response.data.data);
                    setLoadingContent(false);
                }, 500);
            } catch (error) {
                console.error("Error fetching check list:", error);
                setLoadingContent(true);
            }
        };
        fetchCheckList();
    }, [userId])
    return (
        <div className='dashboard-container' id='dashboard-container-cd'>
            <div className="content" id='content-cd'>
                <div className="check-list" id='check-list-cd'>
                    {loadingContent ? (
                        <>
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                        </>
                    ) : (
                        checkList.map((data, index) => (
                            <Accordion key={index} id='accordion-head-cd'>
                                <AccordionSummary
                                    expandIcon={<ArrowDropDownIcon />}
                                    aria-controls="panel-content"
                                    id="panel-header-cd"
                                    sx={{
                                        flexDirection: "row-reverse",
                                    }}
                                >
                                    <div className='check-list-title' id='check-list-title-cd'>
                                        <span className='title' id='title-cd'>{data.checklistcontent}</span>
                                        <div className="check-box" id='check-box-id'>
                                            <Checkbox
                                                id='check-box-status-cd'
                                                key={data.checklistid}
                                                checked={!!data.status}
                                                disabled={!!data.status}
                                                sx={{ '& .MuiSvgIcon-root': { fontSize: 28 }, color: "#2c476d", '&.Mui-checked': { color: "#2c476d", }, }}
                                                onClick={(e) => handleStatus(userId, data.checklistid, e)}
                                            />
                                        </div>
                                    </div>
                                </AccordionSummary>
                                <Divider />
                                <AccordionDetails id='accordion-details-cd'>
                                    <Typography id='accordion-description-cd'>
                                        {data.checklistdescription}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard