import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import WaitingModal from "./waiting";
const AcceptanceModal = forwardRef((props, ref) => {
  let waitingRef = useRef(null);
  const [show, setShow] = useState(false);
  const [waitingShow, setWaitingShow] = useState(false);
  const handleWaittingModal = (): void => setWaitingShow(!waitingShow);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const openModal = () => {
    if (waitingRef.current) {
      handleWaittingModal();
      waitingRef.current.handleShow();
    }
  };

  useImperativeHandle(ref, () => ({
    handleShow,
  }));
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        className={`${waitingShow ? "without-z" : "with-z"} acceptance-modal`}
      >
        <Modal.Header closeButton>
          <Modal.Title>利用規約</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-4"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control as="textarea" rows={12} />
            </Form.Group>
            <Form.Group
              className="email d-flex justify-content-center align-items-center mb-4"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label className="m-0 w-25">メールアドレス</Form.Label>
              <Form.Control className="w-50" />
            </Form.Group>
            <Form.Group className="actions d-flex justify-content-center">
              <Button className="me-3">クリア</Button>
              <Button
                className="py-2"
                onClick={() => {
                  openModal();
                }}
              >
                同意して送信
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
      <WaitingModal
        ref={waitingRef}
        handleWaittingModal={handleWaittingModal}
      />
    </>
  );
});
WaitingModal.displayName = 'AcceptanceModal';
export default AcceptanceModal;
