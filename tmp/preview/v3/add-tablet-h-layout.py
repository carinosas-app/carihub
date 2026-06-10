#!/usr/bin/env python3
"""Duplicate body.proto-laptop layout rules for body.proto-tablet-h."""
from pathlib import Path
import re

path = Path(__file__).resolve().parent / 'home-html-real-mockup-v4.html'
text = path.read_text(encoding='utf-8')
marker = '/* Tablet horizontal — mismo layout y proporciones que laptop */'
if marker in text:
    print('Tablet-h block already present')
    raise SystemExit(0)

start = text.index('body.proto-laptop .home-page-body{z-index:0}')
end = text.index('body.proto-laptop .home-ad-bottom__dot{width:6px;height:6px}')
end += len('body.proto-laptop .home-ad-bottom__dot{width:6px;height:6px}')

block = text[start:end]
lines = block.splitlines()
out = [marker]
i = 0
while i < len(lines):
    line = lines[i]
    if re.search(r'body\.proto-(iphone|tablet)', line):
        while i < len(lines) and '}' not in lines[i]:
            i += 1
        i += 1
        continue
    if '@media' in line and i + 1 < len(lines) and 'body.proto-laptop' in lines[i + 1]:
        rule = []
        while i < len(lines):
            rule.append(lines[i].replace('body.proto-laptop', 'body.proto-tablet-h'))
            if lines[i].strip() == '}':
                i += 1
                break
            i += 1
        out.extend(rule)
        continue
    if 'body.proto-laptop' in line:
        rule = []
        while i < len(lines):
            rule.append(lines[i].replace('body.proto-laptop', 'body.proto-tablet-h'))
            if '}' in lines[i]:
                i += 1
                break
            i += 1
        out.extend(rule)
        continue
    i += 1

insert = '\n' + '\n'.join(out) + '\n'
text = text[:end] + insert + text[end:]
path.write_text(text, encoding='utf-8')
print(f'Inserted {len(out)} lines for tablet-h')
