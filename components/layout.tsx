import styles from "../styles/Home.module.css";
import Head from "next/head";
import { useRouter } from "next/router";
export default function Layout({
  children,
  displayName,
  displayHeader,
  customer,
}: any) {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans+JP:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="header">
        <div className="inner flexbox">
          <h1 onClick={() => router.push("/")}>
            <img src={`${process.env.IMAGE_URL}/images/logo.svg`} alt="Dynax" />
            {`${displayName ? displayName : ""}
             
             `}
             <span>{displayHeader ? displayHeader : ""}</span>
            {/* 保養所予約システム */}
          </h1>
          {/* <div className="header-user dropdown">
            <button
              className="btn dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              山田 太郎 様
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <a className="dropdown-item" href="#">
                  マイページ
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  ログアウト
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
      <>{children}</>
      <footer>
        <p className="copy">Copyright &copy;2022 保養所予約システム</p>
        <p className="totop">
          <a href="#">
            <img src={`${process.env.IMAGE_URL}/images/totop.svg`} alt="TOP" />
          </a>
        </p>
      </footer>
    </div>
  );
}
