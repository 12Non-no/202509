<template>
    <v-container>
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
            <v-btn color="primary" class="mt-4" block @click="login">ログイン</v-btn>
            <v-row justify="center">
            <!-- サインアップボタン -->
            <v-btn text class="mt-4" block @click="goToSignup">新規登録はこちら</v-btn>
            </v-row>
          </v-col>
        </v-row>
        </div>
          </v-card-text>
         
        </v-row>
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
          this.errorMessage = '';
          try {
            const result = await this.$store.dispatch('product/login', this.$store.state.product.user);
            
            if (result.success){
              console.log('ログイン成功');
            // ログイン成功後にページ遷移
            this.$router.push('/mypage');
            }else{
              // 失敗したらエラー表示
              this.errorMessage = result.message;
            }
          } catch (error) {
            alert(error.response.data);
            
          }
          },
        goToSignup(){
          this.$router.push('/signup');
        }
    }
    };
  </script>