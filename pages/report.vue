<template>  
    <main id="report">

    </main> 
</template>
<script setup>
    onMounted(() => {
       
        let report_contents='{"summary": {"title":"Golf club business targeting Severna Park, Maryland, United States of America","score":65,"scoremeaning":"Favorable"}, "features":["Loft and MOI suitable for skill level","Club type and design for playability","Adjustability for shot tendencies and preferences","Shaft flex based on swing speed"], "competitors": ["Dick\'s Sporting Goods", "Golf Galaxy", "The Golf Club at South River", "Chartwell Golf & Country Club", "Severna Park Golf Center", "Sports Authority", "Eagle\'s Nest Country Club", "Walmart"],"expectedGrowth": {"growth":"good","explanation":"There is a consistent increase in golf enthusiasts in the region, and the presence of reputable golf courses, like Severna Park Golf Center, Chartwell Golf and Country Club, and Compass Pointe, supports this trend. Additionally, companies like DICK\’s Sporting Goods and Golf Galaxy in neighboring regions have offered steady sales in golfing equipment. Despite periodic fluctuations, the golf club market in Severna Park, Maryland is expected to experience steady growth due to the region\'s love for the sport and its affluent population who can afford golf as a pastime.","score":15},"regulatoryRisk": {"risk":"low","explanation":"In the United States, there is generally low risk of increased regulation specifically targeting the sale of golf clubs, including in Maryland. Most products are subject to standard consumer safety regulations which are fairly stable and do not regularly change radically. It is broadly a free market for selling items like sports equipment. Additionally, golf is a popular sport with a significant consumer base, making severe regulatory changes unlikely. High-impact legal changes would likely face pushback from consumer and industry groups, as well as potentially infringing on established principles of free trade and commerce. Therefore, the risk of negative impacts on companies selling golf clubs due to regulatory changes can be considered low.","score":0},"created":1709747969147}'
        document.getElementById("report").innerHTML=build_report(report_contents);
        
    })
</script>