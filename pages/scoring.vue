<template>
    <v-container class="pa-0 mt-7 wizard" :class="{'wizard-mobile': !($vuetify.display.lg||$vuetify.display.xl||$vuetify.display.xxl)}">
      <v-row>
        <v-col cols="12">
        <h2>Scoring Guide</h2>
        <p style='margin-bottom:35px;'><em>Effective: 4/16/24</em></p>

        <h3>Base Score</h3>
        <p>
        Each report starts at 50 points and will gain/lose points during the evaluation process. The maximum score is 100 and the minimum score is 0. A favorability rating is given to the overall score at the end of the evaluation process: 
        </p>
        <p>
            &gt;=85 - Highly Favorable<br />
            65-84 - Favorable<br />
            36-64 - Fair<br />
            16-35 - Unfavorable<br />
            &lt;=15 - Highly Unfavorable
        </p>

        <p>&nbsp;</p>

        <h3>Product/Service Evaluation</h3>
        <h4>Clarity</h4>
        <p>
        The product/service entered by the user is checked for clarity to determine if we can perform a fair evaluation. Is what the user entered something concretely saleable? Unclear entries are classified as “potentially non-viable”
        </p>
        
        <h4>Competition</h4>
        <p>
        The product/service entered by the user is checked to see if there are any existing competitors. If there are no competitors the product/service receives a “no competition” label and is not scored. The scoring system requires competitors in order to evaluate some dimensions, and it is not truly possible to gauge products that no one has ever seen without doing customer testing and research. In some cases, a “no competition” label is given because there are no competitors in the location targeted by the user, in which case it would be difficult to judge whether or not this is because it is a good opportunity or there is no demand for the product/service in the targeted location. 
        </p>
       
        <h4>Legality</h4>
        <p>
        The product/service is evaluated for overall legality, if illegality is detected then the report is classified as “potentially non-viable”
        </p>
        
        <h4>Growth</h4>
        <p>
        The expected growth for the product/service is evaluated for the target location. 5 points are awarded for good growth, 20 points are awarded for very good growth. 0 points are awarded for fair growth, (25) points are deducted for poor growth, and (50) points are deducted for very poor growth
        </p>

        <h4>Regulatory Risk</h4>
        <p>
        The product/service is evaluated for overall regulatory risk. (5) points are deducted from the score for medium risk and (15) points are deducted from the score for high risk.
        </p>

        <h4>Insufficient Differentiation</h4>
        <p>
        This penalty applies if the following statements are true:<br />
        &nbsp;&nbsp;&bull;&nbsp;There are more than 3 competitors for the product/service<br />
        &nbsp;&nbsp;&bull;&nbsp;The user didn’t specify one or more differentiators OR at least one differentiator didn’t score positively after applying the specificity/uniqueness/drawback checks (see below)
        </p>
        <p>
        As an insufficiently differentiated product/service will normally fail to gain traction in an existing market, a (30) point penalty is applied
        </p>

        <p>&nbsp;</p>

        <h3>Differentiator Evaluation</h3>
        <p>
        Each stated differentiator (unique feature, cost reduction, or marketing strategy) is evaluated for the following:
        </p>
        
        <h4>Legality</h4>
        <p>Each idea is evaluated for illegality. If detected, the idea is not scored and the report is categorized as “potentially non-viable”</p>

        <h4>Physical Possibility</h4>
        <p>
        Each idea is evaluated for whether or not it is physically possible. If an idea is physically impossible, it is not scored and the report is categorized as “potentially non-viable”
        </p>

        <h4>Preposterity</h4>
        <p>
        Each idea is evaluated for whether or whether or not it is preposterous. The goal is to weed out ideas that the AI could interpret as being real and effective, but are absurd. Preposterous ideas are categorized as “potentially non-viable”
        </p>

        <h4>Effectiveness</h4>
        <p>
        Ideas that pass legality, preoposterity, and physical possibility checks are evaluated for effectiveness. The evaluation differs between Unique Feature and Costs/Marketing Strategy
        </p>
        <p>
        <em>Unique Feature</em><br />proposed features are evaluated for potential popularity among the target audience, with highly popular ideas earning maximum points 30 and somewhat popular ideas earning minimum points 10. Unpopular ideas earn 0 points.
        </p>
        <p>
        <em>Costs/Marketing Strategy</em><br />strategies are evaluated for their reasonable effectiveness. Highly effective strategies earn maximum points 30 and somewhat effective strategies earn minimum points 10. Ineffective strategies earn 0 points. 
        </p>
        <h4>Specificity </h4>
        <p>
        Ideas are evaluated as to how well they specifically address the problem. This can be thought of as a “trust” dimension. If you tell me you can lower costs by buying cheaper raw materials, this less specific statement is less trustworthy than telling me you can lower costs by buying cheaper steel, specifically. A failed specificity check results in any points earned from Effectiveness being set to zero, which may lead to “Insufficient Differentiation”
        </p>
        <h4>Risk</h4>
        <p>
        All ideas that are evaluated for effectiveness, and pass the specificity test, are also evaluated for risk across five different categories:
        </p>
        <p>
        &bull; Cybersecurity<br />
        &bull; Insider threats<br />
        &bull; Supply chain disruptions<br />
        &bull; Employee injury<br />
        &bull; Inability to find talent
        </p>
        <p>
        (10) points are deducted from the total score for each risk the idea presents.
        </p>
        <h4>Uniqueness/Uncommoness (Unique Feature Only)</h4>
        <p>
        Unique features are evaluated to determine if they’re really unique or uncommon. For example, if your unique feature for a car is that it “has four wheels” - then it will fail this test. In order to pass this test, an idea doesn’t have to be one-of-a-kind, it just has to be a feature that most competitors don’t have. Failing this test will lead to any points being earned from Effectiveness being set to zero, which may lead to “Insufficient Differentiation”
        </p>
        <h4>Drawback (Cost and Marketing Strategy Only)</h4>
        <p>
        Cost and marketing strategies are evaluated to determine if they cause a drawback to the effectiveness of the product. If to cut costs or market your product, you end up selling an inferior product, then your idea may be less viable than it seemed. Failing this test will lead to any points being earned from Effectiveness being set to zero, which may lead to “Insufficient Differentiation”
        </p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        </v-col>
      </v-row>
    </v-container>
</template>

<style scoped>
    h3,h4 {
        margin-top:15px;
    }
    h3 {
        margin-bottom:15px;
    }
    p {
        margin-bottom:10px;
    }
</style>