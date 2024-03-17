<template>
    <v-container fluid>
        <v-row>
            <v-col>
                <h2>My Reports</h2>
                <v-data-table
                    :headers="headers"
                    :items="reports"
                    class="elevation-1 mt-5 report-table"
                    v-if="reports.length>0"
                >
                    <template v-slot:item.action="{ value }">
                        <v-btn :icon="mdiDelete" density="compact" class="ma-2" />
                    </template>     
                </v-data-table>
                <div class="mt-5" v-else>
                     <spinner :isLoading="loading" />  
                     <div v-if="!loading">You have no reports</div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
  import { mdiDelete } from '@mdi/js'

  const headers = [
        { title: 'Report', key: 'ProductType' },
        { title: 'Location', key: 'TargetLocation' },
        { title: 'Status', key: 'Status', value: item=>calculateStatus(item) },
        { title: '', key: 'action', sortable: false },
    ];

  const reports=ref([]);
  const loading=ref(true);

  function calculateStatus(item) {
     if (item.Flagged) {
        return "Flagged";
     }
     else if (item.IsReady) {
        return "Ready";
     }
     return "Pending";
  }

  onMounted(()=>{

      fetch("/api/report/list")
        .then(response => response.json())
        .then(data => {
           
            reports.value=data.data;
            loading.value=false;
            console.log(reports.value);
        })
        .catch(error => console.error('Error fetching reports:', error));
  })
</script>

<style>
    th {
        border-bottom: 1px solid #0c1d36!important;
    }
</style>
<style scoped>
    .report-table {
        background:#EEE;
        border:1px solid #0c1d36;
        border-radius:10px;
    }
</style>