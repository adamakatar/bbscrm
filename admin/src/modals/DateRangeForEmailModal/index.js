import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { Button } from '../../Component/Button/Button';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import classes from './DateRangeForEmailModal.module.css'
import ModalSkeleton from '../ModalSkeleton';
import moment from 'moment';

function DateRangeForEmailModal({
    show,
    setShow,
    handleSubmit,
    data,
    isLoading = false,
    dates,
    setDates

}) {
    return (
        <div>
            <style>{`
        .MuiFormControl-root {
            width: 100%;
          }
          .MuiFormLabel-root {
            color: var(--placeholder-color) !important;
          }
          .MuiOutlinedInput-notchedOutline {
            box-shadow: 0px 0 5px 2px #0000000d;
            border: none;
            border-radius: 10px;
          }
          
        
        `}</style>
            <ModalSkeleton
                show={show}
                setShow={setShow}
                width="700px"
                borderRadius="20px"
                header={`Select Date`}
            >
                <div className={classes.container}>
                    <Row className={classes.row}>
                        <Col md={12} >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label={dates[0] ? "" : "Start Date"}
                                    value={dates[0]}
                                    onChange={(newValue) => {
                                        const newDate = [...dates]
                                        newDate[0] = moment(newValue?.$d).format('YYYY-MM-DD')
                                        setDates(newDate);
                                    }}
                                    renderInput={(params) => (
                                        <TextField InputLabelProps={{ shrink: false }} {...params} />
                                    )}
                                />
                            </LocalizationProvider>
                        </Col>
                        <Col md={12} >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label={dates[1] ? "" : "End Date"}
                                    value={dates[1]}
                                    onChange={(newValue) => {
                                        const newDate = [...dates]
                                        newDate[1] = moment(newValue?.$d).format('YYYY-MM-DD')
                                        setDates(newDate);
                                    }}
                                    renderInput={(params) => (
                                        <TextField InputLabelProps={{ shrink: false }} {...params} />
                                    )}
                                />
                            </LocalizationProvider>
                        </Col>
                    </Row>
                    <div className={classes.btn_main}>
                        <Button
                            onClick={async () => {
                                await handleSubmit()
                                await setShow(false)
                            }}
                            className={classes.btn}
                            label={
                                isLoading
                                    ? "Applying..."
                                    : 'Apply'}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </ModalSkeleton>
        </div>

    )
}



export default DateRangeForEmailModal