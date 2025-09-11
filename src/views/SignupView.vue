<template>
<div>
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
          try {
            await this.$store.dispatch('product/signup', this.$store.state.product.user);
            // 会員登録成功後にページ遷移
            this.$router.push('/login');
          } catch (error) {
            alert(error.response.data);
          }
          }
    }
    };
  </script>