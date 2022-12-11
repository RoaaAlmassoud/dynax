import Head from "next/head";
import { Form, ListGroup, Row, Col, Button } from "react-bootstrap";
import styles from "../styles/Home.module.css";
import { useRef, useState } from "react";
import AcceptanceModal from "./acceptance";
export default function Home() {
  const date = new Date();
  let modalRef = useRef<any>(null);
 const [open, setOpen] = useState(false);

  const openModal = () => {
    if (modalRef.current) {
        modalRef.current.handleShow();
    }
  };
  return (
    <div>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans+JP:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.2.0/css/datepicker.min.css"
          rel="stylesheet"
        ></link>
      </Head>
      <main className={styles.main}>
        <div className={`${open? 'open':''} page-nav pc`}>
          <p className="nav-txt1">STEP</p>
          <ul>
            <li>
              <a href="#sec1">
                <span className="step-number">1</span>施設選択
              </a>
            </li>
            <li>
              <a href="#sec2">
                <span className="step-number">2</span>日程選択
              </a>
            </li>
            <li>
              <a href="#sec3">
                <span className="step-number">3</span>基本情報登録
              </a>
            </li>
            <li>
              <a href="#sec4">
                <span className="step-number">4</span>利用者登録
              </a>
            </li>
          </ul>
          <p onClick={() => setOpen(!open)} className="nav-btn">　</p>
        </div>
        <section className="sec1" id="sec1">
          <div className="inner">
            <Form>
              <Form.Group className="d-flex align-items-baseline">
                <Form.Label>利用日</Form.Label>
                <Form.Select
                  className="mr-2 year form-select"
                  aria-label="Default select example"
                  name="year"
                >
                  <option selected>2022年</option>
                  <option value="1">2023年</option>
                  <option value="2">2024年</option>
                  <option value="3">2025年</option>
                  <option value="4">2026年</option>
                  <option value="5">2027年</option>
                  <option value="6">2028年</option>
                  <option value="7">2029年</option>
                  <option value="8">2030年</option>
                  <option value="9">2031年</option>
                  <option value="10">2032年</option>
                </Form.Select>

                <Form.Select name="month" className="month form-select">
                  <option value="1" selected>
                    1月
                  </option>
                  <option value="2">2月</option>
                  <option value="3">3月</option>
                  <option value="4">4月</option>
                  <option value="5">5月</option>
                  <option value="6">6月</option>
                  <option value="7">7月</option>
                  <option value="8">8月</option>
                  <option value="9">9月</option>
                  <option value="10">10月</option>
                  <option value="11">11月</option>
                  <option value="12">12月</option>
                </Form.Select>

                <Form.Select name="day" className="day form-select">
                  <option value="1" selected>
                    1日
                  </option>
                  <option value="2">2日</option>
                  <option value="3">3日</option>
                  <option value="4">4日</option>
                  <option value="5">5日</option>
                  <option value="6">6日</option>
                  <option value="7">7日</option>
                  <option value="8">8日</option>
                  <option value="9">9日</option>
                  <option value="10">10日</option>
                  <option value="11">11日</option>
                  <option value="12">12日</option>
                  <option value="13">13日</option>
                  <option value="14">14日</option>
                  <option value="15">15日</option>
                  <option value="16">16日</option>
                  <option value="17">17日</option>
                  <option value="18">18日</option>
                  <option value="19">19日</option>
                  <option value="20">20日</option>
                  <option value="21">21日</option>
                  <option value="22">22日</option>
                  <option value="23">23日</option>
                  <option value="24">24日</option>
                  <option value="25">25日</option>
                  <option value="26">26日</option>
                  <option value="27">27日</option>
                  <option value="28">28日</option>
                  <option value="29">29日</option>
                  <option value="30">30日</option>
                  <option value="31">31日</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="d-flex align-items-baseline">
                <Form.Label>施設</Form.Label>
                <Form.Check
                  type={"checkbox"}
                  id={`default-checkbox`}
                  label={`全て`}
                  checked
                />
              </Form.Group>
            </Form>
          </div>
        </section>
        <section className="sec2 position-now" id="sec2">
          <div className="inner">
            <h2>
              <img src="/images/h2-icon1.svg" alt="施設選択" />
              施設選択
            </h2>
            <form action="">
              <ul className="checkbox flexbox">
                <li className="hotel-open checked">
                  <img src="images/img1.jpg" alt="" className="thumbnail" />
                  <input
                    className="disabled_checkbox"
                    type="checkbox"
                    name="施設"
                    value="軽井沢"
                    checked
                  />
                  軽井沢
                </li>
              </ul>
            </form>
            <p className="next">
              <a href="#sec3">
                <img src="images/next.svg" alt="次へ" />
              </a>
            </p>
          </div>
        </section>
        <section className="sec3 position-now" id="sec3">
          <div className="inner">
            <h2>
              <img src="images/h2-icon2.svg" alt="宿泊希望日" />
              宿泊希望日
            </h2>
            <p className="calendar-submit submit">
              <button
                onClick={() => {
                  openModal();
                }}
                type="button"
                className="btn btn-primary submit"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                予約へ進む
              </button>
            </p>
          </div>
        </section>

        <section className="sec4 position-now" id="sec4">
          <div className="inner">
            <h2>
              <img src="/images/h2-icon3.svg" alt="基本情報" />
              基本情報
            </h2>
            <div className="section-box">
              <Form action="" name="basic" className="basic-info-form">
                <Row>
                  <Form.Group
                    as={Col}
                    className="pr-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label className="key">施設</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue="軽井沢保養所"
                      className="value"
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    className="pl-3"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label className="key">宿泊日</Form.Label>

                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue="2022年月25日"
                      className="value"
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    controlId="formPlaintextEmail"
                    className="m-0"
                  >
                    <Form.Label className="key">コース</Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue="来館見学 : 10:30"
                      className="value"
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    className="m-0"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label className="key">人数</Form.Label>
                    <Form.Select
                      className="number-room-select"
                      aria-label="Default select example"
                    >
                      <option selected>1</option>
                      <option value="1">2</option>
                      <option value="2">3</option>
                      <option value="3">4</option>
                      <option value="4">5</option>
                    </Form.Select>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    className="name-group"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label className="key">申込者氏名</Form.Label>
                    <Form.Control placeholder="姓" />
                    <Form.Control placeholder="名" />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    className="name-group"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label className="key">氏名フリガナ</Form.Label>
                    <Form.Control placeholder="セイ" />
                    <Form.Control placeholder="メイ" />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    className="one-input"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label className="key">メール</Form.Label>
                    <Form.Control type="email" placeholder="name@example.com" />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    className="one-input"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label className="key">電話番号</Form.Label>
                    <Form.Control placeholder="090-1111-1111" />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    className="one-input"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label className="key">バスワード</Form.Label>
                    <Form.Control type="password" placeholder="6文字以上" />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    className="one-input"
                    controlId="formPlaintextEmail"
                  >
                    <Form.Label className="key">パスワード確認</Form.Label>
                    <Form.Control placeholder="6文字以上" />
                  </Form.Group>
                </Row>
                <Row className="border-0">
                  <Button>予約申込</Button>
                </Row>
              </Form>
            </div>
          </div>
        </section>
      <AcceptanceModal ref={modalRef} />
      </main>
    </div>
  );
}
