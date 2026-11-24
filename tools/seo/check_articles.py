"""Check blog articles against the writing rules in CLAUDE.md.

Usage: python3 tools/seo/check_articles.py <slug> [<slug> ...]   (run from the repository root)
Checks: no em/en dashes, exactly one table, 4 FAQ items, 3 to 5 internal links that resolve
to existing articles (or / and /#demo), seoTitle <= 60, description <= 155, every H2 a question
followed by a capsule of at most 2 sentences and 50 words. Exit code 1 on any problem.
"""
import sys, re, os
root = "."; slugs = sys.argv[1:]
existing = {f[:-3] for f in os.listdir(os.path.join(root,'src/content/blog')) if f.endswith('.md')}
ok = True
for slug in slugs:
    s = open(os.path.join(root,'src/content/blog',slug+'.md')).read()
    fm, body = s.split('---',2)[1], s.split('---',2)[2]
    errs = []
    if re.search('[–—]', s): errs.append('em/en dash')
    tables = len(re.findall(r'^\|[-| :]+\|\s*$', body, re.M))
    if tables != 1: errs.append(f'tables={tables}')
    faq = len(re.findall(r'^\s+- q:', fm, re.M))
    if faq != 4: errs.append(f'faq={faq}')
    links = re.findall(r'\]\((/[^)]*)\)', body)
    for l in links:
        if l in ('/', '/#demo'): continue
        m = re.match(r'^/blog/([^/]+)/$', l)
        if not m or m.group(1) not in existing: errs.append(f'bad link {l}')
    if not 3 <= len(links) <= 5: errs.append(f'internal links={len(links)} {links}')
    st = re.search(r'seoTitle: "(.*)"', fm); d = re.search(r'description: "(.*)"', fm)
    if st and len(st.group(1))>60: errs.append('seoTitle long')
    if len(d.group(1))>155: errs.append('description long')
    # capsules
    parts = re.split(r'^## (.*)$', body, flags=re.M)
    for i in range(1,len(parts),2):
        h, sec = parts[i], parts[i+1].strip()
        para = sec.split('\n\n')[0].strip()
        sents = len(re.findall(r'[.!?](?:["\')]*)(?:\s|$)', para))
        words = len(para.split())
        if not h.endswith('?'): errs.append(f'H2 not question: {h}')
        if para.startswith(('|','-','1.','>','**')) or sents>2 or words>50:
            errs.append(f'capsule [{h}] sents={sents} words={words}')
    nums = [int(n) for n in re.findall(r'^(\d+)\. ', body, re.M)]
    print(slug, 'words', len(body.split()), 'links', len(links), 'numbered max', max(nums) if nums else 0, 'OK' if not errs else errs)
    ok &= not errs
sys.exit(0 if ok else 1)
