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
      // デバッグ用: 都道府県リストの内容を確認
      const list = this.$store.getters['product/prefectureList'];
      console.log('prefList取得結果:', list);
      return list;
    },
    areaList() {
      // デバッグ用: エリアリストの内容を確認
      const list = this.$store.getters['product/areaList'];
      console.log('areaList取得結果:', list);
      return list;
    },
    detailList() {
      // デバッグ用: 詳細エリアリストの内容を確認
      const list = this.$store.getters['product/detailList'];
      console.log('detailList取得結果:', list);
      return list;
    },
    hotels() {
      return this.$store.state.product.hotelResults;
    },
    selectedPref: {
      get() {
        return this.$store.state.product.selectedPrefecture;
      },
      set(value) {
        // デバッグ用: 都道府県選択時のログ
        console.log('都道府県が選択されました:', value);
        console.log('選択された都道府県のtext:', value?.text);
        console.log('選択された都道府県のvalue:', value?.value);


        this.$store.commit('product/setSelectedPrefecture', value);
      }
    },
    selectedAreaData: {
      get() {
        return this.$store.state.product.selectedArea;
      },
      set(value) {
        // デバッグ用: エリア選択時のログ
        console.log('エリアが選択されました:', value);
        this.$store.commit('product/setSelectedArea', value);
      }
    },
    selectedDetailData: {
      get() {
        return this.$store.state.product.selectedDetail;
      },
      set(value) {
        // デバッグ用: 詳細エリア選択時のログ
        console.log('詳細エリアが選択されました:', value);
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
    // デバッグ用: 画面表示時の初期状態を確認
    console.log('=== ホテル検索画面が表示されました ===');
    this.$store.dispatch('product/getRakutenAreaCode');
  },
  
  methods: {
    async search() {
      // デバッグ用: 検索開始ログ
      console.log('=== ホテル検索を開始します ===');
      console.log('現在の選択状態:');
      console.log('- selectedPref:', this.selectedPref);
      console.log('- selectedAreaData:', this.selectedAreaData);
      console.log('- selectedDetailData:', this.selectedDetailData);
      
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
          
          // デバッグ用: 検索パラメータの詳細確認
          console.log('検索パラメータ:', params);
          
          const hotelResult = await this.$store.dispatch('product/searchHotels', params);
          
          if (hotelResult.success) {
            // デバッグ用: 検索成功時のログ
            console.log('ホテル検索成功:', hotelResult);
            this.$store.commit('product/setSnackbarShow', true);
            this.$store.commit('product/setSnackbarMessage', hotelResult.message);
            this.$store.commit('product/setSnackbarColor', 'success');
          } else {
            // デバッグ用: 検索失敗時のログ
            console.log('ホテル検索失敗:', hotelResult);
            this.$store.commit('product/setAlertShow', true);
            this.$store.commit('product/setAlertMessage', hotelResult.message);
            this.$store.commit('product/setAlertType', 'error');
          }
        } else {
          // デバッグ用: セッション確認失敗時のログ
          console.log('セッション確認失敗:', sessionResult);
          this.$store.commit('product/setAlertShow', true);
          this.$store.commit('product/setAlertMessage', sessionResult.message);
          this.$store.commit('product/setAlertType', 'error');
          this.$router.push('/');
        }
      } catch (error) {
        // デバッグ用: 例外発生時の詳細ログ
        console.error('ホテル検索で例外発生:', error);
        console.error('エラーの詳細:', error.response?.data);
        this.$store.commit('product/setAlertShow', true);
        this.$store.commit('product/setAlertMessage', 'システムエラーが発生しました。');
        this.$store.commit('product/setAlertType', 'error');
      }
    }
  }
}
</script>