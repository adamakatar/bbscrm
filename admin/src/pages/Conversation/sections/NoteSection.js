import { useState , useEffect } from "react";
import { Stack, Paper, TextField, Button } from "@mui/material";
import { Phone, Mail, Label } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Get, Post } from "../../../Axios/AxiosFunctions";
import { BaseURL } from "../../../config/apiUrl";
import { INTERVAL_FOR_RUNTIME_2, MSG_ERROR } from "../../../utils/contants";
import { TextArea } from "../../../Component/TextArea";
import moment from "moment";

export default function NoteSection({currentContact }) {
    const { user, access_token: accessToken } = useSelector((state) => state?.authReducer || {});

    const url = `skype:${currentContact?._doc?.contact}?call`

    const [newNote, setNewNote] = useState('');
    const [notes, setNotes] = useState([]);
    const [writer, setWriter] = useState(null);
    const [updatedAt, setUpdatedAt] = useState(null);

    const handleKeyUp = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault(); // Prevent inserting a newline character
          onSubmitNote(); // Call your function here
        }
      };

    useEffect(() => {
        const favicon = document.getElementById("favicon");
    
        const getData = () => {
            if (currentContact)
            {
                Get(BaseURL(`notes/getNote/${currentContact?._doc?.email}`), accessToken)
                .then((res) => {
                if (Array.isArray(res.data)) {
                    res.data.sort((a, b) => b.date - a.date);
                    setNotes(res.data);
                }
                })
                .catch((err) => {
                    setNotes([])
                    setWriter(null)
                    setUpdatedAt(null)
                });
            }
        };
    
        getData();
      }, [currentContact]);

    const onSubmitNote = () => {
        var postTime = new Date().toLocaleString();
        Post(BaseURL('notes/create'), {
            text: newNote,
            date: postTime,
            writer: `${user?.firstName} ${user?.lastName}`,
            sender: user?.email,
            receiver: currentContact?._doc?.email,
        }).then(() => {
            setNewNote('');
            setNotes([...notes, {text:newNote, date:postTime, writer:`${user?.firstName} ${user?.lastName}`}]);
            return toast.success('Added successfully.');
        }).catch((err) => {
            return toast.error(err.toString());
        });
    }

    return (
        <Stack height="calc(100vh - 180px)" component={Paper} spacing={2} p={2}>
            <Stack spacing={1}>
                <TextField
                    label="Phone"
                    InputProps={{
                     startAdornment: <a href={url}  target="_blank"> <Phone /> </a>
                    }}
                    value={currentContact?._doc?.contact || ''}
                    disabled
                />
                <TextField
                    type="email"
                    label="Email"
                    InputProps={{
                        startAdornment: <a href="" target="_blank"><Mail /></a>
                    }}
                    value={currentContact?._doc?.email || ''}
                    disabled
                />
            </Stack>

            <TextArea
                label="Note"
                sx={{ flexGrow: 1 }}
                multiline
                readOnly
                setter={setWriter}
                value={notes.map((entry) => `${entry.text}\n(${entry.writer} - ${moment(entry.date).format("lll")})`).join('\n\n')}
            />
            <TextArea
                label=""
                sx={{ flexGrow: 1 }}
                multiline
                rows={4}
                placeholder={"New Note Here"}
                setter={setNewNote}
                onKeyUp={(e) => {
                      if (e.key == "Enter" && e.ctrlKey) {
                        e.preventDefault();
                        onSubmitNote();
                    }
                  }}
            />
            {/* {writer && (<label>Last Editor: {writer}</label>)}
            {updatedAt && (<label>Updated at {moment(updatedAt).format("lll")}</label>)} */}
            <Button
                variant="contained"
                disabled={!newNote || !currentContact}
                onClick={onSubmitNote}
            >Add a Note</Button>
        </Stack>
    )
}