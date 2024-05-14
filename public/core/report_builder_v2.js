var report_tabs="";
var report_tab_contents=""; 
var tab_id=0;
var current_tab=0;


function build_report(report_string) {
    var report = "";
    
    try {
        report =JSON.parse(report_string);
    }
    catch(e) {

        let li = report_string.lastIndexOf("&apos;");
        report_string = report_string.substring(0, li) + '"' + report_string.substring(li + 6);
    
        report = JSON.parse(report_string);
        
    }

    if (report.competitors.length===0 && !report.isFranchise && !report.isPlatform) {
        buildTab(buildNovelReport());
    }
    else {

        buildTab(buildGenericTab("Summary",calculateSummary(report),"150px","",'<svg xmlns="http://www.w3.org/2000/svg" width="20" style="vertical-align:middle;" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>'));
        buildTab(buildGenericTab("Report",buildMain(report),"150px","display:none;",'<svg xmlns="http://www.w3.org/2000/svg" width="20" style="vertical-align:middle;" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>'));
        buildTab(buildGenericTab("Competitors",buildCompetitors(report),"150px","display:none;",'<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" style="vertical-align:middle;" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" /></svg>'))
        buildTab(buildGenericTab("Requirements","<h3>Requirements</h3><p>"+report.requirements+"</p>","175px","display:none;",'<svg xmlns="http://www.w3.org/2000/svg" width="20" style="vertical-align:middle;" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>'));
        
        if (!report.isFranchise) {
            buildTab(buildGenericTab("Tips &amp; Tricks","<h3>Tips &amp; Tricks</h3><p>"+report.tipstricks+"</p>","175px","display:none;",'<svg xmlns="http://www.w3.org/2000/svg" width="20" style="vertical-align:middle;" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" /></svg>'));
            buildTab(buildGenericTab("Register a Business","<h3>Register a Business</h3><p>"+registerCode()+"</p>","225px","display:none;",'<svg xmlns="http://www.w3.org/2000/svg" width="20" style="vertical-align:middle;" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" /></svg>'));
        }
    }

    let dt = new Date(report.created);
    doAffiliateCode();

    return  "<div class='tabbank'>"+this.report_tabs+"<div class='socials'>"+generateSocials(report)+"</div><div class='clear'></div></div>"+
            "<div class='tabcontents'>"+this.report_tab_contents+"<div class='clear'></div></div>"+
            "<div class='run'><span style='font-style:italic;'>Report Created: "+dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate()+"</span> [Reports are time-sensitive!]</div>"+
            "<div class='run'>Vet My Idea reports are generated by AI, may be factually incorrect, and are not advice of <em>any kind</em>. Use at your own risk!<br />"+
            "By using this report, you agree to our <a href='https://vetmyidea.biz/terms'>Terms of Service</a> and <a href='https://vetmyidez.biz/privacy'>Privacy Policy</a></div>";
}

function buildTab(tab_input) {
    if (tab_input!==null) {
        let selected="";
        if (tab_input.id===0) {
            selected=" selected";
        }

        this.report_tabs+="<button class='tab"+selected+"' id='tabheader"+tab_input.id+"' style='width:"+tab_input.width+"' onclick='selectTab(\""+tab_input.id+"\")'>"+tab_input.svg+"&nbsp;"+tab_input.name+"</button>";
        this.report_tab_contents+=tab_input.contents;
    }
}

function buildMain(report) {

    let content ="<h3>Report</h3><p>An analysis of your business idea is provided below, with items that need attention listed first. This analysis may be imperfect. Double check the facts, and when in doubt, contact a professional</p>"; 
    let sashay = ["finances"];
    if (!report.isPlatform && !report.isFranchise) {
        sashay = ["evaluee","growth","feature","marketing","cost","finances","regulatoryrisk"];
    }

    for (let stoplight=1; stoplight<=3; stoplight++) {
        for (let x=0; x<sashay.length; x++) {
            if (report.hasOwnProperty(sashay[x]) && report[sashay[x]]!==null && report[sashay[x]].stoplight===stoplight) {
                content += buildMainComponent(report,sashay[x]);
            }
        }
    }

    return content;
}

