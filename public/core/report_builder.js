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
        buildTab(buildGrowthCompetitors(report.expectedGrowth, report.competitors));
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
            name: "Labor Cost",
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
            name: "Shipping Cost",
            contents: contents,
            id: tab_id,
            width: "200px"
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
            name: "Raw Materials Cost",
            contents: contents,
            id: tab_id,
            width: "250px"
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
        width: "200px"
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

    contents += "<div class='summaryLeft'>";

    contents += "<h3 class='productTitle' style='margin-top:4.5rem;'>Product/Service &amp; Targeted Location</h3><p><em>"+this.sanitize(report.summary.title)+"</em></p>";

    if (report.uniqueFeature) {
     
        contents+="<h3 class='uniqueFeatureHeader' style='margin-top:50px;'>Unique Feature "+scoreStyle(report.uniqueFeature.score)+"</h3>";
        contents+="<p><em>"+report.uniqueFeature.evaluatedString+"</em></p>"
        contents+="<p>"+report.uniqueFeature.benefits+"</p>";
    
    }
    else if (!report.hadUniqueFeature) {
        
        let lackUniqueInfraction=0;
        if (report.competitors>6) {
            lackUniqueInfraction=-15;
        }

        contents+="<h3>No Differentiation "+scoreStyle(lackUniqueInfraction)+"</h3>";
        contents+="<p>You didn't indicate any differentiation. "+
        "While this doesn't make an idea non-viable, in a saturated market, it will be hard to win customers without a draw that the competition can't provide. Therefore, we assess a score penalty if there are a lot of competitors.</p>"+
        "<p>It is possible that your business will differentiate itself in a manner that this tool doesn't evaluate (e.g. marketing), in which case you may be able to ignore this, although we encourage you to consider how you"+
        " could differentiate your idea</p>";
    }

    contents += "</div>"
    contents += "<div class='summaryRight'>";
    contents += "<h3 class='scoreHeader' style='margin-top:4.5rem;'>Score</h3><div class='circle-score' style='border: 3.6rem solid "+bordercolor+";'><div class='values'>"+report.summary.score+"</div><div class='labels'>"+sanitize(report.summary.scoremeaning)+"</div></div>";
    contents += "<div class='score-text'>A favorable score does not mean that the evaluated business idea is good or vice-versa, and should not be construed as advice either way. ";
    contents += "There are many factors that influence whether or not a business will be successful, of which only some are measured by this tool</div>"
    contents += "</div>";
    contents += "<div class='clear'></div>";
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
        contents: "<section id='tab"+tab_id+"' style='display:none;float:left;width:78vw;'><div class='section'><h3>Growth Potential: "+sanitize(growth.growth.toUpperCase()) + " "+scoreStyle(growth.score)+"</h3>"+
            "<p>"+sanitize(growth.explanation)+"</p><p>&nbsp;</p>"+competition+"</div></section>",
        id: tab_id,
        width:"250px"
    };

    tab_id++;

    return growth_result;
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