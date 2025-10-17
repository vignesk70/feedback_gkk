const toastContainer = document.getElementById("toastContainer");
const sectionList = document.getElementById("sectionList");
const preview = document.getElementById("preview");
const sectionModal = document.getElementById("sectionModal");
const questionModal = document.getElementById("questionModal");
const jsonModal = document.getElementById("jsonModal");
const sectionForm = document.getElementById("sectionForm");
const questionForm = document.getElementById("questionForm");
const optionList = document.getElementById("optionList");
const jsonPreview = document.getElementById("jsonPreview");
const saveButton = document.getElementById("saveBuilder");

const state = {
  questionnaire: {
    title: "GKK Capability Diagnostic",
    sections: [],
  },
  dirty: false,
};

const context = {
  sectionId: null,
  questionId: null,
};

const sampleQuestionnaire = {
  title: "GKK Capability Diagnostic",
  sections: [
    {
      id: "section-digital-readiness",
      title: "Digital Readiness and Skill Gaps",
      category: "Technical Skills & TNA",
      summary:
        "Evaluate how your organisation diagnoses digital skill gaps and modernises training programmes.",
      questions: [
        {
          id: "question-digital-1",
          type: "single",
          prompt:
            "How effectively do you currently assess the mismatch between the skills of your existing employees and the needs of a rapidly changing business environment, particularly concerning digital and technological skills?",
          options: [
            {
              label: "A",
              description:
                "Extremely poorly; we rely on subjective feedback. (Signals need for Automated TNA)",
            },
            {
              label: "B",
              description:
                "Partially; we use manual surveys but results are often slow or prone to bias. (Traditional TNA is slow/prone to error)",
            },
            {
              label: "C",
              description:
                "Effectively, but only for core roles; emerging tech gaps remain unaddressed.",
            },
            {
              label: "D",
              description:
                "Highly effectively; we use real-time data to identify specific skill gaps.",
            },
          ],
          guidance:
            "If A or B is selected, emphasize the need for an Automated TNA. If B, C, or D is selected, a gap still exists, requiring Technical Skills programs.",
        },
        {
          id: "question-digital-2",
          type: "single",
          prompt:
            "Do you feel your current training and development programs are adequate or outdated, and are they failing to equip employees with skills relevant to new technologies and industry trends?",
          options: [
            {
              label: "A",
              description:
                "Our programs are largely outdated and fail to address current technological needs. (Strong signal for inadequacy)",
            },
            {
              label: "B",
              description:
                "They are adequate for basic skills, but not for high-end tech courses or digital upskilling. (GKK focuses on high-end tech courses)",
            },
            {
              label: "C",
              description: "They are mostly up-to-date and effective.",
            },
          ],
          guidance:
            "If A or B is selected, recommend prioritizing Technical Skills and utilizing GKK's superior training powered by AI Learning tools.",
        },
      ],
    },
    {
      id: "section-leadership-culture",
      title: "Leadership, Culture, and Succession",
      category: "People Skills",
      summary:
        "Explore leadership readiness, cultural agility, and succession planning depth across teams.",
      questions: [
        {
          id: "question-leadership-1",
          type: "single",
          prompt:
            "What specific leadership or developmental gaps are currently hindering your succession planning efforts and focusing on developing future leaders?",
          options: [
            {
              label: "A",
              description:
                "Succession planning is severely hindered by a lack of identified high-potential candidates and clear leadership pathways. (Signals Succession Planning Issues)",
            },
            {
              label: "B",
              description:
                "We have emerging leaders, but they lack the necessary soft skills (e.g., coaching, people management) to transition into senior roles.",
            },
            {
              label: "C",
              description: "Succession planning is generally adequate.",
            },
          ],
          guidance:
            "If A or B is selected, recommend People Skills programs, specifically Leadership Bootcamp, First Time Managers Program, and Leader As A Coach.",
        },
        {
          id: "question-leadership-2",
          type: "single",
          prompt:
            "To what extent does the organizational culture demonstrate resistance to change, which might make implementing modern talent development strategies difficult?",
          options: [
            {
              label: "A",
              description:
                "Resistance is high and actively hinders strategic HR initiatives. (Indicates high difficulty)",
            },
            {
              label: "B",
              description:
                "Resistance is moderate, especially in specific long-tenured departments.",
            },
            {
              label: "C",
              description:
                "Resistance is minimal; the culture is generally agile and accepts change.",
            },
          ],
          guidance:
            "If A or B is selected, prioritize People Skills programs like Corporate Culture Transformation and Change Management & Self-Leadership.",
        },
      ],
    },
    {
      id: "section-retention-constraints",
      title: "Retention and Strategic Constraints",
      category: "People Skills & Talent Placement",
      summary:
        "Understand retention blockers, budget constraints, and recruitment pressures impacting growth.",
      questions: [
        {
          id: "question-retention-1",
          type: "single",
          prompt:
            "What role do limited career growth opportunities play in your current employee retention rates, especially concerning high-potential talent leaving for the private sector?",
          options: [
            {
              label: "A",
              description:
                "It is the primary cause of high-potential talent leaving. (Signals Retention Challenges)",
            },
            {
              label: "B",
              description: "It is a contributing factor, but not the main reason.",
            },
            {
              label: "C",
              description:
                "It plays a minimal role; retention challenges stem primarily from compensation.",
            },
          ],
          guidance:
            "If A or B is selected, highlight that limited career growth is a key issue. Recommend People Skills programs (e.g., enhancing management skills for better coaching/development).",
        },
        {
          id: "question-retention-2",
          type: "single",
          prompt:
            "Are financial limitations or budget constraints currently preventing you from investing in cutting-edge talent development initiatives?",
          options: [
            {
              label: "A",
              description:
                "Yes, budget constraints significantly limit our investment in high-quality, external training. (Signals Budget Constraints)",
            },
            {
              label: "B",
              description: "No, investment is generally sufficient for our needs.",
            },
          ],
          guidance:
            "If A is selected, strongly recommend the Talent Placement (K-Youth) program, emphasizing the cost saving benefit where the government bears employee salary costs for up to four months.",
        },
        {
          id: "question-retention-3",
          type: "single",
          prompt:
            "What difficulties are you experiencing in attracting top talent, particularly in highly specialized or emerging fields, against competition from private and multinational corporations?",
          options: [
            {
              label: "A",
              description:
                "We face significant difficulty in filling specialized roles (e.g., Data Analysts, Cybersecurity). (Signals Limited Talent Pool)",
            },
            {
              label: "B",
              description:
                "Moderate difficulty; recruitment is slow but positions are eventually filled.",
            },
            {
              label: "C",
              description:
                "Minimal difficulty; we successfully attract top talent.",
            },
          ],
          guidance:
            "If A is selected, immediately recommend the Talent Placement (K-Youth) program to address vacant roles, providing pre-trained candidates in areas like Junior Data Analyst and Digital Marketing.",
        },
      ],
    },
    {
      id: "section-gap-identification",
      title: "Specific Gap Identification",
      category: "Technical, Business, People Skills",
      summary:
        "Pinpoint the precise competencies and knowledge areas that require investment.",
      questions: [
        {
          id: "question-gap-areas",
          type: "multi",
          prompt:
            "Beyond general upskilling, which specific competencies or knowledge areas have been formally identified as the greatest gaps in your workforce? (Select all that apply)",
          options: [
            {
              label: "A",
              description:
                "High-End Technical Skills: AI, Cybersecurity, Cloud Technology, Data Analytics, Python/Java Programming. (Maps to Technical Skills)",
            },
            {
              label: "B",
              description:
                "Core Business Functions: Project Management, Finance for Non-Finance, Lean Six Sigma/Process Improvement, Quality Control. (Maps to Business Skills)",
            },
            {
              label: "C",
              description:
                "Leadership/Soft Skills: Change Management, Coaching, People Management, Corporate Culture Transformation. (Maps to People Skills)",
            },
            {
              label: "D",
              description:
                "Specific HR Needs: Performance Management, Behavioral Interviewing, Compensation & Benefit. (Maps to Business Skills - HR function)",
            },
          ],
          guidance:
            "The frequency of selections here directly dictates the required training focus across GKK's 3 Pillars.",
        },
      ],
    },
  ],
};

