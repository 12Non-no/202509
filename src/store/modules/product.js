import axios from 'axios';
export default {
  namespaced: true, // モジュール名でアクセスするための設定
  state: { // 初期値を設定
    user: {
        User_id:'',
        User_name:'',
        Password:'',
        Session_id: '',
        Chat_id: '',
        Azure_thread_id: '',
    },
    plan: {
      Start_date:'',
      End_date:'',
      Destination:'',
      Transportation:'',
      Accommodation:'',
      Budget:'',
      Members:'',
      Purpose:'',
      Tourist_spots:''
    },
    ui: {
      showAlert: false,
      alertMessage: '',
      alertType: 'info',
      showSnackbar: false,
      snackbarMessage: '',
      snackbarColor: 'success'
    },
    session: {
        Session_id:''
    },
    messages:[],
    currentMessage:'',
    Assistant_id:null,
    transportationList:[
      '新幹線',
      '飛行機',
      '自動車',
      'その他'
    ],
    hotelSearch: {
      destination: '',
      checkinDate: '',
      checkoutDate: '',
      adultNum: 1
    },
    hotelResults: [],
    rakutenAppId: '1090201424106989371'
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
    addMessage(state, messageData) {
      state.messages.push({
        id: Date.now(),
        userMessage: messageData.userMessage,
        aiResponse: messageData.aiResponse,
        timestamp: messageData.timestamp
      });
    },
    setAzure_thread_id(state, value){
      state.Azure_thread_id = value;
    },
    setAssistant_id(state, value){
      state.Assistant_id = value;
    },
    setChatData(state, data){
      state.user.Azure_thread_id = data.Azure_thread_id;
      state.user.Chat_id = data.Chat_id;
    },
    clearMessages(state) {
      state.messages = [];
    },
    setCurrentMessage(state, message) {
      state.currentMessage = message;
    },
    setPlan(state, plan){
      state.plan.Start_date = plan.Start_date;
      state.plan.End_date = plan.End_date;
      state.plan.Destination = plan.Destination;
      state.plan.Transportation = plan.Transportation;
      state.plan.Accommodation = plan.Accommodation;
      state.plan.Budget = plan.Budget;
      state.plan.Members = plan.Members;
      state.plan.Purpose = plan.Purpose;
      state.plan.Tourist_spots = plan.Tourist_spots;
    },
    setAlertShow(state, value) {
        state.ui.showAlert = value;
    },
    setAlertMessage(state, message) {
        state.ui.alertMessage = message;
    },
    setAlertType(state, type) {
        state.ui.alertType = type;
    },
    setSnackbarShow(state, value) {
        state.ui.showSnackbar = value;
    },
    setSnackbarMessage(state, message) {
        state.ui.snackbarMessage = message;
    },
    setSnackbarColor(state, color) {
        state.ui.snackbarColor = color;
    },
    clearAllMessages(state) {
        state.ui.showAlert = false;
        state.ui.alertMessage = '';
        state.ui.showSnackbar = false;
        state.ui.snackbarMessage = '';
    },
    setHotelSearch(state, data) {
      state.hotelSearch = data;
    },
    setHotelResults(state, results) {
      state.hotelResults = results;
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
        commit('setUserName', response.data.user_name);
        
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
        try{
            const url = 'https://m3h-suzuki-task09.azurewebsites.net/api/Insert_user?';
            const response = await axios.post(url + 
              'User_id=' + userData.User_id + 
              '&User_name=' + encodeURIComponent(userData.User_name) + 
              '&PasswordHash=' + userData.Password
            );

            commit;
            return response.data;
        } catch (error) {
          console.error('新規登録エラー:', error);
        
        return {
            Result: "Failed",
            Message: error.response?.data
        };
        }
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
    async createThreadId({ commit }, user){ //スレッドIDが存在するか確認&ない場合は作成処理
      console.log('スレッドIDが存在するかの確認を開始')
      if(user.Azure_thread_id == null){
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
        console.log('アシスタント作成APIを呼び出します');
      try{
        const url = 'https://m3h-suzuki-task09.azurewebsites.net/api/Create_assistant?';
      
      const response = await axios.post(url + 'User_id=' + user.User_id);

        if(response.data.result === "Succeeded") {
          // アシスタントIDを保存
          commit('setAssistant_id', response.data.assistant_id);

          return {success: true};
        }else{
          // アシスタントID作成失敗
          return { success: false, message: response.data.message};
        }
      } catch (error) {
          console.error("アシスタント作成エラー:", error);
          return { success: false, message: error.response?.data };
      }
    }
    return { success: true };
  },
  async Send_message({ commit }, {user, message}){ //メッセージ送受信
    console.log('アシスタントへのメッセージ送信処理開始');

    const Azure_thread_id = user.Azure_thread_id;

 console.log('送信するuser:', user);
  console.log('送信するmessage:', message);
  console.log('user.User_id:', user?.User_id);
  console.log('user.Azure_thread_id:', Azure_thread_id);

    try{
      const url = 'https://m3h-suzuki-task09.azurewebsites.net/api/Send_message?';
      
      const response = await axios.post(url + 'User_id=' + user.User_id + '&Azure_thread_id=' + Azure_thread_id + '&message_text=' + message);

      if(response.data.result === "Succeeded") {
        console.log('メッセージ送信成功');  
        // AIの返信を保存
          commit('addMessage', {userMessage:message, aiResponse:response.data.message_text, timestamp:new Date()});

          return {success: true, aiResponse: response.data.message_text };
        }else{
          // メッセージ送受信失敗
          return { success: false, message: response.data.Message};
        }
    }catch (error) {
          console.error("メッセージ送信エラー:", error);
          return { success: false, message: error.response?.data?.message || error.message};
      }
  },
  async getChat({commit}, user){ //チャット履歴取得orチャット作成
    console.log('チャット情報取得開始');
    try{
      const url = 'https://m3h-suzuki-task09.azurewebsites.net/api/History_chat?';
      const response = await axios.post(url + 'User_id=' + user.User_id);

      if(response.data.result === "Succeeded" ){
        commit('setChatData', {Azure_thread_id: response.data.azure_thread_id,  
        Chat_id: response.data.chat_id});
        return {success: true};
      }else{
        return { success: false, message: response.data.Message};
      }
    } catch (error) {
        console.error("アシスタント作成エラー:", error);
        return { success: false, message: error.response?.data };
    }
  },
  async insertPlan({commit}, {plan, user}){ //プラン登録
    console.log('プラン登録開始');
    try{
      const url = 'https://m3h-suzuki-task09.azurewebsites.net/api/Insert_plan?';
      const response = await axios.post(url + 
        'User_id=' + user.User_id + 
        '&Chat_id=' + user.Chat_id + 
        '&Start_date=' + plan.Start_date + 
        '&End_date=' + plan.End_date + 
        '&Destination=' + encodeURIComponent(plan.Destination) +
        '&Transportation=' + encodeURIComponent(plan.Transportation) +
        '&Accommodation=' + encodeURIComponent(plan.Accommodation) +
        '&Budget=' + plan.Budget + 
        '&Members=' + plan.Members +
        '&Purpose=' + encodeURIComponent(plan.Purpose) +
        '&Tourist_spots=' + encodeURIComponent(plan.Tourist_spots)
      );

      if(response.data.result === "Succeeded" ){
        commit('setPlan', plan);
        return {success: true};
      }else{
        return { success: false, message: response.data.Message};
      }
    } catch (error) {
        console.error("プラン登録エラー:", error);
        return { success: false, message: error.response?.data };
    }
  },
  validatePlan({ commit, state }) { // プラン登録時の未入力チェック
    const plan = state.plan;
  
    if (!plan.Start_date) {
      commit('setAlertShow', true);
      commit('setAlertMessage', '出発日は必須です');
      commit('setAlertType', 'error');
      return false;
    }
    if (!plan.End_date) {
      commit('setAlertShow', true);
      commit('setAlertMessage', '帰着日は必須です');
      commit('setAlertType', 'error');
      return false;
    }
    if (!plan.Destination) {
      commit('setAlertShow', true);
      commit('setAlertMessage', '旅行先は必須です');
      commit('setAlertType', 'error');
      return false;
    }
  
    commit('clearAllMessages');
    return true;
  },
  validateHotelSearch({ commit, state }) {
    const search = state.hotelSearch;

    if (!search.destination) {
      commit('setAlertShow', true);
      commit('setAlertMessage', '目的地は必須です');
      commit('setAlertType', 'error');
      return false;
    }
    if (!search.checkinDate) {
      commit('setAlertShow', true);
      commit('setAlertMessage', 'チェックイン日は必須です');
      commit('setAlertType', 'error');
      return false;
    }
    if (!search.checkoutDate) {
      commit('setAlertShow', true);
      commit('setAlertMessage', 'チェックアウト日は必須です');
      commit('setAlertType', 'error');
      return false;
    }

    commit('clearAllMessages');
    return true;
  },
  async searchHotels({ commit }, searchData) {
  console.log('ホテル検索開始');
  try {
    const url = 'https://m3h-suzuki-task09.azurewebsites.net/api/Hotel_search?';
    const response = await axios.get(url + 
      'destination=' + encodeURIComponent(searchData.destination) +
      '&checkinDate=' + searchData.checkinDate +
      '&checkoutDate=' + searchData.checkoutDate +
      '&adultNum=' + searchData.adultNum
    );

    console.log('ホテル検索レスポンス:', response.data);

    // デバッグ用：レスポンス構造を確認
    console.log('result:', response.data.result);
    console.log('Result:', response.data.Result);
    console.log('data:', response.data.data);
    console.log('Data:', response.data.Data);

    // 小文字のresult, dataを使用（実際の構造に合わせる）
    if (response.data.result === "Succeeded") {
      const dataStr = response.data.data;
      
      if (!dataStr) {
        console.error('データが空です:', dataStr);
        return { success: false, message: 'レスポンスデータが空です' };
      }
      
      const data = JSON.parse(dataStr);
      console.log('パース後のデータ:', data);
      
      if (data.hotels && data.hotels.length > 0) {
        commit('setHotelResults', data.hotels);
        return { success: true, message: `${data.hotels.length}件のホテルが見つかりました` };
      } else {
        return { success: false, message: 'ホテルが見つかりませんでした' };
      }
    } else {
      return { success: false, message: 'API呼び出しに失敗しました' };
    }
  } catch (error) {
    console.error('ホテル検索エラー:', error);
    console.error('エラーレスポンス:', error.response?.data);
    return { success: false, message: 'ホテル検索に失敗しました' };
  }
}
  }
}