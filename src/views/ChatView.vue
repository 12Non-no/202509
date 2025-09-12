<template>
    <v-container>
            チャットページ
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