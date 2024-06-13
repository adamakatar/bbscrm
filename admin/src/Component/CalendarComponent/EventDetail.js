import { useMemo } from 'react'
import { Stack, Typography, Tooltip, Avatar } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '../../utils/functions'
import { imageUrl } from '../../config/apiUrl'


export default function EventDetail({ eventDetail }) {

    const navigate = useNavigate()

    const attendees = useMemo(() => {
        if (eventDetail) {
            return [...eventDetail.attendees, ...eventDetail.customerAttendees]
        }
        return []
    }, [eventDetail])

    return (
        <Stack spacing={1} my={2}>

            <Stack direction="row" spacing={2}>
                <Typography fontWeight={700}>Project: </Typography>
                <Typography>{eventDetail.project}</Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
                <Typography fontWeight={700}>Name: </Typography>
                <Typography>{eventDetail.title}</Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
                <Typography fontWeight={700}>Date: </Typography>
                <Typography>{formatDate(eventDetail.start)}</Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
                <Typography fontWeight={700}>Agenda: </Typography>
                <Typography>{eventDetail.agenda}</Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
                <Typography fontWeight={700}>Description: </Typography>
                <Typography sx={{ overflowWrap: 'anywhere' }}>{eventDetail.description}</Typography>
            </Stack>

            <Stack spacing={1}>
                <Typography fontWeight={700}>Attendees: </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                    {attendees.map((a) => (
                        <Tooltip key={a._id} title={`${a.firstName} ${a.lastName}`} onClick={() => navigate(`/user-detail/${a._id}`)}>
                            <Avatar alt={`${a.firstName} ${a.lastName}`} src={`${imageUrl}${a.photo}`} />
                        </Tooltip>
                    ))}
                </Stack>
            </Stack>
        </Stack>
    )
}