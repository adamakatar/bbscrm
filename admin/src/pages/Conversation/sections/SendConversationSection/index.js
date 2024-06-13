import { useState } from 'react';
import {
    Stack,
    Paper,
    Box,
    Tab,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import SMSTab from './tabs/SMSTab';
import EmailTab from './tabs/EmailTab';

export default function SendConversationSection({ contacts, currentContact, setConversations, forwardMsg, scrollRef, ...props }) {
    const [currentTab, setCurrentTab] = useState('email');

    return (
        <Stack component={Paper} spacing={2}>
            <TabContext value={currentTab}>
                <Box borderBottom={1} borderColor="divider" pt={2} px={2}>
                    <TabList onChange={(_, newValue) => setCurrentTab(newValue)}>
                        <Tab label="Email" value="email" />
                        <Tab label="SMS" value="sms" />
                    </TabList>
                </Box>

                <TabPanel value="sms">
                    <SMSTab
                        currentContact={currentContact}
                        setConversations={setConversations}
                    />
                </TabPanel>

                <TabPanel value="email">
                    <EmailTab
                        scrollRef={scrollRef}
                        forwardMsg={forwardMsg}
                        contacts={contacts}
                        currentContact={currentContact}
                        setConversations={setConversations}
                    />
                </TabPanel>
            </TabContext>
        </Stack>
    )
}