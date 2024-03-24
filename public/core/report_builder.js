var report_tabs="";
var report_tab_contents=""; 
var tab_id=0;
var current_tab=0;

function build_report(report_string) {
    var report = JSON.parse(report_string);
    var report_output = "";

    if (report.hasOwnProperty("novel")) {
        buildTab(buildNovelReport());
    }
    else if (report.viable=="no") {
        if (report.hasOwnProperty("rawMaterialsCost")) {
            buildTab(buildNonViableReport(report.rawMaterialsCost.viable.evaluatedString, report.rawMaterialsCost.viable.explanation));
        }
        else if (report.hasOwnProperty("shippingCost")) {
            buildTab(buildNonViableReport(report.shippingCost.viable.evaluatedString, report.shippingCost.viable.explanation));
        }
        else if (report.hasOwnProperty("laborCost")) {
            buildTab(buildNonViableReport(report.laborCost.viable.evaluatedString, report.laborCost.viable.explanation));
        }
        else if (report.hasOwnProperty("uniqueFeature")) {
            buildTab(buildNonViableReport(report.uniqueFeature.viable.evaluatedString, report.uniqueFeature.viable.explanation));
        }
        else {
            buildTab(buildNonViableReport("Product: "+report.summary.product, report.explanation));
        }

    }
    else {

        buildTab(buildSummary(report.summary,buildScoreBreakdown(report)));
        buildTab(buildGrowthCompetitors(report.expectedGrowth, report.competitors));
        buildTab(buildFeatures(report));
        buildTab(buildCosts(report));
        buildTab(buildRisks(report));

        report_output += "<div class='socials'>"+generateSocials(report.summary.url)+"</div>"+
                "<h1 class='report'>"+sanitize(report.summary.title)+"</h1>"+
                "<div class='clear'></div>";
            
    }

    let dt = new Date(report.created);
    doAffiliateCode();

    return  "<div class='tabbank'>"+this.report_tabs+"<div class='clear'></div></div>"+
            "<div class='tabcontents'>"+this.report_tab_contents+"<div class='clear'></div></div>"+
            "<div class='run'><span style='font-style:italic;'>Report Created: "+dt.getFullYear()+"-"+dt.getMonth()+"-"+dt.getDay()+"</span> [If that was a long time ago, then this report is probably out-of-date]</div>"+
            "<div class='run'>Vet My Idea reports are not advice and may be factually incorrect. Use at your own risk. Please see the <a href='https://vetmyidea.biz/terms'>Terms of Service</a> for further detail</div>";
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

function buildNonViableReport(strategy,explanation) {
    let contents =   
    "<section id='tab"+tab_id+"' style='float:left;width:78vw;'>" +
      "<div class='section'>"+
        "<h2>Potentially Non-Viable Idea</h2>"+
        "<p>We found one or more arguments that your stated strategy: '"+strategy+"' is non-viable. These are in the paragraph below this one:</p>"+
        "<p>&quot;"+explanation+"&quot;</p>"+
        "<p><b>Warning</b>: <em>You should independently verify the correctness of these arguments</em></p>"+
        "<p>Potentially non-viable ideas are not scored because if they are non-viable they would automatically receive a score of zero</p>"+
      "</div>"+
      "</section>"; 

    let nonviable_result={
        name: "Summary",
        contents: contents,
        id: tab_id,
        width: "150px"
    };

    tab_id++;

    return nonviable_result;
}

function buildNovelReport() {
    let contents =   
    "<section id='tab"+tab_id+"' style='float:left;width:78vw;'>" +
      "<div class='section'>"+
        "<h2>Potentially Novel Idea / No Competition</h2>"+
        "<p>Our tool did not find any potential competitors for this product or service. It could be that the product/service does not exist in the location you specified, or that this is a novel idea. "+
        "This might be a good thing, as being first to market with a novel product or service that is sought-after could be lucrative. It could also be a bad thing, "+
        "for the reason that the product or service doesn't exist yet (in this location or at all) could be because it is not sought-after (in this location or at all). "+
        "Our tool cannot help you determine which of these statements is more truthy for your idea. Additional research is necessary to determine if this idea is a valid one</p>"+
        "<p>Ideas with this classification do not receive a score because we have insufficient data to process a report</p>"+
      "</div>"+
      "</section>"; 

    let novel_result={
        name: "Summary",
        contents: contents,
        id: tab_id,
        width: "150px"
    };

    tab_id++;

    return novel_result;
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
        "<p>"+sanitize(report.shippingCost.risk.explanation)+"</p>";
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
        contents: "<section id='tab"+tab_id+"' style='display:none;float:left;width:78vw;'><div class='section'><h3>Growth Potential: "+sanitize(growth.growth.toUpperCase()) + " "+scoreStyle(growth.score)+"</h3>"+
            "<p>"+sanitize(growth.explanation)+"</p><p>&nbsp;</p>"+competition+"</div></section>",
        id: tab_id,
        width:"250px"
    };

    tab_id++;

    return growth_result;
}