document.getElementById("addSection").addEventListener("click", () => {
  openSectionModal();
});

document.getElementById("exportJson").addEventListener("click", () => {
  jsonPreview.textContent = JSON.stringify(state.questionnaire, null, 2);
  jsonModal.showModal();
});

document
  .querySelectorAll("[data-close-modal]")
  .forEach((btn) => btn.addEventListener("click", handleCloseModal));

document.getElementById("addOption").addEventListener("click", () => {
  addOptionField();
});

sectionList.addEventListener("click", handleBuilderClick);
sectionForm.addEventListener("submit", handleSectionSubmit);
questionForm.addEventListener("submit", handleQuestionSubmit);

saveButton.addEventListener("click", handleSave);
document
  .getElementById("loadSample")
  .addEventListener("click", () => loadSampleQuestionnaire());

document.getElementById("viewResponses").addEventListener("click", downloadResponses);

loadQuestionnaire();

async function loadQuestionnaire() {
  try {
    const response = await fetch("/api/questionnaire");
    if (!response.ok) {
      throw new Error(`Failed to load questionnaire (${response.status})`);
    }
    const payload = await response.json();
    const questionnaire = normalizeQuestionnaire(payload.questionnaire);
    state.questionnaire = questionnaire;
    state.dirty = false;
    render();
    updateSaveButton();
  } catch (error) {
    console.error(error);
    showToast("Unable to load questionnaire from the server.", true);
  }
}

