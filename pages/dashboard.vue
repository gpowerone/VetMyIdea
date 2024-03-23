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
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>
                                <b v-if="item.IsReady">
                                    <NuxtLink :to="getReportURL(item)" target="_blank" >{{ item.ProductType }}</NuxtLink>
                                </b>
                                <b v-else>
                                    {{ item.ProductType }}
                                </b>
                            </td>
                            <td>{{ item.TargetLocation }}</td>
                            <td>
                                <div v-if="item.Flagged" >
                                    <b>Flagged</b> <span class="tooltip" v-tooltip="'This report has been flagged for a content violation. Content must comply with the Open AI Content Policy. Edit and re-run the report.'">?</span> 
                                </div>
                                <div v-else>
                                    <div v-if="item.IsReady">
                                        <b>Ready</b>
                                    </div>
                                    <div v-else>
                                        <b>Processing</b> <span class="tooltip" v-tooltip="'Please allow 1-5 minutes for your report to process.'">?</span> 
                                    </div>
                                </div>
                            </td>
                            <td><v-btn :icon="mdiDelete" density="compact" class="ma-2" /></td>
                        </tr>
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
        { title: 'Status', key: 'Status' },
        { title: '', key: 'action', sortable: false },
    ];

  const reports=ref([]);
  const loading=ref(true);


  function getReportURL(item) {
     return "https://reports.vetmyidea.biz/"+generatePublicPageURL(item.ProductType, item.ReportID);
  }

  function  generatePublicPageURL(productType,reportID) {
     return productType.toLowerCase().replace(" ","_")+"_"+reportID+".html";
  }

  onMounted(()=>{

      fetch("/api/report/list")
        .then(response => response.json())
        .then(data => {
           
            reports.value=data.data;
            loading.value=false;
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