function buildMainComponent(report,item) {
    if (item==="growth") {
        return buildGenericSection("Potential Growth",report.growth.text,null,report.growth.stoplight);
    }
    if (item==="regulatoryrisk") {
        return buildGenericSection("Regulatory Risk",report.regulatoryrisk.text,null,report.regulatoryrisk.stoplight);
    }      
    if (item==="evaluee") {
        let evaluee=""; 
        if (report.evaluee.hasOwnProperty("clarity") && report.evaluee.clarity!==null) {
            evaluee+=buildGenericSection("Product Clarity",report.evaluee.clarity.text,null,report.evaluee.clarity.stoplight);
        }
        if (report.evaluee.hasOwnProperty("legality") && report.evaluee.legality!==null) {
            evaluee+=buildGenericSection("Product Legality",report.evaluee.legality.text,null,report.evaluee.legality.stoplight);
        }

        return evaluee;
    }
    if (item==="marketing" && report.marketing.text!==null) {
        return buildGenericSection("Marketing",report.marketing.text,"<em>You Stated:</em><br />"+report.marketing.input,report.marketing.stoplight);
    }
    if (item==="cost" && report.cost.text!==null) {
        return buildGenericSection("Cost",report.cost.text,"<em>You Stated:</em><br />"+report.cost.input,report.cost.stoplight);
    }
    if (item==="feature" && report.feature.text!==null) {
        return buildGenericSection("Feature",report.feature.text,"<em>You Stated:</em><br />"+report.feature.input,report.feature.stoplight);
    }
    if (item==="finances") {
        return buildGenericSection("Finances",report.finances.text,"<em>You Stated:</em><br />I have "+report.finances.input+" dollars to invest in the business",report.finances.stoplight);
    }
    return ""; 
}

function buildCompetitors(report) {
    let contents="<h3>Potential Competitors</h3><em>This list may be incomplete.</em></p><ol>";
    for(var n=0; n<report.competitors.length; n++) {
        contents+="<li>"+report.competitors[n]+"</li>";
    }
    contents+="</ol>";

    return contents;
}

function buildGenericSection(title,text,input,stoplight) {
    
    let contents = "<hr />";
    
    contents+="<div style='margin-top:25px;margin-bottom:25px;'><div style='float:left;width:75%;'><b>"+title+"</b><br /><br />";

    if (input!==null) {
        contents+=input+"<br /><br />";
    }

    contents+="<em>Analysis:</em><br />"+text+"</div>";
    contents+="<div style='float:right;width:25%;text-align:center;'><div style='margin-top:5%;'>"+render_stoplight(stoplight,"100")+"</div></div>";    
    contents+="<div style='clear:both;'></div>";
    contents+="</div>";

    return contents;   
}

function buildGenericTab(title,text,width,display,svg) {
    let contents =   
    "<section id='tab"+tab_id+"' style='"+display+"float:left;width:78vw;'>" +
        "<div class='section'>"+
        "<p>"+text+"</p>";

    contents += "</div></section>";

    let tab_result={
        name: title,
        contents: contents,
        id: tab_id,
        width: width,
        svg: svg
     };

    tab_id++;

    return tab_result;   
}

function buildNovelReport() {
    let contents =   
    "<section id='tab"+tab_id+"' style='float:left;width:78vw;'>" +
      "<div class='section'>"+
        "<h2>No Competition</h2>"+
        "<p>We did not find any competitors for the business/product/service you specified. This could be because:</p>"+
        "<p>1. We did not detect competing businesses in the target location you provided<br />"+
        "2. The idea is novel</p>"+
        "<p>As competition analysis is a key aspect of our evaluation process, we cannot compile reports for items with this classification. "+
        "If you believe you received this classification in error, then double check that the business, product and target location are correct on the My Reports dashboard</p>"+
      "</div>"+
      "</section>"; 

    let novel_result={
        name: "Summary",
        contents: contents,
        id: tab_id,
        width: "150px",
        svg: ''
    };

    tab_id++;

    return novel_result;
}


