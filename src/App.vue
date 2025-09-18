<template>
  <v-app style="background-image: url('https://i.gyazo.com/51981baf4003f7be3c81cb3ee4eb0600.jpg'); background-size: cover; background-position: center;">
    <v-app-bar
      app
      color="rgba(255, 255, 255, 0.6)"
      dark
    >
      
      <v-spacer></v-spacer>

      <!-- ログイン済みの場合 -->
      <template v-if="isLoggedIn">
        <v-btn color="white" @click="goToMyPage" class="black--text mr-4">
          <v-icon>mdi-home</v-icon>
          マイページ
        </v-btn>
        
        <v-btn color="white" @click="logout" class="black--text">
          <v-icon>mdi-logout</v-icon>
          ログアウト
        </v-btn>
      </template>
      
      <!-- 未ログインの場合 -->
      <template v-else>
        <v-btn color="white" @click="goToLogin" class="black--text">
          <v-icon>mdi-login</v-icon>
          ログイン
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
        <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
  computed: {
    isLoggedIn() {
      // セッションIDの有無でログイン状態を判定
      return !!this.$store.state.product.session.Session_id;
    }
  },
  methods: {
    goToMyPage() {
      this.$router.push('/mypage');
    },
    
    goToLogin() {
      this.$router.push('/');
    },
    
    logout() {
      this.$store.commit('product/setSessionId', '');
      this.$store.commit('product/setUserName', '');
      this.$router.push('/');
    }
  }
};
</script>