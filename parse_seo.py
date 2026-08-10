import sys
from html.parser import HTMLParser

class SEOParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.in_title = False
        self.meta_desc = ""
        self.canonical = ""
        self.robots = ""
        self.h1_count = 0
        self.og_url = ""
        self.og_image = ""
        self.json_ld = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "title":
            self.in_title = True
        elif tag == "meta":
            if attrs_dict.get("name") == "description":
                self.meta_desc = attrs_dict.get("content", "")
            elif attrs_dict.get("name") == "robots":
                self.robots = attrs_dict.get("content", "")
            elif attrs_dict.get("property") == "og:url":
                self.og_url = attrs_dict.get("content", "")
            elif attrs_dict.get("property") == "og:image":
                self.og_image = attrs_dict.get("content", "")
        elif tag == "link":
            if attrs_dict.get("rel") == "canonical":
                self.canonical = attrs_dict.get("href", "")
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "script":
            if attrs_dict.get("type") == "application/ld+json":
                self.json_ld = True

    def handle_data(self, data):
        if self.in_title:
            self.title += data

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

for filename in sys.argv[1:]:
    try:
        with open(filename, "r") as f:
            content = f.read()
            parser = SEOParser()
            parser.feed(content)
            print(f"--- {filename} ---")
            print(f"Title: {parser.title}")
            print(f"Desc: {parser.meta_desc}")
            print(f"Canonical: {parser.canonical}")
            print(f"Robots: {parser.robots}")
            print(f"H1 Count: {parser.h1_count}")
            print(f"OG URL: {parser.og_url}")
            print(f"OG Image: {parser.og_image}")
            print(f"JSON-LD: {parser.json_ld}")
    except Exception as e:
        print(f"Error reading {filename}: {e}")
