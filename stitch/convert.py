import re

with open("stitch/stitch_landing.html", "r", encoding='utf-8') as f:
    html = f.read()

body_match = re.search(r"<body[^>]*>([\s\S]*?)</body>", html)
if not body_match:
    print("Could not find body tags")
    exit(1)
bodyHtml = body_match.group(1)
# Convert class to className
bodyHtml = bodyHtml.replace('class="', 'className="')
# Convert void elements
bodyHtml = re.sub(r'<img(.*?)(?<!/)>', r'<img\1/>', bodyHtml)
bodyHtml = re.sub(r'<input(.*?)(?<!/)>', r'<input\1/>', bodyHtml)
bodyHtml = bodyHtml.replace("<br>", "<br/>")

outerClassMatch = re.search(r'<body[^>]*class="([^"]*)"', html)
outerClass = outerClassMatch.group(1) if outerClassMatch else ""

jsx = f"""import {{ Head, Link }} from '@inertiajs/react';

export default function Welcome({{ auth }}) {{
    return (
        <>
            <Head title="Life OS - Digital Scrapbook Journal" />
            <div className="{outerClass}">
{bodyHtml}
            </div>
        </>
    );
}}
"""

with open("resources/js/Pages/Welcome.jsx", "w", encoding='utf-8') as f:
    f.write(jsx)
