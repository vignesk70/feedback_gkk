import datetime
import json
import os
import sqlite3
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse


ROOT_DIR = os.path.abspath(os.path.dirname(__file__))
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
DB_PATH = os.path.join(ROOT_DIR, "data.sqlite3")

DEFAULT_QUESTIONNAIRE = {
    "title": "GKK Capability Diagnostic",
    "sections": [
        {
            "id": "section-digital-readiness",
            "title": "Digital Readiness and Skill Gaps",
            "category": "Technical Skills & TNA",
            "summary": "Evaluate how your organisation diagnoses digital skill gaps and modernises training programmes.",
            "questions": [
                {
                    "id": "question-digital-1",
                    "type": "single",
                    "prompt": "How effectively do you currently assess the mismatch between the skills of your existing employees and the needs of a rapidly changing business environment, particularly concerning digital and technological skills?",
                    "options": [
                        {
                            "label": "A",
                            "description": "Extremely poorly; we rely on subjective feedback. (Signals need for Automated TNA)",
                        },
                        {
                            "label": "B",
                            "description": "Partially; we use manual surveys but results are often slow or prone to bias. (Traditional TNA is slow/prone to error)",
                        },
                        {
                            "label": "C",
                            "description": "Effectively, but only for core roles; emerging tech gaps remain unaddressed.",
                        },
                        {
                            "label": "D",
                            "description": "Highly effectively; we use real-time data to identify specific skill gaps.",
                        },
                    ],
                    "guidance": "If A or B is selected, emphasize the need for an Automated TNA. If B, C, or D is selected, a gap still exists, requiring Technical Skills programs.",
                },
                {
                    "id": "question-digital-2",
                    "type": "single",
                    "prompt": "Do you feel your current training and development programs are adequate or outdated, and are they failing to equip employees with skills relevant to new technologies and industry trends?",
                    "options": [
                        {
                            "label": "A",
                            "description": "Our programs are largely outdated and fail to address current technological needs. (Strong signal for inadequacy)",
                        },
                        {
                            "label": "B",
                            "description": "They are adequate for basic skills, but not for high-end tech courses or digital upskilling. (GKK focuses on high-end tech courses)",
                        },
                        {
                            "label": "C",
                            "description": "They are mostly up-to-date and effective.",
                        },
                    ],
                    "guidance": "If A or B is selected, recommend prioritizing Technical Skills and utilizing GKK's superior training powered by AI Learning tools.",
                },
            ],
        },
        {
            "id": "section-leadership-culture",
            "title": "Leadership, Culture, and Succession",
            "category": "People Skills",
            "summary": "Explore leadership readiness, cultural agility, and succession planning depth across teams.",
            "questions": [
                {
                    "id": "question-leadership-1",
                    "type": "single",
                    "prompt": "What specific leadership or developmental gaps are currently hindering your succession planning efforts and focusing on developing future leaders?",
                    "options": [
                        {
                            "label": "A",
                            "description": "Succession planning is severely hindered by a lack of identified high-potential candidates and clear leadership pathways. (Signals Succession Planning Issues)",
                        },
                        {
                            "label": "B",
                            "description": "We have emerging leaders, but they lack the necessary soft skills (e.g., coaching, people management) to transition into senior roles.",
                        },
                        {
                            "label": "C",
                            "description": "Succession planning is generally adequate.",
                        },
                    ],
                    "guidance": "If A or B is selected, recommend People Skills programs, specifically Leadership Bootcamp, First Time Managers Program, and Leader As A Coach.",
                },
                {
                    "id": "question-leadership-2",
                    "type": "single",
                    "prompt": "To what extent does the organizational culture demonstrate resistance to change, which might make implementing modern talent development strategies difficult?",
                    "options": [
                        {
                            "label": "A",
                            "description": "Resistance is high and actively hinders strategic HR initiatives. (Indicates high difficulty)",
                        },
                        {
                            "label": "B",
                            "description": "Resistance is moderate, especially in specific long-tenured departments.",
                        },
                        {
                            "label": "C",
                            "description": "Resistance is minimal; the culture is generally agile and accepts change.",
                        },
                    ],
                    "guidance": "If A or B is selected, prioritize People Skills programs like Corporate Culture Transformation and Change Management & Self-Leadership.",
                },
            ],
        },
        {
            "id": "section-retention-constraints",
            "title": "Retention and Strategic Constraints",
            "category": "People Skills & Talent Placement",
            "summary": "Understand retention blockers, budget constraints, and recruitment pressures impacting growth.",
            "questions": [
                {
                    "id": "question-retention-1",
                    "type": "single",
                    "prompt": "What role do limited career growth opportunities play in your current employee retention rates, especially concerning high-potential talent leaving for the private sector?",
                    "options": [
                        {
                            "label": "A",
                            "description": "It is the primary cause of high-potential talent leaving. (Signals Retention Challenges)",
                        },
                        {
                            "label": "B",
                            "description": "It is a contributing factor, but not the main reason.",
                        },
                        {
                            "label": "C",
                            "description": "It plays a minimal role; retention challenges stem primarily from compensation.",
                        },
                    ],
                    "guidance": "If A or B is selected, highlight that limited career growth is a key issue. Recommend People Skills programs (e.g., enhancing management skills for better coaching/development).",
                },
                {
                    "id": "question-retention-2",
                    "type": "single",
                    "prompt": "Are financial limitations or budget constraints currently preventing you from investing in cutting-edge talent development initiatives?",
                    "options": [
                        {
                            "label": "A",
                            "description": "Yes, budget constraints significantly limit our investment in high-quality, external training. (Signals Budget Constraints)",
                        },
                        {
                            "label": "B",
                            "description": "No, investment is generally sufficient for our needs.",
                        },
                    ],
                    "guidance": "If A is selected, strongly recommend the Talent Placement (K-Youth) program, emphasizing the cost saving benefit where the government bears employee salary costs for up to four months.",
                },
                {
                    "id": "question-retention-3",
                    "type": "single",
                    "prompt": "What difficulties are you experiencing in attracting top talent, particularly in highly specialized or emerging fields, against competition from private and multinational corporations?",
                    "options": [
                        {
                            "label": "A",
                            "description": "We face significant difficulty in filling specialized roles (e.g., Data Analysts, Cybersecurity). (Signals Limited Talent Pool)",
                        },
                        {
                            "label": "B",
                            "description": "Moderate difficulty; recruitment is slow but positions are eventually filled.",
                        },
                        {
                            "label": "C",
                            "description": "Minimal difficulty; we successfully attract top talent.",
                        },
                    ],
                    "guidance": "If A is selected, immediately recommend the Talent Placement (K-Youth) program to address vacant roles, providing pre-trained candidates in areas like Junior Data Analyst and Digital Marketing.",
                },
            ],
        },
        {
            "id": "section-gap-identification",
            "title": "Specific Gap Identification",
            "category": "Technical, Business, People Skills",
            "summary": "Pinpoint the precise competencies and knowledge areas that require investment.",
            "questions": [
                {
                    "id": "question-gap-areas",
                    "type": "multi",
                    "prompt": "Beyond general upskilling, which specific competencies or knowledge areas have been formally identified as the greatest gaps in your workforce? (Select all that apply)",
                    "options": [
                        {
                            "label": "A",
                            "description": "High-End Technical Skills: AI, Cybersecurity, Cloud Technology, Data Analytics, Python/Java Programming. (Maps to Technical Skills)",
                        },
                        {
                            "label": "B",
                            "description": "Core Business Functions: Project Management, Finance for Non-Finance, Lean Six Sigma/Process Improvement, Quality Control. (Maps to Business Skills)",
                        },
                        {
                            "label": "C",
                            "description": "Leadership/Soft Skills: Change Management, Coaching, People Management, Corporate Culture Transformation. (Maps to People Skills)",
                        },
                        {
                            "label": "D",
                            "description": "Specific HR Needs: Performance Management, Behavioral Interviewing, Compensation & Benefit. (Maps to Business Skills - HR function)",
                        },
                    ],
                    "guidance": "The frequency of selections here directly dictates the required training focus across GKK's 3 Pillars.",
                },
            ],
        },
    ],
}


