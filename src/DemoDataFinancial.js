// DemoData.js - AAPL Demo Data for Non-authenticated Users
export const DEMO_DATA = {
  AAPL: {
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    currentPrice: '$196.32',
    change: '+2.45%',
    changeType: 'positive',
    
    // Standard analysis data
    analysis: {
      incomeStatement: `Here's a detailed financial analysis of the provided data (likely **Apple Inc.**) across six fiscal years (2019–2024):

---

### **Key Financial Metrics**
| Metric | 2024 | 2023 | 2022 | 2021 | 2020 | 2019 |
|----------------------------|------------|------------|------------|------------|------------|------------|
| **Total Revenue** | $391.0B | $383.3B | $394.3B | $365.8B | $274.5B | $260.2B |
| **Gross Profit** | $180.7B | $169.1B | $170.8B | $152.8B | $105.0B | $98.4B |
| **Operating Income** | $123.2B | $114.3B | $119.4B | $108.9B | $66.3B | $63.9B |
| **Net Income** | $93.7B | $97.0B | $99.8B | $94.7B | $57.4B | $55.3B |
| **EBITDA** | $134.7B | $125.8B | $130.5B | $123.1B | $81.0B | $81.9B |

---

### **Trend Analysis**
1. **Revenue Growth**:
 - **2020–2021**: +33.2% (likely due to pandemic-driven demand for devices/services).
 - **2021–2022**: +7.8% (continued growth but slower).
 - **2022–2023**: -2.8% (decline, possibly supply chain issues or macroeconomic factors).
 - **2023–2024**: +2.0% (recovery).

2. **Gross Profit Margin**:
 - Consistently strong (~42–46%), peaking in 2024 at **46.2%** (up from 44.1% in 2023), suggesting better cost control or premium product mix.

3. **Operating Efficiency**:
 - Operating expenses (R&D + SG&A) rose from **$34.5B (2019)** to **$57.5B (2024)**, reflecting increased investments in innovation and scaling.
 - **Operating Margin**: Improved from **24.6% (2019)** to **31.5% (2024)**.

4. **Net Income**:
 - Peaked in **2022 ($99.8B)** but dipped in **2023 ($97.0B)** due to higher taxes (effective tax rate jumped to **14.7% in 2023** vs. **16.2% in 2024**).
 - **2024 net income ($93.7B)** is lower than 2022–2023, likely due to higher tax expenses.

5. **EBITDA**:
 - Steady growth except for 2023, aligning with revenue trends. 2024 EBITDA ($134.7B) is a record high.

---

### **Key Observations**
- **Profitability**: Strong margins despite rising costs, showcasing pricing power and operational efficiency.
- **R&D Investment**: Increased from **$16.2B (2019)** to **$31.4B (2024)**, emphasizing innovation (e.g., AR/VR, silicon chips).
- **Tax Impact**: 2023 net income was buoyed by a lower tax rate (14.7% vs. ~16–20% in other years).
- **Interest Expenses**: Minimal impact (net interest income fluctuates near zero).

---

### **Strengths**
- Consistent revenue growth (CAGR **~7.4%** from 2019–2024).
- High gross margins (40%+), indicating premium branding and supply chain efficiency.
- Robust cash flow generation (EBITDA > $130B in 2024).

### **Risks**
- **Revenue Volatility**: 2023 decline highlights sensitivity to external factors.
- **Rising Costs**: Operating expenses grew faster than revenue in some years.
- **Tax Uncertainty**: Fluctuating tax rates impact net income stability.

---

### **Conclusion**
Apple's financials reflect a resilient business model with strong profitability and disciplined cost management. The 2024 data shows recovery from 2023's dip, driven by higher gross margins and controlled expenses. However, reliance on premium products and geopolitical/tax risks remain key watchpoints. 

**Recommendation**: Monitor R&D ROI and tax strategies to sustain net income growth. Revenue diversification (services, AI) could mitigate future volatility.`,

      balanceSheet: `Here is a detailed analysis of the provided financial data (in USD) for the fiscal years ending September 2019 to September 2024:

---

### **1. Key Financial Metrics**
| Metric                     | 2024       | 2023       | 2022       | 2021       | 2020       | 2019       |
|----------------------------|------------|------------|------------|------------|------------|------------|
| **Total Assets**           | 364.98B    | 352.58B    | 352.76B    | 351.00B    | 323.89B    | 338.52B    |
| **Total Liabilities**      | 308.03B    | 290.44B    | 302.08B    | 287.91B    | 258.55B    | 248.03B    |
| **Shareholder Equity**     | 56.95B     | 62.15B     | 50.67B     | 63.09B     | 65.34B     | 90.49B     |
| **Debt (Short + Long)**    | 119.06B    | 111.95B    | 120.88B    | 124.72B    | 112.44B    | 108.05B    |
| **Current Ratio**          | 0.87       | 0.99       | 0.88       | 1.07       | 1.36       | 1.54       |

- **Trends**:  
  - Assets grew steadily from 2020 to 2024, peaking in 2024.  
  - Liabilities increased significantly, especially in 2024 (+6.1% YoY).  
  - Equity declined sharply from 2019 to 2024, indicating retained earnings deficits (e.g., -$19.15B in 2024).  
  - The **current ratio** dropped below 1 in 2024, signaling potential liquidity strain.

---

### **2. Asset Composition**
#### **Current Assets** (% of Total Assets)
| Year   | Cash & ST Investments | Receivables | Inventory | Other Current Assets |
|--------|------------------------|-------------|-----------|----------------------|
| 2024   | 17.9%                 | 18.2%       | 2.0%      | 3.9%                 |
| 2023   | 17.4%                 | 8.4%        | 1.8%      | 4.2%                 |
| 2019   | 29.7%                 | 6.8%        | 1.2%      | 3.6%                 |

- **Key Observations**:  
  - **Cash reserves** declined from 29.7% (2019) to 17.9% (2024).  
  - **Receivables** surged in 2024 (likely due to extended credit terms).  
  - **Inventory** doubled from 2019 to 2024 ($4.1B → $7.3B), possibly indicating overstocking.

#### **Non-Current Assets**
- **Property, Plant & Equipment (PPE)**: Grew from $36.8B (2020) to $55.9B (2024), reflecting capital investments.  
- **Long-Term Investments**: Peaked in 2021 ($127.9B) but dropped to $91.5B by 2024, suggesting divestments.

---

### **3. Liability Breakdown**
#### **Debt Structure**
| Year   | Short-Term Debt | Long-Term Debt | Total Debt |
|--------|-----------------|----------------|------------|
| 2024   | 22.51B          | 85.75B         | 119.06B    |
| 2023   | 15.81B          | 95.28B         | 111.95B    |
| 2019   | 16.24B          | 91.81B         | 108.05B    |

- **Debt Shift**: Increased reliance on **short-term debt** (up 42% YoY in 2024), raising refinancing risks.

#### **Accounts Payable**
- Surged from $42.3B (2020) to $68.96B (2024), possibly straining supplier relationships.

---

### **4. Profitability & Equity**
- **Retained Earnings**:  
  - 2019: +$45.9B → 2024: -$19.15B.  
  - Sharp decline suggests sustained losses or aggressive share buybacks.  
- **Common Stock**: Increased from $45.2B (2019) to $83.3B (2024), likely due to stock issuances.

---

### **5. Red Flags**
1. **Liquidity Crunch**: Current ratio <1 in 2024.  
2. **Rising Debt**: Total debt up 10% YoY in 2024.  
3. **Negative Equity**: Retained earnings turned negative.  
4. **Inventory Buildup**: Potential obsolescence risk.  

---

### **6. Recommendations**
- **Address Liquidity**: Reduce short-term debt or convert to long-term.  
- **Optimize Inventory**: Implement just-in-time systems.  
- **Cost Control**: Rein in operating expenses to improve retained earnings.  

---

### **Summary**
The company shows **asset growth but declining financial health**, with rising liabilities, dwindling cash, and negative equity. Immediate action is needed to avoid solvency risks.  

Let me know if you'd like further breakdowns (e.g., cash flow or ratios like ROA/ROE).`,

      cashFlow: `Here's a structured analysis of the provided financial data (likely Apple Inc.'s cash flow statements from 2019–2024):

---

### **Key Observations**
1. **Operating Cash Flow (OCF)**  
   - **Trend**: Steady growth from $69.4B (2019) to $118.3B (2024), reflecting strong operational performance.  
   - **2024**: OCF increased **7% YoY** ($110.5B → $118.3B), driven by higher net income and lower capital expenditures.  
   - **2022 Dip**: OCF dropped to $122.2B (from $110.5B in 2023), likely due to higher receivables ($-9.3B change) and inventory buildup.

2. **Capital Expenditures (CapEx)**  
   - **Decline**: Peaked at $11.1B (2021) but fell to **$9.4B in 2024**, indicating efficiency or reduced investments.  
   - **Ratio to OCF**: CapEx/OCF improved from 15.9% (2021) to 8.0% (2024), freeing more cash for shareholders.

3. **Free Cash Flow (FCF = OCF − CapEx)**  
   - **2024**: $118.3B − $9.4B = **$108.9B** (record high).  
   - **Growth**: FCF doubled since 2019 ($69.4B − $10.5B = $58.9B).

4. **Dividends**  
   - **Stability**: Consistent annual payouts (~$14.1B in 2019 → **$15.2B in 2024**), with a slight 2.1% CAGR.  
   - **Payout Ratio**: ~16% of net income (2024), sustainable.

5. **Share Buybacks**  
   - **Aggressive Repurchases**:  
     - **2024**: **$94.9B** (up from $77.6B in 2023).  
     - **Total (2019–2024)**: ~$486B spent on buybacks.  
   - **Impact**: Reduced shares outstanding, boosting EPS.

6. **Net Income vs. Operating Cash Flow**  
   - **OCF > Net Income**: Consistent gap (e.g., 2024: $93.7B net income vs. $118.3B OCF), highlighting strong non-cash adjustments (e.g., $11.4B depreciation in 2024).

7. **Cash Flow from Financing (CFF)**  
   - **Negative Values**: Reflects net cash outflows from dividends/buybacks.  
   - **2024**: **-$122B** (highest outflow), driven by buybacks.  
   - **Debt**: No significant issuances/repayments noted.

8. **Liquidity & Changes in Cash**  
   - **2024**: No data on cash change, but **2023** saw a $5.8B increase.  
   - **2019–2022**: Volatile (e.g., -$10.9B in 2022 vs. +$24.3B in 2019).

---

### **Strengths**
- **Robust Cash Generation**: OCF growth supports dividends/buybacks.  
- **Capital Efficiency**: Lower CapEx and high FCF enable shareholder returns.  
- **Balance Sheet Flexibility**: Minimal debt activity suggests strong cash reserves.

### **Risks**
- **Buyback Dependency**: Heavy reliance on repurchases for shareholder returns.  
- **Inventory/Receivables**: 2022's receivables surge ($-9.3B) impacted liquidity.  

---

### **Conclusion**
Apple's cash flow trends underscore **operational strength** and **capital return focus**. Declining CapEx and rising FCF signal maturity, while buybacks dominate financing. Monitor receivables/inventory volatility and sustainability of buyback pace.  

**Recommendation**: Attractive for dividend-growth investors, but assess long-term buyback capacity.  

--- 

Let me know if you'd like deeper dives into specific metrics!`
    },
    
    // Deep analysis data
    deepAnalysis: {
      income: `
### Comprehensive Financial Analysis for Fiscal Years 2019–2024  

#### **Key Performance Metrics**  
*(Values in USD Billions)*  

| Fiscal Year | Revenue | Gross Profit | Gross Margin | Operating Income | Op Margin | Net Income | Effective Tax Rate | R&D (% Rev) | SG&A (% Rev) |
|-------------|---------|-------------|--------------|-----------------|-----------|------------|-------------------|-------------|--------------|
| 2019        | $260.17 | $98.39      | 37.8%        | $63.93          | 24.6%     | $55.26     | 15.9%             | 6.2%        | 7.0%         |
| 2020        | $274.52 | $104.96     | 38.2%        | $66.29          | 24.1%     | $57.41     | 14.4%             | 6.8%        | 7.3%         |
| 2021        | $365.82 | $152.84     | **41.8%**    | $108.95         | **29.8%** | $94.68     | 13.3%             | 6.0%        | 6.0%         |
| 2022        | $394.33 | $170.78     | 43.3%        | $119.44         | 30.3%     | $99.80     | 16.2%             | 6.7%        | 6.4%         |
| 2023        | $383.29 | $169.15     | 44.1%        | $114.30         | 29.8%     | $97.00     | 14.7%             | **7.8%**    | **6.5%**     |
| 2024        | $391.04 | **$180.68** | **46.2%**    | **$123.22**     | 31.5%     | $93.74     | **24.1%**         | 8.0%        | 6.7%         |

---

### **Critical Trends & Insights**  

1. **Revenue Growth Volatility**:  
   - Strong growth in 2021 (+33.3% YoY) and 2022 (+7.8%), driven by pandemic-driven demand and product launches.  
   - **2023 saw a rare decline (-2.8%)**, likely due to macroeconomic pressures (inflation, supply chain).  
   - Modest recovery in 2024 (+2.0%), indicating resilient demand.  

2. **Margin Expansion**:  
   - **Gross margin surged from 37.8% (2019) to 46.2% (2024)**, reflecting:  
     - Shift toward high-margin services (Apple Music, iCloud).  
     - Reduced reliance on hardware commoditization.  
   - **Operating margin** exceeded 30% in 2022–2024 (vs. 24–25% pre-2021).  

3. **R&D Investment**:  
   - Steady increase in R&D spending: **8.0% of revenue in 2024** (vs. 6.2% in 2019).  
   - Focus areas: silicon chips (M-series), AI, and AR/VR technologies.  

4. **Profitability Pressures in 2024**:  
   - Net income declined to **$93.74B (-3.4% YoY)** despite higher revenue and operating income.  
   - **Primary driver: Tax rate spike to 24.1%** (vs. 14.7% in 2023). Potential causes:  
     - Global tax reforms (e.g., OECD minimum tax).  
     - Repatriation costs or one-time adjustments.  

5. **Operational Efficiency**:  
   - **SG&A costs stable at 6.0–7.0%** of revenue, indicating disciplined cost management.  
   - Operating income growth (+7.8% in 2024) outpaced revenue growth (+2.0%), highlighting scalability.  

6. **Strategic Shifts**:  
   - **Declining COGS/Revenue**: 62.2% (2019) → 53.8% (2024), signaling supply chain optimization and premium product mix.  
   - Tax volatility underscores exposure to international regulatory risks.  

---

### **Recommendations**  
- **Monitor tax strategies**: Address the 24.1% tax rate through jurisdictional planning or credits.  
- **Leverage margin strength**: Reinvest gross margin gains into high-growth segments (AI/services).  
- **Sustain R&D focus**: Critical for long-term differentiation (e.g., generative AI, mixed reality).  

### **Conclusion**  
Apple demonstrates robust operational prowess with expanding margins and disciplined spending. However, **2024's tax-driven net income dip** highlights regulatory vulnerabilities. Strategic priorities should include tax optimization and sustained innovation to navigate volatile demand. Revenue diversification toward services (25% of 2024 revenue) provides a resilient foundation.  

*Data Note: All figures based on SEC-filed annual reports (10-K).*`,

      balance: `
### Financial Analysis of Provided Data (Fiscal Years 2019–2024)

#### 1. **Liquidity Ratios**  
*(Ability to meet short-term obligations)*  

| Year   | Current Ratio (CA/CL) | Quick Ratio (Cash + ST Inv. + Rec. / CL) |
|--------|----------------------|----------------------------------------|
| 2024  | 0.87                | 0.55                                  |
| 2023  | 0.99                | 0.63                                  |
| 2022  | 0.88                | 0.53                                  |
| 2021  | 1.07                | 0.74                                  |
| 2020  | 1.36                | 1.01                                  |
| 2019  | 1.54                | 0.68                                  |

- **Trend**: Deteriorating liquidity.  
  - Current ratio declined from **1.54 (2019)** to **0.87 (2024)**.  
  - Quick ratio fell from **1.01 (2020)** to **0.55 (2024)**, indicating reduced ability to cover immediate liabilities without selling inventory.  
  - **2024 liquidity crisis**: Current liabilities exceed current assets ($152.99B vs. $176.39B).  

---

#### 2. **Capital Structure & Solvency**  
*(Debt usage and financial leverage)*  

| Year   | Total Debt (ST + LT) | Debt-to-Equity (TL / Equity) |
|--------|---------------------|-----------------------------| 
| 2024  | $119.06B           | 5.41                        |
| 2023  | $111.95B           | 4.67                        |
| 2022  | $120.88B           | 5.96                        |
| 2021  | $124.72B           | 4.56                        |
| 2020  | $112.44B           | 3.96                        |
| 2019  | $108.05B           | 2.74                        |

- **Debt**: Increased by **$11.01B (10.2%)** since 2019.  
- **Leverage**: Debt-to-equity ratio surged from **2.74 (2019)** to **5.41 (2024)**, signaling higher financial risk.  
- **Equity**: Shareholders' equity dropped **37.0%** from $90.49B (2019) to $56.95B (2024).  

---

#### 3. **Asset Composition**  
*(Breakdown of assets)*  

- **Cash & ST Investments**:  
  - Peaked at **$88.06B (2019)**, now at **$65.17B (2024)**.  
- **Receivables**:  
  - Doubled from **$22.93B (2019)** to **$66.24B (2024)**, suggesting slower collections or sales growth.  
- **Inventory**:  
  - Increased **77.6%** from **$4.11B (2019)** to **$7.29B (2024)**.  

---

#### 4. **Liabilities Breakdown**  
- **Accounts Payable**:  
  - Rose **49.0%** from **$46.24B (2019)** to **$68.96B (2024)**.  
- **ST Debt**:  
  - Increased **38.6%** from **$16.24B (2019)** to **$22.51B (2024)**.  

---

#### 5. **Shareholders' Equity**  
- **Retained Earnings**:  
  | 2019 | 2020 | 2021 | 2022 | 2023 | 2024    |
  |------|------|------|------|------|---------| 
  | $45.90B | $14.97B | $5.56B | -$3.07B | -$0.21B | **-$19.15B** |  
  - **Critical decline**: Turned negative in 2022, reaching **-$19.15B (2024)**.  
- **Common Stock**:  
  - Up **84.3%** from **$45.17B (2019)** to **$83.28B (2024)** (likely due to buybacks).  
- **Shares Outstanding**:  
  - Reduced **17.1%** from **18.60B (2019)** to **15.41B (2024)**.  

---

### Key Insights  
1. **Liquidity Crisis**:  
   - Current ratio < 1.0 since 2022, and quick ratio < 0.6 since 2023.  
   - **Risk**: Potential cash flow issues if liabilities accelerate.  

2. **Debt Dependency**:  
   - Reliance on debt financing increased as retained earnings turned negative.  
   - Debt-to-equity > 5.0 in 2022, 2023, and 2024.  

3. **Equity Erosion**:  
   - Shareholders' equity fell **37.0%** over 5 years despite debt increases.  
   - Negative retained earnings imply cumulative losses or aggressive dividends/buybacks.  

4. **Operational Pressures**:  
   - Rising receivables (+189%) and inventory (+77.6%) suggest:  
     - Slower customer payments.  
     - Potential overstocking or sales slowdown.  

**Conclusion**: The company faces significant financial stress, characterized by eroding liquidity, surging debt, negative retained earnings, and deteriorating asset efficiency. Urgent action is needed to stabilize cash flow and reduce leverage.`,

      cashflow: `
### Comprehensive Analysis of Cash Flow Statements (Apple Inc., Fiscal Years 2019-2024)  
All values in USD billions. *Data sourced from provided cash flow statements.*

#### Key Metrics Summary:
| Year | OCF  | FCF   | Net Income | Dividends | Repurchases | Shareholder Returns | FCF After Returns |
|------|------|-------|------------|-----------|-------------|---------------------|-------------------|
| 2019 | 69.4 | 58.9  | 55.3       | 14.1      | 66.9        | 81.0                | -22.1            |
| 2020 | 80.7 | 73.4  | 57.4       | 14.1      | 72.4        | 86.4                | -13.1            |
| 2021 | 104.0| 92.9  | 94.7       | 14.5      | 86.0        | 100.4               | -7.5             |
| 2022 | 122.2| 111.4 | 99.8       | 14.8      | 89.4        | 104.2               | +7.2             |
| 2023 | 110.5| 99.6  | 97.0       | 15.0      | 77.5        | 92.6                | +7.0             |
| 2024 | 118.3| 108.8 | 93.7       | 15.2      | 95.0        | 110.2               | -1.4             |

---

### Trend Analysis:
1. **Operating Cash Flow (OCF)**  
   - **Strong Growth (2019-2022):** OCF rose from $69.4B to $122.2B (+76%), reflecting revenue growth and operational efficiency.  
   - **2023 Dip (-9.5%):** Short-term decline, possibly due to supply chain constraints or macro pressures.  
   - **Recovery (2024):** Rebounded to $118.3B (+7%), signaling resilience.

2. **Free Cash Flow (FCF = OCF - CapEx)**  
   - **2019-2022 Surge:** FCF grew from $58.9B to $111.4B (+89%) as CapEx remained stable (~$11B/year).  
   - **2023 Decline (-10.6%):** Mirroring OCF trend.  
   - **2024 Recovery:** FCF hit $108.8B (+9.3%), aided by reduced CapEx ($9.4B, lowest since 2020).

3. **Shareholder Returns**  
   - **Aggressive Capital Return:** Cumulative returns (dividends + repurchases) totaled **$575B** (2019-2024), exceeding cumulative FCF ($545B).  
     - **Dividends:** Steadily increased from $14.1B (2019) to $15.2B (2024), supporting stable income.  
     - **Share Buybacks:** Averaged **$84B/year** (peaked at $95B in 2024).  
   - **Funding Strategy:** Returns > FCF in 4/6 years, financed via:  
     - Asset sales (net positive investing cash flow in 2019, 2023-2024).  
     - Debt issuance (implied by financing activities).  
   - **2024 Pressure:** Returns ($110.2B) surpassed FCF ($108.8B), resulting in net cash decline.

4. **Cash Flow Composition**  
   - **Investing Activities:**  
     - Net inflows in 2019 ($45.9B), 2023 ($3.7B), and 2024 ($2.9B) from asset sales (e.g., marketable securities).  
     - Outflows in other years (e.g., -$22.4B in 2022) for acquisitions or investments.  
   - **Financing Activities:**  
     - Consistent outflows (avg. $-105B/year) driven by buybacks and dividends.  
     - 2024 outflow hit $-122B (highest on record), reflecting intensified buybacks.

---

### Key Insights:
1. **Capital Return Commitment:**  
   Apple prioritizes shareholder returns, allocating >90% of FCF to dividends/buybacks. Buybacks indicate confidence in stock valuation and a strategy to boost EPS.  

2. **Cash Flow Quality:**  
   - **OCF > Net Income:** All years except 2021, signaling high-quality earnings (cash-rich operations).  
   - **FCF Robustness:** Sustained FCF margins of ~80% of OCF (healthy for a hardware-centric business).  

3. **Strategic Shifts:**  
   - **CapEx Discipline:** Reduced to $9.4B (2024), aligning with slower product cycle investments.  
   - **Liquidity Pressure:** Cash reserves declined in 2020-2022 and 2024, raising questions about long-term sustainability of return levels.  

4. **2024 Warning Signal:**  
   FCF after returns turned negative again (-$1.4B) due to record buybacks ($95B). If OCF growth stalls or asset sales slow, debt may fund future returns.

---

### Recommendations for Investors:
- ✅ **Strength:** Exceptional cash generation, pricing power, and operational efficiency.  
- ⚠️ **Risks:**  
  - Over-reliance on buybacks (may limit R&D/M&A flexibility).  
  - Declining cash buffer (-$0.8B in 2024) if macro headwinds intensify.  
- 🔍 **Monitor:**  
  - Sustainable FCF-to-returns coverage after 2024.  
  - CapEx trends (indicator of innovation pipeline).  
  - Debt levels if returns continue outpacing FCF.

Apple remains a cash flow powerhouse, but its capital return aggressiveness demands vigilance on liquidity and reinvestment balance.`
    },
    
    // Key metrics summary (for preview cards)
    keyMetrics: {
      revenue: { value: '$391.0B', change: '+2.0%', trend: 'up' },
      netIncome: { value: '$93.7B', change: '-3.4%', trend: 'down' },
      grossMargin: { value: '46.2%', change: '+2.1pp', trend: 'up' },
      operatingCashFlow: { value: '$118.3B', change: '+7%', trend: 'up' },
      freeCashFlow: { value: '$108.8B', change: '+9.3%', trend: 'up' },
      currentRatio: { value: '0.87', change: '-12.1%', trend: 'down' }
    }
  }
};

// Export demo messages
export const DEMO_MESSAGES = {
  loginPrompt: {
    title: 'Unlock Full Stock Analysis',
    content: 'Register to analyze more stocks and get 20 free tokens!',
    buttonText: 'Register Free'
  },
  demoNotice: {
    title: 'Demo Data',
    content: 'You are viewing AAPL demo data. Login for real-time analysis.'
  },
  featurePreview: {
    deepAnalysis: 'View complete deep analysis with AI insights',
    realTimeData: 'Get real-time financial data updates',
    allStocks: 'Unlock analysis for more stocks'
  },
  symbolLocked: {
    title: 'Stock Symbol Locked',
    content: 'Register to unlock analysis for any stock. Get 20 free tokens!',
    hint: 'Try analyzing AAPL to see demo results'
  }
};