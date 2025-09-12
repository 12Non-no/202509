import axios from 'axios';
export default {
  namespaced: true, // モジュール名でアクセスするための設定
  state: { // 初期値を設定
    user: {
        User_id:'',
        User_name:'',
        Password:'',
        Session_id: '',
    },
    session: {
        Session_id:'',
        IP_address:'',
        Created_at:'',
        Updated_at:'',
        Expires_at:'',
    }
  },
  getters: {
    
  },
  mutations: {
    setUserId(state, value){
      state.user.User_id = value;
    },
    setUserName(state, value){
        state.user.User_name = value;
    },
    setUserPassword(state, value){
        state.user.Password = value;
    },
    setSessionId(state, value) {
        state.session.Session_id = value;
    },
    // setIPaddress(state, value){
    //     state.session.IP_address = value;
    // },
    // setCreatedAt(state, value){
    //     state.session.Created_at = value;
    // },
    // setUpdatedAt(state, value){
    //     state.session.Updated_at = value;
    // },
    // setExpiresAt(state, value){
    //     state.session.Expires_at = value;
    // }

    },
    
  actions: {
    async login ({ commit }, userData) { // ログイン処理
        try{
            console.log('ログインを開始');
            const url = 'https://m3h-suzuki-task09.azurewebsites.net/api/Login?';
            const response = await axios.post(url + 'User_id=' + userData.User_id + '&Password=' + userData.Password, null,  { withCredentials: true } 
            );

            console.log("ログインレスポンス:", response.data);

            // ログイン成功の場合
      if (response.data.result === "Succeeded") {
        
        // ユーザー名を保存
        commit('setUserName', response.data.User_name);
        
        // セッションIDがある場合はクッキーに保存
        if (response.data.sessionId) {
          commit('setSessionId',  response.data.Session_id);
          console.log("セッション保存完了:", response.data.Session_id);
        }
        
        return { success: true }
        
      } else {
        // ログイン失敗
        return { success: false, message: response.data.Message};
      }
      
    } catch (error) {
// エラーが発生した場合
      console.log("エラー:", error);
      return { success: false, message: error.response?.data};
    }
  },
    async signup ({ commit }, userData) { // 会員登録処理
        console.log('新規会員登録を開始');
            const url = 'https://m3h-suzuki-task09.azurewebsites.net/api/Insert_user?';
            const response = await axios.post(url + 'User_id=' + userData.User_id + '&User_name=' + encodeURIComponent(userData.User_name) + '&PasswordHash=' + userData.Password);

            commit;
            return response.data;
    },
    async sessionCheck ({ commit }, session) { // セッション確認&延長処理
        console.log('セッション確認を開始');
        try{
            const url = 'https://m3h-suzuki-task09.azurewebsites.net/api/CheckSession?';
            const response = await axios.post(url + 'Session_id=' + session.Session_id, null,  { withCredentials: true });

            
            console.log("セッションチェックレスポンス:", response.data);
            commit;
            if(response.data.status === "Success"){
                console.log("セッションチェック成功:", response.data);

                return { success: true }
        } else {
          // セッションが無効な場合
            console.log("セッションチェック失敗:", response.data);
            return { success: false, message: response.data.message};
        }
            }catch (error) {
                console.error("セッションチェックエラー:", error);
                return { success: false, message: "セッションの確認に失敗しました。" };
            }
    }
  }
}