import {Table, Button, Modal} from "react-bootstrap"
import styles from  "../styles/Detail.module.css";
import {useState} from 'react';
const Detail = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
    return (    
    <section className={styles.detail}>
      <div className="inner">
        <h2>予約詳細</h2>
        <div className="section-box">
          <h3>基本情報</h3>
          <Table className="detail-table">
            <tbody>
              <tr>
                <th>施設</th>
                <td>D保養所</td>
                <th>予約番号</th>
                <td>1002080002</td>
              </tr>
              <tr>
                <th>利用日</th>
                <td>2010年02月21日 日曜日</td>
              </tr>
              <tr>
                <th>ゴース</th>
                <td>来館見学 : 10:30</td>
                <th>人数</th>
                <td>3</td>
              </tr>
            </tbody>
          </Table>
          <h3>申込者</h3>
          <Table className="details-table">
            <tbody>
              <tr>
                <th>氏名</th>
                <td>山田 大郎</td>
                <th>氏名フリガナ</th>
                <td>ヤマダ タロウ</td>
              </tr>
              <tr>
                <th>メールアドレス</th>
                <td>jun@dynax.co.jp</td>
                <th>電話番号</th>
                <td>090-11-11</td>
              </tr>
            </tbody>
          </Table>
          <div className="actions flexbox">
            <Button onClick={handleShow}>予約キャンセル</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>予約キャンセル</Modal.Title>
        </Modal.Header>
        <Modal.Body>この予約をキャンセルしますが、よろしいですか？</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
          いいえ
          </Button>
          <Button variant="primary" onClick={handleClose}>
          はい
          </Button>
        </Modal.Footer>
      </Modal>
            <Button>予約変更</Button>
            <Button onClick={() => window.print()}>画面印刷</Button>
          </div>
        </div>
      </div>
    </section>
     );
}
 
export default Detail;