<template>
    <v-container>
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
  <div class="mx-auto" style="max-width: 600px; width: 100%; hight: 80%">
    <form @submit.prevent="savePlan">
      <div class="mb-5">
        <v-row>
          <v-col cols="6">
          <v-text-field
          v-model="plan.Start_date"
          label="出発日 *"
          type="date"
          required 
          outlined />
          </v-col>
          <v-col cols="6">
          <v-text-field
          v-model="plan.End_date"
          label="帰着日 *"
          required 
          type="date"
          outlined />
          </v-col>
        </v-row>
          <v-text-field
          v-model="plan.Destination"
          label="旅行先 *"
          required 
          outlined />
          <v-select
          item-value="value"
          item-text="text"
          :items="transportationList"
          label="交通手段"
          v-model="plan.Transportation"
          outlined />
          <v-text-field
          v-model="plan.Accommodation"
          label="宿泊先"
          outlined />
          <v-text-field
          v-model="plan.Budget"
          label="予算"
          type="number"
          outlined >円</v-text-field>
          <v-text-field
          v-model="plan.Members"
          label="参加者数"
          type="number"
          outlined />
          <v-text-field
          v-model="plan.Purpose"
          label="目的"
          outlined />
          <v-text-field
          v-model="plan.Tourist_spots"
          label="観光場所"
          outlined />
      </div>

      <div>
        <v-row justify="center" class="mt-4">
          <v-col cols="auto">
            <v-btn type="submit" color="primary">登録</v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn class="" color="error" @click="deletePlan">削除</v-btn>
          </v-col>
        </v-row>
      </div>
    </form>
  </div>
</div>
<v-snackbar 
      v-model="$store.state.product.ui.showSnackbar" 
      :color="$store.state.product.ui.snackbarColor"
      timeout="3000"
      @input="$store.commit('product/setSnackbarShow', false)"
    >
      {{ $store.state.product.ui.snackbarMessage }}
    </v-snackbar>
      </v-card>
    </v-container>
</template>

                

  <script>
    export default{
      name: 'PlanView',
      props: ['planId'],
      data() {
        return {
          errorMessage: '',
        }
      },
      mounted() {
        if (this.planId) { //プラン一覧から遷移した場合はプラン情報をフォームに設定
          const planList = this.$store.state.product.planData;
          const targetPlan = planList.find(p => p.Plan_id === parseInt(this.planId));
          if (targetPlan) {
            this.$store.commit('product/setFormattedPlan', targetPlan);
          }
        } else { //新規プラン登録時はフォームをクリア
          this.$store.commit('product/setClearPlan');
        }
      },
      computed: {
        transportationList() {
          return this.$store.state.product.transportationList
        },
        User_id: {
          get() {
            return this.$store.state.product.user.User_id
            },
            set(value) {
                this.$store.commit('product/setUserId', value);
            }
        },
        plan: {
          get() {
            return this.$store.state.product.plan
            },
            set(value) {
                this.$store.commit('product/setPlan', value);
            }
        },
      },
      methods: {
         async savePlan(){
          // 必須項目確認
          const isValid = await this.$store.dispatch('product/validatePlan');
          if (!isValid) return;
          try {
            const result = await this.$store.dispatch('product/sessionCheck', this.$store.state.product.session);
            
            if (!result.success) throw new Error('セッション失敗');
              let planResult;

              if (this.plan.Plan_id) {
                // 編集
                planResult = await this.$store.dispatch('product/updatePlan', { plan: this.plan, user: this.$store.state.product.user });
              } else {
                // 新規登録
                planResult = await this.$store.dispatch('product/insertPlan', { plan: this.$store.state.product.plan, user: this.$store.state.product.user });
              }


            if(planResult.success){
                console.log('プラン登録成功');
                this.$store.commit('product/setSnackbarShow', true);
                this.$store.commit('product/setSnackbarMessage', this.plan.Plan_id ? '旅行プランを更新しました！' : '旅行プランの登録が完了しました！');
              }else{
                this.$store.commit('product/setAlertShow', true);
                this.$store.commit('product/setAlertMessage', planResult.message);
                this.$store.commit('product/setAlertType', 'error');
              }
            } catch (error) {
            this.$store.commit('product/setAlertShow', true);
            this.$store.commit('product/setAlertMessage', 'システムエラーが発生しました');
            this.$store.commit('product/setAlertType', 'error');
          }
        },
        async deletePlan() {
          const confirmDelete = confirm('このプランを削除してもよろしいですか？');
          if (!confirmDelete) return;

          const result = await this.$store.dispatch('product/deletePlan', this.$store.state.product.plan);
            if (result.success) {
              this.$store.commit('product/setSnackbarShow', true);
              this.$store.commit('product/setSnackbarMessage', 'プランを削除しました');
            } else {
              this.$store.commit('product/setAlertShow', true);
              this.$store.commit('product/setAlertMessage', result.message);
              this.$store.commit('product/setAlertType', 'error');
            }
        }
      }
    };
  </script>