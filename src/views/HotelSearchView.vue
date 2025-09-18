<template>
  <v-container>
    <!-- アラート表示 -->
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
      <div class="d-flex align-center justify-center pa-12">
        <div class="mx-auto" style="max-width: 600px; width: 100%;">
          <form @submit.prevent="searchHotel">
            <div class="mb-5">
              <!-- 目的地 -->
              <v-text-field
                v-model="hotelSearch.destination"
                label="目的地 *"
                outlined
                required
                placeholder="例：東京、大阪、京都"
              />
              
              <!-- チェックイン・チェックアウト日 -->
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="hotelSearch.checkinDate"
                    label="チェックイン日 *"
                    type="date"
                    outlined
                    required
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="hotelSearch.checkoutDate"
                    label="チェックアウト日 *"
                    type="date"
                    outlined
                    required
                  />
                </v-col>
              </v-row>
              <!-- 人数 -->
              <v-text-field
                v-model="hotelSearch.adultNum"
                label="人数 *"
                type="number"
                outlined
                required
                min="1"
                max="10"
              />
            </div>

            <div>
              <v-btn type="submit" color="primary">ホテルを検索</v-btn>
            </div>
          </form>
        </div>
      </div>

      <!-- 検索結果表示エリア -->
      <div v-if="hotelResults.length > 0" class="mt-8">
        <v-divider class="mb-4"></v-divider>
        <h3 class="mb-4">検索結果</h3>
        
        <v-row>
          <v-col v-for="hotel in hotelResults" :key="hotel.hotelNo" cols="12" md="6">
            <v-card class="mb-4">
              <v-img
                v-if="hotel.hotelImageUrl"
                :src="hotel.hotelImageUrl"
                height="200"
                cover
              ></v-img>
              
              <v-card-title>{{ hotel.hotelName }}</v-card-title>
              
              <v-card-text>
                <p><strong>料金:</strong> {{ hotel.hotelMinCharge }}円〜</p>
                <p v-if="hotel.access">{{ hotel.access }}</p>
              </v-card-text>
              
              <v-card-actions>
                <v-btn
                  v-if="hotel.hotelInformationUrl"
                  :href="hotel.hotelInformationUrl"
                  target="_blank"
                  color="primary"
                  text
                >
                  詳細を見る
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <v-snackbar 
      v-model="$store.state.product.ui.showSnackbar" 
      :color="$store.state.product.ui.snackbarColor"
      timeout="3000"
      @input="$store.commit('product/setSnackbarShow', false)"
    >
      {{ $store.state.product.ui.snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default{
  name: 'HotelView',
  computed: {
    hotelSearch: {
      get() {
        return this.$store.state.product.hotelSearch
      },
      set(value) {
        this.$store.commit('product/setHotelSearch', value);
      }
    },
    hotelResults() {
      return this.$store.state.product.hotelResults;
    }
  },
  methods: {
    async searchHotel(){
      // バリデーション実行
      const isValid = await this.$store.dispatch('product/validateHotelSearch');
      
      if (!isValid) {
        return;
      }
      
      try {
        const result = await this.$store.dispatch('product/sessionCheck', this.$store.state.product.session);
        
        if (result.success){
          const hotelResult = await this.$store.dispatch('product/searchHotels', this.$store.state.product.hotelSearch);

          if(hotelResult.success){
            this.$store.commit('product/setSnackbarShow', true);
            this.$store.commit('product/setSnackbarMessage', 'ホテルの検索が完了しました！');
          }else{
            this.$store.commit('product/setAlertShow', true);
            this.$store.commit('product/setAlertMessage', hotelResult.message);
            this.$store.commit('product/setAlertType', 'error');
          }
        }
      } catch (error) {
        console.error('ホテル検索エラー:', error);
        this.$store.commit('product/setAlertShow', true);
        this.$store.commit('product/setAlertMessage', 'システムエラーが発生しました');
        this.$store.commit('product/setAlertType', 'error');
      }
    }
  }
};
</script>