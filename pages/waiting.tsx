import { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
const WaitingModal = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    props.handleWaittingModal(false);
    setShow(false);
  };
  const handleShow = () => setShow(true);

  useImperativeHandle(ref, () => ({
    handleShow,
  }));
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      className={`${show ? "with-z" : ""} waiting-modal`}
    >
      <Modal.Header>
        <Modal.Title>メールをご確認ください</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                メールアドレス
              </InputGroup.Text>
              <Form.Control
                placeholder=""
                aria-label="email"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
            <Form.Text id="emailHelpBlock">
              上記メールアドレスに送信したメールに記載してある
              URLをクリックして予約を進めてください。
            </Form.Text>
          </Form.Group>
          <Form.Group className="actions d-flex justify-content-left mt-4">
            <Button onClick={() => handleClose()}>
              メールアドレスを <br />
              入力し直す
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
});

export default WaitingModal;
