import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import { Input } from "../../Component/Input/Input";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./AddOrUpdateCategoryModal.module.css";

const AddOrUpdateCategoryModal = ({
    show,
    setShow,
    handleSubmit,
    data,
    isLoading = false,

}) => {

    const [name, setName] = useState("");
    const [isActive, setIsActive] = useState("");

    useEffect(() => {
        if (data !== undefined) {
            setName(data?.name)
            setIsActive(data?.isActive ? { label: 'Active', value: data?.isActive } : { label: 'Deactive', value: data?.isActive })
        }

    }, [data]);

    const HandleSubmitData = () => {

        if (name == "") {
            return toast.error(`Category name is required`)
        }

        let body = {
            name,
            ...(data && { isActive: isActive?.value, })
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
                header={`${data == undefined ? 'Add' : 'Edit'} Category`}
            >
                <div className={classes.container}>
                    <Row className={classes.row}>
                        <Col md={12}>
                            <Input
                                setter={setName}
                                value={name}
                                placeholder={"Category Name"}
                                label={"Category Name"}
                            />
                        </Col>
                        {data && <Col md={12}>
                            <DropDown 
                                setter={setIsActive} 
                                value={isActive} 
                                options={[{ label: 'Active', value: true, }, { label: 'Deactive', value: false, }]} 
                                placeholder={'Status'} label={'Status'} 
                                optionsLabel={"label"}
                                optionsValue={"value"}
                            />
                        </Col>}
                    </Row>
                    <div className={classes.btn_main}>
                        <Button
                            onClick={() => HandleSubmitData()}
                            className={classes.btn}
                            label={
                                isLoading
                                    ? "Submitting..."
                                    : data == null
                                        ? "Add Category"
                                        : "Edit Category"
                            }
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </ModalSkeleton>
        </div>
    );
};

export default AddOrUpdateCategoryModal;
