import React from "react";
import { useNavigate } from "react-router-dom";
import classes from "./TodoCard.module.css";
import { Draggable } from "react-beautiful-dnd";
import { imageUrl } from "../../config/apiUrl";
import { MdDelete, MdModeEdit } from "react-icons/md";
import moment from "moment/moment";

const TodoCard = ({ item, index, handleEdit, handleDelete, bgColor }) => {

  const navigate = useNavigate();

  return (
    <Draggable key={item._id} draggableId={`${item._id}`} index={index}>
      {(draggableProvided, draggableSnapshot) => (
        <div
          className={`${classes.todo_card_main} ${classes[`color-${bgColor}`]}`}
          outlineColor={
            draggableSnapshot.isDragging ? "card-border" : "transparent"
          }
          boxShadow={
            draggableSnapshot.isDragging
              ? "0 5px 10px rgba(0, 0, 0, 0.6)"
              : "unset"
          }
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          {...draggableProvided.dragHandleProps}>
          <p className={classes.title}>{item?.title}</p>
          <p className={classes.description}>{item?.description}</p>
          {item?.deadlineDate && (
            <p className={classes.description}>
              Deadline:
              <span className={classes.heading}>
                {` ${moment(item?.deadlineDate).format("MMM Do YY")}`}
              </span>
            </p>
          )}
          <div className={classes.card_footer_main}>
            <div className={classes.image_sec}>
              {item?.assignedTo?.length > 0 &&
                item?.assignedTo?.slice(0, 3)?.map((image, ind) => {
                  return (
                    <div
                      onClick={() => navigate(`/user-detail/${image?._id}`)}
                      className={`${[
                        ind == 0 ? classes.image_main : classes.image_inner,
                      ].join(" ")}`}>
                      <img src={imageUrl(image?.photo)} />
                    </div>
                  );
                })}
              {item?.assignedTo.length > 2 && <span>+2</span>}
            </div>
          </div>
          <div className={classes?.iconContainer}>
            <MdDelete
              color={"var(--dashboard-main-color)"}
              size={20}
              style={{
                marginRight: 5,
              }}
              onClick={handleDelete}
            />
            <MdModeEdit
              color={"var(--dashboard-main-color)"}
              size={20}
              onClick={handleEdit}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TodoCard;
