var report_tabs="";
var report_tab_contents=""; 
var tab_id=0;
var current_tab=0;

function build_report(report_string) {
    var report = JSON.parse(report_string);

    buildTab(buildSummary(report.summary,buildScoreBreakdown(report)));
    buildTab(buildGrowthCompetitors(report.expectedGrowth, report.competitors));
    buildTab(buildFeatures(report));
    buildTab(buildCosts(report));
    buildTab(buildRisks(report));
    buildTab(questions());
    doAffiliateCode();

    let dt = new Date(report.created);

    return "<h1 class='report'>"+sanitize(report.summary.title)+"</h1>"+
                "<div class='tabbank'>"+this.report_tabs+"<div class='clear'></div></div>"+
                "<div class='tabcontents'>"+this.report_tab_contents+"<div class='clear'></div></div>"+
                "<div class='run'><span style='font-style:italic;'>Report Created "+dt.getFullYear()+"-"+dt.getMonth()+"-"+dt.getDay()+"</span> [If that was a long time ago, then this report is probably out-of-date]</div>";
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

function buildCosts(report) {
    if (report.rawMaterialsCost || report.laborCost || report.shippingCost) {
        let contents =   
            "<section id='tab"+tab_id+"' style='display:none;float:left;width:78vw;'>" +
                "<div class='section'>";
        
        if (report.rawMaterialsCost) {
            contents+="<h3>Reduced Raw Materials Cost "+scoreStyle(report.rawMaterialsCost.score)+"</h3>";
            contents+="<p><b>Plan</b>: "+report.rawMaterialsCost.evaluatedString+"</p>"
            contents+="<p>"+report.rawMaterialsCost.benefits+"</p>";
        }
        if (report.laborCost) {
            contents+="<h3>Reduced Labor Cost "+scoreStyle(report.laborCost.score)+"</h3>";
            contents+="<p><b>Plan</b>: "+report.laborCost.evaluatedString+"</p>"
            contents+="<p>"+report.laborCost.benefits+"</p>";
        }
        if (report.shippingCost) {
            contents+="<h3>Reduced Shipping Cost "+scoreStyle(report.shippingCost.score)+"</h3>";
            contents+="<p><b>Plan</b>: "+report.shippingCost.evaluatedString+"</p>"
            contents+="<p>"+report.shippingCost.benefits+"</p>";
        }

        contents += "</div></section>";

        let cost_result={
            name: "Costs",
            contents: contents,
            id: tab_id,
            width: "100px"
        };
    
        tab_id++;
    
        return cost_result;

    }
    else {
        return null;
    }
}

function buildRisks(report) {
    let contents =   
    "<section id='tab"+tab_id+"' style='display:none;float:left;width:78vw;'>" +
        "<div class='section'><h3>Regulatory Risk: "+sanitize(report.regulatoryRisk.risk.toUpperCase())+" "+scoreStyle(report.regulatoryRisk.score)+"</h3>"+
        "<p>"+sanitize(report.regulatoryRisk.explanation)+"</p>";

    if (report.uniqueFeature && report.uniqueFeature.risk) {
        "<h3>Risk of Feature Unique to Your Product or Service "+scoreStyle(report.uniqueFeature.risk.score)+"</h3>"+
        "<p>"+sanitize(report.uniqueFeature.risk.explanation)+"</p>";
    }

    if (report.rawMaterialsCost && report.rawMaterialsCost.risk) {
        "<h3>Risk of Raw Materials Cost Strategy "+scoreStyle(report.rawMaterialsCost.risk.score)+"</h3>"+
        "<p>"+sanitize(report.rawMaterialsCost.risk.explanation)+"</p>";
    }

    if (report.laborCost && report.laborCost.risk) {
        "<h3>Risk of Labor Cost Strategy "+scoreStyle(report.laborCost.risk.score)+"</h3>"+
        "<p>"+sanitize(report.laborCost.risk.explanation)+"</p>";
    }

    if (report.shippingCost && report.shippingCost.risk) {
        "<h3>Risk of Shipping Cost Strategy "+scoreStyle(report.shippingCost.risk.score)+"</h3>"+
        "<p>"+sanitize(report.shippingost.risk.explanation)+"</p>";
    }

    contents += "</div></section>";

    let risk_result={
        name: "Risks",
        contents: contents,
        id: tab_id,
        width: "100px"
    };

    tab_id++;

    return risk_result;   
}

function buildSummary(summary,scorebreakdown) {


    let bordercolor="#444";
    if (summary.score>64) {
        bordercolor="green";
    }
    if (summary.score>80) {
        summary.bordercolor="darkgreen";
    }
    if (summary.score<36) {
        bordercolor="red";
    }
    if (summary.score<20) {
        bordercolor="#8B0000";
    }

    let contents =   
      "<section id='tab"+tab_id+"' style='float:left;width:78vw;'>" +
        "<div class='section'>"; 

    contents += "<div class='summaryLeft'>";
    contents += "<div class='circle-score' style='border: 3.6rem solid "+bordercolor+";'><div class='values'>"+summary.score+"</div><div class='labels'>"+sanitize(summary.scoremeaning)+"</div></div>";
    contents += "<div class='score-text'>A favorable score does not mean that the evaluated business idea is good or vice-versa, and should not be construed as advice either way. ";
    contents += "There are many factors that influence whether or not a business will be successful, of which only some are measured by this tool</div>"
    contents += "</div><div class='summaryRight'><h3 style='text-align:center;margin-top:100px;'>Score Breakdown</h3><div style='width:550px;margin:0 auto;margin-top:25px;'>"+scorebreakdown+"</div>";
    contents += scoreMatrix()+"</div><div class='clear'></div>";
    contents += "</div></section>";

    let summary_result={
        name: "Score",
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
        contents: "<section id='tab"+tab_id+"' style='display:none;float:left;width:78vw;'><div class='section'><h3>Expected Growth: "+sanitize(growth.growth.toUpperCase()) + " "+scoreStyle(growth.score)+"</h3>"+
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
        contents+="<h3>Evaluation of Feature Unique To Your Product or Service "+scoreStyle(report.uniqueFeature.score)+"</h3>";
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

function buildScoreBreakdown(report) {
    let breakdown="<div style='width:150px;float:left;font-size:1.5em;'><b>Base Score</b>:</div><div style='float:right;font-size:1.5em;'>50</div><div class='clear'></div>";
    if (report.expectedGrowth.score!==0) {
        breakdown+="<div style='width:150px;float:left;font-size:1.5em;margin-top:5px;'>Expected Growth:</div><div style='float:right;font-size:1.5em;margin-top:5px;'>"+scoreStyle(report.expectedGrowth.score)+"</div><div class='clear'></div>";
    }
    if (report.uniqueFeature && report.uniqueFeature.score!==0) {
        breakdown+="<div style='width:150px;float:left;font-size:1.5em;margin-top:5px;'>Unique Feature:</div><div style='float:right;font-size:1.5em;margin-top:5px;'>"+scoreStyle(report.uniqueFeature.score)+"</div><div class='clear'></div>";
    }
    if (report.rawMaterialsCost && report.rawMaterialsCost.score!==0) {
        breakdown+="<div style='width:150px;float:left;font-size:1.5em;margin-top:5px;'>Raw Material Cost:</div><div style='float:right;font-size:1.5em;margin-top:5px;'>"+scoreStyle(report.rawMaterialsCost.score)+"</div><div class='clear'></div>";
    }
    if (report.laborCost && report.laborCost.score!==0) {
        breakdown+="<div style='width:150px;float:left;font-size:1.5em;margin-top:5px;'>Labor Cost:</div><div style='float:right;font-size:1.5em;margin-top:5px;'>"+scoreStyle(report.laborCost.score)+"</div><div class='clear'></div>";
    }
    if (report.shippingCost && report.shippingCost.score!==0) {
        breakdown+="<div style='width:150px;float:left;font-size:1.5em;margin-top:5px;'>Shipping Cost:</div><div style='float:right;font-size:1.5em;margin-top:5px;'>"+scoreStyle(report.shippingCost.score)+"</div><div class='clear'></div>";
    }
    if (report.regulatoryRisk.score!==0) {
        breakdown+="<div style='width:150px;float:left;font-size:1.5em;margin-top:5px;'>Regulatory Risk:</div><div style='float:right;font-size:1.5em;margin-top:5px;'>"+scoreStyle(report.regulatoryRisk.score)+"</div><div class='clear'></div>";
    }
    if (report.uniqueFeature && report.uniqueFeature.risk && report.uniqueFeature.risk.score!==0) {
        breakdown+="<div style='width:150px;float:left;font-size:1.5em;margin-top:5px;'>Unique Feature Risk:</div><div style='float:right;font-size:1.5em;margin-top:5px;'>"+scoreStyle(report.uniqueFeature.risk.score)+"</div><div class='clear'></div>";
    }
    if (report.rawMaterialsCost && report.rawMaterialsCost.risk && report.rawMaterialsCost.risk.score!==0) {
        breakdown+="<div style='width:150px;float:left;font-size:1.5em;margin-top:5px;'>Raw Materials Cost Risk:</div><div style='float:right;font-size:1.5em;margin-top:5px;'>"+scoreStyle(report.rawMaterialsCost.risk.score)+"</div><div class='clear'></div>";
    }
    if (report.laborCost && report.laborCost.risk && report.laborCost.risk.score!==0) {
        breakdown+="<div style='width:150px;float:left;font-size:1.5em;margin-top:5px;'>Labor Cost Risk:</div><div style='float:right;font-size:1.5em;margin-top:5px;'>"+scoreStyle(report.laborCost.risk.score)+"</div><div class='clear'></div>";
    }
    if (report.shippingCost && report.shippingCost.risk && report.shippingCost.risk.score!==0) {
        breakdown+="<div style='width:150px;float:left;font-size:1.5em;margin-top:5px;'>Shipping Cost Risk:</div><div style='float:right;font-size:1.5em;margin-top:5px;'>"+scoreStyle(report.shippingCost.risk.score)+"</div><div class='clear'></div>";
    }
    breakdown += "<hr />";
    breakdown+="<div style='width:150px;float:left;font-size:1.5em;'>Total Score:</div><div style='float:right;font-size:1.5em;'><b>"+report.summary.score+"</b></div><div class='clear'></div>";

    return breakdown;
}

function doAffiliateCode() {
    this.report_tab_contents+= "<section id='tab"+tab_id+"' style='float:right;text-center;width:19vw;'><div style='text-align:center;margin-top:25px;'>Links To Our Affiliates</div><br /></section>";
}

function questions() {

    let contents="<section id='tab"+tab_id+"' style='display:none;float:left;width:78vw;'><div class='section'><h3>Additional Questions to Consider Before Starting a Business</h3>";

    contents+="<ol>"+
        "<li><strong>What is my business model?</strong><br />Understanding how your business will generate revenue is key to sustainable operations</li>"+
        "<li style='margin-top:10px;'><strong>How will I finance my startup costs?</strong><br />Securing adequate funding is critical to cover initial costs and maintain operations until the business becomes profitable.</li>"+
        "<li style='margin-top:10px;'><strong>What is my marketing and sales strategy?</strong><br />A solid marketing strategy will enable you to attract and retain customers"+
        "<li style='margin-top:10px;'><strong>What team do I need to be successful?</strong><br />Determining the roles and skills needed can help you build a team that complements your strengths and weaknesses</li>"+
        "<li style='margin-top:10px;'><strong>How will I measure success?</strong><br />Setting clear, measurable goals helps you track progress and make informed decisions.</li>"+
        "<li style='margin-top:10px;'><strong>What is my exit strategy?</strong><br />Understanding your long-term goals for the business can influence many decisions you make early on.</li>"+
        "</ol></div></section>";

    let question_results= {
        name: "Questions",
        contents: contents,
        id: tab_id,
        width:"150px"
    };

    tab_id++;

    return question_results;
}

function sanitize(content) {
    if (typeof(content)==="string") {
        return content.replace(/[^A-Za-z0-9\.,'\s]/g,"");
    }
    return content;
}

function scoreMatrix() {
     return "<h3 style='text-align:center;margin-top:75px;'>Score Matrix</h3>"+
            "<div><table border='1' style='width:550px;font-size:1.5em;text-align:center;margin-left:auto;margin-right:auto;'>"+
                "<tr>"+
                    "<td style='color:darkgreen'>Highly Favorable</td><td>81-100</td>"+
                "</tr>"+
                "<tr>"+
                    "<td style='color:green;'>Favorable</td><td>65-80</td>"+
                "</tr>"+
                "<tr>"+
                    "<td style='color:#444;'>Fair</td><td>36-64</td>"+
                "</tr>"+
                "<tr>"+
                    "<td style='color:red;'>Unfavorable</td><td>20-35</td>"+
                "</tr>"+
                "<tr>"+
                    "<td style='color:#8B0000;'>Highly Unfavorable</td><td>0-19</td>"+
                "</tr>"+
            "</table></div>";
}

function scoreStyle(score) {
    if (typeof(score)==="number") {
        if (score>0) {
            return "(<span style='color:green'>+"+String(score)+"</span>)";
        }
        else if (score<0) {
            return "(<span style='color:red'>-"+String(score)+"</span>)";
        }
        else {
            return "";
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