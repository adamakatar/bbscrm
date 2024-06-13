import { useEffect, useMemo, useState } from 'react';
import { DialogTitle, DialogContent, Box, Tab, Typography, IconButton } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { AiOutlineClose } from 'react-icons/ai';
import MeetingTab from './MeetingTab';
import OthersTab from './OthersTab';

export default function ScheduleEventDialog({ scheduler, setLoading, availableInvitees, tabValue = 'meeting', handleClose }) {
    const [currentTab, setCurrentTab] = useState(tabValue)

    const onChangeTab = (_, newEventType) => {
        setCurrentTab(newEventType);
    };

    const onClose = () => {
        handleClose();
    };

    useEffect(() => {
        if (scheduler?.edited) {
            if (scheduler.edited.type !== 'meeting') {
                setCurrentTab('others')
            } else {
                setCurrentTab('meeting')
            }
        } else {
            setCurrentTab('meeting')
        }
    }, [])

    const meetingDisabled = useMemo(() => {
        if (scheduler?.edited) {
            if (scheduler.edited?.type !== 'meeting') {
                return true;
            }
        }
        return false;
    }, [scheduler?.edited])

    const othersDisabled = useMemo(() => {
        if (scheduler?.edited) {
            if (scheduler.edited?.type === 'meeting') {
                return true;
            }
        }
        return false;
    }, [scheduler?.edited])

    const dialogTitle = useMemo(() => {
        if (scheduler?.edited) {
            return 'Update an Event'
        }
        return 'Create an Event'
    }, [scheduler?.edited])

    return (
        <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography component="h5" variant="h5">
                    {dialogTitle}
                </Typography>
                <IconButton onClick={onClose}>
                    <AiOutlineClose />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TabContext value={currentTab}>
                    <Box borderBottom={1} borderColor="divider">
                        <TabList onChange={onChangeTab}>
                            <Tab label="Meeting" value="meeting" sx={{ width: '50%' }} disabled={meetingDisabled} />
                            <Tab label="Others" value="others" sx={{ width: '50%' }} disabled={othersDisabled} />
                        </TabList>
                    </Box>
                    <TabPanel value="meeting">
                        <MeetingTab
                            scheduler={scheduler}
                            setLoading={setLoading}
                            availableInvitees={availableInvitees}
                        />
                    </TabPanel>
                    <TabPanel value="others">
                        <OthersTab
                            scheduler={scheduler}
                            setLoading={setLoading}
                        />
                    </TabPanel>
                </TabContext>
            </DialogContent>
        </>
    )
}