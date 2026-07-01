---
description: Triage a single-site traffic/bot spike from collected Pantheon nginx logs (trigger >2x 5-day avg AND >=100 visits)
subtask: true
---
You are triaging a **traffic spike / bot-traffic** incident for ONE Pantheon site using
its already-collected nginx + php + mysql logs. Logs are present in the current folder.
This investigation was kicked off by a Slack alert.

# Inputs (`$ARGUMENTS` = site name + the Slack alert string)
Run the command from inside the logs folder, pasting the alert exactly as Slack emitted it:
`/triage-traffic-spike Access-Ag 2026-06-30: 267,358 visits vs 107,407 avg (2.49x)`
- **Site display name** = the FIRST token of `$ARGUMENTS` (e.g. `Access-Ag`).
  If missing, infer from the current directory / @collect-logs-rsync.sh.
- **Alert string** = the REMAINING text, format `<YYYY-MM-DD>: <visits> visits vs <avg> avg (<ratio>x)`.
  This is the trigger that fired - treat its visits/avg/ratio as the expected ballpark only.
- **Target date** (call it `DATE`) = the `YYYY-MM-DD` parsed from the alert string. If absent, use today UTC.
- **Site slug** = display name lowercased, non-alphanumerics -> hyphens (e.g. `Access-Ag` -> `access-ag`).
- **Log root** = `.` (the current directory; this is where the command runs).

The alert values are TRIGGER CONTEXT ONLY. You MUST still run the real pipelines below and
report the numbers you actually compute. If your computed figures differ from the alert by >5%,
call that out explicitly in Section 1.

# Objective
Find **bot traffic and traffic spikes**. Confirm whether the day is a real incident per the
rule below, quantify the bots/abuse, then produce the 3-section report at the end.

# Trigger rule (state this explicitly in the report)
A spike is confirmed ONLY when the target day's visits are **> 2x the previous 5-day average
AND >= 100 visits**. Both must hold -> `[TRIGGER MET]`; otherwise `[TRIGGER NOT MET]` and you
still produce the full report.

# How to count - CRITICAL (get this right or every number is wrong)
Nginx rotates daily but **the filename date is NOT the content date** - e.g.
`nginx-access.log-20260630.gz` mostly holds `29/Jun`. You MUST filter by the in-line
timestamp `[DD/Mon/YYYY:...]` and scan EVERY file across ALL app servers (gz AND plain).

1. Convert the target date to nginx form: `date -d "$DATE" +%d/%b/%Y` -> e.g. `30/Jun/2026`.
2. Stream all access logs with: `zcat -f ./app_server_*/logs/nginx/nginx-access*.log* 2>/dev/null`
3. `visits` = request lines matching `<DD>/<Mon>/2026:` on the target day, summed across all
   app servers. Format ints with thousands separators. Also report unique client IPs (the FIRST
   ip in the trailing `"ip, ip, ip"` X-Forwarded-For field = the real client behind AGCDN).
4. **5-day average**: repeat the visit count for each of the 5 UTC days immediately before the
   target (`date -d "$DATE -1 day" +%d/%b/%Y` ... through `-5 day`), then average them. ratio = visits/avg.

## Bot / traffic analysis for the target day
From the target-day lines compute:
- **Status distribution** - flag `499` (client-aborted = scraper signature) and `5xx`.
- **Bot UA breakdown** (case-insensitive), grouped:
  - AI scrapers: GPTBot, ClaudeBot, anthropic-ai, Bytespider, CCBot, PerplexityBot, Google-Extended, Amazonbot, Meta-ExternalAgent, FacebookBot
  - SEO crawlers: AhrefsBot, SemrushBot, MJ12bot, DotBot, PetalBot, SEOkicks, BLEXBot
  - Legit search: Googlebot, Bingbot, DuckDuckBot, YandexBot, Baiduspider
  - Generic/hostile: python-requests, curl/, scrapy, Go-http-client, Java/, `bot/`, crawler, spider, masscan, nikto
- **Top client IPs/subnets** - group IPv4 by /24, IPv6 by /48, top 15.
- **Top paths** (strip `?query`), top 15 - flag `/user/login`, `/admin`, `/.env`, `/wp-login`.
- **Login brute-force signal** - count `/user/login` (all locale prefixes) + 4xx/200 split.

## App/db stress WE control (scan error logs for the target day)
- nginx: count `worker_connections are not enough` in `./app_server_*/logs/nginx/nginx-error.log*`
- php-fpm: count `seems busy` and `executing too slow` in `./app_server_*/logs/php/php-fpm-error.log*`
- php-error.log: top repeated exception type
- mysql: line count of `./db_server_*/logs/mysqld-slow-query.log*` + top slow-query signature

# Output - exactly these three sections, concise

## Section 1: Headline
One line in this exact format (two spaces before the date), using YOUR COMPUTED figures:
`<name> <slug>  <date>: <visits> visits vs <avg5> avg (<ratio>x) [TRIGGER MET|NOT MET]`
e.g. `Access-Ag access-ag  2026-06-30: 140,888 visits vs 52,985 avg (2.66x) [TRIGGER MET]`
If computed visits/avg differ from the Slack alert by >5%, append a short ` (alert: <visits> vs <avg> (<ratio>x))` note.

## Section 2: Site issues we control
Bulleted findings from the stress + status analysis, each with a one-line remediation WE own
(e.g. raise php-fpm `pm.max_children` if pool exhausted; fix/index the slow query; cache the
hammered endpoint). Skip a category if nothing notable.

## Section 3: Pantheon WAF / AGCDN ticket (they control this - draft paste-ready)
We do NOT control the Advanced Global CDN / WAF. Read the Site UUID + env from
@collect-logs-rsync.sh (SITE_UUID / ENV) and produce a paste-ready ticket with:
- Spike summary (date, visits, 5-day avg, ratio, trigger status).
- Bot breakdown: named bot UAs + counts, and the top client IPs/subnets to block or rate-limit.
- Abusive path patterns (e.g. credential-stuffing on /user/login across locales).
- Explicit asks: review AGCDN edge logs; apply WAF rate-limit rules by IP/ASN; add a bot-UA
  blocklist; protect the login endpoint; confirm DDoS/AGCDN caching behaviour; and share the
  edge-side metrics we can't see.
- Note that we have ORIGIN nginx logs only (no edge/GeoIP/ASN visibility) so Pantheon must corroborate.

Run the pipelines above directly; do not estimate or paraphrase the numbers.
