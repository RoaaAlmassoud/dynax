import styles from "../styles/Home.module.css";
export default function Layout({ children }: any) {
  return (
    <div className={styles.container}>
      <div className="header">
        <div className="inner flexbox">
          <h1>
            <img src="/images/logo.svg" alt="Dynax" />
            保養所予約システム
          </h1>
          <div className="header-user dropdown">
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
          </div>
        </div>
      </div>
      <>{children}</>
      <footer>
        <p className="copy">Copyright &copy;2022 保養所予約システム</p>
        <p className="totop">
          <a href="#">
            <img src="/images/totop.svg" alt="TOP" />
          </a>
        </p>
      </footer>
    </div>
  );
}
