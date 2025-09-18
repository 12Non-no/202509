<template>
<div>
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
    
    <v-form ref="form">
      <v-card-title class="text-h4 d-flex justify-center pa-0 mt-6 mb-3"
        >新規登録</v-card-title
      >
      <v-card-text class="d-flex justify-center flex-column">
        <div class="mx-9">
          <v-text-field
            v-model="User_id"
            label="ユーザーID"
            placeholder="英数字10文字以内"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="User_name"
            label="ユーザー名"
            placeholder="15文字以内"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="Password"
            label="パスワード"
            placeholder="8文字以上の半角英数記号"
            outlined
            type="password" 
          ></v-text-field>
        </div>
        <div class="text-center">
          <v-btn class="primary" @click="signup">登録</v-btn>
        </div>
      </v-card-text>
    </v-form>
    <v-snackbar 
      v-model="$store.state.product.ui.showSnackbar" 
      :color="$store.state.product.ui.snackbarColor"
      timeout="3000"
      @input="$store.commit('product/setSnackbarShow', false)"
    >
      {{ $store.state.product.ui.snackbarMessage }}
    </v-snackbar>
  </v-card>
  </div>
</template>

<script>
export default {
    name: 'SignupView',
    computed: {
        User_id: {
          get() {
            return this.$store.state.product.user.User_id
            },
            set(value) {
                this.$store.commit('product/setUserId', value);
            }
        },
        User_name: {
          get() {
            return this.$store.state.product.user.User_name
            },
            set(value) {
                this.$store.commit('product/setUserName', value);
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
        async signup(){
          this.$store.commit('product/clearAllMessages'); // メッセージクリア

          try {
            const result = await this.$store.dispatch('product/signup', this.$store.state.product.user);
        
            if (result && result.result === "Succeeded") {
              this.$store.commit('product/setSnackbarShow', true);
              this.$store.commit('product/setSnackbarMessage', '新規登録が完了しました');
              this.$store.commit('product/setSnackbarColor', 'success');
          
              // ページ遷移
              this.$router.push('/');
          } else {
              // 登録失敗のアラート表示
              this.$store.commit('product/setAlertShow', true);
              this.$store.commit('product/setAlertMessage', result?.Message || '新規登録に失敗しました');
              this.$store.commit('product/setAlertType', 'error');
          }
      } catch (error) {
        console.error('新規登録エラー:', error);
        this.$store.commit('product/setAlertShow', true);
        this.$store.commit('product/setAlertMessage', 'システムエラーが発生しました');
        this.$store.commit('product/setAlertType', 'error');
      }
    }
  }
};
  </script>