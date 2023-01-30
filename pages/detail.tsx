import { Table, Button, Modal } from "react-bootstrap";
import styles from "../styles/Detail.module.css";
import { useEffect, useState } from "react";
import AxiosApi from "./api/axios-api";
import { getDay } from "../utilis/helper";
import { useRouter } from "next/router";
import { SlowBuffer } from "buffer";
const Detail = ({ names, facilityData }: any) => {
  const [show, setShow] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const [info, setInfo] = useState({
    reservation: {
      facility: {
        name: "",
        change_days: facilityData ? facilityData.change_days : 0,
        cancel_days: facilityData ? facilityData.cancel_days : 0,
      },
      code: "",
      date: "",
      roomType: "",
      numRooms: "",
      updateDisabled: false,
      cancelDisabled: false,
      lottery_status: 0,
    },
    user: {
      name: "",
      kana: "",
      mail: "",
      tel: "",
    },
  });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getReservation = async () => {
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

      const updateDisabled = info.reservation.facility.change_days > dayDiffer;
      const cancelDisabled = info.reservation.facility.cancel_days > dayDiffer;
     
      setInfo({
        reservation: {
          ...reservationInformation.data.reservation,
          date: date,
          roomType: roomType,
          numRooms: numRooms,
          updateDisabled: updateDisabled,
          cancelDisabled: cancelDisabled,
        },
        user: reservationInformation.data.user,
      });
    }
  };

  useEffect(() => {
    getReservation();
    // return () => localStorage.clear()
  }, []);

  const cancelReservation = async () => {
    setLoading(true);
    const response = await AxiosApi.call({}, "cancel-reservation", "put", "");
    if (response.data) {
      localStorage.clear();
      router.push(
        {
          pathname: "/reserved",
          query: {
            code: info.reservation.code,
            name: `${info.user.name}様`,
            lottery:
              info.reservation.lottery_status === 0
                ? "先着予約のキャンセルを受け付けました"
                : "抽選予約のキャンセルを受け付けました",
            title: names ? names.section12_cancel : "予約完了",
            type: "cancel",
          },
        },
        "/reserved"
      );
    } else {
    }
  };

  const update = () => {
    router.push(
      {
        pathname: `/${localStorage.getItem("token")}`,
        query: {
          type: "update",
        },
      },
      `/${localStorage.getItem("token")}`
    );
  };

  return (
    <section className={styles.detail}>
      <div className="inner">
        <h2>予約詳細</h2>
        <div className="section-box">
          <h3>基本情報</h3>
          <Table className="detail-table">
            <tbody>
              <tr>
                <th>{names ? names.facility : "施設"}</th>
                <td>
                  {info
                    ? info.reservation
                      ? info.reservation.facility.name
                      : ""
                    : ""}
                </td>
                <th>予約番号</th>
                <td>
                  {info ? (info.reservation ? info.reservation.code : "") : ""}
                </td>
              </tr>
              <tr>
                <th>{names ? names.date : "利用日"}</th>
                <td>{info ? info.reservation.date : ""}</td>
              </tr>
              <tr>
                <th>{names ? names.roomtype : "ゴース"}</th>
                <td>{info ? info.reservation.roomType : ""}</td>
                <th>{names ? names.num_rooms : "人数"}</th>
                <td>{info ? info.reservation.numRooms : ""}</td>
              </tr>
            </tbody>
          </Table>
          <h3>申込者</h3>
          <Table className="details-table">
            <tbody>
              <tr>
                <th>氏名</th>
                <td>{info ? info.user.name : ""}</td>
                <th>氏名フリガナ</th>
                <td>{info ? info.user.kana : ""}</td>
              </tr>
              <tr>
                <th>メールアドレス</th>
                <td>{info ? info.user.mail : ""}</td>
                <th>電話番号</th>
                <td>{info ? info.user.tel : ""}</td>
              </tr>
            </tbody>
          </Table>
          <div className="actions flexbox">
            {info.reservation.cancelDisabled ? null : (
              <div>
                <Button className="cancel-btn" onClick={handleShow}>
                  予約キャンセル
                </Button>
              </div>
            )}
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>予約キャンセル</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                この予約をキャンセルしますが、よろしいですか？
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  いいえ
                </Button>
                <Button variant="primary" onClick={() => cancelReservation()}>
                  {isLoading ? "Processing" : "はい"}
                </Button>
              </Modal.Footer>
            </Modal>
            {info.reservation.updateDisabled ? null : (
              <div className="text-center">
                <Button className="update-btn" onClick={() => update()}>
                  予約変更
                </Button>
              </div>
            )}
            <div className="text-end">
              <Button className="print-btn" onClick={() => window.print()}>
                画面印刷
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detail;
