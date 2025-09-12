<template>
    <v-container>
        <v-card class="mx-auto pt-10 pb-10 rounded-xl pa-4" width="700px" style="background-color: rgba(255, 255, 255, 0.6)">
        <!-- メッセージ表示エリア -->
            <v-card 
			v-for="content in contents"
			:key="content.id"
			class="d-flex"
		>
        {{content.text}}
            </v-card>
	<!-- メッセージ入力エリア -->
	<div class="chat-input">
		<v-text-field 
			v-model="newMessage"
			type="text" 
			name="chatText" 
			id="chatText" 
			class="input-control input-text" 
			placeholder="メッセージを入力してください" 
		/>
    </div>
		<v-btn @click="addToChat">送信</v-btn>
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
         async addToChat(){
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