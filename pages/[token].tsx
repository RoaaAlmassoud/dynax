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
import WindowSize from "../components/window-size";

const Home = (props: any) => {
  const size = WindowSize();
  const router = useRouter();
  const { token } = router.query;
  const { type } = router.query;
  let tokenData = token ? token.toString() : "";

  let sortedData: any;
  let current;
  let firstCalendarItem = {};
  let lastCalendarItem = {};

  const currentDate = new Date();
  const [open, setOpen] = useState(false);
  const [currentCalendar, setCurrentCalendar] = useState(current);
  const [date, setDate] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    day: currentDate.getDate(),
  });
  const [rememberToken, setRememberToken] = useState(tokenData);
  const [calendarDate, setCalendarDate] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    day: currentDate.getDate(),
  });

  const [loading, setLoading] = useState(true);
  const [daySelected, setDaySelected] = useState(0);

  const [firstItem, setFirstItem] = useState(firstCalendarItem);
  const [lastItem, setLastItem] = useState(lastCalendarItem);

  const [firstSectionSummary, setFirstSectionSummary] = useState(false);

  const [secondSectionSummary, setSecondSectionSummary] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showBasic, setShowBasic] = useState(false);

  const [reservation, setReservation] = useState({});

  const [data, setData] = useState({
    room_types: [],
    calendar: [],
  });

  const [info, setInfo] = useState({
    facilityName: "",
    usedDate: "",
    fullUsedDate: "",
    roomType: "",
    openings: 1,
    email: "",
    dateObject: { year: 0, month: 0, dayNumber: 0 },
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

  // const getReservation = async () => {
  //   let reservationInformation = await AxiosApi.call(
  //     {},
  //     "reservation",
  //     "get",
  //     rememberToken
  //   );
  //   if (reservationInformation.data) {
  //     let resData = reservationInformation.data.reservation.rsvdates[0];
  //     let user = reservationInformation.data.user;
  //     let usedDate = getDay(resData.date);
  //     let info = {
  //       facilityName: "施設選択", //reservationInformation.data.reservation.facility.name
  //       usedDate: `${usedDate.year}/${usedDate.month + 1}/${
  //         usedDate.dayNumber
  //       }`,
  //       fullUsedDate: `${usedDate.year}年${usedDate.month + 1}月${
  //         usedDate.dayNumber
  //       }日`,
  //       roomType: resData.rsvroomtype.room_type.name,
  //       openings: resData.rsvFrames.openings,
  //       email: reservationInformation.data.user.mail,
  //     };

  //     let reservation = {};
  //     if (type === "update") {
  //       reservation = {
  //         first_name: user.name.split(" ")[1],
  //         last_name: user.name.split(" ")[0],
  //         first_name_kana: user.kana.split(" ")[1],
  //         last_name_kana: user.kana.split(" ")[0],
  //         phone_number: user.tel,
  //       };
  //     }
  //     setInfo(info);
  //     if (reservation) {
  //       setReservation(reservation);
  //       updateCalendar(usedDate.year, usedDate.month + 1, usedDate.dayNumber);
  //     }
  //   } else {
  //   }
  // };

  const showSecondSummary = () => {
    setSecondSectionSummary(true);
  };

  const updateCalendar = (
    year: number,
    month: number,
    day: number,
    operation?: string
  ) => {
    let newCalendar = [];
    let firstCalendarItem = firstItem,
      lastCalendarItem = lastItem,
      startedIndex: number;

    let currentYear = month === 13 ? year + 1 : year;
    let currentMonth = month === 13 ? 1 : month;
    if (operation) {
      if (operation === "pre-week") {
        startedIndex = data.calendar.indexOf(firstItem);

        let startSlice = size.width > 640 ? startedIndex - 7 : startedIndex - 7;
        let endSlice = size.width > 640 ? startedIndex + 14 : startedIndex + 7;
        newCalendar = data.calendar.slice(
          startSlice < 0 ? 0 : startSlice,
          startSlice < 0 ? endSlice + Math.abs(startSlice) : endSlice
        );
      } else if (operation === "next-week") {
        startedIndex = data.calendar.indexOf(firstItem);
        let startSlice = size.width > 640 ? startedIndex + 7 : startedIndex + 7;
        let endSlice = size.width > 640 ? startedIndex + 28 : startedIndex + 20;
        newCalendar = data.calendar.slice(startSlice, endSlice);
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
    if (!router.isReady) return;
    console.log("router: ", router);
    getCalendar();
  }, [router.isReady]);

  const getCalendar = async () => {
    const response = await axios.get(
      `https:arubaito.online/api/calendar?facility_id=1`
    );
    if (response) {
      let data = response.data.data;
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
        setData(data);
        setCurrentCalendar(current);
        setFirstItem(firstCalendarItem);
        setLastItem(lastCalendarItem);

        console.log("rememberToken: ", rememberToken);
        if (router.isReady) {
          console.log("in rready: ", router.query.token);
          let tokenValue = router.query.token
            ? router.query.token.toString()
            : "";
          let reservationInformation = await AxiosApi.call(
            {},
            "reservation",
            "get",
            tokenValue
          );
          if (reservationInformation.data) {
            let resData = reservationInformation.data.reservation.rsvdates[0];
            let user = reservationInformation.data.user;
            let usedDate = getDay(resData.date);
            let info = {
              facilityName: "施設選択", //reservationInformation.data.reservation.facility.name
              usedDate: `${usedDate.year}/${usedDate.month + 1}/${
                usedDate.dayNumber
              }`,
              fullUsedDate: `${usedDate.year}年${usedDate.month + 1}月${
                usedDate.dayNumber
              }日`,
              dateObject: {
                year: usedDate.year,
                month: usedDate.month + 1,
                dayNumber: usedDate.dayNumber,
              },
              roomType: resData.rsvroomtype.room_type.name,
              openings: resData.rsvFrames.openings,
              email: reservationInformation.data.user.mail,
            };

            let reservation = {};
            if (type === "update") {
              reservation = {
                first_name: user.name.split(" ")[1],
                last_name: user.name.split(" ")[0],
                first_name_kana: user.kana.split(" ")[1],
                last_name_kana: user.kana.split(" ")[0],
                phone_number: user.tel,
              };
            }
            setInfo(info);
            if (Object.keys(reservation).length > 0) {
              setReservation(reservation);
              setShowCalendar(true);
              setShowBasic(false);
              setSecondSectionSummary(false);
              updateCalendar(
                usedDate.year,
                usedDate.month + 1,
                usedDate.dayNumber
              );
            } else {
              setShowCalendar(false);
              setSecondSectionSummary(true);
              setShowBasic(true);
            }
            setLoading(false);
          } else {
          }
        }
      }
    }
  };

  const renderCalendar = () => {
    setShowCalendar(!showCalendar);
    setShowBasic(!showBasic);
    setSecondSectionSummary(!secondSectionSummary);
    updateCalendar(
      info.dateObject.year,
      info.dateObject.month,
      info.dateObject.dayNumber
    );
  };

  const updateSummary = (info: any, day: number) => {
    setInfo(info);
    setShowCalendar(!showCalendar);
    setShowBasic(!showBasic);
    setSecondSectionSummary(!secondSectionSummary);
    setDaySelected(day);
    updateCalendar(
      info.dateObject.year,
      info.dateObject.month,
      info.dateObject.dayNumber
    );
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
      {!loading ? (
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
          {secondSectionSummary ? (
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
                    <Button onClick={() => renderCalendar()}>
                      ここからやり直す
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          ) : (
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
                  updateSummary={updateSummary}
                  info={info}
                />
              </div>
            </section>
          )}
          {showBasic ? (
            <section
              className="fourth-section position-now"
              id="basic-information"
            >
              <div className="inner">
                <h2>
                  <img src="/images/h2-icon3.svg" alt="基本情報" />
                  基本情報
                </h2>
                <div className="section-box">
                  <UserForm
                    info={info}
                    rememberToken={rememberToken}
                    reservation={reservation}
                    type={type}
                    daySelected={daySelected}
                  />
                </div>
              </div>
            </section>
          ) : null}
        </main>
      ) : null}
    </div>
  );
};

export default Home;

//  export const getStaticProps = async () => {
//    const response = await axios.get(
//      `https://arubaito.online/api/calendar?facility_id=1`
//    );
//    return {
//      props: {
//        data: response.data.data,
//      },
//    };
//  };
