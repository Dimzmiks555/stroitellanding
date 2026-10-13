"""Validate generated pages and local assets using only the standard library."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import json
root=Path(__file__).resolve().parent.parent
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.h1=0; self.targets=[]; self.ids=set(); self.json=False; self.data=''
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='h1': self.h1+=1
        if 'id' in a:
            assert a['id'] not in self.ids, 'Duplicate id'
            self.ids.add(a['id'])
        if tag in ['a','link','script','img']:
            value=a.get('href',a.get('src',''))
            if value: self.targets.append(value)
        if tag=='img': assert 'alt' in a, 'Missing image alt'
        if tag=='script' and a.get('type')=='application/ld+json': self.json=True
    def handle_data(self,data):
        if self.json: self.data+=data
    def handle_endtag(self,tag):
        if tag=='script' and self.json:
            json.loads(self.data); self.json=False; self.data=''
for name in ['index','about','contact','projects','services']:
    parser=Page(); parser.feed((root/(name+'.html')).read_text()); assert parser.h1==1, name
    for target in parser.targets:
        u=urlsplit(target)
        if u.scheme or u.netloc: continue
        if not u.path:
            assert u.fragment in parser.ids, (name,target)
            continue
        path=root/u.path.lstrip('/') if u.path!='/' else root/'index.html'
        assert path.is_file() or path.with_suffix('.html').is_file(), (name,target)
    print(name+': heading, assets, links, metadata OK')
