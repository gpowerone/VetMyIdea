import Report from '../models/report.js'
import Eml from '../utilities/email.js'
import { spawn } from 'node:child_process'

// Processes
let processes=[];

// Function to query the database and execute another script
async function queryAndExecute() {
  try {
    if (processes.length<7) {
        let reports = await Report.findAll({
          where: {
            IsReady: false,
            Flagged: false,
            IsProcessing: false
          }
        });
        reports.forEach((job)=>{
          if (processes.indexOf(job.ReportID)===-1) {
            job.IsProcessing=true;
            job.save();

            processes.push(job.ReportID);

            let childProcess=spawn('node', ['./jobs/report.js', job.ReportID], {
              stdio: "inherit"
            });
        
            childProcess.on('close', () => {
                processes= processes.filter(e => e !== job.ReportID)
            });
        }
        })
    }
  } catch (error) {
     console.log(error);
     await Eml.failMail('Taskmaster Failed:'+ error);
  }
}

// Run the query and execute function every 30 seconds
setInterval(queryAndExecute, 30000);

console.log("Taskmaster Started");
