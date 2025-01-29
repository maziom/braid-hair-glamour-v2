import os
from jinja2 import Template
from datetime import datetime

def render_email_template(username, message, action_url=None):
    year = datetime.now().year
    base_dir = os.path.dirname(os.path.abspath(__file__))
    template_path = os.path.join(base_dir, "templates", "email_template.html")

    with open(template_path, "r", encoding="utf-8") as template_file:
        template_content = template_file.read()

    template = Template(template_content)
    return template.render(username=username, message=message, action_url=action_url, year=year)
