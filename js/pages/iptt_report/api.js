/**
 * API for IPTT report - handles updating IPTT report data when a new program/frequency is selected
 */


export default class ReportAPI {
    constructor(ajaxURL) {
        this.url = ajaxURL;
    }
    
    callForReportData(reportType, programId, frequency) {
        let params = {
            programId: programId,
            frequency: frequency,
            reportType: reportType
        };
        return $.get(this.url, params);
    }

}