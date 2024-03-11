var report_tabs="";
var report_tab_contents=""; 
var tab_id=0;
var current_tab=0;

function build_report(report_string) {
    var report = JSON.parse(report_string);

    buildTab(buildSummary(report.summary));
    buildTab(buildGrowthCompetitors(report.expectedGrowth, report.competitors));
    buildTab(buildFeatures(report));
    buildTab(buildCosts(report));
    buildTab(buildRisks(report));
    doAffiliateCode();

    return "<h1>"+sanitize(report.summary.title)+"</h1>"+
                "<div class='tabbank'>"+this.report_tabs+"<div class='clear'></div></div>"+
                "<div class='tabcontents'>"+this.report_tab_contents+"<div class='clear'></div></div>";
}

function buildTab(tab_input) {
    if (tab_input!==null) {
        let selected="";
        if (tab_input.id===0) {
            selected=" selected";
        }

        this.report_tabs+="<button class='tab"+selected+"' id='tabheader"+tab_input.id+"' style='width:"+tab_input.width+"' onclick='selectTab(\""+tab_input.id+"\")'>"+tab_input.name+"</button>";
        this.report_tab_contents+=tab_input.contents;
    }
}

function buildCosts(tab_input) {
    if (report.rawMaterialsCost || report.laborCost || report.shippingCost) {

    }
    else {
        return null;
    }
}

function buildRisks(tab_input) {
    return null;
}

function buildSummary(summary) {

    let contents =   
      "<section id='tab"+tab_id+"' style='float:left;width:78vw;'>" +
        "<div class='section'><div class='summaryLeft'>"+
            "<h3>Details</h3>";


    contents += "</div><div class='summaryRight'>";
    contents += "<h3>Score</h3>";
    contents += "<div class='circle-score'><div class='values'>"+summary.score+"</div><div class='labels'>"+sanitize(summary.scoremeaning)+"</div></div>";
    contents += "<div class='score-text'>This score reflects our opinion on the results. A favorable score does not mean that the evaluated business idea is good or vice-versa, and should not be construed as advice either way. ";
    contents += "There are many factors that influence whether or not a business will be successful, of which only some are measured by this tool. Consider also that the tool output or our assessment could be wrong.</div>"
    contents += "</div><div class='clear'></div>";
    contents += "</div></section>";

    let summary_result={
        name: "Summary",
        contents: contents,
        id: tab_id,
        width: "150px"
    };

    tab_id++;

    return summary_result;
}

function buildGrowthCompetitors(growth, competitors) {

    let competition = "<h3>Potential Competitors</h3><p><em>This list may be incomplete!</em></p><p>";

    for (n=0; n<competitors.length; n++) {
        competition+=(n+1)+". "+sanitize(competitors[n])+"<br />";
    }

    competition+="</p>";

    let growth_result={
        name: "Growth and Competition",
        contents: "<section id='tab"+tab_id+"' style='display:none;float:left;width:78vw;'><div class='section'><h3>Expected Growth: "+sanitize(growth.growth.toUpperCase()) + " ("+scoreStyle(growth.score)+")</h3>"+
            "<p>"+sanitize(growth.explanation)+"</p><p>&nbsp;</p>"+competition+"</div></section>",
        id: tab_id,
        width:"250px"
    };

    tab_id++;

    return growth_result;
}

function buildFeatures(report) {

    let contents = "<section id='tab"+tab_id+"' style='display:none;float:left;width:78vw;'><div class='section'><h3>Features</h3><p>These are some features customers typically want in this product or service</p><p><em>This list may be incomplete!</em></p><p>";

    for (n=0; n<report.features.length; n++) {
        contents+=(n+1)+". "+sanitize(report.features[n])+"<br />";
    }

    contents+="</p>";
    
    if (report.uniqueFeature) {
        contents+="<h3>Evaluation of Feature Unique To Your Product or Service ("+scoreStyle(report.uniqueFeature.score)+")</h3>";
        contents+="<p><b>Feature</b>: "+report.uniqueFeature.evaluatedString+"</p>"
        contents+="<p>"+report.uniqueFeature.benefits+"</p>";
    }

    contents +="</div></section>";

    let features_result={
        name: "Features",
        contents: contents,
        id: tab_id,
        width:"150px"
    };

    tab_id++;

    return features_result;
}

function doAffiliateCode() {
    this.report_tab_contents+= "<section id='tab"+tab_id+"' style='float:right;text-center;width:19vw;'><div style='text-align:center;margin-top:25px;'>Links To Our Affiliates</div><br /></section>";
}

function sanitize(content) {
    if (typeof(content)==="string") {
        return content.replace(/[^A-Za-z0-9\.,'\s]/g,"");
    }
    return content;
}

function scoreStyle(score) {
    if (typeof(score)==="number") {
        if (score>0) {
            return "<span style='color:green'>+"+String(score)+"</span>";
        }
        else if (score<0) {
            return "<span style='color:red'>-"+String(score)+"</span>";
        }
        else {
            return String(score);
        }
    }
}

function selectTab(id) {
    let curr_tab_header = document.getElementById("tabheader"+current_tab);
    let new_tab_header = document.getElementById("tabheader"+id);
    curr_tab_header.classList.remove("selected");
    new_tab_header.classList.add("selected");
    let curr_tab = document.getElementById("tab"+current_tab);
    let new_tab = document.getElementById("tab"+id);
    curr_tab.style="display:none;float:left;width:78vw;";
    new_tab.style="display:block;float:left;width:78vw;";
    current_tab=id;

}