function buildSummary(title,stoplight) {

    let contents = "<h3 class='productTitle summaryHeader' style='margin-top:1.5rem;'>Business</h3><p class='businesstitle'><em>"+this.sanitize(title)+"</em></p>";

    contents += "<div class='summaryLeft'>";
 
    // OWL
    if (stoplight===3 || stoplight===2) {
        contents += "<img src='/core/owl.png' alt='Owl Mascot' width='300' />"; 
    }
    else {
        contents += render_stoplight(stoplight,"300");
    }

    contents += "</div>";

    contents += "<div class='summaryRight'>";
  
    if (stoplight===3 || stoplight===2) {
        contents += "<span class='highlight'>This looks like a wise idea!</span>";

        var cautionitems=""; 
        if (stoplight===2) {
            cautionitems = "<em>(we found some things you should read)</em>";
        }

        contents += "<h3 style='margin-top:25px;'>Next Steps</h3><ol><li>Review your report "+cautionitems+"</li><li>Learn about some potential competitors</li>";
        contents += "<li>See some potential requirements to get your business up and running</li>";
        if (!report.isFranchise) {
            contents += "<li>See some potential tips & tricks</li><li>Learn more about registering a business</li>";
        }
        contents +="</ol>";
        contents += "<p style='margin-top:25px;'>Our partners (to the right) can help you get your business off the ground. Please check them out!</p>"
    }
    else {
        contents += "<p><span class='highlight'>We found some potential issues</span></p><p style='margin-top:25px;'>Please review the report for further detail</p>"
    }

    contents += "<p style='margin-top:4rem;'>See an error on this report? Please <a href='https://vetmyidea.biz/contact' target='_blank' ref='noopener noreferer'>contact us</a>. Be sure to include the link to this report.</p>"

    contents += "</div>"

    

    contents += "<div class='clear'></div>";

    return contents;

}


function calculateSummary(report) {

    let stoplight = 3;

    sashay = ["evaluee","growth","feature","marketing","cost","finances","regulatoryrisk"];

    for (let x=0; x<sashay.length; x++) {
        if (report.hasOwnProperty(sashay[x]) && report[sashay[x]]!==null && report[sashay[x]].stoplight<stoplight) {
            stoplight = report[sashay[x]].stoplight;
        }
    }

    let title = ""; 
    if (report.bizType==="Online Business") {
        if (report.isFranchise===true) {
            title+="Online "+report.franchise+" franchise";
        }
        else {
            title+="Online business providing "+report.productType;
        }
    }
    else if (report.bizType==="Independent Contractor") {
        if (report.isPlatform===true) {
            title+="Independent contractor for "+report.productType;
        }
        else {
            title+="Independent contractor providing "+report.productType;
        }
    }
    else {
        if (report.isFranchise===true) {
            title+="Brick and mortar "+report.productType+" franchise";
        }
        else {
            title+="Brick and mortar store providing "+report.productType;
        }
    }
    title+=" targeting "+report.targetLocation;

    return buildSummary(title,stoplight);

}

function doAffiliateCode() {
    this.report_tab_contents+= "<section id='tab"+tab_id+"' style='float:right;text-center;width:19vw;'>"+
                                    "<div style='margin-top:10px;padding:15px;'>"+
                                        "<div style='text-align:center;'>Ready to start your business?<br /><br />"+
                                        "<a href=\"https://www.jdoqocy.com/click-101139235-15539830\" target=\"_top\">"+
                                        "<img src=\"/core/lzimage.png\" width=\"100\" height=\"100\"  alt=\"\" border=\"0\"/></a><br /><br />"+
                                        "<a href=\"https://www.tkqlhce.com/click-101139235-15053485\" target=\"_top\">LLC - Start your business with confidence</a>"+
                                        "<img src=\"https://www.awltovhc.com/image-101139235-15053485\" width=\"1\" height=\"1\" border=\"0\"/>"+
                                        "<br /><hr /><br />Need a website for your business?<br />" +
                                        "<br /><span style='font-size:1.2em;'>Use <b>Gator Website Builder!</b></span><br /><br />" +
                                        "<br /></div><div style='padding-left:10%;padding-right:10%'>"+
                                        "* Free domain!<br />"+
                                        "* Free SSL certificate for security!<br />"+
                                        "* Cloud hosting included<br />"+
                                        "* Blogging option included with all plans<br />"+
                                        "* Frustration-free drag-and-drop editor<br />"+
                                        "* No ads!<br /><br />"+
                                        "</div><div style='text-align:center;'><a href='https://partners.hostgator.com/zNVEE0'>Get Started Right Now!</a>"+
                                        "<br /><br /><hr /><br />"+
                                        "Reports can cost up to 10 cents each to generate.<br /><br /><b>Donations</b> are appreciated!<br /><br />" +
                                        "<form action=\"https://www.paypal.com/donate\" method=\"post\" target=\"_top\">"+
                                        "<input type=\"hidden\" name=\"hosted_button_id\" value=\"X9UB4CNBABHYQ\" />"+
                                        "<input type=\"image\" src=\"https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif\" border=\"0\" name=\"submit\" title=\"PayPal - The safer, easier way to pay online!\" alt=\"Donate with PayPal button\" />"+
                                        "<img alt=\"\" border=\"0\" src=\"https://www.paypal.com/en_US/i/scr/pixel.gif\" width=\"1\" height=\"1\" />"+
                                        "</form></div>"+
                                    "</div>"+
                                "</section>";
}

