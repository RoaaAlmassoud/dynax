import { Form, ListGroup, Row, Col, Button } from "react-bootstrap";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import AxiosApi from "../pages/api/axios-api";

const UserForm = (props: any) => {
  let info = props.info;
  let rememberToken = props.rememberToken ? props.rememberToken : "";
  const router = useRouter();
  const [validated, setValidated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [userForm, setUserForm] = useState({
    number_of_rooms: 1,
    first_name: "",
    last_name: "",
    first_name_kana: "",
    last_name_kana: "",
    phone_number: "",
    password: "",
    repeat_password: "",
  });
  const handleChange = (event: any, field: string) => {
    let value: string = event.target.value;
    if (field === "repeat_password") {
      if (value !== userForm.password) {
        setShowError(true);
      } else {
        setShowError(false);
      }
    }
    setUserForm({ ...userForm, [field]: value });
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
      let response = await AxiosApi.call(
        userForm,
        `confirm-reservation`,
        "post",
        rememberToken ? rememberToken : ""
      );
      if (response.data) {
        let data = response.data;
        localStorage.setItem("token", rememberToken ? rememberToken : "");
        if (data.reservation.code) {
          router.push(
            {
              pathname: "/reserved",
              query: {
                code: data.reservation.code,
                name: `${data.user.name}様`,
                lottery:
                  data.reservation.lottery_status === 0
                    ? "先着予約を受け付けました。"
                    : "抽選申込を受け付けました。",
                notes: data.facility.notes,
                abbreviation: data.facility.abbreviation,
                mail: data.facility.mail,
                tel: data.facility.tel,
              },
            },
            "/reserved"
          );
        }
        setLoading(false);
      } else {
        if (response.message) {
          setErrorMsg(response.message);
        }
      }
    }
  };

  const renderOpeningNumbers = () => {
    if (info) {
      let openingsNumber = [];
      for (let i = 0; i < info.openings; i++) {
        openingsNumber.push(
          <option value={i + 1} selected={i + 1 === userForm.number_of_rooms}>
            {i + 1}
          </option>
        );
      }
      return openingsNumber;
    }
  };

  return (
    <Form
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
      className="basic-info-form"
    >
      <Row>
        <Form.Group as={Col} className="pr-3" controlId="formPlaintextEmail">
          <Form.Label className="key">施設</Form.Label>
          <Form.Control
            plaintext
            readOnly
            defaultValue={info ? info.facilityName : ""}
            className="value"
          />
        </Form.Group>
        <Form.Group as={Col} className="pl-3" controlId="formPlaintextEmail">
          <Form.Label className="key">宿泊日</Form.Label>

          <Form.Control
            plaintext
            readOnly
            defaultValue={info ? info.fullUsedDate : ""}
            className="value"
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} controlId="formPlaintextEmail" className="m-0">
          <Form.Label className="key">コース</Form.Label>
          <Form.Control
            plaintext
            readOnly
            defaultValue={info ? info.roomType : ""}
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
        <Form.Group as={Col} className="m-0" controlId="formPlaintextEmail">
          <Form.Label className="key">人数</Form.Label>
          <Form.Select
            className="number-room-select"
            aria-label="Default select example"
            required
            onChange={(event) => handleChange(event, "number_of_rooms")}
          >
            {info ? renderOpeningNumbers() : null}
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
          <Form.Control
            required
            placeholder="姓"
            value={userForm.first_name}
            onChange={(event) => handleChange(event, "first_name")}
          />
          <Form.Control
            required
            placeholder="名"
            value={userForm.last_name}
            onChange={(event) => handleChange(event, "last_name")}
          />
        </Form.Group>
        <Form.Group
          as={Col}
          className="name-group"
          controlId="formPlaintextEmail"
        >
          <Form.Label className="key">氏名フリガナ</Form.Label>
          <Form.Control
            required
            placeholder="セイ"
            value={userForm.first_name_kana}
            onChange={(event) => handleChange(event, "first_name_kana")}
          />
          <Form.Control
            required
            placeholder="メイ"
            value={userForm.last_name_kana}
            onChange={(event) => handleChange(event, "last_name_kana")}
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group
          as={Col}
          className="one-input"
          controlId="formPlaintextEmail"
        >
          <Form.Label className="key">メール</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="name@example.com"
            value={info ? info.email : ""}
            readOnly
          />
        </Form.Group>
        <Form.Group
          as={Col}
          className="one-input"
          controlId="formPlaintextEmail"
        >
          <Form.Label className="key">電話番号</Form.Label>
          <Form.Control
            required
            placeholder="090-1111-1111"
            value={userForm.phone_number}
            onChange={(event) => handleChange(event, "phone_number")}
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group
          as={Col}
          className="one-input"
          controlId="formPlaintextEmail"
        >
          <Form.Label className="key">バスワード</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="6文字以上"
            value={userForm.password}
            onChange={(event) => handleChange(event, "password")}
          />
        </Form.Group>
        <Form.Group
          as={Col}
          className="one-input"
          controlId="formPlaintextEmail"
        >
          <Form.Label className="key">パスワード確認</Form.Label>
          <Form.Control
            type="password"
            required
            className={`${showError ? "red-border" : ""}`}
            placeholder="6文字以上"
            value={userForm.repeat_password}
            onChange={(event) => handleChange(event, "repeat_password")}
          />
        </Form.Group>
      </Row>
      <Row className="border-0">
        <Button type="submit">
          {isLoading ? "Processing" : "予約申込予約申込"}
        </Button>
      </Row>
      {errorMsg ? (
        <div className="error-section">
          <img src="/images/warning.png" />
          <h3>{`Error: ${errorMsg}`}</h3>
        </div>
      ) : null}
    </Form>
  );
};

export default UserForm;
