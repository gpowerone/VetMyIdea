import ReportUtility from '../utilities/report.js'

// Check if ReportID is provided
if (process.argv.length <= 2) {
    process.exit(1);
}

await ReportUtility.processReport(process.argv[2]);