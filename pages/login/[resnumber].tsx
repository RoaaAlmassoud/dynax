import { useState } from "react";
import styles from "../../styles/Login.module.css";
import { Form, ListGroup, Row, Col, Button } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import AxiosApi from "../api/axios-api";
export default function Login() {
  const router = useRouter();
  const { resnumber } = router.query;
  const [validated, setValidated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [loginForm, setLoginForm] = useState({
    reservation_code: "",
    email: "",
    password: "",
  });
  function clicked() {
    setOpen(!open);
  }

  const handleChange = (event: any, field: string) => {
    let value: string = event.target.value;
    setErrorMsg("");
    setLoginForm({
      ...loginForm,
      [field]: value,
      reservation_code: resnumber ? resnumber.toString() : "",
    });
  };
  const handleSubmit = async (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      setLoading(true);
      let response = await AxiosApi.call(loginForm, `user/login`, "post", "");
      setLoading(false);
      if (response.data) {
        console.log("response: ", response);
        let data = response.data;
        localStorage.setItem("token", response.data.remember_token);
        router.push("/detail");
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
        <h2>申込者ログイン</h2>
        <div className="login-container">
          <Form
            className="login-form"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <Form.Group>
              <Form.Label>予約番号</Form.Label>
              <Form.Control
                value={resnumber ? resnumber : ""}
                readOnly
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>メールアドレス</Form.Label>
              <Form.Control
                required
                type={"email"}
                value={loginForm ? loginForm.email : ""}
                onChange={(event) => handleChange(event, "email")}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>パスワード</Form.Label>
              <Form.Control
                required
                type={"password"}
                value={loginForm ? loginForm.password : loginForm}
                onChange={(event) => handleChange(event, "password")}
              />
            </Form.Group>
            <Form.Group className="actions d-flex justify-content-center">
              <Button
                className="me-3"
                onClick={() =>
                  setLoginForm({
                    reservation_code: resnumber ? resnumber.toString() : "",
                    email: "",
                    password: "",
                  })
                }
              >
                クリア
              </Button>
              <Button type="submit">
                {isLoading ? "Processing" : "ログイン"}
              </Button>
            </Form.Group>
          </Form>
          {errorMsg ? (
            <div className="error-section">
              <img src="/images/warning-img.png" />
              <h3>{`Error: ${errorMsg}`}</h3>
            </div>
          ) : null}
        </div>
        <ul className="link flexbox">
          <li>
            <a href="#" className="link1">
              <img src="/images/arrow8.svg" alt="" />
              パスワードを忘れた場合はこちら
            </a>
          </li>
        </ul>
        <p className="home-btn">
          <Link href="/">
            <img src="/images/home.svg" alt="" />
            トップページに戻る
          </Link>
        </p>
      </div>
    </section>
  );
}