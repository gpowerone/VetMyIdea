var report_tabs="";
var report_tab_contents=""; 
var tab_id=0;
var current_tab=0;

function build_report(report_string) {
    var report = JSON.parse(report_string);

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

        buildTab(buildSummary(report));
        buildTab(buildBreakdown(report));
        buildTab(buildGrowthCompetitors(report.expectedGrowth, report.competitors));
        buildTab(buildUniqueFeature(report));
        buildTab(buildRawMaterialsCosts(report));
        buildTab(buildLaborCosts(report));
        buildTab(buildShippingCosts(report));
        buildTab(buildRisks(report));

    }

    let dt = new Date(report.created);
    doAffiliateCode();

    return  "<div class='tabbank'>"+this.report_tabs+"<div class='socials'>"+generateSocials(report.summary.url)+"</div><div class='clear'></div></div>"+
            "<div class='tabcontents'>"+this.report_tab_contents+"<div class='clear'></div></div>"+
            "<div class='run'><span style='font-style:italic;'>Report Created: "+dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate()+"</span> [Reports are time-sensitive!]</div>"+
            "<div class='run'>Vet My Idea reports are not advice and may be factually incorrect. Use at your own risk. By using this report, you agree to our <a href='https://vetmyidea.biz/terms'>Terms of Service</a> and <a href='https://vetmyidez.biz/privacy'>Privacy Policy</a></div>";
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

function buildBreakdown(report) {
    let breakdown =   
    "<section id='tab"+tab_id+"' style='display:none;float:left;width:78vw;'>" +
        "<div class='section'>"+
          "<h3>Score Breakdown</h3>";



    breakdown+="<p><b>Base Score:</b> 50</p><p>Each report starts at 50 and can go up to 100 or as low as 0</p>";

    if (!report.summary.hadUniqueFeature && report.competitors.length>3) {
        
        breakdown+="<p style='margin-top:25px;'><b>Insufficient/Ineffective Differentiation:</b> "+scoreStyle(-30)+"</p>";
        breakdown+="<p>We detected more than a few competitors in this market. Without effective differentiation from them, it will be more difficult to compete. Keep in mind that it is "+ 
        "possible to differentiate in some way that this tool doesn't measure (e.g. marketing).</p><p>You can score higher by picking a differentiator (or a different one) and re-running the report.</p>";

    }

    if (report.expectedGrowth.score!==0) {
        breakdown+="<p style='margin-top:25px;'><b>Potential Growth:</b> "+scoreStyle(report.expectedGrowth.score)+"</p>";
    }
    if (report.uniqueFeature && report.uniqueFeature.score!==0) {
        breakdown+="<p style='margin-top:25px;'><b>Unique Feature:</b> "+scoreStyle(report.uniqueFeature.score)+"</p>";
    }
    if (report.rawMaterialsCost && report.rawMaterialsCost.score!==0) {
        breakdown+="<p style='margin-top:25px;'><b>Raw Materials Cost:</b> "+scoreStyle(report.rawMaterialsCost.score)+"</p>";
    }
    if (report.laborCost && report.laborCost.score!==0) {
        breakdown+="<p style='margin-top:25px;'><b>Labor Cost:</b> "+scoreStyle(report.laborCost.score)+"</p>";
    }
    if (report.shippingCost && report.shippingCost.score!==0) {
        breakdown+="<p style='margin-top:25px;'><b>Shipping Cost:</b> "+scoreStyle(report.shippingCost.score)+"</p>";
    }
    if (report.regulatoryRisk.score!==0) {
        breakdown+="<p style='margin-top:25px;'><b>Regulatory Risk:</b> "+scoreStyle(report.regulatoryRisk.score)+"</p>";
    }
   
    breakdown += "<hr />";
    breakdown+="<p><b>Total Score:</b> "+report.summary.score+"</p>";


    breakdown += "</div></section>";

    let breakdown_result={
        name: "Breakdown",
        contents: breakdown,
        id: tab_id,
        width: "125px"
    };

    tab_id++;

    return breakdown_result;

}

function buildLaborCosts(report) {
    if (report.laborCost) {
        let contents =   
            "<section id='tab"+tab_id+"' style='display:none;float:left;width:78vw;'>" +
                "<div class='section'>";
        
        if (report.laborCost) {
            contents+="<h3>Reduced Labor Cost "+scoreStyle(report.laborCost.score)+"</h3>";
            contents+="<p><b>Plan</b>: "+report.laborCost.evaluatedString+"</p>"
            contents+="<p>"+report.laborCost.benefits+"</p>";
        }

        contents += "</div></section>";

        let cost_result={
            name: "Labor",
            contents: contents,
            id: tab_id,
            width: "75px"
        };
    
        tab_id++;
    
        return cost_result;

    }
    else {
        return null;
    }
}

