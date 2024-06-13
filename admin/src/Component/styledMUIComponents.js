import { TextField, styled, FormControlLabel } from "@mui/material";

export const MainTextField = styled(TextField)(() => ({
    border: 'none',
    boxShadow: '0px 0 5px 2px #0000000d',
    borderRadius: '10px',
    backgroundColor: 'white',
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
    },
}));

export const MainFormControlLabel = styled(FormControlLabel)(() => ({
    color: '#02528a',
    textTransform: 'capitalize',
    fontFamily: 'Open-Sans-bold',
    fontSize: '16px',
}))