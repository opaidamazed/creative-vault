#!/usr/bin/env python3
"""سيرفر محلي بيحاكي GitHub Pages، عشان تجرب الموقع زي ما هيشتغل بعد النشر:
  - /contact بيفتح contact.html (لينكات من غير .html)
  - أي لينك مش موجود بيعرض 404.html بحالة 404

التشغيل:
  python serve.py                      ← http://localhost:8000/
  python serve.py 8080                 ← بورت مختلف
  python serve.py 8000 creative-vault  ← http://localhost:8000/creative-vault/ (نفس شكل GitHub Pages)
"""
import http.server
import io
import os
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
PREFIX = ("/" + sys.argv[2].strip("/")) if len(sys.argv) > 2 and sys.argv[2].strip("/") else ""


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def _not_found(self, with_page=True):
        page = os.path.join(ROOT, "404.html")
        body = b"404 Not Found"
        if with_page and os.path.isfile(page):
            with open(page, "rb") as f:
                body = f.read()
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        return io.BytesIO(body)

    def send_head(self):
        parts = urllib.parse.urlsplit(self.path)
        path = urllib.parse.unquote(parts.path)

        if PREFIX:
            if path == PREFIX:
                self.send_response(301)
                self.send_header("Location", PREFIX + "/")
                self.send_header("Content-Length", "0")
                self.end_headers()
                return None
            if not path.startswith(PREFIX + "/"):
                return self._not_found(with_page=False)
            path = path[len(PREFIX):]

        fs = os.path.join(ROOT, path.lstrip("/"))
        if path.endswith("/"):
            if not os.path.isfile(os.path.join(fs, "index.html")):
                return self._not_found()
        elif os.path.isfile(fs):
            pass
        elif os.path.isfile(fs + ".html"):
            path += ".html"          # /contact ← contact.html
        else:
            return self._not_found()  # شامل /contact/ زي GitHub Pages بالظبط

        self.path = path + ("?" + parts.query if parts.query else "")
        return super().send_head()


if __name__ == "__main__":
    with http.server.ThreadingHTTPServer(("", PORT), Handler) as srv:
        print("Serving on http://localhost:%d%s/  (Ctrl+C للإيقاف)" % (PORT, PREFIX))
        try:
            srv.serve_forever()
        except KeyboardInterrupt:
            pass