function buildShippingCosts(report) {
    if (report.shippingCost) {
        let contents =   
            "<section id='tab"+tab_id+"' style='display:none;float:left;width:78vw;'>" +
                "<div class='section'>";
        
        if (report.shippingCost) {
            contents+="<h3>Reduced Shipping Cost "+scoreStyle(report.shippingCost.score)+"</h3>";
            contents+="<p><b>Plan</b>: "+report.shippingCost.evaluatedString+"</p>"
            contents+="<p>"+report.shippingCost.benefits+"</p>";
        }

        contents += "</div></section>";

        let cost_result={
            name: "Shipping",
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

function buildRawMaterialsCosts(report) {
    if (report.rawMaterialsCost) {
        let contents =   
            "<section id='tab"+tab_id+"' style='display:none;float:left;width:78vw;'>" +
                "<div class='section'>";
        
        if (report.rawMaterialsCost) {
            contents+="<h3>Reduced Raw Materials Cost "+scoreStyle(report.rawMaterialsCost.score)+"</h3>";
            contents+="<p><b>Plan</b>: "+report.rawMaterialsCost.evaluatedString+"</p>"
            contents+="<p>"+report.rawMaterialsCost.benefits+"</p>";
        }

        contents += "</div></section>";

        let cost_result={
            name: "Raw Materials",
            contents: contents,
            id: tab_id,
            width: "125px"
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

    contents += "</div></section>";

    let risk_result={
        name: "Regulatory Risk",
        contents: contents,
        id: tab_id,
        width: "150px"
    };

    tab_id++;

    return risk_result;   
}

function buildSummary(report) {

    let bordercolor="#444";
    if (report.summary.score>64) {
        bordercolor="green";
    }
    if (report.summary.score>80) {
        bordercolor="darkgreen";
    }
    if (report.summary.score<36) {
        bordercolor="red";
    }
    if (report.summary.score<20) {
        bordercolor="#8B0000";
    }

    let contents =   
      "<section id='tab"+tab_id+"' style='float:left;width:78vw;'>" +
        "<div class='section'>"; 

    contents += "<div class='summaryRight'>";
    contents += "<h3 class='scoreHeader summaryHeader' style='margin-top:1.5rem;'>VetMyIdea Score</h3><div class='circle-score' style='border: 3.6rem solid "+bordercolor+";'><div class='values'>"+report.summary.score+"</div><div class='labels'>"+sanitize(report.summary.scoremeaning)+"</div></div>";
    contents += "<p><a href='#' onclick='selectTab(1)'>Detailed Score Breakdown</a></p>";
    contents += "</div>";

    contents += "<div class='summaryLeft'>";

    contents += "<h3 class='productTitle summaryHeader' style='margin-top:1.5rem;'>Product/Service &amp; Targeted Location</h3><p><em>"+this.sanitize(report.summary.title)+"</em></p>";
    
    contents += "<h3 style='margin-top:4.5rem;' class='summaryHeader'>How To Use This Report</h3>"+
        "<p><b>Understanding the Score</b><br />Click on the <a href='#' onclick='selectTab(1)'>score breakdown tab</a> to get further details about how the score was calculated and what it means</p>"+
        "<p><b>Detailed Analysis</b><br />Click each tab at the top of the report (desktop) or scroll down (mobile) to get detailed input on different aspects of your idea</p>"+
        "<p><b>Re-running the Report</b><br />If you'd like to change your answers, you can re-run this report by clicking the Edit (pencil) button on the My Reports dashboard. [Note: you cannot change the product/service or the location - you'll need to run a new report]</p>"+
        "<p><b>Additional Research</b><br />You may wish to do further research on your idea. Our partners can assist you with this.</p>"+
        "<p><b>Moving Forward</b><br />Should you decide to move forward, our partners can help you get your business off the ground.</p>"

    contents += "</div>"

    contents += "<div class='clear'></div>";
    contents += "</div></section>";

    let summary_result={
        name: "Summary",
        contents: contents,
        id: tab_id,
        width: "100px"
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
        name: "Growth",
        contents: "<section id='tab"+tab_id+"' style='display:none;float:left;width:78vw;'><div class='section'><h3>Growth Potential: "+sanitize(growth.growth.toUpperCase()) + " "+scoreStyle(growth.score)+"</h3>"+
            "<p>"+sanitize(growth.explanation)+"</p><p>&nbsp;</p>"+competition+"</div></section>",
        id: tab_id,
        width:"75px"
    };

    tab_id++;

    return growth_result;
}

function buildUniqueFeature(report) {
    if (report.uniqueFeature) {
        let contents =   
            "<section id='tab"+tab_id+"' style='display:none;float:left;width:78vw;'>" +
                "<div class='section'>";
        
        if (report.laborCost) {
            contents+="<h3>Unique Feature "+scoreStyle(report.uniqueFeature.score)+"</h3>";
            contents+="<p><b>Plan</b>: "+report.uniqueFeature.evaluatedString+"</p>"
            contents+="<p>"+report.uniqueFeature.benefits+"</p>";
        }

        contents += "</div></section>";

        let cost_result={
            name: "Unique Feature",
            contents: contents,
            id: tab_id,
            width: "150px"
        };
    
        tab_id++;
    
        return cost_result;

    }
    else {
        return null;
    }
}

function doAffiliateCode() {
    this.report_tab_contents+= "<section id='tab"+tab_id+"' style='float:right;text-center;width:19vw;'><div style='text-align:center;margin-top:25px;'>Links To Our Partners</div><br /></section>";
}

function generateSocials(url) {
    return  '<!--<script type="IN/Share" data-url="'+url+'"></script>//-->' +
            '<div id="fb-root"></div>'+
            '<div class="fb-share-button"'+ 
            'data-href="'+url+'"'+
            'data-layout="button_count">'+
            '</div>'+
            '<a class="twitter-share-button" href="https://twitter.com/intent/tweet">Tweet</a>'
          
}

function sanitize(content) {
    if (typeof(content)==="string") {
        return content.replace(/[^A-Za-z0-9\.&,;'\s]/g,"");
    }
    return content;
}

function scoreStyle(score) {
    if (typeof(score)==="number") {
        if (score>0) {
            return "(<span style='color:green'>+"+String(score)+"</span>)";
        }
        else if (score<0) {
            return "(<span style='color:red'>"+String(score)+"</span>)";
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