function normalizeQuestionnaire(questionnaire) {
  const sections = (questionnaire.sections || []).map((section) => ({
    id: section.id || uid(),
    title: section.title || "Untitled Section",
    category: section.category || "",
    summary: section.summary || "",
    questions: (section.questions || []).map((question) => ({
      id: question.id || uid(),
      prompt: question.prompt || "Untitled question",
      guidance: question.guidance || "",
      type: question.type === "multi" ? "multi" : "single",
      options: (question.options || []).map((option) => ({
        label: option.label || "",
        description: option.description || "",
      })),
    })),
  }));

  return {
    title: questionnaire.title || "GKK Capability Diagnostic",
    sections,
  };
}

function handleBuilderClick(event) {
  const action = event.target.dataset.action;
  if (!action) {
    return;
  }

  const sectionId = event.target.dataset.section;
  const questionId = event.target.dataset.question || null;

  switch (action) {
    case "editSection":
      openSectionModal(sectionId);
      break;
    case "deleteSection":
      deleteSection(sectionId);
      break;
    case "addQuestion":
      openQuestionModal(sectionId);
      break;
    case "editQuestion":
      openQuestionModal(sectionId, questionId);
      break;
    case "deleteQuestion":
      deleteQuestion(sectionId, questionId);
      break;
    default:
      break;
  }
}

function openSectionModal(sectionId = null) {
  context.sectionId = sectionId;
  const titleEl = document.getElementById("sectionModalTitle");

  if (sectionId) {
    const section = state.questionnaire.sections.find((item) => item.id === sectionId);
    if (!section) return;
    titleEl.textContent = "Edit Section";
    sectionForm.sectionTitle.value = section.title;
    sectionForm.sectionCategory.value = section.category || "";
    sectionForm.sectionSummary.value = section.summary || "";
  } else {
    titleEl.textContent = "New Section";
    sectionForm.reset();
  }

  sectionModal.showModal();
}

function openQuestionModal(sectionId, questionId = null) {
  context.sectionId = sectionId;
  context.questionId = questionId;
  const titleEl = document.getElementById("questionModalTitle");

  optionList.innerHTML = "";

  const section = state.questionnaire.sections.find((item) => item.id === sectionId);
  if (!section) return;

  if (questionId) {
    titleEl.textContent = "Edit Question";
    const question = section.questions.find((item) => item.id === questionId);
    if (!question) return;

    questionForm.questionPrompt.value = question.prompt;
    questionForm.questionGuidance.value = question.guidance || "";
    questionForm.questionType.value = question.type === "multi" ? "multi" : "single";
    question.options.forEach((option) => addOptionField(option));
  } else {
    titleEl.textContent = "New Question";
    questionForm.reset();
    questionForm.questionType.value = "single";
    addOptionField({ label: "A", description: "" });
    addOptionField({ label: "B", description: "" });
  }

  questionModal.showModal();
}

function handleSectionSubmit(event) {
  event.preventDefault();
  const formData = new FormData(sectionForm);
  const payload = {
    title: formData.get("title").trim(),
    category: formData.get("category").trim(),
    summary: formData.get("summary").trim(),
  };

  if (!payload.title) {
    sectionForm.sectionTitle.focus();
    return;
  }

  if (context.sectionId) {
    state.questionnaire.sections = state.questionnaire.sections.map((section) =>
      section.id === context.sectionId ? { ...section, ...payload } : section
    );
  } else {
    state.questionnaire.sections = [
      ...state.questionnaire.sections,
      {
        id: uid(),
        ...payload,
        questions: [],
      },
    ];
  }

  markDirty();
  render();
  sectionModal.close();
  context.sectionId = null;
}

