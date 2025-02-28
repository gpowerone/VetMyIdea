import s3 from './s3.js'
import Eml from './email.js'

export default {
    createPublicPage: async function(title,url,reportContent) {
        await s3.writeS3Object("vetmyideareports", url, this.getPublicReportBody(title,url,reportContent), "text/html", Eml);
    },
    destroyPublicPage: async function(url) {
        await s3.deleteS3Object("vetmyideareports", url, Eml);
    },
    generatePublicPageURL: function(productType,reportID) {
        return productType.toLowerCase().replace(/\s/g,"_")+"_"+reportID+".html";
    },
    getPublicReportBody: function(title,url,reportContent) {
        return "<html>"+
            "<head>"+
            "<meta name='author' content='Vet My Idea'></meta>"+
            "<meta name='description' content='Information about starting a "+title.replace(/'/g,"&apos;")+"'></meta>"+
            "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"+
            "<meta name='robots' content='noindex'>"+
            "<meta property='og:url' content='https://reports.vetmyidea.biz/"+url+"' />"+
            "<meta property='og:type' content='website' />"+
            "<meta property='og:title' content='"+title.replace(/'/g,"&apos;")+"' />"+
            "<meta property='og:description' content='Information about starting a "+title.replace(/'/g,"&apos;")+"' />"+
            "<meta property='og:image' content='https://reports.vetmyidea.biz/core/vetmyidea.png' />"+
            "<link rel='preconnect' href='https://fonts.googleapis.com'>"+
            "<link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>"+
            "<link href='https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap' rel='stylesheet'>"+
            "<link href='https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css' rel='stylesheet'></link>"+
            "<link href='./core/report_builder_2.css' rel='stylesheet' />"+
            "<script src='./core/report_builder_v2.js' type='text/javascript'></script>"+
            "<script src='https://platform.linkedin.com/in.js' type='text/javascript'>lang: en_US</script>"+
            "<script src='https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/scripts/verify.min.js'></script>"+
            "<script async src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7307219219068554' crossorigin='anonymous'></script>"+
            "<script src='https://www.googletagmanager.com/gtag/js?id=G-Z4T5SBW4ZS'></script>"+
            "<script type='text/javascript'>(function(d, s, id) {"+
                "var js, fjs = d.getElementsByTagName(s)[0];"+
                "if (d.getElementById(id)) return;"+
                "js = d.createElement(s); js.id = id;"+
                "js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0';"+
                "fjs.parentNode.insertBefore(js, fjs);"+
                "}(document, 'script', 'facebook-jssdk'));"+
            "</script>"+
            "<script>window.twttr = (function(d, s, id) {"+
                "var js, fjs = d.getElementsByTagName(s)[0],"+
                "t = window.twttr || {};"+
                "if (d.getElementById(id)) return t;"+
                "js = d.createElement(s);"+
                "js.id = id;"+
                "js.src = 'https://platform.twitter.com/widgets.js';"+
                "fjs.parentNode.insertBefore(js, fjs);"+
                "t._e = [];"+
                "t.ready = function(f) {"+
                    "t._e.push(f);"+
                    "};"+
                "return t;"+
                "}(document, 'script', 'twitter-wjs'));"+
            "</script>"+
                "<title>"+title.replace(/'/g,"&apos;")+"</title>"+
                "</head>"+
                "<body class='report'>"+
                "<header class='report'>"+
                "<div class='header-left'><a href='https://vetmyidea.biz'><img src='./images/logo.png' alt='Vet My Idea' height='60' /></a></div>"+
                "<div class='header-right'>Report</div>"+
                "<div class='clear'></div>"+
                "</header>"+
                "<main id='report'>"+
                "</main>"+
                "<footer class='report'>"+
                "<br /><br />"+
                "<a href='https://www.vetmyidea.biz/about'>About</a> | <a href='https://www.vetmyidea.biz/contact'>Contact</a> | <a href='https://vetmyidea.blogspot.com/'>Blog</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                "<span style='font-size:1.2em;'>" +
                "<a href='https://www.youtube.com/channel/UCKfBFd43hmSLZgsh-jLiq0A' target='_blank' rel='noopener noreferer'><span class='mdi mdi-youtube'></span></a>&nbsp;" +
                "<a href='https://twitter.com/VetMyIdea' target='_blank' rel='noopener noreferer'><span class='mdi mdi-twitter'></a>&nbsp;" +
                "<a href='https://www.linkedin.com/company/vetmyidea'><span class='mdi mdi-linkedin'></span></a>" +
                "</span>" +
                "<br /><br />" +
                "&copy;2024 Techfalos, LLC"+
                "</footer>"+
                "</body>"+
                "<script language='javascript'>"+
                "let report_contents='"+reportContent.replace(/\n/g,"").replace(/\r/g,"").replace(/'/g,"&apos;")+"';"+
            "window.onload=function() { document.getElementById('report').innerHTML=build_report(report_contents,true); }"+
        "</script>\n"+
    "</html>";
    }
}