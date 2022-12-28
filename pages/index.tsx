import Head from "next/head";
import { Form, ListGroup, Row, Col, Button } from "react-bootstrap";
import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import DateForm from "../components/date-form";
import Calendar from "../components/calendar";
import axios from "axios";
import { getDay, previousDate, nextDate } from "../utilis/helper";

const Home = ({ data }: any) => {
  let sortedData: any;
  let current;
  let firstCalendarItem;
  let lastCalendarItem;
  if (data) {
    if (data.calendar) {
      sortedData = data.calendar.sort(
        (objA: any, objB: any) =>
          new Date(objA.date).getTime() - new Date(objB.date).getTime()
      );
    }
    current = data
      ? data.calendar
        ? { ...data, calendar: data.calendar.slice(0, 21) }
        : null
      : null;

    firstCalendarItem = current
      ? current.calendar
        ? current.calendar[0]
        : {}
      : {};
    lastCalendarItem = current
      ? current.calendar
        ? current.calendar[current.calendar.length - 1]
        : {}
      : {};
  }

  const currentDate = new Date();
  const [open, setOpen] = useState(false);
  const [currentCalendar, setCurrentCalendar] = useState(current);
  const [date, setDate] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    day: currentDate.getDate(),
  });
  const [calendarDate, setCalendarDate] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    day: currentDate.getDate(),
  });

  const [firstItem, setFirstItem] = useState(firstCalendarItem);
  const [lastItem, setLastItem] = useState(lastCalendarItem);

  const [firstSectionSummary, setFirstSectionSummary] = useState(false);
  const [secondSectionSummary, setSecondSectionSummary] = useState(false);

  const updateDate = (field: string, value: string) => {
    if (field === "month") {
      setDate({ ...date, [field]: parseInt(value), day: 1 });
    } else if (field === "year") {
      setDate({ ...date, [field]: parseInt(value), month: 1, day: 1 });
    } else {
      setDate({ ...date, [field]: parseInt(value) });
    }
  };

  const showSecondSummary = () => {
    setSecondSectionSummary(true);
  };

  const updateCalendar = (
    year: number,
    month: number,
    day: number,
    operation?: string
  ) => {
    let newCalendar,
      firstCalendarItem = firstItem,
      lastCalendarItem = lastItem,
      startedIndex: number;

    let currentYear = month === 13 ? year + 1 : year;
    let currentMonth = month === 13 ? 1 : month;
    if (operation) {
      if (operation === "pre-week") {
        startedIndex = data.calendar.indexOf(firstItem);
        newCalendar = data.calendar.slice(startedIndex - 7, startedIndex + 14);
      } else if (operation === "next-week") {
        startedIndex = data.calendar.indexOf(firstItem);
        newCalendar = data.calendar.slice(startedIndex + 7, startedIndex + 27);
      }
    } else {
      let startDate = data.calendar.find((a: any) => {
        return (
          new Date(a.date).getFullYear() === currentYear &&
          new Date(a.date).getMonth() + 1 === currentMonth &&
          new Date(a.date).getDate() === day
        );
      });
      startDate = !startDate
        ? data.calendar.find((a: any) => {
            return (
              new Date(a.date).getFullYear() === currentYear &&
              new Date(a.date).getMonth() + 1 === currentMonth
            );
          })
        : startDate;
      if (startDate) {
        startedIndex = data.calendar.findIndex((object: any) => {
          return object.id === startDate.id;
        });
        newCalendar = data.calendar.slice(startedIndex, startedIndex + 21);
      }
    }
    firstCalendarItem = newCalendar ? newCalendar[0] : {};
    lastCalendarItem = newCalendar ? newCalendar[newCalendar.length - 1] : {};
    setFirstItem(firstCalendarItem);
    setLastItem(lastCalendarItem);
    setCurrentCalendar({ ...data, calendar: newCalendar });
  };

  const calendarOperation = (operation: string) => {
    switch (operation) {
      case "pre-month":
        let previousMonth = previousDate(firstItem.date);
        updateCalendar(
          previousMonth.previousYear,
          previousMonth.previousMonth,
          1
        );
        break;
      case "next-month":
        let nextMonth = nextDate(lastItem.date);
        updateCalendar(nextMonth.nextYear, nextMonth.nextMonth, 1);
        break;
      case "pre-week":
        updateCalendar(date.year, date.month, date.day, "pre-week");
        break;
      case "next-week":
        updateCalendar(date.year, date.month, date.day, "next-week");
        break;
    }
  };

  return (
    <div>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />

        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.2.0/css/datepicker.min.css"
          rel="stylesheet"
        ></link>
      </Head>
      <main className={styles.main}>
        <div className={`${open ? "open" : ""} page-nav pc`}>
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
          <p onClick={() => setOpen(!open)} className="nav-btn">
            　
          </p>
        </div>
        {firstSectionSummary || secondSectionSummary ? null : (
          <section className="first-section" id="sec1">
            <div className="inner">
              <DateForm date={date} updateDate={updateDate} />
            </div>
          </section>
        )}
        {secondSectionSummary ? null : (
          <section className="second-section position-now" id="sec2">
            <div className="inner">
              <h2>
                <img src="/images/h2-icon1.svg" alt="施設選択" />
                施設選択
              </h2>
              {firstSectionSummary ? (
                <div className="summary-section">
                  <div className="summary-detail">
                    <div>
                      <p className="key">利用日</p>
                      <p className="value">{`${date.year}年${date.month}月${date.day}日 日日`}</p>
                    </div>
                    <Button>ここからやり直す</Button>
                  </div>
                </div>
              ) : (
                <>
                  <form action="">
                    <ul className="checkbox flexbox">
                      <li className="hotel-open checked">
                        <img
                          src="images/img1.jpg"
                          alt=""
                          className="thumbnail"
                        />
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
                      <img
                        src="images/next.svg"
                        alt="次へ"
                        onClick={() => {
                          setFirstSectionSummary(true);
                          updateCalendar(date.year, date.month, date.day);
                        }}
                      />
                    </a>
                  </p>
                </>
              )}
            </div>
          </section>
        )}

        <section className="third-section position-now" id="sec3">
          <div className="inner">
            <h2>
              <img src="images/h2-icon2.svg" alt="宿泊希望日" />
              宿泊希望日
            </h2>
            {secondSectionSummary ? (
              <div className="summary-section">
                <div className="summary-detail">
                  <div>
                    <p className="key">xxxx</p>
                    <p className="value">{`xxxx`}</p>
                    <p className="key">xxxx</p>
                    <p className="value">{`xxxx`}</p>
                    <p className="key">xxxx</p>
                    <p className="value">{`xxxx`}</p>
                  </div>
                  <Button>ここからやり直す</Button>
                </div>
              </div>
            ) : current ? (
              <Calendar
                date={date}
                current={currentCalendar}
                data={data}
                calendarDate={calendarDate}
                calendarOperation={calendarOperation}
                firstCalendarItem={firstItem}
                lastCalendarItem={lastItem}
                showSecondSummary={showSecondSummary}
              />
            ) : null}
          </div>
        </section>

        <section className="fourth-section position-now" id="sec4">
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
                  <Form.Group
                    as={Col}
                    controlId="formPlaintextEmail"
                    className="m-0 pc"
                  ></Form.Group>
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
                  <Form.Group
                    as={Col}
                    className="m-0 pc"
                    controlId="formPlaintextEmail"
                  ></Form.Group>
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
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const response = await axios.get(
    `http://194.163.169.47/api/calendar?facility_id=1`
  );
  return {
    props: {
      data: response.data.data,
    },
  };
};
