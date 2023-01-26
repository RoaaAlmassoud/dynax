import { useRef, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { propTypes } from "react-bootstrap/esm/Image";
import AcceptanceModal from "../components/acceptance";
import { getDay, previousDate, nextDate, unique } from "../utilis/helper";
import WindowSize from "./window-size";
import AxiosApi from "../pages/api/axios-api";
const Calendar = ({
  date,
  data,
  current,
  calendarOperation,
  calendarDate,
  firstCalendarItem,
  lastCalendarItem,
  showSecondSummary,
  names,
  facility,
  updateSummary,
  info,
}: any) => {
  const size = WindowSize();
  const [daySelected, setDaySelected] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [infoData, setInfoData] = useState({});
  let sliceNumber = size.width > 640 ? 21 : 7;
  let currentCalendar = current
    ? current.calendar
      ? { ...current, calendar: current.calendar.slice(0, sliceNumber) }
      : data
      ? data.calendar
        ? { ...current, calendar: data.calendar.slice(0, sliceNumber) }
        : null
      : null
    : null;
  firstCalendarItem = currentCalendar.calendar
    ? currentCalendar.calendar[0]
    : null;

  lastCalendarItem = currentCalendar.calendar
    ? currentCalendar.calendar[currentCalendar.calendar.length - 1]
    : null;

  let previousFormate = firstCalendarItem
    ? previousDate(firstCalendarItem.date)
    : null;
  let nextFormate = lastCalendarItem ? nextDate(lastCalendarItem.date) : null;
  let minDate = data
    ? data.calendar
      ? {
          month: getDay(data.calendar[0].date).month + 1,
          year: getDay(data.calendar[0].date).year,
        }
      : null
    : null;
  let maxDate = data
    ? data.calendar
      ? {
          month: getDay(data.calendar[data.calendar.length - 1].date).month + 1,
          year: getDay(data.calendar[data.calendar.length - 1].date).year,
        }
      : null
    : null;

  let previousMonthText = previousFormate
    ? `${previousFormate.previousYear}年 ${previousFormate.previousMonth}月`
    : "";

  let monthText = nextFormate
    ? getDay(firstCalendarItem.date).month ===
      getDay(lastCalendarItem.date).month
      ? nextFormate.nextMonth + 1
      : nextFormate.nextMonth
    : "";
  let nextMonthText = nextFormate
    ? `${nextFormate.nextYear}年 ${monthText}月`
    : "";

  let modalRef = useRef<any>(null);

  const openModal = async () => {
    setLoading(true);
    if (info && localStorage.getItem("token")) {
      // add status check
      let response = await AxiosApi.call(
        {
          rsv_frame_ids: [daySelected],
        },
        `accept-conditions-for-update`,
        "post",
        ""
      );
      setLoading(false);
      if (response.data) {
        updateSummary(infoData, daySelected);
      }
    } else {
      if (modalRef.current) {
        modalRef.current.daySelected = daySelected;
        modalRef.current.handleShow(
          daySelected,
          facility ? facility.agreement : ""
        );
      }
    }
  };
  const dayClicked = (day: any, frame: any) => {
    if (frame.openings !== 0) {
      setDaySelected(daySelected === frame.id ? "" : frame.id);
      let usedDate = getDay(day.date);
      let roomType = data.room_types.find(
        (a: any) => a.id === frame.roomtype_id
      );
      let infoData = {
        ...info,
        usedDate: `${usedDate.year}/${usedDate.month + 1}/${
          usedDate.dayNumber
        }`,
        dateObject: {
          year: usedDate.year,
          month: usedDate.month + 1,
          dayNumber: usedDate.dayNumber,
        },
        roomType: roomType.name,
        fullUsedDate: `${usedDate.year}年${usedDate.month + 1}月${
          usedDate.dayNumber
        }日`,
        number_of_rooms: 1,
        totalRoomsNum: frame.openings,
      };
      setInfoData(infoData);
    }
  };
  const renderDay = (day: any, type: any) => {
    const dayData = getDay(day.date);
    switch (day.status_type) {
      case 0:
        const availableNumber = day.rsv_frames.find(
          (a: any) => a.roomtype_id === type.id
        );

        let color = "blue";
        if (availableNumber.openings === type.num_rooms) {
          color = "pale blue";
        } else {
          let rate = (availableNumber.fixed_number / type.num_rooms) * 100;
          if (rate > 0 && rate < 49) {
            color = "pale blue";
          } else if (rate >= 50 && rate <= 99) {
            color = "blue";
          } else {
            color = "deep blue";
          }
        }

        let td = (
          <td
            key={unique()}
            className={`${color} ${availableNumber.id} ${
              daySelected === availableNumber.id ? "selected" : ""
            }
        ${availableNumber.openings === 0 ? "disabled" : ""}`}
            onClick={() => dayClicked(day, availableNumber)}
          >
            {availableNumber.openings}
          </td>
        );
        return td;
        break;

      case 1:
        return (
          <td key={unique()} className="gray">
            休
          </td>
        );
        break;
      case 2:
      case 3:
        return <td key={unique()} className="gray"></td>;
        break;
    }
  };

  const renderTableHeader = (day: any, index: number) => {
    const dayData = getDay(day.date);
    let dayBeforeText = checkDay(dayData, index);
    return (
      <th
        key={unique()}
        className={`day ${
          dayData.dayName === "土"
            ? "saturday"
            : dayData.dayName === "日"
            ? "sunday"
            : day.date_type === 1
            ? "red"
            : ""
        } ${dayBeforeText}`}
      >
        {dayBeforeText ? (
          size.width > 640 ? (
            <div className="header-text">{`${dayData.year}年${
              dayData.month + 1
            }月`}</div>
          ) : (
            <span className="month-sp">{`${dayData.month + 1}/`}</span>
          )
        ) : null}
        <p className="day-number">{dayData.dayNumber}</p>
        <p className="day-name"> {dayData.dayName}</p>
      </th>
    );
  };

  const calenderOperation = (operation: string) => {
    calendarOperation(operation);
  };

  const checkDay = (day: any, index: number): string => {
    let withIndex = index === 0 || day.dayNumber === 1;
    return withIndex ? "with-before" : "";
  };
  return (
    <>
      <ul className="status-colors flexbox">
        <li>
          <span className="status-color color1"></span>先着順：空室あり
        </li>
        <li>
          <span className="status-color color2"></span>先着順：空室わずか
        </li>
        <li>
          <span className="status-color color3"></span>先着順：満室
        </li>
      </ul>
      {currentCalendar.calendar ? (
        <div className={`${size.width <= 640 ? "calendar-sp" : ""}`}>
          <div className="flexbox switch-month">
            <Button
              className="previous-btn"
              onClick={() => calenderOperation("pre-month")}
              disabled={
                minDate && previousFormate
                  ? previousFormate.previousYear < minDate.year
                    ? true
                    : previousFormate.previousYear === minDate.year &&
                      previousFormate.previousMonth < minDate.month
                  : false
              }
            >
              {previousMonthText}
            </Button>
            {/* <p>日程は複数選択が可能です</p> */}
            <Button
              className="next-btn"
              onClick={() => calenderOperation("next-month")}
              disabled={
                maxDate && nextFormate
                  ? nextFormate.nextYear === maxDate.year &&
                    monthText > maxDate.month
                  : false
              }
            >
              {nextMonthText}
            </Button>
          </div>
          <div className="calendar-section">
            <h3>{facility ? facility.name : info ? info.facilityName : ""}</h3>
            <Table className="calendar-table">
              <thead>
                <tr>
                  {size.width > 640 ? (
                    <>
                      <th className="room-type">
                        {names ? names.roomtype : "部屋タイプ"}
                      </th>
                      <th className="room-number">
                        {names ? names.num_rooms : "部屋数"}
                      </th>
                    </>
                  ) : null}

                  {data
                    ? data.calendar
                      ? currentCalendar.calendar
                        ? currentCalendar.calendar.map(
                            (day: any, index: number) => {
                              return renderTableHeader(day, index);
                            }
                          )
                        : null
                      : null
                    : null}
                </tr>
              </thead>
              <tbody className="calendar-body">
                {data
                  ? data.room_types
                    ? data.room_types.map((type: any) => {
                        if (size.width > 640)
                          return (
                            <tr key={unique()}>
                              <td>{type.name}</td>
                              <td>{type.num_rooms}</td>
                              {currentCalendar.calendar
                                ? currentCalendar.calendar.map((day: any) => {
                                    let t = getDay(day.date);
                                    return renderDay(day, type);
                                  })
                                : null}
                            </tr>
                          );
                        else
                          return (
                            <>
                              <tr key={unique()} className={"type-row"}>
                                <td colSpan={4}>{type.name}</td>
                                <td
                                  colSpan={3}
                                >{`部屋数：${type.num_rooms}部屋`}</td>
                              </tr>
                              <tr key={unique()} className={"opening-number"}>
                                {currentCalendar.calendar
                                  ? currentCalendar.calendar.map((day: any) => {
                                      let t = getDay(day.date);
                                      return renderDay(day, type);
                                    })
                                  : null}
                              </tr>
                            </>
                          );
                      })
                    : null
                  : null}
              </tbody>
            </Table>
            <div className="flexbox switch-week">
              <Button
                className="previous-btn"
                onClick={() => calenderOperation("pre-week")}
                disabled={data.calendar.indexOf(firstCalendarItem) === 0}
              >
                前の週へ
              </Button>
              <Button
                className="next-btn"
                onClick={() => calenderOperation("next-week")}
                disabled={
                  data.calendar.indexOf(lastCalendarItem) ===
                  data.calendar.length - 1
                }
              >
                次の週へ
              </Button>
            </div>
          </div>
          <p className="calendar-submit submit">
            <button
              onClick={() => {
                openModal();
              }}
              disabled={!daySelected}
              type="button"
              className="btn btn-primary submit"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              {}予約へ進む
            </button>
          </p>
          <AcceptanceModal ref={modalRef} />
        </div>
      ) : null}
    </>
  );
};

export default Calendar;