function buildFeatures(report) {

    let contents = "<section id='tab"+tab_id+"' style='display:none;float:left;width:78vw;'><div class='section'>";

    if (report.uniqueFeature) {
     
        contents+="<h3>Evaluation of Feature Unique To Your Product or Service "+scoreStyle(report.uniqueFeature.score)+"</h3>";
        contents+="<p><b>Feature</b>: "+report.uniqueFeature.evaluatedString+"</p>"
        contents+="<p>"+report.uniqueFeature.benefits+"</p>";
    
    }
    else if (!report.hadUniqueFeature) {
        
        let lackUniqueInfraction=0;
        if (report.competitors>6) {
            lackUniqueInfraction=-15;
        }

        contents+="<h3>No Unique Feature or Cost Cutting Differentiation "+scoreStyle(lackUniqueInfraction)+"</h3>";
        contents+="<p>You didn't indicate a unique feature differentiator or any cost-cutting differentiation. "+
        "While this doesn't make an idea non-viable, in a saturated market, it will be hard to win customers without a draw that the competition can't provide. Therefore, we assess a score penalty if there are a lot of competitors.</p>"+
        "<p>It is possible that your business will differentiate itself in a manner that this tool doesn't evaluate (e.g. marketing), in which case you may be able to ignore this, although it is encouraged for you to consider how you"+
        " could differentiate your idea</p>";
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

    let lackUniqueInfraction=0;
    if (report.competitors>6) {
        lackUniqueInfraction=-15;
    }

    let breakdown="<div style='width:150px;float:left;font-size:1.5em;'><b>Base Score</b>:</div><div style='float:right;font-size:1.5em;'>50</div><div class='clear'></div>";
    if (report.expectedGrowth.score!==0) {
        breakdown+="<div style='width:150px;float:left;font-size:1.5em;margin-top:5px;'>Expected Growth:</div><div style='float:right;font-size:1.5em;margin-top:5px;'>"+scoreStyle(report.expectedGrowth.score)+"</div><div class='clear'></div>";
    }
    if (report.uniqueFeature && report.uniqueFeature.score!==0) {
        breakdown+="<div style='width:150px;float:left;font-size:1.5em;margin-top:5px;'>Unique Feature:</div><div style='float:right;font-size:1.5em;margin-top:5px;'>"+scoreStyle(report.uniqueFeature.score)+"</div><div class='clear'></div>";
    }
    if (lackUniqueInfraction<0) {
        breakdown+="<div style='width:150px;float:left;font-size:1.5em;margin-top:5px;'>Lack of Differentiation:</div><div style='float:right;font-size:1.5em;margin-top:5px;'>"+scoreStyle(lackUniqueInfraction)+"</div><div class='clear'></div>";
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

function generateSocials(url) {
    return  '<script type="IN/Share" data-url="'+url+'"></script>' +
            '<div id="fb-root"></div>'+
            '<div class="fb-share-button"'+ 
            'data-href="'+url+'"'+
            'data-layout="button_count">'+
            '</div>'+
            '<a class="twitter-share-button" href="https://twitter.com/intent/tweet">Tweet</a>'
          
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