<template>
    <v-container>
            
                <v-col class="d-flex flex-column align-center">
                    <div>
        <v-row class="text-h4 mb-4" justify="center">ようこそ</v-row>
        <br>
          </div>
          </v-col> 
          <v-row justify="center">
          <v-col class="d-flex flex-column align-center">
          <div class="text-center">
            <v-card class="mx-auto pt-10 pb-10 rounded-xl text-h5" width="350px" style="background-color: rgba(255, 255, 255, 0.6)" @click="goToChat">
            <!-- カード内容 -->
            <v-img src="https://i.gyazo.com/f239a716c92373dee820b967d7fa66c8.png" width="180" height="auto" class="mx-auto my-8"></v-img>
            旅行の相談をする
            </v-card>
            </div>
            </v-col>
            <v-col class="d-flex flex-column align-center">
              <div class="text-center">
            <v-card class="mx-auto pt-10 pb-10 rounded-xl text-h5" width="350px" style="background-color: rgba(255, 255, 255, 0.6)" @click="goToBook">
            <!-- カード内容 -->
            <v-img src="https://i.gyazo.com/5c2e8ab0ee3474729326726cd9f4571d.png" width="180" height="auto" class="mx-auto mb-8 mt-4"></v-img>
            旅行プランを登録する
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
            // ログイン成功後にチャットページへ遷移
            this.$router.push('/chat');
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
        async goToBook(){
          this.errorMessage = '';
          try {
            const result = await this.$store.dispatch('product/sessionCheck', this.$store.state.product.session);
            
            if (result.success){
              console.log('セッション確認成功');
            // ログイン成功後にしおりページへ遷移
            this.$router.push('/book');
            }else{
              // 失敗したらエラー表示
              this.errorMessage = result.message;
              this.$router.push('/');
            }
          } catch (error) {
            alert(error.response.data);
            this.$router.push('/');
          }
        }
    }
    };
  </script>