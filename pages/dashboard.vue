<template>
    <v-container fluid>
        <v-row>
            <v-col>
                <h2>My Reports</h2>
                <p class="mt-5"><NuxtLink to="/">Create New Report</NuxtLink></p>
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
                                        <div v-if="item.IsProcessing">
                                            <b>Processing</b> <span class="tooltip" v-tooltip="'Please allow 1-5 minutes for your report to process.'">?</span> 
                                        </div>
                                        <div v-else>
                                            <b>Queued</b> <span class="tooltip" v-tooltip="'Your report is queued for processing. Under normal load, wait times to start processing are <1 minute'">?</span> 
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div v-if="item.Score!==null">
                                    <div v-if="item.IsViable">
                                        {{ item.Score }}
                                    </div>
                                    <div v-else>
                                        N/A
                                    </div>
                                </div>
                                <div v-else>
                                    N/A
                                </div>
                            </td>
                            <td>
                                {{ new Date(item.createdAt).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"numeric" })  }}
                            </td>
                            <td><v-btn :icon="mdiDelete" density="compact" class="ma-2" @click="doDelete(item.ReportID)" /></td>
                        </tr>
                    </template>
   
                </v-data-table>
                <div class="mt-5" v-else>
                     <spinner :isLoading="loading" />  
                     <div v-if="!loading">You have no reports</div>
                </div>
                <p class="text-center mt-5">
                    Loved it? Hated it? Be sure to let us know by taking our <NuxtLink to="https://forms.gle/k1LcAbWo3CUXzxjP9" target="_blank">survey!</NuxtLink>
                </p>
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
        { title: 'Score', key: 'Score' },
        { title: 'Created', key: 'Created' },
        { title: '', key: 'action', sortable: false },
    ];

  const reports=ref([]);
  const loading=ref(true);

  async function doDelete(reportID) {
    if (window.confirm("Are you sure you wish to delete this report? You will not be able to retrieve it later")) {
        const response = await fetch('/api/report/delete/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reportId: reportID
                })
        });

        if (!response.ok) {
            window.alert("Failed to contact the backend, check your internet connection");
        }
        else {

            const responseData = await response.json();
            if (responseData.success) {
                await fetchTable();
                window.alert("Report successfully deleted");
            }
            else {
                window.alert(responseData.message);
            }
        }
    }
  }

  async function fetchTable() {
     await fetch("/api/report/list/")
        .then(response => response.json())
        .then(data => {
           
            reports.value=data.data;
            loading.value=false;
        })
        .catch(error => console.error('Error fetching reports:', error));
  }

  function getReportURL(item) {
     return "https://reports.vetmyidea.biz/"+generatePublicPageURL(item.ProductType, item.ReportID);
  }

  function  generatePublicPageURL(productType,reportID) {
     return productType.toLowerCase().replace(" ","_")+"_"+reportID+".html";
  }

  onMounted(()=>{

     fetchTable();
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