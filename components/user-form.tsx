import { Form, ListGroup, Row, Col, Button } from "react-bootstrap";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import AxiosApi from "../pages/api/axios-api";
import { Methods } from "../pages/api/axios-api";
import axios from "axios";
import * as https from "https";
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const UserForm = (props: any) => {
  let info = props.info;
  let reservation = props.reservation;
  let type = props.type;
  let daySelected = props.daySelected;
  const names = props ? props.names : {};
  let rememberToken = props.rememberToken ? props.rememberToken : "";
  const router = useRouter();

  let isUpdate = localStorage.getItem("token") && info.status === 7;
  const [validated, setValidated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userForm, setUserForm] = useState({
    number_of_rooms: info ? info.number_of_rooms : 1,
    first_name: info ? info.first_name : "",
    last_name: info ? info.last_name : "",
    first_name_kana: info ? info.first_name_kana : "",
    last_name_kana: info ? info.last_name_kana : "",
    phone_number: info ? info.phone_number : "",
    password: "",
    repeat_password: "",
    new_rsv_frame_ids: [0],
  });
  const handleChange = (event: any, field: string) => {
    let value: string = event.target.value;
    if (field === "repeat_password") {
      setErrorMsg("");
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
    if (form.checkValidity() === false || showError) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      if (showError) {
        setErrorMsg(
          "Error:新しいパスワード、またはパスワード確認の入力が不正です。"
        );
      }
    } else {
      event.preventDefault();
      setLoading(true);
      let url = "confirm-reservation";
      let method: Methods = "post";
      let tokenValue: string = router.query.token
        ? router.query.token.toString()
        : "";
      if (isUpdate) {
        url = "update-reservation";
        method = "put";
        tokenValue = localStorage.getItem("token")
          ? localStorage.getItem("token")
          : tokenValue;
        userForm.new_rsv_frame_ids = daySelected ? [daySelected] : [info.rsvId];
      }
      let response = await AxiosApi.call(userForm, url, method, tokenValue);
      setLoading(false);
      if (response.data) {
        let data = response.data;
        localStorage.setItem("token", tokenValue);
        if (data.reservation.code) {
          router.push(
            {
              pathname: "/reserved",
              query: {
                code: data.reservation.code,
                name: `${data.user.name}様`,
                lottery: !isUpdate
                  ? data.reservation.lottery_status === 0
                    ? "先着予約を受け付けました。"
                    : "抽選申込を受け付けました。"
                  : data.reservation.lottery_status === 0
                  ? "先着予約の変更を受け付けました。"
                  : "抽選申込の変更を受け付けました。",
                notes: data.facility.notes,
                abbreviation: data.facility.abbreviation,
                mail: data.facility.mail,
                tel: data.facility.tel,
                title: info
                  ? info.status === 0
                    ? names.section12_new
                    : info.status === 7
                    ? names.section12_change
                    : "予約完了"
                  : "予約完了",
              },
            },
            "/reserved"
          );
        }
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
      for (let i = 0; i < info.totalRoomsNum; i++) {
        openingsNumber.push(
          <option value={i + 1} selected={i + 1 === userForm.number_of_rooms}>
            {i + 1}
          </option>
        );
      }
      return openingsNumber;
    }
  };

  const handleKana = async (field: string, value: string) => {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "User-Agent":
        "Yahoo AppID: dj00aiZpPUtWaEp6OFRNdzhkUiZzPWNvbnN1bWVyc2VjcmV0Jng9YTk-",
    };
    type response = {
      id: "";
      jsonrpc: "";
      result: {
        word: [
          {
            furigana: "";
            roman: "";
            surface: "";
          }
        ];
      };
    };
    let furiganaResponse: any;
    try {
      furiganaResponse = await axios.post(
        `https://jlp.yahooapis.jp/FuriganaService/V2/furigana`,
        {
          id: "1234-1",
          jsonrpc: "2.0",
          method: "jlp.furiganaservice.furigana",
          params: {
            q: value,
            grade: 1,
          },
        },
        {
          headers: headers,
          httpsAgent,
        }
      );
    } catch (e) {}
    if (furiganaResponse) {
      const furiganaText = furiganaResponse.result
        ? furiganaResponse.result.word[0]
          ? furiganaResponse.result.word[0].furigana
            ? furiganaResponse.result.word[0].furigana
            : ""
          : ""
        : "";

      if (furiganaText) {
        setUserForm({ ...userForm, [field]: furiganaText });
      }
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
          <Form.Label className="key">
            {names ? names.facility : "施設"}
          </Form.Label>
          <Form.Control
            plaintext
            readOnly
            defaultValue={info ? info.facilityName : ""}
            className="value"
          />
        </Form.Group>
        <Form.Group as={Col} className="pl-3" controlId="formPlaintextEmail">
          <Form.Label className="key">
            {names ? names.date : "宿泊日"}
          </Form.Label>

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
          <Form.Label className="key">
            {names ? names.roomtype : "コース"}
          </Form.Label>
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
          <Form.Label className="key">
            {names ? names.num_rooms : "人数"}
          </Form.Label>
          <Form.Select
            className="number-room-select"
            aria-label="Default select example"
            required
            value={userForm ? userForm.number_of_rooms : 1}
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
          <Form.Label className="key">
            {names ? names.user + "氏名" : "申込者氏名"}
          </Form.Label>
          <Form.Control
            required
            placeholder="姓"
            value={userForm ? userForm.last_name : ""}
            onChange={(event) => handleChange(event, "last_name")}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              handleKana("last_name_kana", e.target.value);
            }}
          />
          <Form.Control
            required
            placeholder="名"
            value={userForm ? userForm.first_name : ""}
            onChange={(event) => handleChange(event, "first_name")}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              handleKana("first_name_kana", e.target.value);
            }}
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
            value={userForm ? userForm.last_name_kana : ""}
            onChange={(event) => handleChange(event, "last_name_kana")}
          />
          <Form.Control
            required
            placeholder="メイ"
            value={userForm ? userForm.first_name_kana : ""}
            onChange={(event) => handleChange(event, "first_name_kana")}
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
            value={userForm ? userForm.phone_number : ""}
            onChange={(event) => handleChange(event, "phone_number")}
          />
        </Form.Group>
      </Row>
      {info ? (
        info.status === 7 ? null : (
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
        )
      ) : null}

      <Row className="border-0">
        <Button type="submit">
          {isLoading ? "Processing" : type === "update" ? "Update" : "予約申込"}
        </Button>
      </Row>
      {errorMsg ? (
        <div className="error-section">
          <img src={`${process.env.IMAGE_URL}/images/warning.png`} />
          <h3>{`Error: ${errorMsg}`}</h3>
        </div>
      ) : null}
    </Form>
  );
};

export default UserForm;
