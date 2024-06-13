import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import { Input } from "../../Component/Input/Input";
import { TextArea } from "../../Component/TextArea";
import { formRegEx, formRegExReplacer } from "../../config/apiUrl";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./AddOrUpdateReviewModal.module.css";

const AddOrUpdateReviewModal = ({
    show,
    setShow,
    handleSubmit,
    data,
    isLoading = false,

}) => {
    const typeOptions = [{ label: 'Business Owner', value: 'Business Owner', }]
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [role, setRole] = useState(typeOptions[0]);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (data !== undefined) {
            setTitle(data?.title)
            setDescription(data?.description)
            setRole(typeOptions?.find(item => item?.value == data?.role))
            setUserName(data?.userName)
        }

    }, [data]);

    const HandleSubmitData = () => {
        let body = {
            title,
            description,
            role: role?.value,
            userName
        }
        for (let key in body) {
            if (body[key] == '' || body[key] == null) {
                return toast.error(`${key.replace(formRegEx, formRegExReplacer).toLowerCase()} can't be empty`)
            }
        }
        handleSubmit(body);
    };
    return (
        <div>
            <ModalSkeleton
                show={show}
                setShow={setShow}
                width="700px"
                borderRadius="20px"
                header={`${data == undefined ? 'Add' : 'Edit'} Review`}
            >
                <div className={classes.container}>
                    <Row className={classes.row}>
                        <Col md={12}>
                            <Input
                                setter={setTitle}
                                value={title}
                                placeholder={"Title"}
                                label={"Title"}
                            />
                        </Col>
                        <Col md={12}>
                            <TextArea
                                setter={setDescription}
                                value={description}
                                placeholder={"Description"}
                                label={"Description"}
                            />
                        </Col>
                        <Col md={12}>
                            <DropDown setter={setRole} value={role} options={typeOptions} placeholder={'User Type'} label={'User Type'} />
                        </Col>
                        <Col md={12}>
                            <Input setter={setUserName} value={userName} placeholder={'User Name'} label={'User Name'} />
                        </Col>

                    </Row>
                    <div className={classes.btn_main}>
                        <Button
                            onClick={() => HandleSubmitData()}
                            className={classes.btn}
                            label={
                                isLoading
                                    ? "Submitting..."
                                    : data == null
                                        ? "Add Review"
                                        : "Edit Review"
                            }
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </ModalSkeleton>
        </div>
    );
};

export default AddOrUpdateReviewModal;
