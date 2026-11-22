#!/usr/bin/env python3
"""
Keyword research for the Tadam blog, via the DataForSEO API.

No credentials in this file: in the Claude Code cloud environment the network proxy adds
the DataForSEO login to every request to api.dataforseo.com. To run it elsewhere, set
DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD (API login and API password from the
DataForSEO dashboard, "API Access"), and the script sends them as Basic auth.

Usage (keywords: one per line in a text file, or given with --kw):
  python3 tools/seo/research.py volume      --file docs/seo/data/seeds-events-il.txt --out vol.csv
  python3 tools/seo/research.py suggestions --kw "בר מצווה" --out sug.csv
  python3 tools/seo/research.py serp        --kw "אטרקציות לבר מצווה" --out serp.csv
  python3 tools/seo/research.py questions   --kw "יום גיבוש לעובדים" --out q.csv
  add --us for the US market (English) instead of Israel.

Rough costs (2026-11): volume $0.09 per call of up to 1,000 keywords; suggestions about $0.05
per keyword; serp $0.002 per keyword; questions about $0.04 per keyword (1 SERP + 16 autocompletes).
See docs/seo/how-to-research.md.
"""
import argparse
import base64
import csv
import json
import os
import sys
import urllib.request
from urllib.parse import urlparse

API = "https://api.dataforseo.com/v3/"
ISRAEL, USA = 2376, 2840
QUESTION_WORDS_HE = ["איך", "מה", "כמה", "למה", "מתי", "איפה", "האם", "אילו"]


def post(endpoint: str, task: dict) -> dict:
    req = urllib.request.Request(
        API + endpoint, data=json.dumps([task]).encode(), headers={"Content-Type": "application/json"}, method="POST"
    )
    login, password = os.environ.get("DATAFORSEO_LOGIN"), os.environ.get("DATAFORSEO_PASSWORD")
    if login and password:
        req.add_header("Authorization", "Basic " + base64.b64encode(f"{login}:{password}".encode()).decode())
    with urllib.request.urlopen(req, timeout=180) as r:
        data = json.load(r)
    t = data["tasks"][0]
    print(f"{endpoint}: {t['status_code']} {t['status_message']} cost ${t.get('cost')}", file=sys.stderr)
    if t["status_code"] == 40102:  # "No Search Results": a valid empty answer (common for autocomplete seeds)
        t["result"] = None
        return t
    if t["status_code"] != 20000:
        raise SystemExit(1)
    return t


def volume(keywords, loc):
    # Google Ads volumes: no language_code (Hebrew is rejected here), location only.
    t = post("keywords_data/google_ads/search_volume/live", {"keywords": keywords, "location_code": loc})
    rows = [
        {"keyword": r["keyword"], "volume": r.get("search_volume"), "competition": r.get("competition"), "cpc_usd": r.get("cpc")}
        for r in t.get("result") or []
    ]
    return sorted(rows, key=lambda r: -(r["volume"] or 0))


def suggestions(keywords, loc, lang):
    rows = {}
    for kw in keywords:
        t = post(
            "dataforseo_labs/google/keyword_suggestions/live",
            {"keyword": kw, "location_code": loc, "language_code": lang, "limit": 300},
        )
        for it in ((t.get("result") or [{}])[0] or {}).get("items") or []:
            info = it.get("keyword_info") or {}
            rows[it["keyword"]] = {
                "seed": kw,
                "keyword": it["keyword"],
                "volume": info.get("search_volume") or 0,
                "kd": (it.get("keyword_properties") or {}).get("keyword_difficulty"),
                "cpc_usd": info.get("cpc"),
            }
    return sorted(rows.values(), key=lambda r: -r["volume"])


def serp(keywords, loc, lang):
    rows = []
    for kw in keywords:
        t = post(
            "serp/google/organic/live/advanced",
            {"keyword": kw, "location_code": loc, "language_code": lang, "device": "mobile", "depth": 10,
             "load_async_ai_overview": True, "people_also_ask_click_depth": 1},
        )
        for i in ((t.get("result") or [{}])[0].get("items") or []):
            if i["type"] == "organic":
                # Mobile results hide the URL behind a Google redirect; the breadcrumb has the real site.
                site = (i.get("breadcrumb") or "").split(" ")[0]
                rows.append({"keyword": kw, "type": "organic", "position": i.get("rank_group"),
                             "site": urlparse(site).netloc or site, "title": i.get("title"), "detail": ""})
            elif i["type"] == "ai_overview":
                refs = sorted({urlparse(x.get("url") or "").netloc for x in i.get("references") or [] if x.get("url")})
                rows.append({"keyword": kw, "type": "ai_overview", "position": "", "site": "", "title": "",
                             "detail": " ".join(r for r in refs if "google." not in r)})
            elif i["type"] == "people_also_ask":
                for q in i.get("items") or []:
                    rows.append({"keyword": kw, "type": "people_also_ask", "position": "", "site": "",
                                 "title": q.get("title"), "detail": ""})
            else:
                rows.append({"keyword": kw, "type": i["type"], "position": "", "site": "", "title": "", "detail": ""})
    return rows


def questions(keywords, loc, lang):
    """Hebrew 'People also ask' is rare in Google Israel, so autocomplete is the main source."""
    rows = set()
    for kw in keywords:
        t = post(
            "serp/google/organic/live/advanced",
            {"keyword": kw, "location_code": loc, "language_code": lang, "device": "desktop", "depth": 20,
             "people_also_ask_click_depth": 3},
        )
        for i in ((t.get("result") or [{}])[0].get("items") or []):
            if i["type"] == "people_also_ask":
                rows |= {(kw, "people_also_ask", q.get("title")) for q in i.get("items") or []}
            if i["type"] == "related_searches":
                rows |= {(kw, "related_search", q) for q in i.get("items") or [] if isinstance(q, str)}
        words = QUESTION_WORDS_HE if lang == "he" else ["how", "what", "why", "when", "where", "which", "can", "is"]
        for w in words:
            for seed in (f"{w} {kw}", f"{kw} {w}"):
                a = post("serp/google/autocomplete/live/advanced", {"keyword": seed, "location_code": loc, "language_code": lang})
                rows |= {(kw, "autocomplete", s["suggestion"]) for s in ((a.get("result") or [{}])[0].get("items") or []) if s.get("suggestion")}
    return [{"seed": a, "source": b, "question": c} for a, b, c in sorted(rows)]


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("command", choices=["volume", "suggestions", "serp", "questions"])
    p.add_argument("--file", help="text file, one keyword per line")
    p.add_argument("--kw", action="append", default=[], help="a keyword (repeatable)")
    p.add_argument("--us", action="store_true", help="US market in English instead of Israel in Hebrew")
    p.add_argument("--out", help="CSV output path (default: print to stdout)")
    a = p.parse_args()

    kws = list(a.kw)
    if a.file:
        kws += [l.strip() for l in open(a.file, encoding="utf-8") if l.strip()]
    if not kws:
        p.error("give keywords with --kw or --file")
    loc, lang = (USA, "en") if a.us else (ISRAEL, "he")

    rows = {"volume": lambda: volume(kws, loc), "suggestions": lambda: suggestions(kws, loc, lang),
            "serp": lambda: serp(kws, loc, lang), "questions": lambda: questions(kws, loc, lang)}[a.command]()
    if not rows:
        print("no results", file=sys.stderr)
        return
    out = open(a.out, "w", newline="", encoding="utf-8") if a.out else sys.stdout
    w = csv.DictWriter(out, fieldnames=list(rows[0].keys()))
    w.writeheader()
    w.writerows(rows)


if __name__ == "__main__":
    main()
