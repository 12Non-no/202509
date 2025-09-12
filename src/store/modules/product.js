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
        Session_id:''
    },
    messages:[],
    Azure_thread_id:null,
    Assistant_id:null
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
    addMessage(state, value){
      state.messages.push(value);
    },
    setAzure_thread_id(state, value){
      state.Azure_thread_id = value;
    },
    setAssistant_id(state, value){
      state.Assistant_id = value;
    }
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
        if (response.data.session_id) {
          commit('setSessionId',  response.data.session_id);
          console.log("セッション保存完了:", response.data.session_id);
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
    },
    async createThreadId({ commit }, {user, Azure_thread_id}){ //スレッドIDが存在するか確認&ない場合は作成処理
      console.log('スレッドIDが存在するかの確認を開始')
      if(Azure_thread_id == null){
              try{
                const url ='https://m3h-suzuki-task09.azurewebsites.net/api/Create_thread?';
                const response = await axios.post(url + 'User_id=' + user.User_id);
                
                if (response.data.Result === "Succeeded") {
                  // スレッドIDを保存
                  commit('setAzure_thread_id', response.data.Azure_thread_id);
        
                  return { success: true }
                 } else {
                  // スレッド作成失敗
                  return { success: false, message: response.data.Message};
              }
              }catch (error) {
                console.error("スレッド作成エラー:", error);
                return { success: false, message: error.response?.data };
            }
          }
          return { success: true };
    },
    async Create_assistant({ commit }, {user, Assistant_id}){ //アシスタントが存在するか確認&ない場合は作成
      console.log('アシスタント作成開始');
      if(Assistant_id == null){
      try{
        const url = 'https://m3h-suzuki-task09.azurewebsites.net/api/Create_assistant?';
        const response = await axios.post(url + 'User_id=' + user.User_id);

        if(response.data.Result === "Succeeded") {
          // アシスタントIDを保存
          commit('setAssistant_id', response.data.Assistant_id);

          return {success: true};
        }else{
          // アシスタントID作成失敗
          return { success: false, message: response.data.Message};
        }
      } catch (error) {
          console.error("アシスタント作成エラー:", error);
          return { success: false, message: error.response?.data };
      }
    }
    return { success: true };
  },
  async Send_message({ commit }, {user, Azure_thread_id, message}){ //メッセージ送受信
    console.log('アシスタントへのメッセージ送信処理開始');
    try{
      const url = 'https://m3h-suzuki-task09.azurewebsites.net/api/Send_message?';
      const response = await axios.post(url + 'User_id=' + user.User_id + '&Azure_thread_id=' + Azure_thread_id + '&message_text=' + message);

      if(response.data.Result === "Succeeded") {
          // AIの返信を保存
          commit('setMessage', response.data.message_text);

          return {success: true, aiResponse: response.data.message_text };
        }else{
          // メッセージ送受信失敗
          return { success: false, message: response.data.Message};
        }
    }catch (error) {
          console.error("メッセージ送信エラー:", error);
          return { success: false, message: error.response?.data };
      }
  }
}
}