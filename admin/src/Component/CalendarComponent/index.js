import React, { useState, useRef, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Scheduler } from "@aldabil/react-scheduler";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, FormControlLabel, Switch, Box, Dialog, Stack } from "@mui/material";
import Loader from '../Loader';
import classes from "./CalendarComponent.module.css";
import { BaseURL, apiHeader } from "../../config/apiUrl";
import { Delete, Get, Patch, Put } from "../../Axios/AxiosFunctions";
import { formatDate } from '../../utils/functions';
import ScheduleEventDialog from "./ScheduleEventDialog";
import { MSG_ERROR, TYPE_EVENT } from "../../utils/contants";
import EventDetail from "./EventDetail";
import { propTypes } from "react-bootstrap/esm/Image";

let loadingTimes = 0;

export default function CalendarComponent() {
    const { access_token: accessToken, user } = useSelector(
        (state) => state?.authReducer
    );
    const calendarRef = useRef(null);
    const isAdmin = !user?.role?.includes("broker");
    let project = [];

    // Involved Tasks
    const [fetchFrom, setFetchFrom] = useState(new Date());
    const [fetchTo, setFetchTo] = useState(new Date());
    const [meetingInvitees, setMeetingInvitees] = useState([]);
    const [onlyMyTasks, setOnlyMyTasks] = useState(false);
    const [loading, setLoading] = useState(false);
    const [scheduleMeetingDialogOpened, setScheduleMeetingDialogOpened] = useState(false)
    
    /**
     * Drag an event
     */
    const onEventDrop = (_, updatedEvent, __) => {
        const startAt = new Date(updatedEvent.start).toISOString().substring(0, 19) + "Z";
        const endAt = new Date(updatedEvent.end).toISOString().substring(0, 19) + "Z";

        if (updatedEvent?.meetingId) {
            const reqData = {
                creatorZoomEmail: updatedEvent.zoomEmail || '',
                topic: updatedEvent.agenda || '',
                startAt,
                endAt,
                meetingType: updatedEvent.meetingType || 0,
                invitees: [...updatedEvent.attendees, updatedEvent.customerAttendees] || [],
                calendar: updatedEvent.event_id,
            };

            setLoading(true);
            Put(BaseURL(`meeting-2/update/${updatedEvent.meetingId}`), reqData, apiHeader(accessToken))
                .then((response) => {
                    if (response.data && typeof response.data !== 'string') {
                        setLoading(false);
                        return toast.success("Success. You've booked a meeting.");
                    }
                    setLoading(false);
                    return toast.error(response.data || MSG_ERROR);
                })
                .catch((error) => {
                    setLoading(false);
                    return toast.error(MSG_ERROR);
                })
        } else {
            const date = new Date(updatedEvent.start).toISOString().substring(0, 19) + "Z";
            const reqData = {
                creator: user?._id,
                name: updatedEvent.title || '',
                color: updatedEvent.color || '',
                venue: updatedEvent.venue || '',
                description: updatedEvent.description || '',
                date,
                type: TYPE_EVENT,
                agenda: updatedEvent.agenda || '',
                attendees: updatedEvent.attendees?.map((item) => item?._id),
                customerAttendees: updatedEvent.customerAttendees?.map((item) => item?._id),
            }
            setLoading(true);
            Patch(BaseURL(`events/update/${updatedEvent.event_id}`), reqData, apiHeader(accessToken))
                .then((res) => {
                    setLoading(false);
                    if (typeof res?.data === 'object') {
                        return toast.success('Success! The event was saved.');
                    } else {
                        return toast.error(MSG_ERROR);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    return toast.error(MSG_ERROR);
                });
        }
    }

    /**
     * Delete an Event
     */
    const onDeleteEvent = (event_id) => {
        const event = calendarRef.current.scheduler.events.find((e) => e.event_id === event_id)

        if (event?.meetingId) {
            setLoading(true);
            Delete(BaseURL(`meeting-2/delete/${event.meetingId}`), apiHeader(accessToken))
                .then((response) => {
                    if (response.data && typeof response.data !== 'string') {
                        setLoading(false);
                        return toast.success('Deleted successfully.');
                    }
                    setLoading(false);
                    return toast.error(response.data || MSG_ERROR);
                })
                .catch((error) => {
                    setLoading(false);
                    return toast.error(MSG_ERROR);
                })
        } else {
            setLoading(true);
            Delete(BaseURL(`events/delete/${event_id}`), apiHeader(accessToken))
                .then((res) => {
                    setLoading(false);
                    if (typeof res.data === 'object') {
                        return toast.success('Deleted successfully.');
                    } else {
                        return toast.error(MSG_ERROR);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    return toast.error(MSG_ERROR);
                })
        }
    }

    /**
     * Get calendar data
     * @param {startDate, endDate} param0
     * @returns
     */
    const getCalendarData = ({ start: startDate, end: endDate }) => {
        let _events = [];
        setFetchFrom(startDate)
        setFetchTo(endDate)
        let query = '';
        if (onlyMyTasks) {
            query = `meeting-2/get-calendar-data/?userId=${user?._id}&startAt=${formatDate(startDate, true)}&endAt=${formatDate(endDate, true)}`;
        } else {
            query = `meeting-2/get-calendar-data/?startAt=${formatDate(startDate, true)}&endAt=${formatDate(endDate, true)}`;
        }

        Get(BaseURL(query, accessToken))
            .then(async (res) => {
                if (typeof res.data === 'object' && res.data !== null) {
                    const { meetings, events: eventsData, projectName: projects } = res.data;

                    for (let m of meetings) {
                        const start = new Date(m?.startAt) || new Date();
                        const end = new Date(m?.endAt) || new Date();

                        _events.push({
                            event_id: m?.calendar?._id,
                            title: m?.topic || '',
                            start,
                            end,
                            admin_id: m?.creator?._id,
                            description: user?._id === m?.creator ? m?.startUrl : m?.joinUrl,
                            color: m?.calendar?.color,
                            attendees: m?.invitees || [],
                            customerAttendees: m?.customerAttendees || [],
                            type: 'meeting',
                            editable: m?.creator?._id === user?.id || start.getTime() <= new Date().getTime() ? false : true,
                            deletable: m?.creator?._id === user?.id || start.getTime() <= new Date().getTime() ? false : true,
                            draggable: m?.creator?._id === user?.id || start.getTime() <= new Date().getTime() ? false : true,
                            meetingId: m?._id,
                            agenda: m?.calendar?.agenda || '',
                            zoomEmail: m?.creatorZoomEmail || '',
                            meetingType: m?.meetingType || 0,
                        })
                    }

                    for (let e of eventsData) {
                        const start = e.date ? new Date(e.date) : new Date();
                        const end = new Date(start.getTime() + 3600 * 1000);

                        let idx = eventsData.indexOf(e);
                        let pro = '';
                        pro = projects[idx];

                        _events.push({
                            event_id: e?._id || '',
                            title: e?.name || '',
                            project: pro,
                            start,
                            end,
                            admin_id: e?.creator?._id || '',
                            description: e?.description || '',
                            color: e?.color || '',
                            attendees: e?.attendees || [],
                            customerAttendees: e?.customerAttendees || [],
                            type: e?.type || '',
                            editable: e?.creator?._id === user?.id || start.getTime() <= new Date().getTime() ? false : true,
                            deletable: e?.creator?._id === user?.id || start.getTime() <= new Date().getTime() ? false : true,
                            draggable: e?.creator?._id === user?.id || start.getTime() <= new Date().getTime() ? false : true,
                            agenda: e?.agenda || '',
                            venue: e?.venue || ''
                        })
                    }
                }
            });

        return new Promise((res) => {
            setTimeout(() => {
                res(_events);
            }, 3000);
        });
    }

    /**
     * Switch event
     * @param {*} e 
     */
    const onSwitchMyTasks = (e) => {
        const { checked } = e.target;
        let query = '';

        setOnlyMyTasks(checked)

        if (checked) {
            query = `meeting-2/get-calendar-data/?userId=${user?._id}&startAt=${formatDate(fetchFrom, true)}&endAt=${formatDate(fetchTo, true)}`;
        } else {
            query = `meeting-2/get-calendar-data/?startAt=${formatDate(fetchFrom, true)}&endAt=${formatDate(fetchTo, true)}`;
        }
        calendarRef.current.scheduler.handleState(true, 'loading');

        project = [];

        Get(BaseURL(query, accessToken))
            .then((res) => {
                if (typeof res.data === 'object' && res.data !== null) {
                    const { meetings, events: eventsData, projectName: projects } = res.data;
                    const _events = [];

                    for (let m of meetings) {
                        _events.push({
                            event_id: m?.calendar?._id,
                            title: m?.topic || '',
                            start: new Date(m?.startAt),
                            end: new Date(m?.endAt),
                            admin_id: m?.creator?._id,
                            description: user?._id === m?.creator ? m?.startUrl : m?.joinUrl,
                            color: m?.calendar?.color,
                            attendees: m?.invitees || [],
                            customerAttendees: m?.customerAttendees || [],
                            type: 'meeting',
                            editable: m?.creator?._id === user?.id ? false : true,
                            deletable: m?.creator?._id === user?.id ? false : true,
                            draggable: m?.creator?._id === user?.id ? false : true,
                            meetingId: m?._id,
                            agenda: m?.calendar?.agenda,
                            zoomEmail: m?.creatorZoomEmail,
                            meetingType: m?.meetingType,
                        })
                    }

                    for (let e of eventsData) {
                        if (_events.findIndex((_e) => _e.event_id === e._id) >= 0) continue;
                        const start = e.date ? new Date(e.date) : new Date();
                        const end = new Date(start.getTime() + 3600 * 1000);

                        let idx = eventsData.indexOf(e);
                        let pro = '';
                        pro = projects[idx];

                        _events.push({
                            event_id: e?._id || '',
                            title: e?.name,
                            project: pro,
                            start,
                            end,
                            admin_id: e?.creator?._id || '',
                            description: e?.description || '',
                            color: e?.color || '',
                            attendees: e?.attendees || [],
                            customerAttendees: e?.customerAttendees || [],
                            type: e?.type || '',
                            editable: e?.creator?._id === user?.id ? false : true,
                            deletable: e?.creator?._id === user?.id ? false : true,
                            draggable: e?.creator?._id === user?.id ? false : true,
                            agenda: e?.agenda
                        })
                    }

                    calendarRef.current.scheduler.handleState(_events, 'events')
                } else if (typeof res.data === 'string') {
//                    toast.error(res.data)
                    calendarRef.current.scheduler.handleState([], 'events')
                }
                calendarRef.current.scheduler.handleState(false, 'loading')
            })
            .catch((error) => {
                calendarRef.current.scheduler.handleState([], 'events')
                calendarRef.current.scheduler.handleState(false, 'loading')
            })
    }

    useEffect(() => {
        if (loadingTimes === 0) {
            Get(BaseURL(`users/get-available-meeting-invitees/${user?._id}`), accessToken)
                .then((res) => {
                    if (Array.isArray(res.data)) {
                        setMeetingInvitees(res.data)
                    } else if (typeof res.data === 'string') {
                        toast.warning("guys")
                    }
                })
                .catch((error) => {
                    console.log('>>>>>>>>>> error => ', error);
                })
        }
    }, []);

    useEffect(() => {
        if (calendarRef?.current?.scheduler?.translations?.navigation) {
            delete (calendarRef?.current?.scheduler?.translations?.navigation.today);
            if (window.location.href.indexOf("calendar") > -1)
                document.getElementsByClassName('s-available-datetime')[0].scrollIntoView();
        }
    }, [calendarRef])

    return (
        <Container fluid className={classes.container}>
            <Row>
                <Col md={12}>
                    <div className={classes.headingAndBtn}>
                        <h3>Calendar</h3>

                    </div>
                </Col>
                <Col md={12}>
                    {loading ? (
                        <Loader />
                    ) : (
                        <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Button
                                    variant="contained"
                                    onClick={() => setScheduleMeetingDialogOpened(true)}
                                >Schedule a Meeting</Button>

                                <div className={classes.switchAndBtn}>
                                    {isAdmin &&
                                        <FormControlLabel
                                            value="myTasks"
                                            control={
                                                <Switch
                                                    checked={onlyMyTasks}
                                                    onChange={onSwitchMyTasks}
                                                />
                                            }
                                            label="My Tasks"
                                            labelPlacement="start"
                                        />
                                    }
                                </div>
                            </Stack>

                            <Scheduler
                                ref={calendarRef}
                                month={{
                                    weekDays: [0, 1, 2, 3, 4, 5, 6],
                                    weekStartOn: 0,
                                    startHour: 0,
                                    endHour: 24,
                                    navigation: true,
                                    disableGoToDay: false,
                                    cellRenderer: ({ start, end, ...props }) => {
                                        const currentHours = new Date().getTime();
                                        const disabled = currentHours >= end.getTime() || start.getHours();
                                        const _props = disabled ? {} : props;
                                        return (
                                            <Button
                                                disabled={disabled}
                                                disableRipple={disabled}
                                                sx={{
                                                    height: '100%',
                                                    background: disabled ? '#eee' : 'transparent',
                                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                                }}
                                                className={disabled ? '' : 's-available-datetime'}
                                                {..._props}
                                            />
                                        )
                                    }
                                }}
                                week={{
                                    weekDays: [0, 1, 2, 3, 4, 5, 6],
                                    weekStartOn: 0,
                                    startHour: 0,
                                    endHour: 24,
                                    step: 60,
                                    navigation: true,
                                    disableGoToDay: false,
                                    cellRenderer: ({ start, end, ...props }) => {
                                        const currentDt = new Date().getTime();

                                        let disabled = false;
                                        if (currentDt >= end.getTime()) disabled = true;
                                        if (start.getHours() < 8 || start.getHours() >= 18) disabled = true;
                                        if (start.getHours() === 12 || start.getHours() === 13) disabled = true;

                                        const _props = disabled ? {} : props;
                                        return (
                                            <Button
                                                disabled={disabled}
                                                disableRipple={disabled}
                                                sx={{
                                                    height: '100%',
                                                    background: disabled ? '#eee' : 'transparent',
                                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                                }}
                                                className={disabled ? '' : 's-available-datetime'}
                                                {..._props}
                                            />
                                        )
                                    }
                                }}
                                day={{
                                    startHour: 0,
                                    endHour: 24,
                                    step: 60,
                                    navigation: true,
                                    cellRenderer: ({ start, end, ...props }) => {
                                        const currentDt = new Date().getTime();

                                        let disabled = false;
                                        if (currentDt >= end.getTime()) disabled = true;
                                        if (start.getHours() < 8 || start.getHours() >= 18) disabled = true;
                                        if (start.getHours() === 12 || start.getHours() === 13) disabled = true;

                                        const _props = disabled ? {} : props;
                                        return (
                                            <Button
                                                disabled={disabled}
                                                sx={{
                                                    height: '100%',
                                                    background: disabled ? '#eee' : 'transparent',
                                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                                }}
                                                className={disabled ? '' : 's-available-datetime'}
                                                {..._props}
                                            />
                                        )
                                    },
                                }}
                                customEditor={(scheduler) => (
                                    <ScheduleEventDialog
                                        scheduler={scheduler}
                                        availableInvitees={meetingInvitees}
                                        setLoading={setLoading}
                                        handleClose={() => scheduler.close()}
                                    />
                                )}
                                viewerExtraComponent={(_, event) => (<EventDetail eventDetail={event}/>)}
                                onEventDrop={onEventDrop}
                                getRemoteEvents={getCalendarData}                   
                                onDelete={onDeleteEvent}
                            />
                        </Box>
                    )}
                </Col>
            </Row>

            <Dialog
                open={scheduleMeetingDialogOpened}
                onClose={() => setScheduleMeetingDialogOpened(false)}
            >
                <ScheduleEventDialog
                    availableInvitees={meetingInvitees}
                    setLoading={setLoading}
                    handleClose={() => setScheduleMeetingDialogOpened(false)}
                />
            </Dialog>
        </Container>
    );
};