function handleQuestionSubmit(event) {
  event.preventDefault();
  const formData = new FormData(questionForm);
  const prompt = formData.get("prompt").trim();
  const guidance = formData.get("guidance").trim();
  const type = formData.get("type") === "multi" ? "multi" : "single";
  const options = collectOptions();

  if (!prompt) {
    questionForm.questionPrompt.focus();
    return;
  }

  if (!options.length) {
    addOptionField();
    return;
  }

  state.questionnaire.sections = state.questionnaire.sections.map((section) => {
    if (section.id !== context.sectionId) {
      return section;
    }

    if (context.questionId) {
      const updatedQuestions = section.questions.map((question) =>
        question.id === context.questionId
          ? { ...question, prompt, guidance, options, type }
          : question
      );
      return { ...section, questions: updatedQuestions };
    }

    return {
      ...section,
      questions: [
        ...section.questions,
        { id: uid(), prompt, guidance, options, type },
      ],
    };
  });

  markDirty();
  render();
  questionModal.close();
  resetModalContext();
}

function handleCloseModal(event) {
  const dialog = event.target.closest("dialog");
  if (dialog) {
    dialog.close();
    resetModalContext();
  }
}

function deleteSection(sectionId) {
  const section = state.questionnaire.sections.find((item) => item.id === sectionId);
  if (!section) return;
  const confirmed = window.confirm(
    `Delete the section "${section.title}" and all of its questions?`
  );

  if (!confirmed) return;

  state.questionnaire.sections = state.questionnaire.sections.filter(
    (item) => item.id !== sectionId
  );
  markDirty();
  render();
}

function deleteQuestion(sectionId, questionId) {
  const section = state.questionnaire.sections.find((item) => item.id === sectionId);
  if (!section) return;
  const question = section.questions.find((item) => item.id === questionId);
  if (!question) return;

  const confirmed = window.confirm("Delete this question?");
  if (!confirmed) return;

  state.questionnaire.sections = state.questionnaire.sections.map((item) => {
    if (item.id !== sectionId) return item;
    return {
      ...item,
      questions: item.questions.filter((q) => q.id !== questionId),
    };
  });

  markDirty();
  render();
}

async function handleSave() {
  if (!state.dirty) {
    return;
  }

  try {
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";
    const response = await fetch("/api/questionnaire", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state.questionnaire),
    });
    if (!response.ok) {
      throw new Error(`Save failed (${response.status})`);
    }
    state.dirty = false;
    updateSaveButton();
    showToast("Questionnaire saved successfully.");
    await loadQuestionnaire();
  } catch (error) {
    console.error(error);
    showToast("Failed to save questionnaire.", true);
  } finally {
    updateSaveButton();
  }
}

function loadSampleQuestionnaire() {
  const confirmed = window.confirm(
    "Replace the current working copy with the sample questionnaire?"
  );
  if (!confirmed) return;

  state.questionnaire = normalizeQuestionnaire(sampleQuestionnaire);
  markDirty();
  render();
}

