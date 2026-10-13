from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
import os
os.chdir(Path(__file__).resolve().parent.parent)
class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path=urlsplit(self.path).path
        if path in ['/about','/contact','/projects','/services']:
            self.path=path+'.html'
        super().do_GET()
ThreadingHTTPServer(('127.0.0.1',4330), Handler).serve_forever()
