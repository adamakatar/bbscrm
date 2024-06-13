import { Fragment, useMemo, useState } from 'react';
import {
    Stack,
    TextField,
    MenuItem,
    Badge,
    List,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Paper,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getFirstLetters, stringToColor } from '../../../utils/functions';
import useDebounce from '../../../CustomHooks/useDebounce';
import { Post } from '../../../Axios/AxiosFunctions';
import { BaseURL, apiHeader } from '../../../config/apiUrl';
import styled from "styled-components";

//  ----------------------------------------------------------------------------------

const FILTER_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'broker', label: 'Brokers' },
    { value: 'buyer/seller', label: 'Buyer/Seller' },
    { value: 'admin', label: 'Admin User' },
    { value: 'outside-user', label: 'Outside User' },
    { value: 'unread', label: 'Unread' },
];

//  ----------------------------------------------------------------------------------

const ScrollableList = styled.div`
  height: calc(100% - 140px);
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: darkgrey transparent;
  ::-webkit-scrollbar {
    width: 10px;
    display: block;
  }

  ::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: grey;
  }
`;

export default function ContactsSection({
    contacts,
    setContacts,
    currentContact,
    setCurrentContact,
}) {
    const { user, access_token: accessToken } = useSelector((state) => state?.authReducer || {});

    const [filterOptionValue, setFilterOptionValue] = useState(FILTER_OPTIONS[0].value);
    const [searchKey, setSearchKey] = useState('');

    const debouncedSearchKey = useDebounce(searchKey, 500);

    const filteredContacts = useMemo(() => {
        const pattern = new RegExp(debouncedSearchKey, 'gi');
        return contacts.filter((c) => {
            console.log(c);
            if (pattern.test(`${c?._doc?.firstName} ${c?._doc?.lastName}`) || pattern.test(c?._doc?.email || '')) {
                if ((filterOptionValue === 'broker' || filterOptionValue === 'admin') && c?._doc?.role?.includes(filterOptionValue)) {
                    return true;
                }
                if (filterOptionValue === 'buyer/seller' && (c?._doc?.role?.includes('buyer') || c?._doc?.role?.includes('seller'))) {
                    return true;
                }
                if (filterOptionValue === 'outside-user' && c?.isOutsideUser) {
                    return true;
                }
                if (filterOptionValue === 'unread' && c?.unreadCount) {
                    return true;
                }
                if (filterOptionValue === 'all') {
                    return true;
                }
            }
            return false;
        });
    }, [contacts, filterOptionValue, debouncedSearchKey]);

    const onClickContact = (c) => {
        Post(
            BaseURL('communication/s-mark-read'),
            {
                contactId: c?._doc?._id,
                userId: user?._id,
            },
            apiHeader(accessToken)
        ).then((res) => {
            if (typeof res.data === 'string') {
                return toast.error(res.data)
            }
            setCurrentContact({
                ...c,
                unreadCount: 0,
            });
            return setContacts((prev) => {
                const index = prev.findIndex((co) => co?._doc?._id === c?._doc?._id);
                prev.splice(index, 1, {
                    ...c,
                    unreadCount: 0,
                });
                return prev;
            });
        }).catch((err) => { });
    };

    return (
        <Stack component={Paper} p={2} height="100%" spacing={2}>
            <Stack spacing={1}>
                <TextField
                    label="Filter"
                    select
                    value={filterOptionValue}
                    onChange={(e) => setFilterOptionValue(e.target.value)}
                >
                    {FILTER_OPTIONS.map((o) => (
                        <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    InputProps={{
                        startAdornment: <Search />
                    }}
                    placeholder="Type here to search..."
                    onChange={(e) => setSearchKey(e.target.value)}
                    value={searchKey}
                />
            </Stack>
            <ScrollableList>
            <List sx={{ width: '100%', flexGrow: 1, height: '100px' }}>
                {filteredContacts.map((c) => (
                    <Fragment key={c?._doc?._id}>
                        {c?.unreadCount > 0 ? (
                            <Badge
                                badgeContent={c?.unreadCount}
                                color="primary"
                                sx={{ width: '100%' }}
                            >
                                <ListItemButton
                                    sx={{ alignItems: 'start', width: '100%' }}
                                    selected={c?._doc?._id === currentContact?._doc?._id}
                                    onClick={() => onClickContact(c)}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            variant="rounded"
                                            alt="Username"
                                            sx={{ bgcolor: stringToColor(`${c?._doc?.firstName || ''} ${c?._doc?.lastName || ''}`) }}
                                        >
                                            {getFirstLetters(`${c?._doc?.firstName || ''} ${c?._doc?.lastName || ''}`)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${c?._doc?.firstName || ''} ${c?._doc?.lastName || ''}`}
                                        primaryTypographyProps={{
                                            fontWeight: 700
                                        }}
                                    />
                                </ListItemButton>
                            </Badge>
                        ) : (
                            <ListItemButton
                                sx={{ alignItems: 'start', width: '100%' }}
                                selected={c?._doc?._id === currentContact?._doc?._id}
                                onClick={() => onClickContact(c)}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        variant="rounded"
                                        alt="Username"
                                        sx={{ bgcolor: stringToColor(`${c?._doc?.firstName} ${c?._doc?.lastName}`) }}
                                    >
                                        {getFirstLetters(`${c?._doc?.firstName} ${c?._doc?.lastName}`)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={`${c?._doc?.firstName} ${c?._doc?.lastName}`} />
                            </ListItemButton>
                        )}
                    </Fragment>
                ))}
            </List>
            </ScrollableList>
        </Stack>
    )
}