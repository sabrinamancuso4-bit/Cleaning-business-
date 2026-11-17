/* The Cleaning Specialist: small progressive enhancements.
   The site works without JavaScript: the menu stays open and the form posts
   directly to Web3Forms, which redirects to /thank-you.html. */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
  }

  /* ---------- Enquiry form ---------- */
  var form = document.getElementById("enquiry-form");
  if (!form) return;

  // Our own validation takes over from the browser's when JavaScript runs.
  form.noValidate = true;
  var status = document.getElementById("form-status");
  var submitBtn = form.querySelector('button[type="submit"]');
  var btnLabel = submitBtn.querySelector(".btn__label");
  var requirementBoxes = form.querySelectorAll('#requirements input[type="checkbox"]');
  var fallbackEmail = (document.querySelector('.contact__email a') || {}).textContent || "";
  var attempted = false;

  var UK_POSTCODE = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s*[0-9][A-Z]{2}$/i;
  var PHONE = /^\+?[0-9\s()-]{10,20}$/;
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var rules = {
    business_name: function (v) { return v.trim().length >= 2 || "Please enter your business name."; },
    contact_name: function (v) { return v.trim().length >= 2 || "Please enter a contact name."; },
    email: function (v) {
      if (!v.trim()) return "Please enter your business email address.";
      return EMAIL.test(v.trim()) || "Please enter a valid email address, for example name@company.co.uk.";
    },
    phone: function (v) {
      if (!v.trim()) return true;
      return (PHONE.test(v.trim()) && v.replace(/\D/g, "").length >= 10) || "Please enter a valid UK telephone number, or leave this blank.";
    },
    postcode: function (v) {
      if (!v.trim()) return "Please enter your business postcode.";
      return UK_POSTCODE.test(v.trim()) || "Please enter a full UK postcode, for example M2 3AW.";
    },
    premises: function (v) { return !!v || "Please choose the type of premises."; },
    frequency: function (v) { return !!v || "Please choose a preferred cleaning frequency."; },
    consent: function (_, el) { return el.checked || "Please confirm you have read the privacy notice."; }
  };

  function showError(id, message, target) {
    var el = target || document.getElementById(id);
    var err = document.getElementById(id + "-error");
    if (message) {
      el.setAttribute("aria-invalid", "true");
      el.setAttribute("aria-describedby", id + "-error");
      err.textContent = message;
      err.hidden = false;
    } else {
      el.removeAttribute("aria-invalid");
      el.removeAttribute("aria-describedby");
      err.hidden = true;
      err.textContent = "";
    }
  }

  function validateField(id) {
    var el = document.getElementById(id);
    var result = rules[id](el.value, el);
    showError(id, result === true ? "" : result);
    return result === true;
  }

  function validateRequirements() {
    var any = Array.prototype.some.call(requirementBoxes, function (b) { return b.checked; });
    showError("requirements", any ? "" : "Please choose at least one cleaning requirement.");
    return any;
  }

  function validateAll() {
    var firstInvalid = null;
    Object.keys(rules).forEach(function (id) {
      if (!validateField(id) && !firstInvalid) firstInvalid = document.getElementById(id);
    });
    if (!validateRequirements() && !firstInvalid) firstInvalid = requirementBoxes[0];
    return firstInvalid;
  }

  // Re-check fields as the user corrects them (after the first submit attempt).
  Object.keys(rules).forEach(function (id) {
    var el = document.getElementById(id);
    var evt = el.tagName === "SELECT" || el.type === "checkbox" ? "change" : "input";
    el.addEventListener(evt, function () { if (attempted) validateField(id); });
    el.addEventListener("blur", function () { if (attempted || el.value) validateField(id); });
  });
  requirementBoxes.forEach(function (b) {
    b.addEventListener("change", function () { if (attempted) validateRequirements(); });
  });

  function setStatus(kind, title, body) {
    status.className = "form__status is-" + kind;
    status.innerHTML = "";
    var strong = document.createElement("strong");
    strong.textContent = title;
    var p = document.createElement("span");
    p.textContent = body;
    status.appendChild(strong);
    status.appendChild(p);
    status.hidden = false;
    status.focus();
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnLabel.textContent = loading ? "Sending…" : "Send enquiry";
    var spinner = submitBtn.querySelector(".spinner");
    if (loading && !spinner) {
      spinner = document.createElement("span");
      spinner.className = "spinner";
      spinner.setAttribute("aria-hidden", "true");
      submitBtn.insertBefore(spinner, btnLabel);
    } else if (!loading && spinner) {
      spinner.remove();
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    attempted = true;
    status.hidden = true;

    var firstInvalid = validateAll();
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    var accessKey = form.querySelector('input[name="access_key"]').value;
    if (!accessKey || accessKey.indexOf("YOUR_") === 0) {
      setStatus("error", "This form is not connected yet.",
        "The Web3Forms access key has not been added, so nothing was sent. Add the key (see README) and try again." +
        (fallbackEmail ? " In the meantime, please email " + fallbackEmail + "." : ""));
      return;
    }

    // Build the email: combine the requirement checkboxes into one readable line.
    var data = {};
    new FormData(form).forEach(function (value, key) {
      if (key.indexOf("Requirement: ") === 0 || key === "redirect") return;
      data[key] = value;
    });
    data["Cleaning requirements"] = Array.prototype.filter.call(requirementBoxes, function (b) { return b.checked; })
      .map(function (b) { return b.nextElementSibling.textContent.trim(); }).join(", ");
    data["Postcode"] = String(data["Postcode"] || "").toUpperCase();
    data.botcheck = form.querySelector('input[name="botcheck"]').checked;

    var controller = "AbortController" in window ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 20000) : null;

    setLoading(true);
    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        return res.json().catch(function () { return { success: false }; }).then(function (json) {
          if (!res.ok || !json.success) throw new Error(json.message || "Submission failed");
        });
      })
      .then(function () {
        form.reset();
        attempted = false;
        setStatus("success", "Thank you, your enquiry has been sent.",
          "We will be in touch shortly to arrange your free site assessment.");
      })
      .catch(function () {
        setStatus("error", "Sorry, your enquiry could not be sent.",
          "Please check your connection and try again" + (fallbackEmail ? ", or email us at " + fallbackEmail : "") + ".");
      })
      .finally(function () {
        if (timer) clearTimeout(timer);
        setLoading(false);
      });
  });
})();
