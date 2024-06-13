import React from "react";
import { Modal } from "react-bootstrap";
import classes from "./modalSkeleton.module.css";
import { AiOutlineClose } from "react-icons/ai";

export default function ModalSkeleton({
  show,
  setShow,
  header,
  footer,
  children,
  modalClass,
  hideHeaderBorder,
  headerStyles,
  footerStyles,
  borderRadius,
  showCloseIcon,
  width,
  borderLine = true,
  headerClass,
}) {
  function handleClose() {
    setShow(false);
  }
  return (
    <>
      <style jsx>{`
        .modal-dialog-centered {
          height: 100% !important;
        }
        .modal-header {
          border-bottom: none !important;
        }
        .modal-header {
          border-bottom: ${hideHeaderBorder
            ? "none"
            : `1px solid var(--main-color-yellow)`};
        }
        .modal-footer {
          margin: 0px;
          display: unset;
          justify-content: unset;
          align-items: unset;
          padding: ${!borderLine ? "15px 30px" : "0px"};
        }

        .${classes.header} button {
          color: var(--black-color) !important;
        }
        .modal-content {
          width: 94%;
          border-radius: ${borderRadius ? borderRadius : "0px"};
          margin: 0 auto;
        }
        .modal .modal-dialog {
          max-width: ${width};
          margin: 0px auto;
        }
        @media screen and (max-width: 992px) {
          .modal .modal-dialog {
            max-width: 70%;
          }
        }
        @media screen and (max-width: 768px) {
          .modal .modal-dialog {
            max-width: 80%;
          }
        }
        @media screen and (max-width: 575px) {
          .modal .modal-dialog {
            max-width: 90%;
          }
        }
      `}</style>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        className={`${[classes.modal].join(" ")}`}>
        <Modal.Header
          // closeButton
          className={`${[classes.header, headerClass && headerClass].join(
            " "
          )}`}
          style={{ ...headerStyles }}>
          <h4>{header}</h4>
        </Modal.Header>
        {showCloseIcon && (
          <div className={classes.iconBox} onClick={handleClose}>
            <AiOutlineClose size={20} />
          </div>
        )}
        <Modal.Body
          className={`${[classes.body, modalClass && modalClass].join(" ")}`}>
          {children}
        </Modal.Body>
        {footer && (
          <Modal.Footer
            className={`${[classes.footer].join(" ")}`}
            style={{
              ...footerStyles,
            }}>
            <div>{footer}</div>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}