REQUIRED_RESPONDENT_FIELDS = (
    "companyName",
    "industry",
    "respondentName",
    "respondentEmail",
)


def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS questionnaire (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                payload TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS responses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                questionnaire_id INTEGER NOT NULL,
                submitted_at TEXT NOT NULL,
                payload TEXT NOT NULL,
                FOREIGN KEY(questionnaire_id) REFERENCES questionnaire(id)
            )
            """
        )
        cursor = conn.execute("SELECT payload FROM questionnaire WHERE id = 1")
        if cursor.fetchone() is None:
            now = datetime.datetime.utcnow().isoformat()
            conn.execute(
                "INSERT INTO questionnaire (id, payload, updated_at) VALUES (1, ?, ?)",
                (json.dumps(DEFAULT_QUESTIONNAIRE), now),
            )
        conn.commit()


def fetch_questionnaire():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.execute("SELECT payload, updated_at FROM questionnaire WHERE id = 1")
        row = cursor.fetchone()
        if row is None:
            return DEFAULT_QUESTIONNAIRE, None
        payload, updated_at = row
        return json.loads(payload), updated_at


def update_questionnaire(body):
    with sqlite3.connect(DB_PATH) as conn:
        now = datetime.datetime.utcnow().isoformat()
        conn.execute(
            """
            INSERT INTO questionnaire (id, payload, updated_at)
            VALUES (1, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                payload = excluded.payload,
                updated_at = excluded.updated_at
            """,
            (json.dumps(body), now),
        )
        conn.commit()
        return now


def insert_response(questionnaire_id, payload):
    with sqlite3.connect(DB_PATH) as conn:
        submitted_at = datetime.datetime.utcnow().isoformat()
        conn.execute(
            """
            INSERT INTO responses (questionnaire_id, submitted_at, payload)
            VALUES (?, ?, ?)
            """,
            (questionnaire_id, submitted_at, json.dumps(payload)),
        )
        conn.commit()
        return submitted_at


def fetch_responses():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.execute(
            """
            SELECT id, questionnaire_id, submitted_at, payload
            FROM responses
            ORDER BY submitted_at DESC
            """
        )
        rows = cursor.fetchall()
        return [
            {
                "id": row[0],
                "questionnaire_id": row[1],
                "submitted_at": row[2],
                "payload": json.loads(row[3]),
            }
            for row in rows
        ]


class QuestionnaireRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def do_OPTIONS(self):
        if self.path.startswith("/api/"):
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
            return
        super().do_OPTIONS()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/questionnaire":
            self.handle_get_questionnaire()
            return
        if parsed.path == "/api/responses":
            self.handle_get_responses()
            return
        super().do_GET()

    def do_PUT(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/questionnaire":
            self.handle_put_questionnaire()
            return
        self.send_error(404, "Not Found")

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/responses":
            self.handle_post_response()
            return
        self.send_error(404, "Not Found")

    def handle_get_questionnaire(self):
        questionnaire, updated_at = fetch_questionnaire()
        response = {"questionnaire": questionnaire, "updated_at": updated_at}
        self.respond_json(response)

    def handle_put_questionnaire(self):
        payload = self.read_json_body()
        if payload is None:
            return

        if not isinstance(payload, dict) or "sections" not in payload:
            self.send_error(400, "Payload must be an object with a sections array")
            return

        sections = payload.get("sections")
        if not isinstance(sections, list):
            self.send_error(400, "sections must be a list")
            return

        update_questionnaire(payload)
        self.respond_json({"status": "ok"})

    def handle_post_response(self):
        payload = self.read_json_body()
        if payload is None:
            return

        if not isinstance(payload, dict):
            self.send_error(400, "Payload must be a JSON object")
            return

        answers = payload.get("answers")
        if not isinstance(answers, list) or not answers:
            self.send_error(400, "Answers must be a non-empty array")
            return

        respondent = payload.get("respondent")
        if not isinstance(respondent, dict):
            self.send_error(400, "Respondent details are required")
            return

        respondent_clean, error_message = normalize_respondent(respondent)
        if error_message:
            self.send_error(400, error_message)
            return

        questionnaire, _ = fetch_questionnaire()
        questionnaire_id = 1 if questionnaire else 0
        record = dict(payload)
        record["respondent"] = respondent_clean
        submitted_at = insert_response(questionnaire_id, record)
        self.respond_json({"status": "ok", "submitted_at": submitted_at}, status=201)

    def handle_get_responses(self):
        records = fetch_responses()
        self.respond_json({"responses": records})

    def read_json_body(self):
        length_header = self.headers.get("Content-Length", "0")
        try:
            length = int(length_header)
        except ValueError:
            self.send_error(411, "Invalid Content-Length")
            return None

        raw = self.rfile.read(length) if length else b""
        try:
            return json.loads(raw.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON payload")
            return None

    def respond_json(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)


def normalize_respondent(respondent):
    cleaned = {}
    for field in REQUIRED_RESPONDENT_FIELDS:
        value = respondent.get(field, "")
        if not isinstance(value, str):
            value = str(value or "")
        trimmed = value.strip()
        if not trimmed:
            return None, f"{field} is required"
        cleaned[field] = trimmed

    phone = respondent.get("respondentPhone", "")
    if phone is not None:
        if not isinstance(phone, str):
            phone = str(phone)
        phone = phone.strip()
        if phone:
            cleaned["respondentPhone"] = phone

    return cleaned, None


def run(address="127.0.0.1", port=8000):
    init_db()
    server = ThreadingHTTPServer((address, port), QuestionnaireRequestHandler)
    print(f"Serving questionnaire app on http://{address}:{port}")
    print(f"Static files served from: {PUBLIC_DIR}")
    server.serve_forever()


if __name__ == "__main__":
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "8000"))
    run(host, port)
