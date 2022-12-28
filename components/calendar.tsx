import { useEffect, useRef, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { propTypes } from "react-bootstrap/esm/Image";
import AcceptanceModal from "../components/acceptance";
import { getDay, previousDate, nextDate, unique } from "../utilis/helper";
const Calendar = ({
  date,
  data,
  current,
  calendarOperation,
  calendarDate,
  firstCalendarItem,
  lastCalendarItem,
  showSecondSummary,
}: any) => {
  let currentCalendar = current ? current : data ? data : null;
  let previousFormate = previousDate(firstCalendarItem.date);
  let nextFormate = nextDate(lastCalendarItem.date);
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

  let monthText =
    getDay(firstCalendarItem.date).month === getDay(lastCalendarItem.date).month
      ? nextFormate.nextMonth + 1
      : nextFormate.nextMonth;
  let nextMonthText = nextFormate
    ? `${nextFormate.nextYear}年 ${monthText}月`
    : "";

  let modalRef = useRef<any>(null);
  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.handleShow();
    }
    showSecondSummary();
  };
  const renderDay = (day: any, type: any) => {
    switch (day.status_type) {
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
      default:
        const availableNumber = day.rsv_frames.find(
          (a: any) => a.roomtype_id === type.id
        );
        return (
          <td key={unique()} className="blue">
            {availableNumber.applied_number / availableNumber.num_frames}
          </td>
        );
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
            : ""
        } ${dayBeforeText}`}
      >
        {dayBeforeText ? (
          <div className="header-text">{`${dayData.year}年${
            dayData.month + 1
          }月`}</div>
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
        <li>
          <span className="status-color color4"></span>抽選：狙い目
        </li>
        <li>
          <span className="status-color color5"></span>抽選：人気
        </li>
        <li>
          <span className="status-color color6"></span>抽選：混雑
        </li>
      </ul>
      <div className="flexbox switch-month">
        <Button
          className="previous-btn"
          onClick={() => calenderOperation("pre-month")}
          disabled={
            minDate
              ? previousFormate.previousYear === minDate.year &&
                previousFormate.previousMonth < minDate.month
              : false
          }
        >
          {previousMonthText}
        </Button>
        <p>日程は複数選択が可能です</p>
        <Button
          className="next-btn"
          onClick={() => calenderOperation("next-month")}
          disabled={
            maxDate
              ? nextFormate.nextYear === maxDate.year &&
                monthText > maxDate.month
              : false
          }
        >
          {nextMonthText}
        </Button>
      </div>
      <div className="calendar-section">
        <h3>軽井沢</h3>
        <Table className="calendar-table">
          <thead>
            <tr>
              <th className="room-type">部屋タイプ</th>
              <th className="room-number">部屋数</th>
              {data
                ? data.calendar
                  ? currentCalendar.calendar.map((day: any, index: number) => {
                      return renderTableHeader(day, index);
                    })
                  : null
                : null}
            </tr>
          </thead>
          <tbody className="calendar-body">
            {data
              ? data.room_types
                ? data.room_types.map((type: any) => {
                    return (
                      <tr>
                        <td>{type.name}</td>
                        <td>{type.num_rooms}</td>
                        {currentCalendar.calendar.map((day: any) => {
                          return renderDay(day, type);
                        })}
                      </tr>
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
          type="button"
          className="btn btn-primary submit"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          予約へ進む
        </button>
      </p>
      <AcceptanceModal ref={modalRef} />
    </>
  );
};

export default Calendar;
