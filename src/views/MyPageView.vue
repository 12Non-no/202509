<template>
    <v-container>
      <v-alert
        v-if="$store.state.product.ui.showAlert"
        :type="$store.state.product.ui.alertType"
        dismissible
        @input="$store.commit('product/setAlertShow', false)"
        class="mb-4"
      >
        {{ $store.state.product.ui.alertMessage }}
      </v-alert>
        <v-col class="d-flex flex-column align-center">
          <div>
            <v-row class="text-h4 mb-4 white--text" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.7)" justify="center">
               {{ $store.state.product.user.User_name }}さん、ようこそ
            </v-row>
            <br>
          </div>
        </v-col> 
        <v-row justify="center">
          <v-col class="d-flex flex-column align-center">
            <div class="text-center">
              <v-card class="mx-auto pt-10 pb-10 rounded-xl text-h5" width="350px" style="background-color: rgba(255, 255, 255, 0.6)" @click="goToChat">
              <!-- カード内容 -->
                <v-img src="https://i.gyazo.com/f239a716c92373dee820b967d7fa66c8.png" width="180" height="120" contain class="mx-auto my-8"></v-img>
                  旅行の相談をする
              </v-card>
            </div>
          </v-col>
          <v-col class="d-flex flex-column align-center">
            <div class="text-center">
              <v-card class="mx-auto pt-10 pb-10 rounded-xl text-h5" width="350px" style="background-color: rgba(255, 255, 255, 0.6)" @click="goToHotel">
              <!-- カード内容 -->
                <v-img src="https://i.gyazo.com/65cc6039021bd770e0f6eff38e4f60f2.png" width="180" height="120" contain class="mx-auto my-8"></v-img>
                  ホテルを調べる
              </v-card>
            </div>
          </v-col>
          <v-col class="d-flex flex-column align-center">
            <div class="text-center">
              <v-card class="mx-auto pt-10 pb-10 rounded-xl text-h5" width="350px" style="background-color: rgba(255, 255, 255, 0.6)" @click="goToPlan">
              <!-- カード内容 -->
                <v-img src="https://i.gyazo.com/5c2e8ab0ee3474729326726cd9f4571d.png" width="180" height="120" contain class="mx-auto my-8"></v-img>
                旅行プランを登録する
              </v-card>
            </div>
          </v-col>
        </v-row>
      <v-snackbar 
        v-model="$store.state.product.ui.showSnackbar" 
        :color="$store.state.product.ui.snackbarColor"
        timeout="3000"
        @input="$store.commit('product/setSnackbarShow', false)"
      >
        {{ $store.state.product.ui.snackbarMessage }}
      </v-snackbar>
    </v-container>
</template>

                

  <script>
    export default{
      name: 'MyPage',
      computed: {
        User_id: {
          get() {
            return this.$store.state.product.user.User_id
            },
            set(value) {
                this.$store.commit('product/setUserId', value);
            }
        },
        User_name:{
          get(){
            return this.$store.state.product.user.User_name
          }
        }
      },
      methods: {
         async goToChat(){
          this.$store.commit('product/clearAllMessages'); // メッセージクリア
          try {
            const result = await this.$store.dispatch('product/sessionCheck', this.$store.state.product.session);
            
            if (result.success){
              console.log('セッション確認成功');

              //アシスタント作成
              const assistantResult = await this.$store.dispatch('product/Create_assistant', {user: this.$store.state.product.user,
                Assistant_id: this.$store.state.product.Assistant_id});
              if (!assistantResult.success) {
                this.$store.commit('product/setAlertShow', true);
                this.$store.commit('product/setAlertMessage', assistantResult.message);
                this.$store.commit('product/setAlertType', 'error');
                return;
              }
            const chatResult = await this.$store.dispatch('product/getChat', this.$store.state.product.user);
            
            if (chatResult.success){
                // チャット履歴取得orチャット作成成功後にチャットページへ遷移
                this.$router.push('/chat');
              } else {
                // 失敗したらエラー表示
                this.$store.commit('product/setAlertShow', true);
                this.$store.commit('product/setAlertMessage', chatResult.message);
                this.$store.commit('product/setAlertType', 'error');
                this.$router.push('/');
              } 
            }else{
              // 失敗したらエラー表示
              this.$store.commit('product/setAlertShow', true);
              this.$store.commit('product/setAlertMessage', result.message);
              this.$store.commit('product/setAlertType', 'error');
              this.$router.push('/');
            }
          } catch (error) {
            alert(error.response.data);
            this.$store.commit('product/setAlertShow', true);
            this.$store.commit('product/setAlertMessage', 'システムエラーが発生しました。');
            this.$store.commit('product/setAlertType', 'error');
            this.$router.push('/');
          }
          },
        async goToPlan(){
          this.$store.commit('product/clearAllMessages'); // メッセージクリア
          try {
            const result = await this.$store.dispatch('product/sessionCheck', this.$store.state.product.session);
            
            if (result.success){
              console.log('セッション確認成功');
              // セッション確認成功後に旅行プラン登録ページへ遷移
              this.$router.push('/plan');
            }else{
              // 失敗したらエラー表示
              this.$store.commit('product/setAlertShow', true);
              this.$store.commit('product/setAlertMessage', result.message);
              this.$store.commit('product/setAlertType', 'error');
              this.$router.push('/');
            }
          } catch (error) {
            console.error('goToPlan エラー:', error);
            this.$store.commit('product/setAlertShow', true);
            this.$store.commit('product/setAlertMessage', 'システムエラーが発生しました。');
            this.$store.commit('product/setAlertType', 'error');
            this.$router.push('/');
          }
        },
        async goToHotel(){
          this.$store.commit('product/clearAllMessages'); // メッセージクリア
          try {
            const result = await this.$store.dispatch('product/sessionCheck', this.$store.state.product.session);
            
            if (result.success){
              console.log('セッション確認成功');
              // セッション確認成功後にホテル検索ページへ遷移
              this.$router.push('/hotel');
            }else{
              // 失敗したらエラー表示
              this.$store.commit('product/setAlertShow', true);
              this.$store.commit('product/setAlertMessage', result.message);
              this.$store.commit('product/setAlertType', 'error');
              this.$router.push('/');
            }
          } catch (error) {
            console.error('goToPlan エラー:', error);
            this.$store.commit('product/setAlertShow', true);
            this.$store.commit('product/setAlertMessage', 'システムエラーが発生しました。');
            this.$store.commit('product/setAlertType', 'error');
            this.$router.push('/');
          }
        }
    }
    };
  </script>