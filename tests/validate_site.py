from html.parser import HTMLParser
from pathlib import Path
import json, re, sys

ROOT = Path(__file__).resolve().parents[1]
PAGES = ["index.html", "domain.html", "milestones.html", "documents.html", "presentations.html", "about.html", "contact.html"]
NAV = ["Home", "Milestones", "Documents", "Presentations", "About Us", "Contact Us"]

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.h1 = 0; self.ids = set(); self.links = []; self.images = []; self.title = False; self.description = False; self.nav_text = []
    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if tag == "h1": self.h1 += 1
        if data.get("id"): self.ids.add(data["id"])
        if tag == "a" and data.get("href"): self.links.append((data["href"], data))
        if tag == "img": self.images.append(data)
        if tag == "title": self.title = True
        if tag == "meta" and data.get("name") == "description" and data.get("content"): self.description = True

errors=[]
for filename in PAGES:
    text=(ROOT/filename).read_text(encoding="utf-8")
    parser=PageParser(); parser.feed(text)
    if parser.h1 != 1: errors.append(f"{filename}: expected one H1, got {parser.h1}")
    if not parser.title or not parser.description: errors.append(f"{filename}: missing title or description")
    for item in NAV:
        if f">{item}<" not in text: errors.append(f"{filename}: missing nav item {item}")
    if '>Domain<' not in text and '>Project Scope<' not in text:
        errors.append(f"{filename}: missing Project Scope navigation item")
    for attrs in parser.images:
        if "alt" not in attrs: errors.append(f"{filename}: image missing alt")
    for href, attrs in parser.links:
        if href.startswith(("http://","https://","mailto:","#")): continue
        target=href.split("#",1)[0].split("?",1)[0]
        if target and not (ROOT/target).resolve().exists(): errors.append(f"{filename}: missing target {href}")
        if attrs.get("target") == "_blank" and "noopener" not in attrs.get("rel",""): errors.append(f"{filename}: unsafe target blank {href}")

for manifest in ("data/documents.json","data/presentations.json"):
    items=json.loads((ROOT/manifest).read_text(encoding="utf-8"))
    required={"id","title","category","description","status","date","version","type","size","viewUrl","downloadUrl","approved"}
    for i,item in enumerate(items):
        missing=required-set(item)
        if missing: errors.append(f"{manifest}[{i}]: missing {sorted(missing)}")
        if item["status"] == "available":
            if not item["approved"] or not item["viewUrl"] or not item["downloadUrl"]: errors.append(f"{manifest}[{i}]: available item lacks approved URLs")

if errors:
    print("VALIDATION FAILED")
    print("\n".join(f"- {e}" for e in errors)); sys.exit(1)
print(f"VALIDATION PASSED: {len(PAGES)} pages, navigation, metadata, local links and manifests")
