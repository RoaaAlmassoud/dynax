import { Form } from "react-bootstrap";
import React from "react";
import { years, months } from "./data/data";

const DateForm = (props: any) => {
  let date = props.date;
  let days: { id: number; name: string; value: number }[] = [];
  let monthDays = new Date(date.year, date.month, 0).getDate();
  for (let i = 1; i <= monthDays; i++) {
    days.push({
      id: i,
      name: `${i}日`,
      value: i,
    });
  }
  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    let value: string = event.target.value;
    date = { ...date, [field]: parseInt(value) };
    props.updateDate(field, value);
  };

  return (
    <Form>
      <Form.Group className="d-flex align-items-baseline">
        <Form.Label>利用日</Form.Label>
        <Form.Select
          className="mr-2 year form-select"
          aria-label="Default select example"
          name="year"
          onChange={(event) => handleChange(event, "year")}
        >
          {years.map((year, index) => {
            return <option value={year.value}>{year.name}</option>;
          })}
        </Form.Select>

        <Form.Select
          name="month"
          className="month form-select"
          onChange={(event) => handleChange(event, "month")}
        >
          {months.map((month, index) => {
            return (
              <option value={month.value} selected={date.month === month.value}>
                {month.name}
              </option>
            );
          })}
        </Form.Select>

        <Form.Select
          name="day"
          className="day form-select"
          onChange={(event) => handleChange(event, "day")}
        >
          {days.map((day, index) => {
            return (
              <option value={day.value} selected={date.day === day.value}>
                {day.name}
              </option>
            );
          })}
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
  );
};

export default DateForm;