async function downloadResponses() {
  try {
    const response = await fetch("/api/responses");
    if (!response.ok) {
      throw new Error("Unable to load responses");
    }
    const payload = await response.json();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    link.href = url;
    link.download = `gkk-responses-${stamp}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Responses downloaded.");
  } catch (error) {
    console.error(error);
    showToast("Unable to export responses.", true);
  }
}

function addOptionField(
  option = {
    label: "",
    description: "",
  }
) {
  const row = document.createElement("div");
  row.className = "option-row";
  row.innerHTML = `
    <input
      type="text"
      name="label"
      maxlength="3"
      value="${escapeHtml(option.label || "")}"
      placeholder="A"
      required
    />
    <textarea
      name="description"
      rows="2"
      placeholder="Describe the option"
      required
    >${escapeHtml(option.description || "")}</textarea>
    <button type="button" class="delete-option">Remove</button>
  `;

  row
    .querySelector(".delete-option")
    .addEventListener("click", () => row.remove());

  optionList.appendChild(row);
}

function collectOptions() {
  const rows = Array.from(optionList.querySelectorAll(".option-row"));
  return rows
    .map((row) => {
      const label = row.querySelector('input[name="label"]').value.trim();
      const description = row
        .querySelector('textarea[name="description"]')
        .value.trim();
      if (!label || !description) {
        return null;
      }
      return { label, description };
    })
    .filter(Boolean);
}

function render() {
  renderSections();
  renderPreview();
}

function renderSections() {
  const { sections } = state.questionnaire;
  if (!sections.length) {
    sectionList.innerHTML = `
      <div class="empty-state">
        Start by creating a section to organise your questionnaire.
      </div>
    `;
    return;
  }

  sectionList.innerHTML = sections
    .map((section, sectionIndex) => {
      const questionMarkup = section.questions
        .map((question, questionIndex) => {
          const optionsMarkup = question.options
            .map(
              (option) => `
            <div class="option-chip">
              <strong>${escapeHtml(option.label)}.</strong>
              <span>${escapeHtml(option.description)}</span>
            </div>
          `
            )
            .join("");

          return `
            <article class="question-card">
              <div class="question-header">
                <h4>${questionIndex + 1}. ${escapeHtml(question.prompt)}</h4>
                <div class="question-actions">
                  <button
                    class="ghost-btn"
                    data-action="editQuestion"
                    data-section="${section.id}"
                    data-question="${question.id}"
                  >
                    Edit
                  </button>
                  <button
                    class="ghost-btn ghost-btn--danger"
                    data-action="deleteQuestion"
                    data-section="${section.id}"
                    data-question="${question.id}"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div class="question-options">
                <div class="tag">${question.type === "multi" ? "Multi Select" : "Single Select"}</div>
                ${optionsMarkup}
              </div>
              ${
                question.guidance
                  ? `<p class="guidance">${escapeHtml(question.guidance)}</p>`
                  : ""
              }
            </article>
          `;
        })
        .join("");

      return `
        <article class="section-card">
          <div class="section-card-header">
            <div>
              <h3>${roman(sectionIndex + 1)}. ${escapeHtml(section.title)}</h3>
              <div class="section-meta">
                ${
                  section.category
                    ? `<span class="tag">${escapeHtml(section.category)}</span>`
                    : ""
                }
                <span>${section.questions.length} question${
        section.questions.length === 1 ? "" : "s"
      }</span>
              </div>
            </div>
            <div class="question-actions">
              <button
                class="ghost-btn"
                data-action="addQuestion"
                data-section="${section.id}"
              >
                + Question
              </button>
              <button
                class="ghost-btn"
                data-action="editSection"
                data-section="${section.id}"
              >
                Edit Section
              </button>
              <button
                class="ghost-btn ghost-btn--danger"
                data-action="deleteSection"
                data-section="${section.id}"
              >
                Remove
              </button>
            </div>
          </div>
          ${
            section.summary
              ? `<p class="section-summary">${escapeHtml(section.summary)}</p>`
              : ""
          }
          <div class="question-stack">
            ${
              questionMarkup ||
              `<div class="empty-state">No questions yet.</div>`
            }
          </div>
        </article>
      `;
    })
    .join("");
}

function renderPreview() {
  const { sections } = state.questionnaire;
  if (!sections.length) {
    preview.innerHTML = `
      <div class="empty-state">
        Preview appears here once sections have been added.
      </div>
    `;
    return;
  }

  preview.innerHTML = sections
    .map((section, sectionIndex) => {
      const questions = section.questions
        .map(
          (question, questionIndex) => `
            <div class="preview-question">
              <h4>
                ${sectionIndex + 1}.${questionIndex + 1}
                ${escapeHtml(question.prompt)}
              </h4>
              <ul class="preview-options">
                ${question.options
                  .map(
                    (option) => `
                      <li><strong>${escapeHtml(
                        option.label
                      )}.</strong> ${escapeHtml(option.description)}</li>
                    `
                  )
                  .join("")}
              </ul>
              ${
                question.guidance
                  ? `<p class="preview-guidance">${escapeHtml(
                      question.guidance
                    )}</p>`
                  : ""
              }
            </div>
          `
        )
        .join("");

      return `
        <section class="preview-section">
          <h3>${roman(sectionIndex + 1)}. ${escapeHtml(section.title)}</h3>
          ${
            section.summary
              ? `<p>${escapeHtml(section.summary)}</p>`
              : ""
          }
          ${questions}
        </section>
      `;
    })
    .join("");
}

function resetModalContext() {
  context.sectionId = null;
  context.questionId = null;
  optionList.innerHTML = "";
}

function markDirty() {
  state.dirty = true;
  updateSaveButton();
}

function updateSaveButton() {
  saveButton.disabled = !state.dirty;
  saveButton.textContent = state.dirty
    ? "Save Questionnaire"
    : "Saved ✓";
}

function showToast(message, isError = false) {
  const toast = document.createElement("div");
  toast.className = `toast${isError ? " toast--error" : ""}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function uid() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return (
    "id-" + Math.random().toString(36).slice(2, 9) + "-" + Date.now().toString(36)
  );
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function roman(value) {
  const romans = [
    ["M", 1000],
    ["CM", 900],
    ["D", 500],
    ["CD", 400],
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["IX", 9],
    ["V", 5],
    ["IV", 4],
    ["I", 1],
  ];
  let number = value;
  let result = "";

  romans.forEach(([symbol, magnitude]) => {
    while (number >= magnitude) {
      result += symbol;
      number -= magnitude;
    }
  });

  return result || value;
}
