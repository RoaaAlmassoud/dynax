import Head from "next/head";
import { Form, ListGroup, Row, Col, Button } from "react-bootstrap";
import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import DateForm from "../components/date-form";
import Calendar from "../components/calendar";
import axios from "axios";
import { getDay, previousDate, nextDate } from "../utilis/helper";
import { useRouter } from "next/router";
import AxiosApi from "./api/axios-api";
import UserForm from "../components/user-form";

const Home = ({ data }: any) => {
  const router = useRouter();
  const { token } = router.query;
  let rememberToken = token?token.toString(): "";

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

  const [info, setInfo] = useState({
    facilityName: "",
    usedDate: "",
    fullUsedDate: "",
    roomType: "",
    openings: 1,
    email: "",
  });

  const updateDate = (field: string, value: string) => {
    if (field === "month") {
      setDate({ ...date, [field]: parseInt(value), day: 1 });
    } else if (field === "year") {
      setDate({ ...date, [field]: parseInt(value), month: 1, day: 1 });
    } else {
      setDate({ ...date, [field]: parseInt(value) });
    }
  };

  const getReservation = async () => {
    let reservationInformation = await AxiosApi.call(
      {},
      "reservation",
      "get",
      rememberToken
    );
    if (reservationInformation.data) {
      let resData = reservationInformation.data.reservation.rsvdates[0];
      let usedDate = getDay(resData.date);
      let info = {
        facilityName: "施設選択", //reservationInformation.data.reservation.facility.name
        usedDate: `${usedDate.year}/${usedDate.month + 1}/${
          usedDate.dayNumber
        }`,
        fullUsedDate: `${usedDate.year}年${usedDate.month + 1}月${
          usedDate.dayNumber
        }日`,
        roomType: resData.rsvroomtype.room_type.name,
        openings: resData.rsvFrames.openings,
        email: reservationInformation.data.user.mail,
      };
      setInfo(info);
    } else {
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

  useEffect(() => {
    getReservation();
    // let navLink = document
    //   .getElementById("page-nav")
    //   ?.getElementsByTagName("a");
    // if (navLink) {
    //   let contentsArr = new Array();
    //   for (let i = 0; i < navLink?.length; i++) {
    //     let targetContents = navLink[i].getAttribute("href")?.substring(1);
    //     if (targetContents) {
    //       let element =
    //         targetContents && document.getElementById(targetContents)
    //           ? document.getElementById(targetContents)
    //           : null;
    //       if (element) {
    //         let targetContentsTop = element.offsetTop;
    //         let targetContentsBottom =
    //           targetContentsTop + element.offsetHeight - 1;
    //         contentsArr[i] = [targetContentsTop, targetContentsBottom];
    //       }
    //     }
    //   }
    //   function currentCheck() {
    //     let windowScrolltop = window.scrollY;
    //     for (let i = 0; i < contentsArr.length; i++) {
    //       if (
    //         contentsArr[i][0] <= windowScrolltop &&
    //         contentsArr[i][1] >= windowScrolltop
    //       ) {
    //         let activeElement = document.getElementsByClassName("active");
    //         if (activeElement[0]) {
    //           activeElement[0].classList.remove("active");
    //         }
    //         if (navLink[i]) {
    //           navLink[i].classList.add("active");
    //         }

    //         i == contentsArr.length;
    //       }
    //     }
    //   }
    //   window.onscroll = function () {
    //     currentCheck();
    //   };
    // }

    // return () => localStorage.clear();
  }, []);

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
        <div className={`${open ? "open" : ""} page-nav pc`} id="page-nav">
          <p className="nav-txt1">STEP</p>
          <ul>
            <li>
              <a href="#date" id="nav1">
                <span className="step-number">1</span>施設選択
              </a>
            </li>
            <li>
              <a href="#facilities" id="nav2">
                <span className="step-number">2</span>日程選択
              </a>
            </li>
            <li>
              <a href="#calendar" id="nav3">
                <span className="step-number">3</span>基本情報登録
              </a>
            </li>
            <li>
              <a href="#basic-information" id="nav4">
                <span className="step-number">4</span>利用者登録
              </a>
            </li>
          </ul>
          <p onClick={() => setOpen(!open)} className="nav-btn">
            　
          </p>
        </div>
        {info ? (
          <section className="third-section position-now" id="calendar">
            <div className="inner">
              <div className="summary-section">
                <div className="summary-detail">
                  <div>
                    <p className="key">施設</p>
                    <p className="value">{info.facilityName}</p>
                    <p className="key">利用日</p>
                    <p className="value">{info.usedDate}</p>
                    <p className="key">コース</p>
                    <p className="value">{info.roomType}</p>
                  </div>
                  <Button>ここからやり直す</Button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="first-section" id="date">
              <div className="inner">
                <DateForm date={date} updateDate={updateDate} />
              </div>
            </section>
            <section className="second-section position-now" id="facilities">
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
              </div>
            </section>
            <section className="third-section position-now" id="calendar">
              <div className="inner">
                <h2>
                  <img src="images/h2-icon2.svg" alt="宿泊希望日" />
                  宿泊希望日
                </h2>

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
              </div>
            </section>
          </>
        )}

        <section className="fourth-section position-now" id="basic-information">
          <div className="inner">
            <h2>
              <img src="/images/h2-icon3.svg" alt="基本情報" />
              基本情報
            </h2>
            <div className="section-box">
              <UserForm info={info} rememberToken={rememberToken}/>
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
    `https://arubaito.online/api/calendar?facility_id=1`
  );
  return {
    props: {
      data: response.data.data,
    },
  };
};
