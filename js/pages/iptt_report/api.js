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
    
    callForIndicatorData(reportType, programId, frequency, indicatorId) {
        let params = {
            programId: programId,
            reportType: reportType,
            frequency: frequency,
            indicatorId: indicatorId,
            updateIndicator: '1'
        }
        return $.get(this.url, params);
    }

}