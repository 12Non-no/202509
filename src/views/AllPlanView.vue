<template>
    <v-container>
        <!-- エラーメッセージ -->
        <v-alert
            v-if="$store.state.product.ui.showAlert"
            :type="$store.state.product.ui.alertType"
            dismissible
            @input="$store.commit('product/setAlertShow', false)"
            class="mb-4"
        >
            {{ $store.state.product.ui.alertMessage }}
        </v-alert>

        <!-- 成功メッセージ -->
        <v-snackbar 
            v-model="$store.state.product.ui.showSnackbar" 
            :color="$store.state.product.ui.snackbarColor"
            timeout="3000"
            @input="$store.commit('product/setSnackbarShow', false)"
        >
            {{ $store.state.product.ui.snackbarMessage }}
        </v-snackbar>
        
        <v-card class="mx-auto pt-10 pb-10 rounded-xl" width="1080px" style="background-color: rgba(255, 255, 255, 0.6)">
            <v-card-title class="text-center">
                <h2>旅行プラン一覧</h2>
            </v-card-title>
            
            <v-row justify="center" class="text-center text-body-2">
                <v-data-table
                    :headers="planHeaders"
                    :items="planData"
                    :items-per-page="5"
                    class="elevation-1"
                    style="width: 90%"
                >
                    <!-- 旅行期間の表示 -->
                    <template v-slot:[`item.period`]="{item}">
                        {{ item.Start_date }} ～ {{ item.End_date }}
                    </template>
                    
                    <!-- 予算の表示 -->
                    <template v-slot:[`item.Budget`]="{item}">
                        <span v-if="item.Budget">¥{{ item.Budget.toLocaleString() }}</span>
                        <span v-else>-</span>
                    </template>
                    
                    <!-- 詳細ボタン -->
                    <template v-slot:[`item.details`]="{item}">
                        <v-btn
                            small
                            color="primary"
                            @click="viewDetails(item)"
                        >
                            詳細
                        </v-btn>
                    </template>
                </v-data-table>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
export default {
    name: 'AllPlanView',
    computed: {
        planHeaders() {
            return this.$store.state.product.planHeaders;
        },
        planData() {
            return this.$store.state.product.planData;
        },
        User_id: {
          get() {
            return this.$store.state.product.user.User_id
            },
            set(value) {
                this.$store.commit('product/setUserId', value);
            }
        },
    },
    methods: {
        // プラン詳細を表示
        viewDetails(plan) {
            this.$router.push({
                name: 'planDetails',
                params: { planId: plan.Plan_id }
            });
        },
        
        // プラン編集
        editPlan(plan) {
            this.$router.push({
                name: 'editPlan',
                params: { 
                    planId: plan.Plan_id,
                    planData: plan
                }
            });
        },
        
        // プラン削除
        deletePlan(plan) {
            const confirmDelete = confirm(`「${plan.Destination}」の旅行プランを削除してもよろしいですか？`);
            
            if (confirmDelete) {
                this.$store.dispatch('product/deletePlan', plan.Plan_id);
            }
        }
    }
};
</script>