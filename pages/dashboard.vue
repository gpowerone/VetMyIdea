<template>
    <v-container fluid>
        <v-row>
            <v-col>
                <div v-if="$store.state.isLoggedIn">
                    <h2 class="ml-2 mt-5">My Reports</h2>
                    <p class="mt-2 mr-5 text-right"><b><NuxtLink to="/" class="greenlink"><v-icon :icon="mdiPlusCircle" />New Report</NuxtLink></b></p>
                    <v-data-table
                        :headers="headers"
                        :items="reports"
                        class="elevation-1 mt-5 report-table"
                        v-if="reports && reports.length>0"
                    >
                         <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                            <tr class="tblheader">
                                <template v-for="column in columns" :key="column.key">
                                <td>
                                    <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.title }}</span>
                                    <template v-if="isSorted(column)">
                                    <v-icon :icon="getSortIcon(column)"></v-icon>
                                    </template>
                                    <v-icon v-if="column.removable" icon="$close" @click="() => remove(column.key)"></v-icon>
                                </td>
                                </template>
                            </tr>
                        </template>

                        <template v-slot:item="{ item }">
                            <tr>
                                <td class="text-right">
                                    <v-btn :icon="mdiPencil" density="compact" class="ma-2" v-if="item.IsReady||item.Flagged" @click="doEdit(item.ReportID)" />                                
                                </td>
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
                                        <b>Flagged</b> <span class="tooltip" v-tooltip="{triggers: ['click'], content:'This report has been flagged for a content violation. Content must comply with the Open AI Content Policy. Edit and re-run the report.'}">?</span> 
                                    </div>
                                    <div v-else>
                                        <div v-if="item.IsReady">
                                            <b>Ready</b>
                                        </div>
                                        <div v-else>
                                            <div v-if="item.IsProcessing">
                                                <b>Processing</b> <span class="tooltip" v-tooltip="{triggers: ['click'], content:'Please allow 1-5 minutes for your report to process.'}">?</span> 
                                            </div>
                                            <div v-else-if="item.IsDelayed">
                                                <b>Delayed</b> <span class="tooltip" v-tooltip="{triggers: ['click'], content:'Due to there being zero reports available, this report will process the next time a report becomes available'}">?</span> 
                                            </div>
                                            <div v-else>
                                                <b>Queued</b> <span class="tooltip" v-tooltip="{triggers: ['click'], content:'Your report is queued for processing. Under normal load, wait times to start processing are <1 minute'}">?</span> 
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {{ new Date(item.updatedAt).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"numeric" })  }}
                                </td>
                                <td>
                                      <v-btn :icon="mdiDelete" density="compact" class="ma-2" v-if="item.IsReady||item.Flagged" @click="doDelete(item.ReportID)" />
                                </td>
                            </tr>
                        </template>
    
                    </v-data-table>
                    <div class="mt-5" v-else>
                        <spinner :isLoading="loading" />  
                        <div v-if="!loading" class="ml-2">You have no reports</div>
                    </div>
                    <p class="text-center mt-5">
                        You may create reports above the 3/day a limit. They will remain in "Delayed" status until additional reports become available
                    </p>
                    <p class="text-center mt-5">
                        Loved it? Hated it? Be sure to let us know by taking our <NuxtLink to="https://forms.gle/k1LcAbWo3CUXzxjP9" target="_blank">survey!</NuxtLink>
                    </p>
                </div>
                <div v-else>
                    <login v-on:loggedIn="loggedIn" :loadBack="false" />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
  import login from '../components/login.vue'
  import { mdiDelete, mdiPencil, mdiPlusCircle } from '@mdi/js'
  import { useStore } from 'vuex'

  const store = useStore();

  const headers = [
        { title: '', key: 'action1', sortable: false },
        { title: 'Report', key: 'ProductType' },
        { title: 'Location', key: 'TargetLocation' },
        { title: 'Status', key: 'Status' },
        { title: 'Updated', key: 'Updated' },
         { title: '', key: 'action2', sortable: false },
       
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
            store.state.errorText="Failed to contact the backend, check your internet connection";
        }
        else {

            const responseData = await response.json();
            if (responseData.success) {
                await fetchTable();
                store.state.successText="Report successfully deleted";
            }
            else {
                store.state.errorText=responseData.message;
            }
        }
    }
  }

  function doEdit(reportID) {
      navigateTo("/edit?ReportID="+reportID);
  }

  function doPoll(reportID) {
    try {
        fetch("/api/report/poll/",  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reportId: reportID
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                store.state.successText="Report has finished processing";
                
                // Get report count
                fetch("/api/user/get", {
                        method: "GET",
                })
                .then(async (response)=>await response.json())
                .then(async (response)=>{
                        if (response.success) {
                            store.state.remaining = response.message;
                        }
            
                });
                
                fetchTable();
            }
            else {
                setTimeout(function() {
                    doPoll(reportID)
                },30000);
            }
        })
    }
    catch(e) {

    }
  }

  async function fetchTable() {

     await fetch("/api/report/list/")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
            reports.value=data.data;
                loading.value=false;
                for (var report of data.data.filter(p=>p.IsReady===false)) {
                    setTimeout(function() {
                        doPoll(report.ReportID)
                    },30000);
                }
            }
        })
        .catch(error => console.error('Error fetching reports:', error));

  }

  function getReportURL(item) {
     return "https://reports.vetmyidea.biz/"+generatePublicPageURL(item.ProductType, item.ReportID);
  }

  function generatePublicPageURL(productType,reportID) {
     return productType.toLowerCase().replace(/\s/g,"_")+"_"+reportID+".html";
  }

  function loggedIn() {
     fetchTable();

    fetch("/api/user/get", {
            method: "GET",
    })
    .then(async (response)=>await response.json())
    .then(async (response)=>{
            if (response.success) {
                store.state.remaining = response.message;
            }

    });
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
        background:#FFF;
        border:1px solid #0c1d36;
        border-radius:10px;
    }
</style>