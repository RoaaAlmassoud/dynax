import { useState } from "react";
import styles from "../styles/Login.module.css";
import { Form, ListGroup, Row, Col, Button } from "react-bootstrap";
import Link from 'next/link';
export default function Login() {
  const [open, setOpen] = useState(false);
  function clicked() {
    setOpen(!open);
  }
  return (
    <section className={styles.login}>
      <div className="inner under">
        <h2>申込者ログイン</h2>
        <div className="login-container">
          <Form className="login-form">
            <Form.Group>
              <Form.Label>予約番号</Form.Label>
              <Form.Control />
            </Form.Group>
            <Form.Group>
              <Form.Label>メールアドレス</Form.Label>
              <Form.Control />
            </Form.Group>
            <Form.Group>
              <Form.Label>パスワード</Form.Label>
              <Form.Control />
            </Form.Group>
            <Form.Group className="actions d-flex justify-content-center">
              <Button className="me-3">クリア</Button>
              <Button>ログイン</Button>
            </Form.Group>
          </Form>
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
