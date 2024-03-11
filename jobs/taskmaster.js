import Report from '../models/report.js'
import { failMail } from '../utilities/email.js'

// Processes
let processes=[];

// Function to query the database and execute another script
async function queryAndExecute() {
  try {
    if (processes.len()<7) {
        await Report.findAll({
          where: {
            IsReady: false
          }
        }).forEach(job => {

            if (processes.indexOf(job.ReportID)===-1) {
                processes.push(job.ReportID);

                let childProcess=spawn('node', ['./report.js', job.ReportID]);
            
                childProcess.on('close', () => {
                    processes= processes.filter(e => e !== job.ReportID)
                });
            }
        });
    }
  } catch (error) {
     await failMail('Taskmaster Failed:'+ error);
  }
}

// Run the query and execute function every 5 seconds
setInterval(queryAndExecute, 5000);

console.log("Taskmaster Started");
