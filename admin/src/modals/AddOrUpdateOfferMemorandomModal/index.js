import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Button } from "../../Component/Button/Button";
import { TextArea } from "../../Component/TextArea";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./AddOrUpdateOfferMemorandomModal.module.css";

const AddOrUpdateOfferMemorandomModal = ({
    show,
    setShow,
    handleSubmit,
    data,
    isLoading = false,

}) => {

    const [description, setDescription] = useState("");

    useEffect(() => {
        if (data !== undefined) {
            setDescription(data)
        }

    }, [data]);

    const HandleSubmitData = () => {

        if (description == "") {
            return toast.error(`Memorandom description is required`)
        }

        handleSubmit(description);
    };

    return (
        <div>
            <ModalSkeleton
                show={show}
                setShow={setShow}
                width="700px"
                borderRadius="20px"
                header={`${data == undefined ? 'Add' : 'Edit'} Memorandom`}
            >
                <div className={classes.container}>
                    <Row className={classes.row}>
                        <Col md={12}>
                            <TextArea
                                setter={setDescription}
                                value={description}
                                placeholder={"Memorandom Description"}
                                label={'Description'}
                            />
                        </Col>
                    </Row>
                    <div className={classes.btn_main}>
                        <Button
                            onClick={() => HandleSubmitData()}
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

export default AddOrUpdateOfferMemorandomModal;
