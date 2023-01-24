import { useState } from "react";
import styles from "../../styles/Login.module.css";
import { Form, ListGroup, Row, Col, Button } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import AxiosApi from "../api/axios-api";
import { type } from "os";
export default function Forget() {
  const router = useRouter();
  const { token } = router.query;
  const [validated, setValidated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  const [forgetForm, setForgetForm] = useState({
    password: "",
    repeat_password: "",
  });

  const handleChange = (event: any, field: string) => {
    let value: string = event.target.value;
    setErrorMsg("");
    if (field === "repeat_password") {
      setErrorMsg("");
      if (value !== forgetForm.password) {
       
        setShowError(true);
      } else {
        setShowError(false);
      }
    }
    setForgetForm({
      ...forgetForm,
      [field]: value,
    });
  };
  const handleSubmit = async (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false || showError) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      if (showError) {
        setErrorMsg(
          "新しいパスワード、またはパスワード確認の入力が不正です。"
        );
      }
    } else {
      event.preventDefault();
      setLoading(true);
      let response = await AxiosApi.call(
        { token: token ? token.toString() : "", password: forgetForm.password },
        `forget-password/second-step`,
        "post",
        ""
      );
     
      setLoading(false);
      if (response.data) {
        let data = response.data;
        router.push("/forget/completed");
      } else {
        if (response.message) {
          setErrorMsg(response.message);
        }
      }
    }
  };

  return (
    <section className={styles.login}>
      <div className="inner under">
        <h2>パスワード登録</h2>
        <div className="login-container">
          <Form
            className="login-form"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <Form.Group>
              <Form.Label>新しいパスワード</Form.Label>
              <Form.Control
                required
                type={"password"}
                value={forgetForm ? forgetForm.password : ""}
                onChange={(event) => handleChange(event, "password")}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>パスワード確認</Form.Label>
              <Form.Control
                type="password"
                required
                className={`${showError ? "red-border" : ""}`}
                placeholder="6文字以上"
                value={forgetForm.repeat_password}
                onChange={(event) => handleChange(event, "repeat_password")}
              />
            </Form.Group>
            <Form.Group className="actions d-flex justify-content-center">
              <Button
                className="me-3"
                onClick={() =>
                  setForgetForm({
                    password: "",
                    repeat_password: "",
                  })
                }
              >
                クリア
              </Button>
              <Button type="submit">
                {isLoading ? "Processing" : "バスワード変更"}
              </Button>
            </Form.Group>
          </Form>
          {errorMsg ? (
            <div className="error-section">
              <img src="/images/warning.png" />
              <h3>{`Error: ${errorMsg}`}</h3>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
