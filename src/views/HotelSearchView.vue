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
      <h2>ホテル検索</h2>
      
      <!-- 都道府県選択 -->
      <div class="mb-4">
        <v-select
          v-model="selectedPref"
          :items="prefList"
          label="都道府県を選択してください"
          item-title="text"
          item-value="value"
          return-object
          variant="outlined"
        ></v-select>
      </div>
      
      <!-- エリア選択 -->
      <div class="mb-4" v-if="selectedPref">
        <v-select
          v-model="selectedAreaData"
          :items="areaList"
          label="エリアを選択してください"
          item-title="text"
          item-value="value"
          return-object
          variant="outlined"
        ></v-select>
      </div>
      
      <!-- 詳細エリア選択（東京の時だけ） -->
      <div class="mb-4" v-if="showDetail">
        <v-select
          v-model="selectedDetailData"
          :items="detailList"
          label="詳細エリアを選択してください"
          item-title="text"
          item-value="value"
          return-object
          variant="outlined"
        ></v-select>
      </div>
      
      <!-- 日付入力 -->
      <div class="mb-4">
        <v-text-field
          v-model="checkin"
          label="チェックイン日"
          type="date"
          variant="outlined"
        ></v-text-field>
      </div>
      
      <div class="mb-4">
        <v-text-field
          v-model="checkout"
          label="チェックアウト日"
          type="date"
          variant="outlined"
        ></v-text-field>
      </div>
      
      <!-- 人数入力 -->
      <div class="mb-4">
        <v-text-field
          v-model="people"
          label="大人の人数"
          type="number"
          variant="outlined"
        ></v-text-field>
      </div>
      
      <!-- 検索ボタン -->
      <div class="text-center mb-4">
        <v-btn @click="search" color="primary" v-if="selectedAreaData">
          ホテルを検索
        </v-btn>
      </div>
      
      <!-- 結果表示 -->
      <div v-if="hotels.length > 0">
        <h3>検索結果: {{ hotels.length }}件</h3>
        <div v-for="hotel in hotels" :key="hotel.hotelNo" class="mb-4">
          <v-card>
            <v-img v-if="hotel.hotelImageUrl" :src="hotel.hotelImageUrl" height="200"></v-img>
            <v-card-title>{{ hotel.hotelName }}</v-card-title>
            <v-card-text>
              <p>料金: {{ hotel.hotelMinCharge }}円〜</p>
              <p v-if="hotel.access">{{ hotel.access }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn v-if="hotel.hotelInformationUrl" :href="hotel.hotelInformationUrl" target="_blank">
                詳細を見る
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </v-card>

    <!-- スナックバー -->
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
export default {
  name: 'HotelView',
  computed: {
    prefList() {
      return this.$store.getters['product/prefectureList'];
    },
    areaList() {
      return this.$store.getters['product/areaList'];
    },
    detailList() {
      return this.$store.getters['product/detailList'];
    },
    hotels() {
      return this.$store.state.product.hotelResults;
    },
    selectedPref: {
      get() {
        return this.$store.state.product.selectedPrefecture;
      },
      set(value) {
        this.$store.commit('product/setSelectedPrefecture', value);
      }
    },
    selectedAreaData: {
      get() {
        return this.$store.state.product.selectedArea;
      },
      set(value) {
        this.$store.commit('product/setSelectedArea', value);
      }
    },
    selectedDetailData: {
      get() {
        return this.$store.state.product.selectedDetail;
      },
      set(value) {
        this.$store.commit('product/setSelectedDetail', value);
      }
    },
    checkin: {
      get() {
        return this.$store.state.product.hotelSearch.checkinDate;
      },
      set(value) {
        this.$store.commit('product/setHotelSearchCheckin', value);
      }
    },
    checkout: {
      get() {
        return this.$store.state.product.hotelSearch.checkoutDate;
      },
      set(value) {
        this.$store.commit('product/setHotelSearchCheckout', value);
      }
    },
    people: {
      get() {
        return this.$store.state.product.hotelSearch.adultNum;
      },
      set(value) {
        this.$store.commit('product/setHotelSearchAdult', value);
      }
    },
    showDetail() {
      return this.detailList.length > 0;
    }
  },
  mounted() {
    this.$store.dispatch('product/getRakutenAreaCode');
  },
  
  methods: {
    async search() {
      this.$store.commit('product/clearAllMessages');
      
      try {
        const sessionResult = await this.$store.dispatch('product/sessionCheck', this.$store.state.product.session);
        
        if (sessionResult.success) {
          console.log('セッション確認成功');
          
          const params = {
            prefectureCode: this.selectedPref.value,
            areaCode: this.selectedAreaData.value,
            detailCode: this.selectedDetailData ? this.selectedDetailData.value : null,
            checkinDate: this.checkin,
            checkoutDate: this.checkout,
            adultNum: this.people
          };
          
          const hotelResult = await this.$store.dispatch('product/searchHotels', params);
          
          if (hotelResult.success) {
            this.$store.commit('product/setSnackbarShow', true);
            this.$store.commit('product/setSnackbarMessage', hotelResult.message);
            this.$store.commit('product/setSnackbarColor', 'success');
          } else {
            this.$store.commit('product/setAlertShow', true);
            this.$store.commit('product/setAlertMessage', hotelResult.message);
            this.$store.commit('product/setAlertType', 'error');
          }
        } else {
          this.$store.commit('product/setAlertShow', true);
          this.$store.commit('product/setAlertMessage', sessionResult.message);
          this.$store.commit('product/setAlertType', 'error');
          this.$router.push('/');
        }
      } catch (error) {
        console.error('ホテル検索エラー:', error);
        this.$store.commit('product/setAlertShow', true);
        this.$store.commit('product/setAlertMessage', 'システムエラーが発生しました。');
        this.$store.commit('product/setAlertType', 'error');
      }
    }
  }
}
</script>