import Head from "next/head";
import { Button } from "react-bootstrap";
import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import DateForm from "../components/date-form";
import Calendar from "../components/calendar";
import UserForm from "../components/user-form";
import WindowSize from "../components/window-size";
import axios from "axios";
import * as https from "https";
import { getDay, previousDate, nextDate } from "../utilis/helper";
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});
const Home = ({ data, facility, names }: any) => {
  const size = WindowSize();
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
        ? {
            ...data,
            // calendar: data.calendar.slice(0, sliceNumber)
          }
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
    fullDay: currentDate.toLocaleDateString("ja-JP", { weekday: "long" }),
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
      let dayFull = new Date(
        date.year,
        parseInt(value) - 1,
        1
      ).toLocaleDateString("ja-JP", { weekday: "long" });

      setDate({ ...date, [field]: parseInt(value), day: 1, fullDay: dayFull });
    } else if (field === "year") {
      let dayFull = new Date(
        parseInt(value),
        date.month - 1,
        1
      ).toLocaleDateString("ja-JP", { weekday: "long" });
      setDate({
        ...date,
        year: parseInt(value),
        month: 1,
        day: 1,
        fullDay: dayFull,
      });
    } else {
      let dayFull = new Date(
        date.year,
        date.month - 1,
        parseInt(value)
      ).toLocaleDateString("ja-JP", { weekday: "long" });
      setDate({ ...date, [field]: parseInt(value), fullDay: dayFull });
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
        let startSlice = size.width > 640 ? startedIndex - 7 : startedIndex - 7;
        let endSlice = size.width > 640 ? startedIndex + 14 : startedIndex + 7;
        newCalendar = data.calendar.slice(
          startSlice < 0 ? 0 : startSlice,
          startSlice < 0? endSlice+Math.abs(startSlice): endSlice
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
        let nextMonthNum =
          getDay(firstItem.date).month === getDay(lastItem.date).month
            ? nextMonth.nextMonth + 1
            : nextMonth.nextMonth;
        updateCalendar(nextMonth.nextYear, nextMonthNum, 1);
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
    let pageElement = document.getElementById("page-nav");
    let navLink: any;
    if (pageElement) navLink = pageElement.getElementsByTagName("a");
    if (navLink) {
      let contentsArr = new Array();
      for (let i = 0; i < navLink?.length; i++) {
        let targetContents = navLink[i].getAttribute("href")?.substring(1);
        if (targetContents) {
          let element =
            targetContents && document.getElementById(targetContents)
              ? document.getElementById(targetContents)
              : null;
          if (element) {
            let targetContentsTop = element.offsetTop;
            let targetContentsBottom =
              targetContentsTop + element.offsetHeight - 1;
            contentsArr[i] = [targetContentsTop, targetContentsBottom];
          }
        }
      }
      function currentCheck() {
        let windowScrolltop = window.scrollY;
        for (let i = 0; i < contentsArr.length; i++) {
          if (
            contentsArr[i][0] <= windowScrolltop &&
            contentsArr[i][1] >= windowScrolltop
          ) {
            let activeElement = document.getElementsByClassName("active");
            if (activeElement[0]) {
              activeElement[0].classList.remove("active");
            }
            if (navLink[i]) {
              navLink[i].classList.add("active");
            }

            i == contentsArr.length;
          }
        }
      }
      window.onscroll = function () {
        currentCheck();
      };
    }
  }, []);

  return (
    <div>
      <Head>
        {/* <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/> */}
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
                <span className="step-number">1</span>
                {"施設選択"}
              </a>
            </li>
            <li>
              <a href="#facilities" id="nav2">
                <span className="step-number">2</span>
                {names ? names.section01 : "日程選択"}
              </a>
            </li>
            <li>
              <a href="#calendar" id="nav3">
                <span className="step-number">3</span>
                {names ? names.section02 : "基本情報登録"}
              </a>
            </li>
            {/* <li>
              <a href="#basic-information" id="nav4">
                <span className="step-number">4</span>{names ? names.section03: "利用者登録"}
              </a>
            </li> */}
          </ul>
          <p onClick={() => setOpen(!open)} className="nav-btn">
            　
          </p>
        </div>
        {firstSectionSummary || secondSectionSummary ? null : (
          <section className="first-section" id="date">
            <div className="inner">
              <DateForm date={date} updateDate={updateDate} />
            </div>
          </section>
        )}
        {secondSectionSummary ? null : (
          <section className="second-section position-now" id="facilities">
            <div className="inner">
              <h2>
                <img src="/images/h2-icon1.svg" alt="施設選択" />
                {names ? names.section01 : "施設選択"}
              </h2>
              {firstSectionSummary ? (
                <div className="summary-section">
                  <div className="summary-detail">
                    <div>
                      <p className="key">利用日</p>
                      <p className="value">{`${date.year}年${date.month}月${date.day}日 ${date.fullDay}`}</p>
                    </div>
                    <Button
                      onClick={() => {
                        setFirstSectionSummary(false);
                        // updateCalendar(date.year, date.month, date.day);
                      }}
                    >
                      ここからやり直す
                    </Button>
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
                        {facility ? facility.name : "軽井沢"}
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

        <section className="third-section position-now" id="calendar">
          <div className="inner">
            <h2>
              <img src="images/h2-icon2.svg" alt="宿泊希望日" />
              {names ? names.section02 : "基本情報登録"}
            </h2>
            {secondSectionSummary ? (
              <div className="summary-section">
                <div className="summary-detail">
                  <div>
                    <p className="key">施設</p>
                    <p className="value">{`xxxx`}</p>
                    <p className="key">利用日</p>
                    <p className="value">{`xxxx`}</p>
                    <p className="key">コース</p>
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
                names={names}
                facility={facility}
              />
            ) : null}
          </div>
        </section>

        {/* <section className="fourth-section position-now" id="basic-information">
          <div className="inner">
            <h2>
              <img src="/images/h2-icon3.svg" alt="基本情報" />
              {names ? names.section03: "基本情報"}
            </h2>
            <div className="section-box">
              <UserForm />
            </div>
          </div>
        </section> */}
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const facility = await axios.get(`https:arubaito.online/api/facilities`, {
    httpsAgent,
  });
  const names = await axios.get(`https:arubaito.online/api/names`, {
    httpsAgent,
  });
  let response;
  if (facility.data) {
    const facilityObject = facility.data.data[0];
    response = await axios.get(
      `https:arubaito.online/api/calendar?facility_id=${facilityObject.id}`,
      { httpsAgent }
    );
  }

  return {
    props: {
      data: response ? response.data.data : {},
      facility: facility.data.data[0],
      names: names.data.data,
    },
  };
};
