import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "../../Component/Button/Button";
import { ProfileWithEditButton } from "../../Component/ProfileWithEditButton";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./updateProfileModal.module.css";

const UpdateProfileModal = ({
    show,
    setShow,
    handleSubmit,

}) => {
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useSelector(
        (state) => state?.authReducer
    );
    const [photo, setPhoto] = useState(user ? user?.photo : "");



    const HandleSubmitData = async () => {

        if (typeof photo !== 'object') {
            return toast.error(`Please upload profile picture`)
        }
        setIsLoading(true)
        await handleSubmit(photo);
        setIsLoading(false)
    };

    return (
        <div>
            <ModalSkeleton
                show={show}
                setShow={setShow}
                width="700px"
                borderRadius="20px"
                header={`Update Profile Picture`}
            >
                <div className={classes.container}>
                    <Row className={classes.row}>
                        <Col md={12} className={classes.imgBox}>
                            <ProfileWithEditButton
                                updateImage={photo}
                                setUpdateImage={setPhoto}
                                isEdit={true}
                            />
                        </Col>
                    </Row>
                    <div className={classes.btn_main}>
                        <Button
                            onClick={() => {
                                HandleSubmitData()
                            }}
                            className={classes.btn}
                            label={
                                isLoading
                                    ? "Submitting..."
                                    : 'Submit'}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </ModalSkeleton>
        </div>
    );
};

export default UpdateProfileModal;
