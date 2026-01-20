# AI / OTA Experiment Pack (Embeddable)

This pack contains 3 standalone HTML pages you can embed in Credamo/Credemo (or Qualtrics) as an iframe/custom page.

## Files
- c1.html  -> Condition 1: Sustainability-focused chatbot (Template B autonomy-support)
- c2.html  -> Condition 2: Generic chatbot
- c3.html  -> Condition 3: Mock OTA with standard filters + one "Sustainable stays" filter
- assets/hotels.json
- assets/style.css
- assets/common.js

## Query parameters
All pages accept:
- pid: participant id (e.g., PID001)
- lang: en or zh (default en)
- return_url: where to send participants after selection (survey page)
  The page will redirect to:
  return_url?pid=...&condition=c1|c2|c3&lang=...&payload=BASE64(JSON)

Example:
c1.html?pid=PID001&lang=en&return_url=https://YOUR-SURVEY-LINK

## Data capture
- The UI logs events (filters, views, selects, chat messages) into a JSON array.
- On "Continue", it redirects with a base64 payload (payload=...).
- If return_url is missing, it downloads a log file locally instead.

## Embedding in Credamo/Credemo
Typical options (depends on your project settings):
1) Upload these files to a web host (school server / GitHub Pages / Netlify / Vercel).
2) In Credamo, use an "External link / iframe / custom HTML" block to load:
   https://host/c1.html?pid=${participant_id}&lang=zh&return_url=${next_page_url}

If Credamo doesn't support variable injection, you can:
- pass pid via query string using Credamo's built-in participant variable, or
- generate unique links per participant condition via your recruitment system.

## Reading the payload
On your survey page (Credamo/Qualtrics), parse the querystring parameter `payload`
and decode base64 to JSON.
Store it in an embedded field / hidden question.

Minimal JS to decode (Qualtrics-like):
const payload = decodeURIComponent(new URL(location.href).searchParams.get('payload')||'');
const json = JSON.parse(decodeURIComponent(escape(atob(payload))));
console.log(json);

## Language
- Set `lang=zh` for Chinese
- Set `lang=en` for English

## Ethics / transparency
Both chatbot conditions display "You are always in control..." message.



## v2 Chatbot upgrade
- Multi-turn, intent-based, stateful responses (no dead-end repetition)
- Soft preference inference (budget/priority/sustainability)
- Dynamic re-ordering of hotel list in c1/c2 based on inferred preferences


## v3 Chatbot upgrade
- Always outputs concrete shortlist (top 3) after parsing constraints
- Parses multi-constraint sentences (budget + metro + quiet)
- If no perfect match, shows near-misses and asks which constraint to relax
- Removes repetitive fallback loop; each turn advances narrowing


## v4 upgrade (requested)
- Hotels expanded to 15 (A–O) with balanced sustainability/info strength
- Chatbots: concise narrowing (names only), details on demand; robust short-answer carryover
- Added left-side AI shortlist cards with View / Add to compare / Select
- OTA filters: discrete checkbox bands for price/rating/metro to reduce interaction-cost bias


## v5 update (requested fixes)
- Hotel order interleaved to avoid clustered sustainable labels; sustainable badge moved to last position
- Badges spacing increased
- C1/C2 more conversational open prompts; periodic preference check-in every 2 turns
- Shortlist area includes Compare and Clear buttons; Add-to-compare now visible here
- Continue requires confirmation
- Added index.html homepage
