import styles from "../../styles/Login.module.css";
export default function Completed(){

    return (
        <section className={styles.login}>
        <div className="inner under">
          <h2>パスワード変更完了</h2>
          <div className="login-container forget-completed">
            <h3>パスワードを変更しました。</h3>
          </div>
        </div>
      </section>
    )
}