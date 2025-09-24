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
    rakutenAppId: '1090201424106989371',
    rakutenAreaCodes: [],
    selectedPrefecture: null,
    selectedArea: null,
    selectedDetail: null
  },
  getters: {
    prefectureList(state) {
    if (!state.rakutenAreaCodes || state.rakutenAreaCodes.length === 0) {
      return [];
    }
    const list = [];
    for (let i = 0; i < state.rakutenAreaCodes.length; i++) {
      const item = state.rakutenAreaCodes[i];
      if (item.middleClass && item.middleClass.length > 0) {
      const middleClass = item.middleClass[0]; // 最初の要素を取得
      list.push({
        text: middleClass.middleClassName,
        value: middleClass.middleClassCode
      });
    }
  }
    return list;
  },
  areaList(state) {
    console.log('=== areaList getter 開始 ===');

    if (!state.selectedPrefecture) {
      return [];
    }

    console.log('selectedPrefecture.value:', state.selectedPrefecture.value);

    // const areas = [];
    for (let i = 0; i < state.rakutenAreaCodes.length; i++) {
      const item = state.rakutenAreaCodes[i];
      if (item.middleClass && item.middleClass.length > 0) {
        const middleClass = item.middleClass[0];


//追加した部分
        if (middleClass.middleClassCode === 'aomori') {
        console.log('=== 青森県の詳細構造 ===');
        console.log('middleClass全体:', middleClass);
        console.log('smallClasses:', middleClass.smallClasses);
        
        // middleClassの全プロパティを確認
        for (let key in middleClass) {
          console.log(`middleClass.${key}:`, middleClass[key]);
        }
      }

        if (middleClass.middleClassCode === state.selectedPrefecture.value) {

          console.log('選択された都道府県の詳細:', middleClass);
          const areas = [];

          // smallClassesを詳しく確認
        if (middleClass.smallClasses) {
          console.log('smallClasses確認:');

        // // smallClassesがある場合
        // if (middleClass.smallClasses && middleClass.smallClasses.length > 0) {
        //   console.log('smallClasses数:', middleClass.smallClasses.length);

          for (let j = 0; j < middleClass.smallClasses.length; j++) {
            const smallItem = middleClass.smallClasses[j];
            console.log(`smallClasses[${j}]:`, smallItem);

          //   if (smallItem.smallClass && smallItem.smallClass.length > 0) {
          //     const smallClass = smallItem.smallClass[0];

          if (smallItem.smallClass) {
              console.log(`smallClass配列:`, smallItem.smallClass);
              
              if (smallItem.smallClass.length > 0) {
                const smallClass = smallItem.smallClass[0];
                console.log('smallClass詳細:', smallClass);

              areas.push({
                text: smallClass.smallClassName,
                value: smallClass.smallClassCode
              });
            }
          }
        }
      } else{
        // smallClassesがない場合は、都道府県名をそのまま使用
          console.log('smallClassesが存在しません');
          areas.push({
            text: middleClass.middleClassName,
            value: middleClass.middleClassCode
          });
      }
        console.log('最終的なareaList:', areas);
    return areas;
      }
    
  }
  
}

return [];
  },
  detailList(state) {
    if (state.selectedPrefecture && state.selectedPrefecture.value === 'tokyo' &&
        state.selectedArea && state.selectedArea.value === 'tokyo') {
      return [
        { text: '東京駅・銀座・秋葉原・東陽町・葛西', value: 'A' },
        { text: '新橋・汐留・浜松町・お台場', value: 'B' },
        { text: '赤坂・六本木・霞ヶ関・永田町', value: 'C' },
        { text: '渋谷・恵比寿・目黒・二子玉川', value: 'D' },
        { text: '品川・大井町・蒲田・羽田空港', value: 'E' },
        { text: '新宿・中野・荻窪・四谷', value: 'F' },
        { text: '池袋・赤羽・巣鴨・大塚', value: 'G' },
        { text: '東京ドーム・飯田橋・御茶ノ水', value: 'H' },
        { text: '上野・浅草・錦糸町・新小岩・北千住', value: 'I' }
      ];
    }
    return [];
  }
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
    },
    setRakutenAreaCode(state, areaCodes) {
      console.log('地区コードを保存します');
      state.rakutenAreaCodes = areaCodes;
    },
    setSelectedPrefecture(state, prefecture) {
      console.log('都道府県を選択:', prefecture);
      state.selectedPrefecture = prefecture;
      state.selectedArea = null;
      state.selectedDetail = null;
    },
    setSelectedArea(state, area) {
      console.log('エリアを選択:', area);
      state.selectedArea = area;
      state.selectedDetail = null;
    },
    setSelectedDetail(state, detail) {
      console.log('詳細エリアを選択:', detail);
      state.selectedDetail = detail;
    },
    setHotelSearchCheckin(state, date) {
      state.hotelSearch.checkinDate = date;
    },
    setHotelSearchCheckout(state, date) {
      state.hotelSearch.checkoutDate = date;
    },
    setHotelSearchAdult(state, num) {
      state.hotelSearch.adultNum = num;
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
  async getRakutenAreaCode({ commit }) {
    console.log('地区コードを取得します');
    try {
      const url = 'https://m3h-suzuki-task09.azurewebsites.net/api/Get_area_codes';

      const response = await axios.get(url);
      
      if (response.data.status === "Success") {
        const data = JSON.parse(response.data.data);
        
        const largeClassData = data.areaClasses.largeClasses[0];

      // largeClass配列の中身を確認
      if (largeClassData.largeClass && largeClassData.largeClass.length > 0) {
        
        // middleClassesを探す
        let middleClasses = null;
        for (let i = 0; i < largeClassData.largeClass.length; i++) {
          const item = largeClassData.largeClass[i];
          if (item.middleClasses) {
            middleClasses = item.middleClasses;
            break;
          }
        }
        if (middleClasses && middleClasses.length > 0) {
          commit('setRakutenAreaCode', middleClasses);
          console.log('地区コード保存完了');
        }
      }
    }
  } catch(error) {
    console.error("エラーが発生しました:", error);
  }
},
  async searchHotels({ commit }, searchData) {
    console.log('ホテル検索を開始します');
    try {
      // URLを作る
      const url = 'https://m3h-suzuki-task09.azurewebsites.net/api/Hotel_search?';
      let params = 'prefectureCode=' + searchData.prefectureCode +
                   '&areaCode=' + searchData.areaCode +
                   '&checkinDate=' + searchData.checkinDate +
                   '&checkoutDate=' + searchData.checkoutDate +
                   '&adultNum=' + searchData.adultNum;
      
      // 詳細コードがある場合は追加
      if (searchData.detailCode) {
        params += '&detailCode=' + searchData.detailCode;
      }
      
      // APIを呼び出す
      const response = await axios.get(url + params);
      console.log('API結果:', response.data);

      // 成功したかチェック
      if (response.data.result === "Succeeded") {
        const data = JSON.parse(response.data.data);
        console.log('ホテルデータ:', data);
        
        // ホテルがあるかチェック
        if (data.hotels && data.hotels.length > 0) {
          // ホテルリストを作る
          const hotelList = [];
          
          // 一つずつ処理
          for (let i = 0; i < data.hotels.length; i++) {
            const hotel = data.hotels[i].hotel[0].hotelBasicInfo;
            
            // 簡単なホテルデータを作る
            const simpleHotel = {
              hotelNo: hotel.hotelNo,
              hotelName: hotel.hotelName,
              hotelMinCharge: hotel.hotelMinCharge,
              hotelImageUrl: hotel.hotelImageUrl,
              hotelInformationUrl: hotel.hotelInformationUrl,
              access: hotel.access,
              reviewAverage: hotel.reviewAverage,
              hotelSpecial: hotel.hotelSpecial
            };
            
            hotelList.push(simpleHotel);
          }
          
          console.log('ホテル一覧完成:', hotelList.length + '件');
          
          // 結果を保存
          commit('setHotelResults', hotelList);
          return { success: true, message: hotelList.length + '件見つかりました' };
        } else {
          return { success: false, message: 'ホテルが見つかりませんでした' };
        }
      } else {
        return { success: false, message: '検索に失敗しました' };
      }
    } catch (error) {
      console.error('検索エラー:', error);
      return { success: false, message: '検索でエラーが発生しました' };
    }
  }
  }
}