const form = document.getElementById("questionnaireForm");
const clientSections = document.getElementById("clientSections");
const feedbackBanner = document.getElementById("feedbackBanner");
const titleEl = document.getElementById("questionnaireTitle");

const respondentConfig = [
  { key: "companyName", required: true },
  { key: "industry", required: true },
  { key: "respondentName", required: true },
  { key: "respondentEmail", required: true },
  { key: "respondentPhone", required: false },
];

const state = {
  questionnaire: null,
};

init();

async function init() {
  try {
    const response = await fetch("/api/questionnaire");
    if (!response.ok) {
      throw new Error(`Failed to load questionnaire (${response.status})`);
    }
    const payload = await response.json();
    state.questionnaire = normaliseQuestionnaire(payload.questionnaire);
    renderQuestionnaire();
  } catch (error) {
    console.error(error);
    feedbackBanner.innerHTML =
      '<div class="error-banner">Unable to load the questionnaire. Please try again later.</div>';
  }
}

form.addEventListener("submit", handleSubmit);

function normaliseQuestionnaire(questionnaire) {
  return {
    title: questionnaire.title || "GKK Capability Diagnostic",
    sections: (questionnaire.sections || []).map((section) => ({
      id: section.id || randomId(),
      title: section.title || "Untitled Section",
      category: section.category || "",
      summary: section.summary || "",
      questions: (section.questions || []).map((question) => ({
        id: question.id || randomId(),
        prompt: question.prompt || "Untitled question",
        guidance: question.guidance || "",
        type: question.type === "multi" ? "multi" : "single",
        options: (question.options || []).map((option) => ({
          label: option.label || "",
          description: option.description || "",
        })),
      })),
    })),
  };
}

function renderQuestionnaire() {
  clearFeedback();
  const questionnaire = state.questionnaire;
  if (!questionnaire) {
    return;
  }

  titleEl.textContent = questionnaire.title;

  clientSections.innerHTML = questionnaire.sections
    .map((section, sectionIndex) => {
      const questionsMarkup = section.questions
        .map((question, questionIndex) => {
          const inputType = question.type === "multi" ? "checkbox" : "radio";
          const optionsMarkup = question.options
            .map((option) => {
              const optionId = `${question.id}-${option.label}`;
              const requiredAttr = question.type === "single" ? "required" : "";
              return `
                <div class="client-option">
                  <input
                    type="${inputType}"
                    id="${optionId}"
                    name="${question.id}"
                    value="${escapeHtml(option.label)}"
                    ${requiredAttr}
                  />
                  <label for="${optionId}">
                    <strong>${escapeHtml(option.label)}.</strong>
                    <span>${escapeHtml(option.description)}</span>
                  </label>
                </div>
              `;
            })
            .join("");

          return `
            <fieldset
              class="client-question"
              data-question-id="${question.id}"
              data-section-id="${section.id}"
            >
              <legend>
                ${sectionIndex + 1}.${questionIndex + 1}
                ${escapeHtml(question.prompt)}
              </legend>
              <div class="client-options">
                ${optionsMarkup}
              </div>
              ${
                question.guidance
                  ? `<p class="client-guidance">${escapeHtml(
                      question.guidance
                    )}</p>`
                  : ""
              }
            </fieldset>
          `;
        })
        .join("");

      return `
        <section class="client-section">
          <h2>${escapeHtml(section.title)}</h2>
          ${
            section.summary
              ? `<p>${escapeHtml(section.summary)}</p>`
              : ""
          }
          ${questionsMarkup}
        </section>
      `;
    })
    .join("");
}

async function handleSubmit(event) {
  event.preventDefault();
  clearFeedback();
  clearQuestionErrors();
  clearFieldErrors();

  if (!state.questionnaire) {
    feedbackBanner.innerHTML =
      '<div class="error-banner">Questionnaire not loaded. Please refresh.</div>';
    return;
  }

  const formData = new FormData(form);
  const respondent = collectRespondent(formData);
  if (!respondent) {
    feedbackBanner.innerHTML =
      '<div class="error-banner">Please complete the required respondent details.</div>';
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const answers = collectAnswers(formData);
  if (!answers) {
    feedbackBanner.innerHTML =
      '<div class="error-banner">Please answer all questions before submitting.</div>';
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    const response = await fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionnaire_title: state.questionnaire.title,
        submitted_at: new Date().toISOString(),
        respondent,
        answers,
      }),
    });

    if (!response.ok) {
      throw new Error(`Submission failed (${response.status})`);
    }

    feedbackBanner.innerHTML =
      '<div class="success-banner">Thank you! Your responses have been submitted successfully.</div>';
    form.reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error(error);
    feedbackBanner.innerHTML =
      '<div class="error-banner">We could not save your responses. Please try again.</div>';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Responses";
  }
}

function collectRespondent(formData) {
  const result = {};
  let valid = true;

  respondentConfig.forEach(({ key, required }) => {
    const field = document.querySelector(`.field[data-field="${key}"]`);
    const input = document.getElementById(key);
    if (!input || !field) {
      return;
    }
    const value = (formData.get(key) || "").toString().trim();
    if (required && !value) {
      markFieldError(field);
      valid = false;
    }
    if (value) {
      result[key] = value;
    }
  });

  if (!valid) {
    return null;
  }

  return result;
}

function collectAnswers(formData) {
  const answers = [];
  let isValid = true;

  state.questionnaire.sections.forEach((section) => {
    section.questions.forEach((question) => {
      const entry = {
        question_id: question.id,
        prompt: question.prompt,
        type: question.type,
        section_id: section.id,
        section_title: section.title,
      };

      const values = formData.getAll(question.id).filter(Boolean);
      if (!values.length) {
        markQuestionError(question.id);
        isValid = false;
        return;
      }

      const selected = values.map((value) => {
        const option = question.options.find(
          (item) => String(item.label) === String(value)
        );
        return {
          label: option ? option.label : value,
          description: option ? option.description : "",
        };
      });

      entry.selected = selected;
      answers.push(entry);
    });
  });

  if (!isValid) {
    return null;
  }

  return answers;
}

function markQuestionError(questionId) {
  const fieldset = form.querySelector(
    `.client-question[data-question-id="${cssEscape(questionId)}"]`
  );
  if (fieldset) {
    fieldset.classList.add("error");
  }
}

function clearQuestionErrors() {
  form
    .querySelectorAll(".client-question.error")
    .forEach((fieldset) => fieldset.classList.remove("error"));
}

function markFieldError(field) {
  field.classList.add("error");
  const input = field.querySelector("input, textarea, select");
  if (input) {
    input.setAttribute("aria-invalid", "true");
  }
}

function clearFieldErrors() {
  document
    .querySelectorAll(".field.error")
    .forEach((field) => {
      field.classList.remove("error");
      const input = field.querySelector("input, textarea, select");
      if (input) {
        input.removeAttribute("aria-invalid");
      }
    });
}

function clearFeedback() {
  feedbackBanner.innerHTML = "";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function randomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "id-" + Math.random().toString(36).slice(2, 9);
}

function cssEscape(value) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return String(value).replace(/"/g, '\\"');
}
