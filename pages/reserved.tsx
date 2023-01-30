import { Button } from "react-bootstrap";
import styles from "../styles/Reserved.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getDay } from "../utilis/helper";
import { withRouter } from "next/router";
import AxiosApi from "./api/axios-api";
import { propTypes } from "react-bootstrap/esm/Image";

const Reserved = (props: any) => {
  let data = props.router ? (props.router ? props.router.query : {}) : {};
  let facilityData = props ? props.facilityData : {};
  const close = () => {
    window.close();
  };
  const [info, setInfo] = useState({
    reservation: {
      facility: { name: "", change_days: 0 },
      code: "",
      date: "",
      roomType: "",
      numRooms: "",
      updateDisabled: false,
      lottery: "",
    },
    user: {
      name: "",
      kana: "",
      mail: "",
      tel: "",
    },
  });
  const getReservation = async () => {
    if (localStorage.getItem("token")) {
      let reservationInformation = await AxiosApi.call(
        {},
        "reservation",
        "get",
        ""
      );
      if (reservationInformation.data) {
        let rsvdates = reservationInformation.data.reservation.rsvdates;
        const usedDate = getDay(rsvdates[0].date);
        const date = `${usedDate.year}年${usedDate.month + 1}月${
          usedDate.dayNumber
        }日 ${usedDate.dayNameFull}`;
        const roomType = rsvdates[0].rsvroomtype.room_type.name;
        const numRooms = rsvdates[0].rsvroomtype.rsv_num_rooms;
        const datesDiffer =
          new Date(rsvdates[0].date).getTime() - new Date().getTime();
        const dayDiffer = datesDiffer / (1000 * 60 * 60 * 24);
        const updateDisabled =
          reservationInformation.data.reservation.facility.change_days >
          dayDiffer;

        setInfo({
          reservation: {
            ...reservationInformation.data.reservation,
            date: date,
            roomType: roomType,
            numRooms: numRooms,
            updateDisabled: updateDisabled,
          },
          user: reservationInformation.data.user,
        });
      }
    } else {
      data;
    }
    {
      if (data.type === "cancel") {
        setInfo({
          reservation: {
            ...info.reservation,
            code: data.code,
            lottery: data.lottery,
          },
          user: { ...info.user, name: data.name },
        });
      }
    }
  };
  useEffect(() => {
    getReservation();
    // return () => localStorage.clear()
  }, []);

  return (
    <section className={styles.reserved}>
      <div className="inner">
        <h2>{data ? data.title : "予約完了"}</h2>
        <div className="section-box">
          <p className="title-text">
            {data ? data.name : ""}
            <br />
            {data ? data.lottery : ""}
          </p>
          <div className="message-box">
            <p className="message-text">
              ご予約番号は <span>{data ? data.code : ""}</span> です。
            </p>
          </div>
          <p className="title-text">
            ご登録時に入力していただいたメールアドレスへ確認メールを自動送信しております。
            <br />
            ご確認下さいますようあわせてお願い致します。
          </p>
          <dl>
            <dt>
              <span>ご注意事項</span>
            </dt>
            <dd>
              <p className="note-text">
                {/* 予約番号は申し込み内容の変更やキャンセルする際に必要となりますので、控える様お願い致します。
                <br />
                尚、確認メールが何らかの問題で届かない場合がございます。2日以上たってメールが届かない場合、申込みが成立していないことがありますので雪見荘までご連絡ください。 */}
                {facilityData ? facilityData.notes : ""}
              </p>
              <p className="detail">
                <span className="detail-text">
                  {facilityData ? facilityData.abbreviation : ""}
                </span>
                <br className="sp" />
                {` E-MAIL : `}
                <a href={`mailto:${facilityData ? facilityData.mail : ""}`}>
                  {facilityData ? facilityData.mail : ""}
                </a>
                　
                <br className="sp" />
                TEL：
                <a href="tel:03-5488-7030">
                  {facilityData ? facilityData.tel : ""}
                </a>
              </p>
            </dd>
          </dl>
          <ul className="links flexbox">
            <li>
              <a
                href="https://bonzuttner.co.jp/"
                target="_blank"
                className="link-item"
              >
                <img src={`${process.env.IMAGE_URL}/images/arrow8.svg`} alt="" />
                保養所案内はこちら
              </a>
            </li>
            {info.reservation.code && data.type !== "cancel" ? (
              <li>
                <a href="/detail" className="link-item">
                  <img src={`${process.env.IMAGE_URL}/images/arrow8.svg`} alt="" />
                  ご予約の内容の変更はこちら
                </a>
              </li>
            ) : null}
          </ul>
          <ul className="buttons-section flexbox">
            <li>
              {info.reservation.code && data.type !== "cancel" ? (
                <Link href="/detail">予約内容の確認・印刷</Link>
              ) : null}
            </li>

            <li>
              <Button variant="secondary" onClick={() => close()}>
                閉じる
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default withRouter(Reserved);
