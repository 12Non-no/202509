<template>
    <v-container>
            <v-row justify="center">
                <v-col class="d-flex flex-column align-center">
                    <div>
        <v-row class="text-h4 mb-4" justify="center">ようこそ</v-row>
        <br>
          </div>
          </v-col> 
          <v-col class="d-flex flex-column align-center">
          <div class="text-center">
            <v-card class="mx-auto pt-10 pb-10 rounded-xl" width="250px" style="background-color: rgba(255, 255, 255, 0.6)" @click="goToChat">
            <!-- カード内容 -->
            旅行の相談をする
            </v-card>
            <v-card class="mx-auto pt-10 pb-10 rounded-xl" width="250px" style="background-color: rgba(255, 255, 255, 0.6)" @click="goToBook">
            <!-- カード内容 -->
            しおりをみる
            </v-card>
          </div>
        </v-col>
        </v-row>
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
         async goToChat(){
          this.errorMessage = '';
          try {
            const result = await this.$store.dispatch('product/sessionCheck', this.$store.state.product.session);
            
            if (result.success){
              console.log('セッション確認成功');
            // ログイン成功後にページ遷移
            this.$router.push('/signup');
            }else{
              // 失敗したらエラー表示
              this.errorMessage = result.message;
              this.$router.push('/');
            }
          } catch (error) {
            alert(error.response.data);
            this.$router.push('/');
          }
          },
        goToBook(){
          this.$router.push('/signup');
        }
    }
    };
  </script>