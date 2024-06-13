import { useEffect, useMemo, useState } from 'react';
import {
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Avatar,
    Stack,
    Typography,
    Chip,
} from '@mui/material';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { GalleryImage } from '../../constant/imagePath';
import { imageUrl } from '../../config/apiUrl';

export default function RoomListItem({ room, onClick, selected = false }) {
    const { user } = useSelector((state) => state?.authReducer || {});
    const [avatar, setAvatar] = useState('');
    const [title, setTitle] = useState('');
    const [decideRoomUser, setDecideRoomUser] = useState('');
    const [decideGroupData, setDecideGroupData] = useState(false);

    const unreadAmount = useMemo(() => {
        if (Array.isArray(room?.users)) {
            for (let u of room.users) {
                if (u?.userId?._id === user?._id && typeof u?.unreadCount === 'number' && !isNaN(u?.unreadCount)) {
                    return u.unreadCount;
                }
            }
        }
        return 0;
    }, [room]);

    useEffect(() => {
        if (room) {
            setDecideRoomUser(room.users?.find(
                (e) => e?.userId?._id !== user?._id
            )?.userId);
            setDecideGroupData(!["group", "one-to-one"].includes(room?.reference));
        }
    }, [room])

    useEffect(() => {
        if (room?.reference === 'lead-group') {
            setAvatar(room?.lead?.buyer?.photo);
        } else if (room?.reference === "business-group") {
            setAvatar(room?.business?.images[0]);
        }
        if (["one-to-one", "group"].includes(room?.reference)) {
            setAvatar(decideRoomUser?.photo);
            setTitle(`${decideRoomUser?.firstName} ${decideRoomUser?.lastName}`)
        } else if (["business-group", "lead-group"].includes(room?.reference)) {
            setTitle(room?.title);
        }
    }, [room, decideRoomUser]);

    return (
        <ListItemButton
            sx={{
                alignItems: 'start',
            }}
            onClick={() => onClick(room?._id)}
            selected={selected}
        >
            <Stack direction="row" alignItems="center" flexGrow={1}>
                <ListItemAvatar>
                    <Avatar
                        variant="rounded"
                        src={imageUrl(avatar)}
                        alt={room?.title}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = GalleryImage;
                        }}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={title}
                    secondary={
                        decideGroupData ? (
                            room?.reference === 'business-group' ? (
                                room?.users?.map((u) =>
                                    u.userId ? `${u.userId.firstName} ${u.userId.lastName}` : 'undefined'
                                ).join(', ')
                            ) : ''
                        ) : room?.lastMessage?.text
                    }
                />
            </Stack>
            <Stack py={1} justifyContent="space-between">
                <Typography component="span" fontSize={14}>
                    {moment(room?.updatedAt).format("DD MMM YYYY")}
                </Typography>
                {unreadAmount && !selected ? (
                    <Chip label={unreadAmount} color="primary" sx={{ px: 1 }} />
                ) : (<></>)}
            </Stack>
        </ListItemButton>
    );
}