function generateSocials(report) {
    if (report.hasOwnProperty("novel")) {
        return ""; 
    }
    else {
        return  '<!--<div style="display:inline-block:!important;"><script type="IN/Share" data-url="'+window.location.href+'"></script></div>//-->' +
                '<div id="fb-root"></div>'+
                '<div class="fb-share-button"'+ 
                'data-href="'+window.location.href+'"'+
                'data-layout="button_count">'+
                '</div>'+
                '<a class="twitter-share-button" href="https://twitter.com/intent/tweet">Tweet</a>'
    }
          
}

function registerCode() {
    let contents = "<p>Types of businesses include sole proprietorship, partnership, limited liability company (LLC), and corporation. Each has its own set of advantages and disadvantages.</p>"+
        "<p><strong>Sole Proprietorship</strong></p><strong>Pros:</strong><ul><li>Easy and inexpensive to establish.</li><li>Owner has complete control over decision-making.</li>"+
        "<li>Simplified tax preparation, as business income is reported on the owner's personal tax return.</li></ul><strong>Cons:</strong><ul>"+
        "<li>Owner is personally liable for all business debts and liabilities.</li><li>May be more difficult to raise capital or secure loans.</li>"+
        "<li>Limited lifespan, as the business does not exist separately from the owner.</li></ul>"+
        "<hr /><p><strong>Partnership</strong></p><strong>Pros:</strong><ul>"+
        "<li>Ability to pool resources and share responsibilities with partners.</li><li>Access to more capital compared to a sole proprietorship.</li>"+
        "<li>Relatively easy to establish with minimal formalities.</li></ul><strong>Cons:</strong><ul><li>Partners are jointly and individually liable for business debts and liabilities.</li>"+
        "<li>Potential for disputes among partners over decisions and profit sharing.</li><li>Partnership dissolves if a partner decides to leave, unless otherwise agreed upon.</li>"+
        "</ul><hr /><p><strong>Limited Liability Company (LLC)</strong></p><strong>Pros:</strong><ul><li>Owners (members) have limited personal liability for business debts.</li>"+
        "<li>Flexible management structure and profit distribution.</li><li>Can choose to be taxed as a sole proprietor, partnership, or corporation.</li></ul><strong>Cons:</strong><ul>"+
        "<li>More complex and costly to establish than a sole proprietorship or partnership.</li><li>Subject to state-specific regulations and additional paperwork.</li>"+
        "<li>May have limited life in some states, requiring re-establishment after a certain period.</li></ul><hr /><p><strong>Corporation</strong></p><strong>Pros:</strong><ul>"+
        "<li>Shareholders have limited liability for business debts.</li><li>Ability to raise capital through the sale of stock.</li><li>Perpetual existence, not affected by changes in ownership.</li>"+
        "</ul><strong>Cons:</strong><ul><li>Most complex and expensive structure to establish and maintain.</li><li>Subject to double taxation, unless elected to be treated as an S corporation.</li>"+
        "<li>Regulated by federal, state, and local agencies, requiring strict compliance with laws and regulations.</li></ul>"+
        "<p></p><p></p>";

    return contents;
}

function render_stoplight(stoplight,size) {
    if (stoplight===3) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="'+size+'" style="color:darkgreen" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>';
    
    }
    else if (stoplight===2) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="'+size+'" style="color:darkorange" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>';
    }
    else {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="'+size+'" style="color:darkred" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>';
    }
}

function sanitize(content) {
    if (typeof(content)==="string") {
        return content.replace(/_/g," ").replace(/[^A-Za-z0-9\.&,;'\s]/g,"");
    }
    return content;
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