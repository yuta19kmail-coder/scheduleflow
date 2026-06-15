/* ========================================
   firebase-init.js  -  MasterHub Schedule (MHS) v0.6.0〜
   ----------------------------------------
   CarFlow と同じ Firebase プロジェクト(carflow-9d500)に「相乗り」する。
   ・認証(Google) と Firestore を共用。
   ・MHS のデータは専用コレクションに保存し、CarFlow / StockFlow 本体には触らない。
       - 社内予定 … companies/kobayashi_motors/scheduleEvents
       - 会社カレンダーマスター … companies/kobayashi_motors/settings/mhsCompanyCalendar
   ・入室判定は CoreFlow 名簿(portalMembers)を使う（CarFlow/StockFlow/CoreFlow と同じ）。
   ・authDomain はアプリと同一サブドメイン(mhs.kobayashi-motors.com)。
       理由：別サブドメイン(coreflow等)だと iOS Safari のリダイレクト戻りで
       ログイン情報を受け渡せずループする（StockFlow/CarFlow と同じ対応）。
       ※前提：Google Cloud OAuth クライアントに
         https://mhs.kobayashi-motors.com/__/auth/handler を登録必須。
   ======================================== */
(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyBmhI5SzkmPvZUiuTn_ttCZ4tUikKv_iHI",
    authDomain: "mhs.kobayashi-motors.com",
    projectId: "carflow-9d500",
    storageBucket: "carflow-9d500.firebasestorage.app",
    messagingSenderId: "235121541987",
    appId: "1:235121541987:web:8f96dfadc23fe1de7f4956"
  };

  if (typeof firebase === 'undefined') {
    console.error('[firebase-init] Firebase SDK が読み込まれていません');
    return;
  }
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  const db = firebase.firestore();

  // オフラインキャッシュ（IndexedDB永続化）は無効。
  //   複数Flowアプリ／複数タブ同時オープンでローカルキャッシュとサーバーがズレる事故を避け、
  //   常にサーバーの実データを読む（StockFlow と同じ方針）。保存成否はクライアントで確認＋警告。

  window.fb = {
    auth: auth,
    db: db,
    config: firebaseConfig,
    serverTimestamp: function () { return firebase.firestore.FieldValue.serverTimestamp(); },
    FieldValue: firebase.firestore.FieldValue,
    currentUser: null,
    currentMember: null
  };

  console.log('[firebase-init] OK', firebaseConfig.projectId);
})();
