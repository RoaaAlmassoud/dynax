import { Button } from "react-bootstrap";
import styles from "../styles/Reserved.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";

const Reserved = () => {
  const close = () => {
    console.log("window: ", window);
    window.close();
  };

  return (
    <section className={styles.reserved}>
      <div className="inner">
        <h2>予約完了</h2>
        <div className="section-box">
          <p className="title-text">
            手巣戸花子様
            <br />
            先着申し込みを受け付けました。
          </p>
          <div className="message-box">
            <p className="message-text">
              ご予約番号は <span>2201080001</span> です。
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
                予約番号は申し込み内容の変更やキャンセルする際に必要となりますので、控える様お願い致します。
                <br />
                尚、確認メールが何らかの問題で届かない場合がございます。2日以上たってメールが届かない場合、申込みが成立していないことがありますので雪見荘までご連絡ください。
              </p>
              <p className="detail">
                <span className="detail-text">雪見荘</span>
                <br className="sp" />
                {` E-MAIL : `}
                <a href="mailto:info@sumple.co.jp">info@sumple.co.jp</a>　
                <br className="sp" />
                TEL：<a href="tel:03-5488-7030">03-5488-7030</a>
              </p>
            </dd>
          </dl>
          <ul className="links flexbox">
            <li>
              <a href="#" className="link-item">
                <img src="images/arrow8.svg" alt="" />
                保養所案内はこちら
              </a>
            </li>
            <li>
              <a href="#" className="link-item">
                <img src="images/arrow8.svg" alt="" />
                ご予約の内容の変更はこちら
              </a>
            </li>
          </ul>
          <ul className="buttons-section flexbox">
            <li>
              <Link href="/detail">予約内容の確認・印刷</Link>
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

export default Reserved;
