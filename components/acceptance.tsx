import {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import { Modal, Button, Form } from "react-bootstrap";
import WaitingModal from "./waiting";
import AxiosApi from "../pages/api/axios-api";
const AcceptanceModal = forwardRef((props, ref) => {
  let waitingRef = useRef<any>(null);
  const [show, setShow] = useState(false);
  const [waitingShow, setWaitingShow] = useState(false);
  const [daySelected, setDaySelected] = useState(0);
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [agreement, setAgreement] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      setLoading(true);
      let response = await AxiosApi.call(
        {
          mail: email,
          rsv_frame_ids: [daySelected],
        },
        `accept-conditions`,
        "post",
        ""
      );
      setLoading(false);
      if (response.data) {
        openModal();
      } else{
        if (response.message) {
          setErrorMsg(response.message);
        }
      }
    }
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = async (daySelected: number, agreement: string) => {
    setShow(true);
    setDaySelected(daySelected);
    setAgreement(agreement)
  };

  const openModal = () => {
    if (waitingRef.current) {
      waitingRef.current.handleShow(daySelected, email);
    }
  };

  useImperativeHandle(ref, () => ({
    handleShow,
  }));
  return (
    <>
      <Modal
        id="accept"
        show={show}
        onHide={handleClose}
        className={`acceptance-modal`}
      >
        <Modal.Header closeButton>
          <Modal.Title>利用規約</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group
              className="mb-4"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control as="textarea" rows={12} readOnly value={agreement} />
            </Form.Group>
            <Form.Group
              className="email d-flex justify-content-center align-items-center mb-4"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label className="m-0 w-25">メールアドレス</Form.Label>
              <Form.Control
                required
                className="w-50"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="actions d-flex justify-content-center my-2">
              <Button className="me-3" onClick={() => setEmail("")}>
                クリア
              </Button>
              <Button
                type="submit"
                className="py-2"

                //  onClick={() => {
                //    handleSubmit(event);
                //  }}
              >
                {isLoading ? "Processing" : "同意して送信"}
              </Button>
            </Form.Group>
          </Form>
          {errorMsg ? (
            <div className="error-section">
              <img src="/images/warning.png" />
              <h3>{`Error: ${errorMsg}`}</h3>
            </div>
          ) : null}
        </Modal.Body>
      </Modal>
      <WaitingModal ref={waitingRef} />
    </>
  );
});

AcceptanceModal.displayName = "AcceptanceModal";
export default AcceptanceModal;
