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
        <v-card class="mx-auto pt-10 pb-10 rounded-xl" width="500px" style="background-color: rgba(255, 255, 255, 0.6)">
            <v-row justify="center">
              <v-col class="d-flex flex-column align-center">
                <div>
                  <v-row class="text-h4 mb-4" justify="center">ログイン</v-row>
                </div>
              </v-col>
              <v-card-text class="mx-20">
                <div class="mx-20">
                <!-- 入力フォーム -->
                  <v-row justify="center">
                    <v-col cols="12" sm="9" md="4" >
                    <!-- ユーザー名入力欄 -->
                      <v-text-field
                        v-model="User_id" 
                        label="ユーザーID" 
                        outlined>
                      </v-text-field>
                      <!-- パスワード入力欄 -->
                      <v-text-field 
                        v-model="Password" 
                        label="パスワード" 
                        type="password" 
                        outlined>
                      </v-text-field>
                      <!-- ログインボタン -->
                      <v-btn color="primary" class="mt-4" block @click="login">
                        ログイン
                      </v-btn>
                      <v-row justify="center">
                      <!-- サインアップボタン -->
                        <v-btn text class="mt-4" block @click="goToSignup">
                          新規登録はこちら
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-row>
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
      name: 'LoginView',
      computed: {
        User_id: {
          get() {
            return this.$store.state.product.user.User_id
            },
            set(value) {
                this.$store.commit('product/setUserId', value);
            }
        },
        Password: {
          get() {
            return this.$store.state.product.user.Password
            },
            set(value) {
                this.$store.commit('product/setUserPassword', value);
            }
        }
      },
      methods: {
        async login(){
          this.$store.commit('product/clearAllMessages'); // メッセージクリア
          try {
            const result = await this.$store.dispatch('product/login', this.$store.state.product.user);
            
            if (result.success){
              console.log('ログイン成功');
              this.$store.commit('product/setSnackbarShow', true);
              this.$store.commit('product/setSnackbarMessage', 'ログインしました');
              this.$store.commit('product/setSnackbarColor', 'success');
              // ログイン成功後にページ遷移
              this.$router.push('/mypage');
            }else{
              // 失敗したらエラー表示
              this.$store.commit('product/setAlertShow', true);
              this.$store.commit('product/setAlertMessage', result.message || 'ログインに失敗しました');
              this.$store.commit('product/setAlertType', 'error');
            }
          } catch (error) {
            console.error('ログインエラー:', error);
            this.$store.commit('product/setAlertShow', true);
            this.$store.commit('product/setAlertMessage', 'システムエラーが発生しました');
            this.$store.commit('product/setAlertType', 'error');
          }
          },
        goToSignup(){
          this.$router.push('/signup');
        }
    }
    };
  </script>