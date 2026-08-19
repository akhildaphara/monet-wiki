# Monet for Business: B2B Product Strategy

## The core evolution

The strongest B2B evolution is not “Monet, but with business cards.” It is:

> Monet for Business tells a company the best way to pay each expense—not merely which card earns the most points.

For a business, a 3% reward can easily be defeated by a card surcharge, a lost early-payment discount, insufficient credit headroom, financing cost, or a policy violation.

## How the decision changes

| Consumer Monet | Monet for Business |
|---|---|
| Which card should I swipe? | How should we pay this expense? |
| Optimize cashback or points | Optimize total economic value |
| One person’s wallet | Company cards, employee cards, and payment rails |
| Merchant category is primary | Vendor, invoice, amount, timing, and policy are primary |
| Immediate recommendation | Recommendation plus approval and audit trail |
| Mostly card vs. card | Card vs. ACH, wire, virtual card, or payment terms |

Business card programs already combine rewards with employee limits, reporting, protections, travel benefits, payment flexibility, and spend controls. Modern spend platforms also treat policies and approvals as core functionality.

## The new optimization model

Instead of ranking cards by reward percentage, Monet should calculate:

```text
Net payment value =
  reward value
+ usable credits and rebates
+ signup or spend-threshold progress
+ value of payment float
+ applicable purchase/travel protections
- card surcharge
- lost ACH or early-payment discount
- foreign transaction fees
- expected interest or financing cost
- annual-fee allocation
- policy and operational costs
```

This produces recommendations such as:

> Pay this $40,000 AWS invoice with Card A. It produces approximately $920 in net value, preserves $12,000 of headroom on your travel card, and remains within the marketing team’s policy.

Or:

> Pay by ACH. The vendor’s 2.9% card fee exceeds the maximum available card value by $640.

That second answer is essential. A product that always recommends a card will lose a finance team’s trust.

### Model benefits at three levels

Business perks should not all be converted into a simplistic reward rate:

- **Transaction-level:** cashback, points, foreign transaction fees, purchase protection, extended warranty, and travel insurance.
- **Period-level:** category caps, quarterly credits, annual spend thresholds, introductory offers, and rebates.
- **Portfolio-level:** annual fees, lounge access, employee-card fees, transfer partners, credit capacity, and renewal decisions.

Soft perks such as lounge access should be valued separately or configured by the company. Monet should avoid inventing an inflated dollar value merely to make a card look attractive.

## The best initial customer

Monet should not begin with large enterprises. Their procurement processes, negotiated rebates, ERP systems, and payment agreements make the first product substantially harder.

A better beachhead is:

- Companies with roughly 5–100 employees.
- Three to ten existing business cards.
- $50,000–$1 million in monthly card-eligible spend.
- Concentrated recurring expenses such as advertising, SaaS, cloud infrastructure, travel, shipping, telecom, and professional services.
- A founder, controller, or finance manager currently managing optimization with spreadsheets.

Agencies, e-commerce operators, technology companies, and multi-location service businesses are especially promising. Their spend is repeatable, category-heavy, and relatively easy to optimize.

## The product experience

The iPhone app can remain useful for employee purchases, but B2B Monet should primarily become a web product.

The core workflow would be:

1. The company adds its cards, limits, benefits, statement dates, and point valuations.
2. It connects card accounts or uploads historical statements.
3. Monet creates vendor profiles and identifies recurring payments and cards on file.
4. Before a large purchase, an employee enters or forwards an invoice.
5. Monet recommends a card or alternative payment rail and explains the economics.
6. The appropriate manager approves it.
7. After settlement, Monet reconciles the outcome and measures actual versus optimal value.

Virtual cards eventually become particularly useful because they can be restricted by vendor, amount, category, and time, while carrying richer reconciliation data.

## A practical MVP

The first version should be an advisory layer, not a card issuer or full expense platform:

- Multi-user company wallet.
- Business-card rewards and benefit catalog.
- CSV/Plaid transaction import.
- Vendor and recurring-payment detection.
- Planned-purchase calculator.
- Card fee, credit-limit, cap, and statement-date awareness.
- “Actual versus optimal” monthly savings report.
- Card portfolio report: keep, downgrade, replace, or cancel.
- Clear audit trail explaining every recommendation.

This reuses much of Monet’s existing foundation: merchant categorization, caps, card catalog, optimizer, and actual-versus-optimal analysis.

### Later phases

- QuickBooks, Xero, and NetSuite integrations.
- Slack or Teams approval flows.
- Browser recommendations at vendor checkout.
- Card-on-file migration suggestions.
- Automated virtual-card creation through an issuing partner.
- Payment execution and reconciliation.

Monet should avoid issuing its own card initially. That introduces underwriting, compliance, fraud, treasury, and support complexity before proving that businesses value the decision engine.

## Positioning and business model

The differentiated positioning is:

> The independent optimization layer across the cards and payment methods your business already uses.

Spend platforms such as Ramp and Brex generally encourage businesses to consolidate onto their own platform. Monet can remain neutral and optimize Chase, Amex, Capital One, issuer-specific cards, and eventually competing corporate-card platforms together.

A compelling sales motion would be a free “spend audit”:

1. Upload 90 days of transactions.
2. Add the company’s card programs.
3. Monet calculates missed rewards, unused credits, unnecessary fees, and poorly routed vendors.
4. Sell the continuing monitoring and recommendation product based on demonstrated savings.

Pricing could begin as a fixed SaaS subscription, with tiers based on connected spend or company complexity. Any issuer referral revenue should be disclosed and must never influence the ranking.

## Strategic thesis

Consumer Monet optimizes a purchase. B2B Monet should optimize the company’s entire payment portfolio—transaction by transaction, vendor by vendor, and card by card.

