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
    <v-card class="mx-auto pt-10 pb-10 rounded-xl pa-4" width="700px" style="background-color: rgba(255, 255, 255, 0.6)">
      
      <!-- メッセージ表示エリア -->
      <div class="chat-messages" style="max-height: 400px; overflow-y: auto; margin-bottom: 20px;">
        <div 
          v-for="(message, index) in $store.state.product.messages"
          :key="index"
          class="mb-4"
        >
          <!-- ユーザーメッセージ -->
          <div class="d-flex justify-end mb-2">
            <v-card 
              color="primary" 
              dark 
              class="pa-3" 
              style="max-width: 80%; word-wrap: break-word; white-space: pre-wrap;"
              rounded="lg"
            >
              <v-card-text class="pa-2">
                あなた: {{ message.userMessage }}
              </v-card-text>
            </v-card>
          </div>
          
          <!-- AIレスポンス -->
          <div class="d-flex justify-start">
            <v-card 
              color="grey lighten-4" 
              class="pa-3" 
              style="max-width: 80%; word-wrap: break-word; white-space: pre-wrap;"
              rounded="lg"
            >
              <v-card-text class="pa-2">
                AI: {{ message.aiResponse }}
              </v-card-text>
            </v-card>
          </div>
        </div>
      </div>

      <!-- メッセージ入力エリア -->
      <div class="chat-input">
        <v-row>
          <v-col cols="10">
            <v-text-field 
              v-model="$store.state.product.currentMessage"
              placeholder="メッセージを入力してください"
              @keyup.enter="addToChat"
              outlined
            />
          </v-col>
          <v-col cols="2">
            <v-btn @click="addToChat" color="#90CAF9" block large>
              送信
            </v-btn>
          </v-col>
        </v-row>
      </div>
              <v-snackbar 
      v-model="$store.state.product.ui.showSnackbar" 
      :color="$store.state.product.ui.snackbarColor"
      timeout="3000"
      @input="$store.commit('product/setSnackbarShow', false)"
    >
      {{ $store.state.product.ui.snackbarMessage }}
    </v-snackbar>
    </v-card>
  </v-container>
</template>

                

  <script>
    export default{
      name: 'ChatView',
      computed: {
        User_id: {
          get() {
            return this.$store.state.product.user.User_id
            },
            set(value) {
                this.$store.commit('product/setUserId', value);
            }
        }
      },
      methods: {
         async addToChat(){
          this.$store.commit('product/clearAllMessages'); // メッセージクリア
          try {
            const result = await this.$store.dispatch('product/sessionCheck', this.$store.state.product.session);
            
            if (result.success){
              console.log('セッション確認成功');
              const chatResult = await this.$store.dispatch('product/Send_message', {user: this.$store.state.product.user, message: this.$store.state.product.currentMessage});

              if(chatResult.success){
                console.log('メッセージ送信成功');
                this.$store.commit('product/setCurrentMessage', '');
              }else{
                this.$store.commit('product/setAlertShow', true);
                this.$store.commit('product/setAlertMessage', chatResult.message);
                this.$store.commit('product/setAlertType', 'error');
              }
            }else{
              // 失敗したらエラー表示
              this.$store.commit('product/setAlertShow', true);
              this.$store.commit('product/setAlertMessage', result.message);
              this.$store.commit('product/setAlertType', 'error');
              this.$router.push('/');
            }
          } catch (error) {
            console.error('addToChat エラー:', error);
            this.$store.commit('product/setAlertShow', true);
            this.$store.commit('product/setAlertMessage', 'システムエラーが発生しました。');
            this.$store.commit('product/setAlertType', 'error');
          }
        }
      }
    };
  </script>