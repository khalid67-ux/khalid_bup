/* =========================================================
   Tender Package Builder
   Frontend-only application
   No backend / database / server upload
========================================================= */

(() => {
  "use strict";

  /* =======================================================
     CONSTANTS
  ======================================================== */

  const MAX_FILES = 30;
  const MAX_TOTAL_BYTES = 50 * 1024 * 1024;

  const PDFJS_VERSION = "4.4.168";
  const PDFJS_URL =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.mjs`;

  const PDFJS_WORKER_URL =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;

  const STORAGE_KEY = "tenderPackageBuilderState";

  const FOOTER_HEIGHT = 28;


  /* =======================================================
     APPLICATION STATE
  ======================================================== */

  const state = {
    lang: "en",
    tender: null,
    requirements: [],
    files: [],
    matches: {},
    expiry: {},
    generated: false,
    pdfEngineReady: false,
    pdfEngineError: false
  };


  /* =======================================================
     DOM HELPER
  ======================================================== */

  const $ = (id) => document.getElementById(id);


  /* =======================================================
     TRANSLATIONS
  ======================================================== */

  const t = {

    en: {

      appTitle:
        "Build a complete, checked tender PDF package.",

      appSubtitle:
        "Load requirements, upload PDFs, match documents, validate expiry dates, resolve duplicates, then generate one submission-ready package.",

      reqHead:
        "Tender requirements",

      loadReq:
        "Load requirements.json",

      noTender:
        "No tender loaded",

      reqStart:
        "Choose the provided requirements.json file to start.",

      upload:
        "Upload PDF files",

      drop:
        "Drop PDFs here or click to browse",

      hint:
        "PDF only • up to 30 files • 50 MB total",

      engineLoading:
        "PDF engine loading…",

      engineReady:
        "PDF engine ready",

      engineError:
        "PDF engine unavailable",

      engineWait:
        "Preparing PDF engine…",

      check:
        "Document checklist",

      ok:
        "OK",

      blocking:
        "Blocking",

      optional:
        "Optional",

      loadCheck:
        "Load requirements to see the checklist.",

      validation:
        "Validation center",

      blockN:
        "blocking",

      readiness:
        "Package readiness",

      ready:
        "All checks passed. Your package is ready to generate.",

      notReady:
        "Resolve all blocking issues before generating.",

      progressStart:
        "Load requirements to begin.",

      progressFiles:
        "Upload and match the required documents.",

      progressChecks:
        "Resolve all blocking checks.",

      progressReady:
        "Your package is ready to generate.",

      generate:
        "Generate package",

      export:
        "Checklist export",

      exportText:
        "Export the current checklist as CSV for office records.",

      csv:
        "Export CSV",

      save:
        "Save & reopen",

      saveText:
        "Save your project locally in this browser. PDF files can also be restored during this browser session.",

      saveState:
        "Save state",

      restore:
        "Restore state",

      privacy:
        "Privacy by design",

      privacyText:
        "No backend, database, or upload service is used. PDFs are processed locally with browser APIs.",

      tenderId:
        "Tender ID",

      title:
        "Title",

      entity:
        "Procuring entity",

      bidder:
        "Bidder",

      deadline:
        "Submission deadline",

      order:
        "Order",

      document:
        "Document",

      file:
        "Matched file",

      expiry:
        "Expiry date",

      status:
        "Status",

      required:
        "Required",

      optionalLabel:
        "Optional",

      expiryCheck:
        "Expiry check",

      noExpiry:
        "Not required",

      missing:
        "Missing",

      expiryNeeded:
        "Expiry date needed",

      expired:
        "Expired",

      notProvided:
        "Not provided",

      noFile:
        "— No file —",

      remove:
        "Remove",

      duplicate:
        "Duplicate",

      invalidPdf:
        "Only PDF files are allowed.",

      tooMany:
        "Maximum 30 PDF files.",

      tooLarge:
        "Total file size must not exceed 50 MB.",

      noReq:
        "Load requirements.json first.",

      badReq:
        "Invalid requirements.json. Check its tender and requirements fields.",

      requirementsEmpty:
        "The requirements list cannot be empty.",

      requirementsInvalid:
        "One or more requirements have invalid fields.",

      duplicateRequirementId:
        "Requirement IDs must be unique.",

      duplicateRequirementOrder:
        "Requirement order values must be unique.",

      matchedElse:
        "This file is already matched to another requirement.",

      duplicateBlock:
        "Duplicate content cannot be matched to different documents.",

      duplicateSameContent:
        "This PDF has identical content to another uploaded PDF.",

      pdfReadFail:
        "Could not read this PDF. It may be damaged or password-protected.",

      allGood:
        "No blocking problems",

      genFail:
        "Package generation failed. Check the PDF files and try again.",

      generated:
        "Package generated successfully.",

      saved:
        "Project state saved locally.",

      restored:
        "Saved state restored.",

      restoreNoFiles:
        "Saved state restored. Re-select PDFs if they are no longer available.",

      chooseExpiry:
        "Enter an expiry date.",

      expiredMsg:
        "Expiry is before the submission deadline.",

      pages:
        "pages",

      files:
        "files",

      resetConfirm:
        "Reset the current tender, matches and uploaded files?",

      coverTitle:
        "TENDER SUBMISSION PACKAGE",

      coverSubtitle:
        "Submission-ready document set",

      includedDocuments:
        "INCLUDED DOCUMENTS",

      packageCreated:
        "Package Created",

      csvDocument:
        "Document",

      csvFile:
        "File",

      csvPages:
        "Pages",

      csvExpiry:
        "Expiry Date",

      csvStatus:
        "Status",

      localProcessing:
        "✓ Local processing",

      shaCheck:
        "✓ SHA-256 duplicate check",

      noLogin:
        "✓ No login"

    },


    bn: {

      appTitle:
        "সম্পূর্ণ ও যাচাইকৃত Tender PDF Package তৈরি করুন।",

      appSubtitle:
        "Requirements লোড করুন, PDF আপলোড করুন, document match করুন, expiry যাচাই করুন, duplicate ঠিক করুন এবং final package তৈরি করুন।",

      reqHead:
        "Tender requirements",

      loadReq:
        "requirements.json লোড করুন",

      noTender:
        "কোনো tender লোড হয়নি",

      reqStart:
        "শুরু করতে দেওয়া requirements.json ফাইল নির্বাচন করুন।",

      upload:
        "PDF ফাইল আপলোড",

      drop:
        "PDF এখানে টেনে আনুন অথবা ক্লিক করে নির্বাচন করুন",

      hint:
        "শুধু PDF • সর্বোচ্চ ৩০টি ফাইল • মোট ৫০ MB",

      engineLoading:
        "PDF engine লোড হচ্ছে…",

      engineReady:
        "PDF engine প্রস্তুত",

      engineError:
        "PDF engine পাওয়া যায়নি",

      engineWait:
        "PDF engine প্রস্তুত হচ্ছে…",

      check:
        "Document checklist",

      ok:
        "ঠিক আছে",

      blocking:
        "Blocking",

      optional:
        "Optional",

      loadCheck:
        "Checklist দেখতে requirements লোড করুন।",

      validation:
        "Validation center",

      blockN:
        "টি blocking সমস্যা",

      readiness:
        "Package readiness",

      ready:
        "সব check ঠিক আছে। Package generate করা যাবে।",

      notReady:
        "Generate করার আগে সব blocking সমস্যা সমাধান করুন।",

      progressStart:
        "শুরু করতে requirements লোড করুন।",

      progressFiles:
        "Required documents upload ও match করুন।",

      progressChecks:
        "সব blocking সমস্যা সমাধান করুন।",

      progressReady:
        "আপনার package generate করার জন্য প্রস্তুত।",

      generate:
        "Package তৈরি করুন",

      export:
        "Checklist export",

      exportText:
        "Office record-এর জন্য বর্তমান checklist CSV হিসেবে export করুন।",

      csv:
        "CSV Export",

      save:
        "Save & reopen",

      saveText:
        "Project browser-এ locally save করুন। একই browser session-এ PDF ফাইলও restore করা যাবে।",

      saveState:
        "Save state",

      restore:
        "Restore state",

      privacy:
        "Privacy by design",

      privacyText:
        "কোনো backend, database বা upload service ব্যবহার করা হয় না। PDF browser-এর মধ্যেই process হয়।",

      tenderId:
        "Tender ID",

      title:
        "Title",

      entity:
        "Procuring entity",

      bidder:
        "Bidder",

      deadline:
        "Submission deadline",

      order:
        "ক্রম",

      document:
        "Document",

      file:
        "Matched file",

      expiry:
        "Expiry date",

      status:
        "Status",

      required:
        "Required",

      optionalLabel:
        "Optional",

      expiryCheck:
        "Expiry check",

      noExpiry:
        "প্রয়োজন নেই",

      missing:
        "Missing",

      expiryNeeded:
        "Expiry date প্রয়োজন",

      expired:
        "Expired",

      notProvided:
        "দেওয়া হয়নি",

      noFile:
        "— কোনো file নেই —",

      remove:
        "Remove",

      duplicate:
        "Duplicate",

      invalidPdf:
        "শুধু PDF ফাইল গ্রহণযোগ্য।",

      tooMany:
        "সর্বোচ্চ ৩০টি PDF ফাইল।",

      tooLarge:
        "মোট file size ৫০ MB-এর বেশি হতে পারবে না।",

      noReq:
        "আগে requirements.json লোড করুন।",

      badReq:
        "requirements.json সঠিক নয়। tender ও requirements fields পরীক্ষা করুন।",

      requirementsEmpty:
        "Requirements list খালি হতে পারবে না।",

      requirementsInvalid:
        "এক বা একাধিক requirement-এর field সঠিক নয়।",

      duplicateRequirementId:
        "Requirement ID unique হতে হবে।",

      duplicateRequirementOrder:
        "Requirement order unique হতে হবে।",

      matchedElse:
        "এই file ইতিমধ্যে অন্য requirement-এর সাথে match করা হয়েছে।",

      duplicateBlock:
        "Duplicate content আলাদা document-এ match করা যাবে না।",

      duplicateSameContent:
        "এই PDF-এর content অন্য একটি uploaded PDF-এর সাথে একই।",

      pdfReadFail:
        "PDF পড়া যায়নি। ফাইলটি damaged বা password-protected হতে পারে।",

      allGood:
        "কোনো blocking সমস্যা নেই",

      genFail:
        "Package তৈরি করা যায়নি। PDF files পরীক্ষা করে আবার চেষ্টা করুন।",

      generated:
        "Package সফলভাবে তৈরি হয়েছে।",

      saved:
        "Project state browser-এ save হয়েছে।",

      restored:
        "Saved state restore হয়েছে।",

      restoreNoFiles:
        "Saved state restore হয়েছে। PDF আর session-এ না থাকলে আবার select করুন।",

      chooseExpiry:
        "Expiry date দিন।",

      expiredMsg:
        "Expiry submission deadline-এর আগে।",

      pages:
        "pages",

      files:
        "files",

      resetConfirm:
        "বর্তমান tender, matches এবং uploaded files reset করবেন?",

      coverTitle:
        "TENDER SUBMISSION PACKAGE",

      coverSubtitle:
        "Submission-ready document set",

      includedDocuments:
        "INCLUDED DOCUMENTS",

      packageCreated:
        "Package Created",

      csvDocument:
        "Document",

      csvFile:
        "File",

      csvPages:
        "Pages",

      csvExpiry:
        "Expiry Date",

      csvStatus:
        "Status",

      localProcessing:
        "✓ Local processing",

      shaCheck:
        "✓ SHA-256 duplicate check",

      noLogin:
        "✓ No login"

    }

  };


  const L = () => t[state.lang];


  /* =======================================================
     GENERAL HELPERS
  ======================================================== */

  function esc(value) {
    return String(value ?? "")
      .replace(
        /[&<>"']/g,
        (match) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        }[match])
      );
  }


  function toast(message, type = "") {
    const root = $("toastRoot");

    if (!root) return;

    const element = document.createElement("div");

    element.className = `toast ${type}`.trim();

    element.textContent = message;

    root.appendChild(element);

    setTimeout(() => {
      element.remove();
    }, 3600);
  }


  function setText(id, key) {
    const element = $(id);

    if (element) {
      element.textContent = L()[key] ?? "";
    }
  }


  function fmtBytes(bytes) {
    if (!Number.isFinite(bytes)) {
      return "0 KB";
    }

    if (bytes < 1024 * 1024) {
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }


  function reqTitle(requirement) {
    return state.lang === "bn"
      ? (requirement.title_bn || requirement.title_en)
      : (requirement.title_en || requirement.title_bn);
  }


  /*
   * PDF cover must ALWAYS be English.
   * Therefore this helper intentionally does not use reqTitle().
   */
  function reqEnglishTitle(requirement) {
    return requirement.title_en || requirement.title_bn || "";
  }


  function isValidDateString(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
      return false;
    }

    const date = new Date(`${value}T00:00:00`);

    return !Number.isNaN(date.getTime());
  }


  function formatToday() {
    const now = new Date();

    const y = now.getFullYear();

    const m = String(now.getMonth() + 1).padStart(2, "0");

    const d = String(now.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  }


  /* =======================================================
     SHA-256
  ======================================================== */

  async function sha256(file) {
    const buffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      buffer
    );

    return [...new Uint8Array(hashBuffer)]
      .map(
        (byte) =>
          byte.toString(16).padStart(2, "0")
      )
      .join("");
  }


  /* =======================================================
     PDF PAGE COUNT
  ======================================================== */

  async function pdfPages(file) {

    if (!state.pdfEngineReady || !window.pdfjsLib) {
      throw new Error("PDF.js unavailable");
    }

    const bytes = new Uint8Array(
      await file.arrayBuffer()
    );

    const loadingTask =
      window.pdfjsLib.getDocument({
        data: bytes
      });

    const pdf = await loadingTask.promise;

    return pdf.numPages;
  }


  /* =======================================================
     PDF.JS LOADER
  ======================================================== */

  async function loadPdfJs() {

    updatePdfEngineStatus("loading");

    try {

      const pdfjs = await import(PDFJS_URL);

      window.pdfjsLib = pdfjs;

      if (pdfjs.GlobalWorkerOptions) {
        pdfjs.GlobalWorkerOptions.workerSrc =
          PDFJS_WORKER_URL;
      }

      if (
        !window.pdfjsLib ||
        typeof window.pdfjsLib.getDocument !== "function"
      ) {
        throw new Error(
          "PDF.js getDocument unavailable"
        );
      }

      state.pdfEngineReady = true;
      state.pdfEngineError = false;

      updatePdfEngineStatus("ready");

    } catch (error) {

      console.error(
        "PDF.js loading failed:",
        error
      );

      state.pdfEngineReady = false;
      state.pdfEngineError = true;

      updatePdfEngineStatus("error");

    }
  }


  function updatePdfEngineStatus(status) {

    const badge = $("pdfEngineStatus");

    const text = $("pdfEngineStatusText");

    const dropHint = $("dropEngineHint");

    const dropzone = $("dropzone");

    if (!badge) return;


    badge.classList.remove(
      "loading",
      "ready",
      "error"
    );

    badge.classList.add(status);


    if (status === "loading") {

      if (text) {
        text.textContent = L().engineLoading;
      }

      if (dropHint) {
        dropHint.textContent = L().engineWait;
      }

      if (dropzone) {
        dropzone.classList.add("disabled");
      }

    } else if (status === "ready") {

      if (text) {
        text.textContent = L().engineReady;
      }

      if (dropHint) {
        dropHint.textContent =
          L().engineReady;
      }

      if (dropzone) {
        dropzone.classList.remove("disabled");
      }

    } else {

      if (text) {
        text.textContent = L().engineError;
      }

      if (dropHint) {
        dropHint.textContent =
          L().engineError;
      }

      if (dropzone) {
        dropzone.classList.add("disabled");
      }
    }
  }


  /* =======================================================
     LANGUAGE
  ======================================================== */

  function applyLang() {

    document.documentElement.lang =
      state.lang === "bn"
        ? "bn"
        : "en";


    const mappings = [

      ["appTitle", "appTitle"],

      ["appSubtitle", "appSubtitle"],

      ["requirementsHeading", "reqHead"],

      ["loadReqText", "loadReq"],

      ["reqEmptyTitle", "noTender"],

      ["reqEmptyText", "reqStart"],

      ["uploadHeading", "upload"],

      ["dropTitle", "drop"],

      ["dropHint", "hint"],

      ["checkHeading", "check"],

      ["legendOk", "ok"],

      ["legendBlock", "blocking"],

      ["legendOptional", "optional"],

      ["validationHeading", "validation"],

      ["readyTitle", "readiness"],

      ["exportHeading", "export"],

      ["exportText", "exportText"],

      ["csvBtn", "csv"],

      ["saveHeading", "save"],

      ["saveText", "saveText"],

      ["saveBtn", "saveState"],

      ["restoreBtn", "restore"],

      ["privacyHeading", "privacy"],

      ["privacyText", "privacyText"],

      ["privacyLocal", "localProcessing"],

      ["privacyHash", "shaCheck"],

      ["privacyLogin", "noLogin"],

      ["generateBtn", "generate"],

      ["footerLeft", "privacyText"]

    ];


    mappings.forEach(
      ([id, key]) => setText(id, key)
    );


    if ($("langBtn")) {
      $("langBtn").textContent =
        state.lang === "en"
          ? "বাংলা"
          : "English";
    }


    updatePdfEngineStatus(
      state.pdfEngineError
        ? "error"
        : state.pdfEngineReady
          ? "ready"
          : "loading"
    );


    renderAll();
  }


  /* =======================================================
     TENDER RENDER
  ======================================================== */

  function renderTender() {

    if (!state.tender) {

      $("tenderSummary")?.classList.remove(
        "hidden"
      );

      $("tenderInfo")?.classList.add(
        "hidden"
      );

      return;
    }


    $("tenderSummary")?.classList.add(
      "hidden"
    );

    $("tenderInfo")?.classList.remove(
      "hidden"
    );


    const data = state.tender;


    $("tenderInfo").innerHTML = `

      <div class="tender-grid">

        <div class="info-box tender-title">
          <label>${esc(L().title)}</label>
          <strong>${esc(data.title || "—")}</strong>
        </div>

        <div class="info-box">
          <label>${esc(L().tenderId)}</label>
          <strong>${esc(data.tender_id || "—")}</strong>
        </div>

        <div class="info-box">
          <label>${esc(L().deadline)}</label>
          <strong>${esc(data.submission_deadline || "—")}</strong>
        </div>

        <div class="info-box">
          <label>${esc(L().entity)}</label>
          <strong>${esc(data.procuring_entity || "—")}</strong>
        </div>

        <div class="info-box">
          <label>${esc(L().bidder)}</label>
          <strong>${esc(data.bidder || "—")}</strong>
        </div>

      </div>

    `;
  }


  /* =======================================================
     FILE RENDER
  ======================================================== */

  function renderFiles() {

    const count = $("fileCount");

    if (count) {
      count.textContent =
        `${state.files.length} / ${MAX_FILES}`;
    }


    const list = $("fileList");

    if (!list) return;


    if (!state.files.length) {
      list.innerHTML = "";
      return;
    }


    list.innerHTML =
      state.files
        .map(
          (file) => `

            <div class="file-item">

              <div class="file-icon">
                PDF
              </div>

              <div>

                <div
                  class="file-name"
                  title="${esc(file.name)}"
                >
                  ${esc(file.name)}
                </div>

                <div class="file-meta">
                  ${file.pages ?? "?"}
                  ${esc(L().pages)}
                  •
                  ${fmtBytes(file.size)}
                </div>

              </div>

              <div>

                ${
                  file.duplicate
                    ? `
                      <span class="duplicate">
                        ⚠ ${esc(L().duplicate)}
                      </span>
                    `
                    : ""
                }

                <button
                  class="btn btn-ghost"
                  type="button"
                  title="${esc(L().remove)}"
                  aria-label="${esc(L().remove)} ${esc(file.name)}"
                  data-remove="${esc(file.id)}"
                >
                  ×
                </button>

              </div>

            </div>

          `
        )
        .join("");


    document
      .querySelectorAll("[data-remove]")
      .forEach(
        (button) => {

          button.onclick = () => {

            removeFile(
              button.dataset.remove
            );

          };

        }
      );
  }


  /* =======================================================
     DUPLICATE HELPERS
  ======================================================== */

  function getDuplicateHashes() {

    const counts = new Map();

    state.files.forEach(
      (file) => {

        if (!file.hash) return;

        counts.set(
          file.hash,
          (counts.get(file.hash) || 0) + 1
        );

      }
    );

    return counts;
  }


  function isDuplicateFile(file) {

    if (!file?.hash) {
      return false;
    }

    const counts =
      getDuplicateHashes();

    return (
      (counts.get(file.hash) || 0) > 1
    );
  }


  function duplicateMatchedElsewhere(
    requirementId,
    hash
  ) {

    if (!hash) {
      return false;
    }


    return Object.entries(
      state.matches
    ).some(
      ([otherRequirementId, fileId]) => {

        if (
          otherRequirementId ===
          requirementId
        ) {
          return false;
        }

        const otherFile =
          state.files.find(
            (file) =>
              file.id === fileId
          );

        return (
          otherFile?.hash === hash
        );

      }
    );
  }


  /* =======================================================
     REQUIREMENT STATUS
  ======================================================== */

  function statusFor(requirement) {

    const id = requirement.id;

    const fileId =
      state.matches[id];


    if (!fileId) {

      if (requirement.mandatory) {

        return {
          key: "missing",
          block: true,
          cls: "block"
        };

      }

      return {
        key: "notProvided",
        block: false,
        cls: "optional"
      };
    }


    const file =
      state.files.find(
        (item) => item.id === fileId
      );


    if (!file) {

      return {
        key: "missing",
        block: !!requirement.mandatory,
        cls: "block"
      };
    }


    const reused =
      Object.entries(state.matches)
        .some(
          ([otherId, otherFileId]) =>
            otherId !== id &&
            otherFileId === fileId
        );


    if (reused) {

      return {
        key: "missing",
        block: true,
        cls: "block"
      };
    }


    if (
      isDuplicateFile(file) &&
      duplicateMatchedElsewhere(
        id,
        file.hash
      )
    ) {

      return {
        key: "missing",
        block: true,
        cls: "block"
      };
    }


    if (requirement.has_expiry) {

      const expiryDate =
        state.expiry[id];


      if (!expiryDate) {

        return {
          key: "expiryNeeded",
          block: true,
          cls: "warn"
        };
      }


      if (
        !isValidDateString(expiryDate)
      ) {

        return {
          key: "expiryNeeded",
          block: true,
          cls: "warn"
        };
      }


      /*
       * Same-day expiry is VALID.
       * Only expiry strictly before
       * submission deadline is invalid.
       */
      if (
        state.tender?.submission_deadline &&
        expiryDate <
          state.tender.submission_deadline
      ) {

        return {
          key: "expired",
          block: true,
          cls: "block"
        };
      }

    }


    return {
      key: "ok",
      block: false,
      cls: "ok"
    };
  }


  /* =======================================================
     CHECKLIST RENDER
  ======================================================== */

  function renderChecklist() {

    const container =
      $("requirementsTable");

    if (!container) return;


    if (!state.requirements.length) {

      container.innerHTML = `

        <div class="empty-state compact">

          <div class="empty-icon">
            ✓
          </div>

          <p>
            ${esc(L().loadCheck)}
          </p>

        </div>

      `;

      return;
    }


    const options =
      `
        <option value="">
          ${esc(L().noFile)}
        </option>
      ` +
      state.files
        .map(
          (file) => `
            <option value="${esc(file.id)}">
              ${esc(file.name)}
              ${
                isDuplicateFile(file)
                  ? " ⚠"
                  : ""
              }
            </option>
          `
        )
        .join("");


    const rows =
      state.requirements
        .map(
          (requirement) => {

            const status =
              statusFor(requirement);

            return `

              <div class="req-row">

                <div class="req-order">
                  ${esc(requirement.order)}
                </div>


                <div class="req-name">

                  <strong>
                    ${esc(reqTitle(requirement))}
                  </strong>

                  <span>
                    ${
                      requirement.mandatory
                        ? esc(L().required)
                        : esc(L().optionalLabel)
                    }

                    ${
                      requirement.has_expiry
                        ? ` • ${esc(L().expiryCheck)}`
                        : ""
                    }
                  </span>

                </div>


                <div>

                  <select
                    class="match-select"
                    data-match="${esc(requirement.id)}"
                    aria-label="${esc(reqTitle(requirement))} file"
                  >
                    ${options}
                  </select>

                </div>


                <div>

                  ${
                    requirement.has_expiry

                      ? `

                        <input
                          class="date-input"
                          type="date"
                          data-expiry="${esc(requirement.id)}"
                          value="${esc(state.expiry[requirement.id] || "")}"
                          min="${esc(state.tender?.submission_deadline || "")}"
                          aria-label="${esc(L().expiry)}"
                        >

                      `

                      : `

                        <input
                          class="date-input"
                          type="text"
                          disabled
                          value="${esc(L().noExpiry)}"
                          aria-label="${esc(L().noExpiry)}"
                        >

                      `
                  }

                </div>


                <div>

                  <span
                    class="status ${status.cls}"
                  >
                    ${esc(L()[status.key])}
                  </span>

                </div>

              </div>

            `;

          }
        )
        .join("");


    container.innerHTML = `

      <div class="req-row header">

        <div>
          ${esc(L().order)}
        </div>

        <div>
          ${esc(L().document)}
        </div>

        <div>
          ${esc(L().file)}
        </div>

        <div>
          ${esc(L().expiry)}
        </div>

        <div>
          ${esc(L().status)}
        </div>

      </div>

      ${rows}

    `;


    document
      .querySelectorAll("[data-match]")
      .forEach(
        (select) => {

          select.value =
            state.matches[
              select.dataset.match
            ] || "";

          select.onchange = () => {

            setMatch(
              select.dataset.match,
              select.value
            );

          };

        }
      );


    document
      .querySelectorAll("[data-expiry]")
      .forEach(
        (input) => {

          input.onchange = () => {

            const id =
              input.dataset.expiry;

            state.expiry[id] =
              input.value;

            renderAll();

          };

        }
      );
  }


  /* =======================================================
     VALIDATION CENTER
  ======================================================== */

  function renderValidation() {

    const rows =
      state.requirements.map(
        (requirement) => ({
          requirement,
          status: statusFor(requirement)
        })
      );


    const blocking =
      rows.filter(
        (item) => item.status.block
      );


    const blockingCount =
      blocking.length;


    const blockingPill =
      $("blockingPill");

    if (blockingPill) {

      blockingPill.textContent =
        `${blockingCount} ${L().blockN}`;

      blockingPill.classList.toggle(
        "danger",
        blockingCount > 0
      );

    }


    const validationList =
      $("validationList");

    if (!validationList) return;


    if (!rows.length) {

      validationList.innerHTML = `

        <div class="validation-item">

          <strong>
            ${esc(L().noTender)}
          </strong>

          <p>
            ${esc(L().reqStart)}
          </p>

        </div>

      `;

    } else {

      validationList.innerHTML =
        rows
          .map(
            ({ requirement, status }) => `

              <div
                class="validation-item ${
                  status.block
                    ? "bad"
                    : "good"
                }"
              >

                <strong>

                  ${
                    status.block
                      ? "⚠"
                      : "✓"
                  }

                  ${esc(
                    reqTitle(requirement)
                  )}

                </strong>

                <p>

                  ${esc(
                    L()[status.key]
                  )}

                  ${
                    status.key === "expired"
                      ? ` — ${esc(L().expiredMsg)}`
                      : ""
                  }

                </p>

              </div>

            `
          )
          .join("");

    }


    const ready =
      state.requirements.length > 0 &&
      blockingCount === 0 &&
      state.pdfEngineReady;


    const generateButton =
      $("generateBtn");

    if (generateButton) {
      generateButton.disabled =
        !ready;
    }


    const readyText =
      $("readyText");

    if (readyText) {

      if (
        state.requirements.length &&
        blockingCount === 0 &&
        !state.pdfEngineReady
      ) {

        readyText.textContent =
          L().engineLoading;

      } else {

        readyText.textContent =
          ready
            ? L().ready
            : L().notReady;

      }

    }


    const csvButton =
      $("csvBtn");

    if (csvButton) {
      csvButton.disabled =
        state.requirements.length === 0;
    }


    const total =
      state.requirements.length;

    let percentage = 0;


    if (total > 0) {

      const satisfied =
        rows.filter(
          (item) =>
            !item.status.block
        ).length;

      percentage =
        Math.round(
          (satisfied / total) * 100
        );

    }


    const progressLabel =
      $("progressLabel");

    if (progressLabel) {

      progressLabel.textContent =
        `${percentage}% ${
          state.requirements.length
            ? percentage === 100
              ? "ready"
              : "checked"
            : "ready"
        }`;

    }


    const progressBar =
      $("progressBar");

    if (progressBar) {

      progressBar.style.width =
        `${percentage}%`;

    }


    const progressElement =
      document.querySelector(
        ".progress"
      );

    if (progressElement) {

      progressElement.setAttribute(
        "aria-valuenow",
        String(percentage)
      );

    }


    const progressHint =
      $("progressHint");

    if (progressHint) {

      if (!state.requirements.length) {

        progressHint.textContent =
          L().progressStart;

      } else if (percentage === 100) {

        progressHint.textContent =
          L().progressReady;

      } else if (
        state.files.length === 0
      ) {

        progressHint.textContent =
          L().progressFiles;

      } else {

        progressHint.textContent =
          L().progressChecks;

      }

    }


    updateWorkflowSteps(
      percentage,
      blockingCount
    );
  }


  /* =======================================================
     WORKFLOW STEPPER
  ======================================================== */

  function updateWorkflowSteps(
    percentage,
    blockingCount
  ) {

    const steps = [
      $("stepTender") || document.querySelector(".step:nth-of-type(1)"),
      $("stepUpload") || document.querySelector(".step:nth-of-type(3)"),
      $("stepCheck") || document.querySelector(".step:nth-of-type(5)"),
      $("stepGenerate") || document.querySelector(".step:nth-of-type(7)")
    ];

    const actualSteps =
      document.querySelectorAll(".step");

    if (actualSteps.length >= 4) {
      steps[0] =
        $("stepTender") ||
        actualSteps[0];

      steps[1] =
        $("stepUpload") ||
        actualSteps[1];

      steps[2] =
        $("stepCheck") ||
        actualSteps[2];

      steps[3] =
        $("stepGenerate") ||
        actualSteps[3];
    }


    steps.forEach(
      (step) => {

        if (step) {
          step.classList.remove(
            "active",
            "done"
          );
        }

      }
    );


    if (!state.tender) {

      steps[0]?.classList.add(
        "active"
      );

      return;
    }


    steps[0]?.classList.add(
      "done"
    );


    if (!state.files.length) {

      steps[1]?.classList.add(
        "active"
      );

      return;
    }


    steps[1]?.classList.add(
      "done"
    );


    if (
      blockingCount > 0
    ) {

      steps[2]?.classList.add(
        "active"
      );

      return;
    }


    steps[2]?.classList.add(
      "done"
    );


    if (
      percentage === 100
    ) {

      steps[3]?.classList.add(
        "active"
      );

    }

  }


  /* =======================================================
     RENDER ALL
  ======================================================== */

  function renderAll() {

    renderTender();

    renderFiles();

    renderChecklist();

    renderValidation();

  }


  /* =======================================================
     REQUIREMENTS VALIDATION
  ======================================================== */

  function validateRequirementsData(data) {

    if (
      !data ||
      typeof data !== "object"
    ) {
      return false;
    }


    const tender =
      data.tender;

    const requirements =
      data.requirements;


    if (
      !tender ||
      typeof tender !== "object"
    ) {
      return false;
    }


    if (
      !Array.isArray(requirements) ||
      requirements.length === 0
    ) {
      throw new Error(
        "requirements-empty"
      );
    }


    const requiredTenderFields = [
      "tender_id",
      "title",
      "procuring_entity",
      "bidder",
      "submission_deadline"
    ];


    const tenderValid =
      requiredTenderFields.every(
        (field) =>
          typeof tender[field] === "string" &&
          tender[field].trim() !== ""
      );


    if (!tenderValid) {
      return false;
    }


    if (
      !isValidDateString(
        tender.submission_deadline
      )
    ) {
      return false;
    }


    const ids = new Set();

    const orders = new Set();


    for (const requirement of requirements) {

      if (
        !requirement ||
        typeof requirement !== "object"
      ) {
        throw new Error(
          "requirements-invalid"
        );
      }


      const validBasic =
        typeof requirement.id === "string" &&
        requirement.id.trim() !== "" &&

        Number.isFinite(
          Number(requirement.order)
        ) &&

        typeof requirement.title_en === "string" &&
        requirement.title_en.trim() !== "" &&

        typeof requirement.title_bn === "string" &&
        requirement.title_bn.trim() !== "" &&

        typeof requirement.mandatory === "boolean" &&

        typeof requirement.has_expiry === "boolean";


      if (!validBasic) {
        throw new Error(
          "requirements-invalid"
        );
      }


      if (
        ids.has(requirement.id)
      ) {
        throw new Error(
          "duplicate-id"
        );
      }


      if (
        orders.has(
          Number(requirement.order)
        )
      ) {
        throw new Error(
          "duplicate-order"
        );
      }


      ids.add(requirement.id);

      orders.add(
        Number(requirement.order)
      );

    }


    return true;
  }


  /* =======================================================
     LOAD REQUIREMENTS.JSON
  ======================================================== */

  async function loadRequirements(file) {

    try {

      if (!file) return;


      const isJson =
        file.type === "application/json" ||
        file.name.toLowerCase().endsWith(".json");

      if (!isJson) {
        throw new Error("requirements-invalid");
      }


      const text =
        await file.text();

      if (!text.trim()) {
        throw new Error("requirements-invalid");
      }


      const data =
        JSON.parse(text);


      validateRequirementsData(
        data
      );


      state.tender =
        data.tender;

      state.requirements =
        [...data.requirements]
          .sort(
            (a, b) =>
              Number(a.order) -
              Number(b.order)
          );


      state.matches = {};

      state.expiry = {};

      state.generated = false;


      state.files =
        state.files.map(
          (file) => ({
            ...file,
            duplicate:
              isDuplicateFile(file)
          })
        );


      toast(
        `${state.requirements.length} requirements loaded.`,
        "success"
      );


      renderAll();


    } catch (error) {

      console.error(
        "Requirements loading error:",
        error
      );


      if (
        error.message ===
        "requirements-empty"
      ) {

        toast(
          L().requirementsEmpty,
          "error"
        );

      } else if (
        error.message ===
        "requirements-invalid"
      ) {

        toast(
          L().requirementsInvalid,
          "error"
        );

      } else if (
        error.message ===
        "duplicate-id"
      ) {

        toast(
          L().duplicateRequirementId,
          "error"
        );

      } else if (
        error.message ===
        "duplicate-order"
      ) {

        toast(
          L().duplicateRequirementOrder,
          "error"
        );

      } else {

        toast(
          L().badReq,
          "error"
        );

      }

    }

  }


  /* =======================================================
     ADD PDF FILES
  ======================================================== */

  async function addFiles(
    fileList
  ) {

    if (!state.tender) {

      toast(
        L().noReq,
        "error"
      );

      return;
    }


    if (!state.pdfEngineReady) {

      toast(
        state.pdfEngineError
          ? L().engineError
          : L().engineLoading,
        "error"
      );

      return;
    }


    const incoming =
      [...fileList];


    if (!incoming.length) {
      return;
    }


    if (
      state.files.length +
      incoming.length >
      MAX_FILES
    ) {

      toast(
        L().tooMany,
        "error"
      );

      return;
    }


    let totalSize =
      state.files.reduce(
        (sum, file) =>
          sum + file.size,
        0
      );


    const errors = [];


    for (
      const file of incoming
    ) {

      const isPdf =
        file.type ===
          "application/pdf" ||
        file.name
          .toLowerCase()
          .endsWith(".pdf");


      if (!isPdf) {

        errors.push(
          `${file.name}: ${L().invalidPdf}`
        );

        continue;
      }


      if (
        totalSize +
        file.size >
        MAX_TOTAL_BYTES
      ) {

        errors.push(
          `${file.name}: ${L().tooLarge}`
        );

        break;
      }


      try {

        const [
          pages,
          hash
        ] = await Promise.all([
          pdfPages(file),
          sha256(file)
        ]);


        const duplicate =
          state.files.some(
            (existing) =>
              existing.hash === hash
          );


        const id =
          crypto.randomUUID();


        state.files.push({
          id,
          name: file.name,
          size: file.size,
          pages,
          hash,
          duplicate,
          blob: file
        });


        totalSize += file.size;


      } catch (error) {

        console.error(
          `Unable to read ${file.name}:`,
          error
        );


        errors.push(
          `${file.name}: ${L().pdfReadFail}`
        );

      }

    }


    state.files =
      state.files.map(
        (file) => ({
          ...file,
          duplicate:
            isDuplicateFile(file)
        })
      );


    const errorContainer =
      $("uploadErrors");


    if (errorContainer) {

      errorContainer.innerHTML =
        errors
          .map(
            (message) =>
              `<div class="upload-error">
                ${esc(message)}
              </div>`
          )
          .join("");

    }


    renderAll();
  }


  /* =======================================================
     REMOVE FILE
  ======================================================== */

  function removeFile(id) {

    Object.keys(
      state.matches
    ).forEach(
      (requirementId) => {

        if (
          state.matches[
            requirementId
          ] === id
        ) {

          delete state.matches[
            requirementId
          ];

        }

      }
    );


    state.files =
      state.files.filter(
        (file) =>
          file.id !== id
      );


    state.files =
      state.files.map(
        (file) => ({
          ...file,
          duplicate:
            isDuplicateFile(file)
        })
      );


    renderAll();
  }


  /* =======================================================
     SET DOCUMENT MATCH
  ======================================================== */

  function setMatch(
    requirementId,
    fileId
  ) {

    if (!fileId) {

      delete state.matches[
        requirementId
      ];

      state.generated = false;

      renderAll();

      return;
    }


    const alreadyUsed =
      Object.entries(
        state.matches
      ).find(
        ([otherRequirementId, otherFileId]) =>
          otherRequirementId !==
            requirementId &&
          otherFileId ===
            fileId
      );


    if (alreadyUsed) {

      toast(
        L().matchedElse,
        "error"
      );

      renderAll();

      return;
    }


    const file =
      state.files.find(
        (item) =>
          item.id === fileId
      );


    if (!file) {

      delete state.matches[
        requirementId
      ];

      renderAll();

      return;
    }


    if (
      isDuplicateFile(file) &&
      duplicateMatchedElsewhere(
        requirementId,
        file.hash
      )
    ) {

      toast(
        L().duplicateBlock,
        "error"
      );

      renderAll();

      return;
    }


    state.matches[
      requirementId
    ] = fileId;


    state.generated = false;


    renderAll();
  }


  /* =======================================================
     COVER PAGE
  ======================================================== */

  function coverPage(
    pdf,
    pageW,
    pageH,
    documents,
    fonts
  ) {

    const page =
      pdf.addPage([
        pageW,
        pageH
      ]);

    const {
      width,
      height
    } = page.getSize();


    const dark =
      PDFLib.rgb(
        0.055,
        0.07,
        0.16
      );

    const purple =
      PDFLib.rgb(
        0.36,
        0.29,
        1
      );

    const white =
      PDFLib.rgb(
        1,
        1,
        1
      );

    const muted =
      PDFLib.rgb(
        0.72,
        0.75,
        0.90
      );

    const labelColor =
      PDFLib.rgb(
        0.55,
        0.59,
        0.75
      );

    const soft =
      PDFLib.rgb(
        0.12,
        0.14,
        0.24
      );


    const bold =
      fonts.bold;

    const regular =
      fonts.regular;


    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: dark
    });


    page.drawRectangle({
      x: 0,
      y: height - 8,
      width,
      height: 8,
      color: purple
    });


    page.drawText(
      "TENDER SUBMISSION PACKAGE",
      {
        x: 42,
        y: height - 72,
        size: 24,
        color: white,
        font: bold
      }
    );


    page.drawText(
      "Submission-ready document set",
      {
        x: 42,
        y: height - 96,
        size: 10,
        color: muted,
        font: regular
      }
    );


    const tenderItems = [

      [
        "TENDER ID",
        state.tender.tender_id
      ],

      [
        "TENDER TITLE",
        state.tender.title
      ],

      [
        "BIDDER",
        state.tender.bidder
      ],

      [
        "PROCURING ENTITY",
        state.tender.procuring_entity
      ],

      [
        "SUBMISSION DEADLINE",
        state.tender.submission_deadline
      ],

      [
        "GENERATED DATE",
        formatToday()
      ]

    ];


    let infoY =
      height - 140;


    tenderItems.forEach(
      ([label, value]) => {

        page.drawText(
          label,
          {
            x: 42,
            y: infoY,
            size: 7.5,
            color: labelColor,
            font: bold
          }
        );


        page.drawText(
          String(value || "—"),
          {
            x: 42,
            y: infoY - 14,
            size: 10.5,
            color: white,
            font: regular,
            maxWidth: 500
          }
        );


        infoY -= 39;

      }
    );


    const tableTop = 430;

    const tableLeft = 42;

    const tableRight =
      width - 42;

    const tableWidth =
      tableRight - tableLeft;

    const headerH = 24;

    const rowH = 25;


    page.drawText(
      "DOCUMENT INDEX",
      {
        x: tableLeft,
        y: tableTop + 24,
        size: 9,
        color: labelColor,
        font: bold
      }
    );


    page.drawRectangle({
      x: tableLeft,
      y: tableTop - headerH,
      width: tableWidth,
      height: headerH,
      color: purple
    });


    const cols = [

      {
        label: "ORDER",
        x: tableLeft + 8,
        width: 42
      },

      {
        label: "REQUIREMENT",
        x: tableLeft + 50,
        width: 185
      },

      {
        label: "FILENAME",
        x: tableLeft + 235,
        width: 220
      },

      {
        label: "PAGES",
        x: tableLeft + 455,
        width: 70
      }

    ];


    cols.forEach(
      (col) => {

        page.drawText(
          col.label,
          {
            x: col.x,
            y: tableTop - 16,
            size: 7,
            color: white,
            font: bold
          }
        );

      }
    );


    documents.forEach(
      (
        document,
        index
      ) => {

        const y =
          tableTop -
          headerH -
          ((index + 1) * rowH);


        if (index % 2 === 0) {

          page.drawRectangle({
            x: tableLeft,
            y,
            width: tableWidth,
            height: rowH,
            color: soft
          });

        }


        const values = [

          String(
            document.order ??
            index + 1
          ),

          String(
            document.title || ""
          ),

          String(
            document.filename || ""
          ),

          String(
            document.pageRange ||
            document.pages ||
            ""
          )

        ];


        const positions = [

          tableLeft + 8,

          tableLeft + 50,

          tableLeft + 235,

          tableLeft + 455

        ];


        values.forEach(
          (
            value,
            valueIndex
          ) => {

            page.drawText(
              value,
              {
                x:
                  positions[
                    valueIndex
                  ],

                y:
                  y + 8,

                size: 7.5,

                color: white,

                font: regular,

                maxWidth:
                  valueIndex === 1
                    ? 178
                    : valueIndex === 2
                      ? 212
                      : 60
              }
            );

          }
        );

      }
    );


    page.drawText(
      "All documents are included in the supplied requirement order. Page numbering is applied to every output page.",
      {
        x: tableLeft,
        y: 45,
        size: 7.5,
        color: muted,
        font: regular,
        maxWidth: tableWidth
      }
    );


    return page;
  }


  /* =======================================================
     DRAW FOOTER
  ======================================================== */

  function drawFooter(
    page,
    pageNumber,
    totalPages,
    footerFont
  ) {

    const width =
      page.getWidth();

    const height =
      page.getHeight();


    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height: FOOTER_HEIGHT,

      color:
        PDFLib.rgb(
          0.055,
          0.07,
          0.16
        )
    });


    page.drawText(
      `${state.tender.tender_id} | Page ${pageNumber} of ${totalPages}`,
      {
        x: 42,
        y: 9,
        size: 8,

        color:
          PDFLib.rgb(
            0.72,
            0.75,
            0.84
          ),

        font: footerFont
      }
    );

  }


  /* =======================================================
     GENERATE FINAL PACKAGE
  ======================================================== */

  async function generatePackage() {

    try {

      if (!state.tender) {

        toast(
          L().noReq,
          "error"
        );

        return;
      }


      if (!state.pdfEngineReady) {

        toast(
          L().engineError,
          "error"
        );

        return;
      }


      if (
        !window.PDFLib ||
        !window.PDFLib.PDFDocument
      ) {

        throw new Error(
          "pdf-lib is unavailable."
        );

      }


      const rows =
        state.requirements.map(
          (requirement) => ({
            requirement,
            status:
              statusFor(
                requirement
              )
          })
        );


      const blocking =
        rows.filter(
          (row) =>
            row.status.block
        );


      if (
        blocking.length > 0
      ) {

        toast(
          L().notReady,
          "error"
        );

        renderAll();

        return;
      }


      const orderedRequirements =
        [...state.requirements]
          .sort(
            (a, b) =>
              Number(a.order) -
              Number(b.order)
          )
          .filter(
            (requirement) =>
              state.matches[
                requirement.id
              ]
          );


      if (
        orderedRequirements.length === 0
      ) {

        toast(
          L().notReady,
          "error"
        );

        return;
      }


      /*
       * Cover is page 1.
       */
      let nextOutputPage = 2;


      const documentIndex =
        orderedRequirements.map(
          (requirement) => {

            const file =
              state.files.find(
                (item) =>
                  item.id ===
                  state.matches[
                    requirement.id
                  ]
              );


            if (!file) {

              throw new Error(
                `Matched file not found for requirement ${requirement.id}.`
              );

            }


            const pageCount =
              Number(
                file.pages
              );


            if (
              !Number.isInteger(
                pageCount
              ) ||
              pageCount < 1
            ) {

              throw new Error(
                `Invalid page count for ${file.name}.`
              );

            }


            const startPage =
              nextOutputPage;


            const endPage =
              startPage +
              pageCount -
              1;


            nextOutputPage =
              endPage + 1;


            return {

              order:
                requirement.order,

              title:
                reqEnglishTitle(
                  requirement
                ),

              filename:
                file.name,

              pages:
                pageCount,

              pageRange:
                pageCount === 1
                  ? String(
                      startPage
                    )
                  : `${startPage}-${endPage}`,

              file

            };

          }
        );


      const PDFDocument =
        window.PDFLib.PDFDocument;


      const pdf =
        await PDFDocument.create();


      /*
       * IMPORTANT FIX:
       *
       * drawText() requires an actual PDFFont
       * object, not a StandardFonts string.
       */
      const regularFont =
        await pdf.embedFont(
          PDFLib.StandardFonts.Helvetica
        );


      const boldFont =
        await pdf.embedFont(
          PDFLib.StandardFonts.HelveticaBold
        );


      const fonts = {

        regular:
          regularFont,

        bold:
          boldFont

      };


      /*
       * English-only cover page.
       */
      coverPage(
        pdf,
        595.28,
        841.89,
        documentIndex,
        fonts
      );


      /*
       * Import source PDFs.
       *
       * IMPORTANT:
       * Do NOT use copyPages() followed by
       * embedPage() on the copied page.
       *
       * embedPage() receives the original
       * page from the source document.
       */
      for (
        const document
        of documentIndex
      ) {

        const file =
          document.file;


        const sourceBytes =
          await file.blob.arrayBuffer();


        let source;


        try {

          source =
            await PDFDocument.load(
              sourceBytes,
              {
                ignoreEncryption:
                  false,

                updateMetadata:
                  false
              }
            );

        } catch (
          sourceError
        ) {

          console.error(
            `Could not load source PDF "${file.name}":`,
            sourceError
          );


          throw new Error(
            `Could not import "${file.name}". The PDF may be damaged, encrypted, or unsupported.`
          );

        }


        const sourcePageCount =
          source.getPageCount();


        if (
          sourcePageCount !==
          Number(file.pages)
        ) {

          throw new Error(
            `Page count changed for "${file.name}". Please remove and re-upload the PDF.`
          );

        }


        for (
          let pageIndex = 0;
          pageIndex <
            sourcePageCount;
          pageIndex++
        ) {

          const sourcePage =
            source.getPage(
              pageIndex
            );


          const sourceWidth =
            sourcePage.getWidth();


          const sourceHeight =
            sourcePage.getHeight();


          if (
            !Number.isFinite(
              sourceWidth
            ) ||

            !Number.isFinite(
              sourceHeight
            ) ||

            sourceWidth <= 0 ||

            sourceHeight <= 0
          ) {

            throw new Error(
              `Invalid page size in "${file.name}" page ${pageIndex + 1}.`
            );

          }


          /*
           * Preserve original page dimensions.
           */
          const outputPage =
            pdf.addPage([
              sourceWidth,
              sourceHeight
            ]);


          /*
           * Embed original source page.
           */
          const embedded =
            await pdf.embedPage(
              sourcePage
            );


          /*
           * Reserve footer area.
           */
          const availableHeight =
            Math.max(
              1,
              sourceHeight -
                FOOTER_HEIGHT
            );


          /*
           * Do not enlarge original content.
           */
          const scale =
            Math.min(
              1,
              availableHeight /
                sourceHeight
            );


          const drawWidth =
            sourceWidth *
            scale;


          const drawHeight =
            sourceHeight *
            scale;


          const x =
            (
              sourceWidth -
              drawWidth
            ) / 2;


          const y =
            FOOTER_HEIGHT +
            Math.max(
              0,
              (
                availableHeight -
                drawHeight
              ) / 2
            );


          outputPage.drawPage(
            embedded,
            {
              x,

              y,

              width:
                drawWidth,

              height:
                drawHeight
            }
          );

        }

      }


      /*
       * Add footer after every page has been created,
       * so the final total page count is known.
       */
      const totalPages =
        pdf.getPageCount();


      const pages =
        pdf.getPages();


      if (
        totalPages < 2
      ) {

        throw new Error(
          "No document pages were added to the package."
        );

      }


      pages.forEach(
        (
          page,
          index
        ) => {

          drawFooter(
            page,

            index + 1,

            totalPages,

            regularFont
          );

        }
      );


      /*
       * Generate Blob.
       */
      const bytes =
        await pdf.save();


      const blob =
        new Blob(
          [bytes],
          {
            type:
              "application/pdf"
          }
        );


      const url =
        URL.createObjectURL(
          blob
        );


      const anchor =
        document.createElement(
          "a"
        );


      anchor.href =
        url;


      /*
       * Required filename:
       * <tender_id>_Package.pdf
       */
      const safeTenderId =
        String(
          state.tender.tender_id ||
          "Tender"
        ).replace(
          /[<>:"/\\|?*\x00-\x1F]/g,
          "_"
        );


      anchor.download =
        `${safeTenderId}_Package.pdf`;


      document.body.appendChild(
        anchor
      );


      anchor.click();


      anchor.remove();


      setTimeout(
        () =>
          URL.revokeObjectURL(
            url
          ),
        5000
      );


      state.generated =
        true;


      toast(
        L().generated,
        "success"
      );


    } catch (
      error
    ) {

      console.error(
        "Package generation failed:",
        error
      );


      const detail =
        error?.message
          ? ` ${error.message}`
          : "";


      toast(
        `${L().genFail}${detail}`,
        "error"
      );

    }

  }


  /* =======================================================
     CSV EXPORT
  ======================================================== */

  function exportCsv() {

    if (!state.requirements.length) {

      toast(
        L().noReq,
        "error"
      );

      return;
    }


    const header = [

      L().csvDocument,

      L().csvFile,

      L().csvPages,

      L().csvExpiry,

      L().csvStatus

    ];


    const rows =
      state.requirements.map(
        (requirement) => {

          const file =
            state.files.find(
              (item) =>
                item.id ===
                state.matches[
                  requirement.id
                ]
            );


          const status =
            statusFor(
              requirement
            );


          return [

            reqTitle(
              requirement
            ),

            file?.name || "",

            file?.pages || "",

            state.expiry[
              requirement.id
            ] || "",

            L()[status.key]

          ];

        }
      );


    const csv =
      [header, ...rows]
        .map(
          (row) =>
            row
              .map(
                (value) =>
                  `"${String(value)
                    .replace(
                      /"/g,
                      '""'
                    )}"`
              )
              .join(",")
        )
        .join("\r\n");


    const blob =
      new Blob(
        [
          "\ufeff",
          csv
        ],
        {
          type:
            "text/csv;charset=utf-8"
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    const anchor =
      document.createElement(
        "a"
      );


    anchor.href =
      url;


    anchor.download =
      `${state.tender?.tender_id || "tender"}_Checklist.csv`;


    document.body.appendChild(
      anchor
    );


    anchor.click();


    anchor.remove();


    setTimeout(
      () =>
        URL.revokeObjectURL(url),
      2000
    );

  }


  /* =======================================================
     SAVE STATE
  ======================================================== */

  function saveState() {

    try {

      /*
       * File blobs cannot safely be serialized
       * into localStorage.
       */
      const data = {

        lang:
          state.lang,

        tender:
          state.tender,

        requirements:
          state.requirements,

        matches:
          state.matches,

        expiry:
          state.expiry

      };


      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );


      toast(
        L().saved,
        "success"
      );


    } catch (error) {

      console.error(
        "Save state failed:",
        error
      );

      toast(
        "Could not save state.",
        "error"
      );

    }

  }


  /* =======================================================
     RESTORE STATE
  ======================================================== */

  function restoreState() {

    try {

      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );


      if (!saved) {

        toast(
          L().reqStart,
          "error"
        );

        return;
      }


      const data =
        JSON.parse(saved);


      state.lang =
        data.lang === "bn"
          ? "bn"
          : "en";


      state.tender =
        data.tender || null;


      state.requirements =
        Array.isArray(
          data.requirements
        )
          ? data.requirements
          : [];


      state.matches =
        data.matches &&
        typeof data.matches === "object"
          ? data.matches
          : {};


      state.expiry =
        data.expiry &&
        typeof data.expiry === "object"
          ? data.expiry
          : {};


      /*
       * localStorage cannot preserve
       * File objects, so stale file IDs
       * are removed.
       */
      const validFileIds =
        new Set(
          state.files.map(
            (file) =>
              file.id
          )
        );


      Object.keys(
        state.matches
      ).forEach(
        (requirementId) => {

          if (
            !validFileIds.has(
              state.matches[
                requirementId
              ]
            )
          ) {

            delete state.matches[
              requirementId
            ];

          }

        }
      );


      applyLang();


      toast(
        state.files.length
          ? L().restored
          : L().restoreNoFiles,
        "success"
      );


    } catch (error) {

      console.error(
        "Restore state failed:",
        error
      );


      toast(
        L().reqStart,
        "error"
      );

    }

  }


  /* =======================================================
     RESET APPLICATION
  ======================================================== */

  function resetApplication() {

    const confirmed =
      window.confirm(
        L().resetConfirm
      );


    if (!confirmed) {
      return;
    }


    state.tender = null;

    state.requirements = [];

    state.files = [];

    state.matches = {};

    state.expiry = {};

    state.generated = false;


    const errors =
      $("uploadErrors");

    if (errors) {
      errors.innerHTML = "";
    }


    const requirementInput =
      $("requirementsInput");

    if (requirementInput) {
      requirementInput.value = "";
    }


    const pdfInput =
      $("pdfInput");

    if (pdfInput) {
      pdfInput.value = "";
    }


    renderAll();


    toast(
      "Reset complete.",
      "success"
    );

  }


  /* =======================================================
     EVENT BINDINGS
  ======================================================== */

  function bindEvents() {

    /*
     * Requirements JSON
     */
    $("requirementsInput")?.addEventListener(
      "change",
      async (event) => {

        const file =
          event.target.files?.[0] ||
          null;


        if (!file) return;


        try {

          await loadRequirements(
            file
          );

        } catch (error) {

          console.error(
            "requirements.json load failed:",
            error
          );

          toast(
            L().badReq,
            "error"
          );

        } finally {

          event.target.value = "";

        }

      }
    );


    /*
     * Requirements JSON fallback.
     */
    const reqInput =
      $("requirementsInput");

    const reqLabel =
      reqInput?.closest(
        "label.file-btn"
      );


    reqLabel?.addEventListener(
      "click",
      (event) => {

        if (
          event.target ===
          reqInput
        ) {
          return;
        }

        /*
         * Native label behaviour
         * opens the file picker.
         */

      }
    );


    /*
     * PDF input
     */
    $("pdfInput")?.addEventListener(
      "change",
      (event) => {

        addFiles(
          event.target.files
        );


        event.target.value = "";

      }
    );


    /*
     * Drag enter / over
     */
    [
      "dragenter",
      "dragover"
    ]
      .forEach(
        (eventName) => {

          $("dropzone")?.addEventListener(
            eventName,
            (event) => {

              event.preventDefault();

              event.stopPropagation();

              $("dropzone")
                ?.classList.add(
                  "drag"
                );

            }
          );

        }
      );


    /*
     * Drag leave
     */
    [
      "dragleave",
      "drop"
    ]
      .forEach(
        (eventName) => {

          $("dropzone")?.addEventListener(
            eventName,
            (event) => {

              event.preventDefault();

              event.stopPropagation();

              $("dropzone")
                ?.classList.remove(
                  "drag"
                );

            }
          );

        }
      );


    /*
     * Drop PDFs
     */
    $("dropzone")?.addEventListener(
      "drop",
      (event) => {

        const files =
          event.dataTransfer?.files;


        if (
          files?.length
        ) {

          addFiles(
            files
          );

        }

      }
    );


    /*
     * Generate
     */
    $("generateBtn")?.addEventListener(
      "click",
      generatePackage
    );


    /*
     * CSV
     */
    $("csvBtn")?.addEventListener(
      "click",
      exportCsv
    );


    /*
     * Save
     */
    $("saveBtn")?.addEventListener(
      "click",
      saveState
    );


    /*
     * Restore
     */
    $("restoreBtn")?.addEventListener(
      "click",
      restoreState
    );


    /*
     * Language
     */
    $("langBtn")?.addEventListener(
      "click",
      () => {

        state.lang =
          state.lang === "en"
            ? "bn"
            : "en";

        applyLang();

      }
    );


    /*
     * Reset
     */
    $("resetBtn")?.addEventListener(
      "click",
      resetApplication
    );

  }


  /* =======================================================
     INITIALIZE
  ======================================================== */

  function init() {

    bindEvents();

    applyLang();


    /*
     * PDF.js loads independently.
     */
    loadPdfJs();

  }


  init();

})();
