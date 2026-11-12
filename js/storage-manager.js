/**
 * MAIN APPLICATION ENTRY POINT
 * Sentral Robotika - Interactive IoT Presentation & Canva-like Studio
 */

// Toast Notification Utility
window.showToast = function(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type === "success" ? "toast-success" : type === "error" ? "toast-error" : ""}`;
  
  const icon = type === "success" ? "✅" : type === "error" ? "⚠️" : "💡";
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px) scale(0.9)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Subsystems (Auth first, then Slides & OCR)
  window.authManager = new AuthManager();
  window.slideManager = new SlideManager();
  window.tokenExtractor = new OCRTokenExtractor();

  // 2. Project Title Binding
  const projectTitleInput = document.getElementById("project-title-input");
  const projectTitleDisplay = document.getElementById("project-title-display");
  if (projectTitleInput) {
    const currentTitle = StorageManager.getProjectTitle();
    projectTitleInput.value = currentTitle;
    if (projectTitleDisplay) projectTitleDisplay.textContent = currentTitle;

    projectTitleInput.addEventListener("input", () => {
      StorageManager.setProjectTitle(projectTitleInput.value);
      if (projectTitleDisplay) projectTitleDisplay.textContent = projectTitleInput.value;
    });
  }

  // 3. Presentation Mode Toggle
  const btnTogglePresentation = document.getElementById("btn-toggle-presentation");
  const hudExitBtn = document.getElementById("hud-exit-presentation");

  function togglePresentationMode(forceState) {
    const isCurrentlyPresenting = document.body.classList.contains("presentation-mode");
    const nextState = forceState !== undefined ? forceState : !isCurrentlyPresenting;

    if (nextState) {
      document.body.classList.add("presentation-mode");
      // Request native browser fullscreen if supported
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      window.showToast("Mode Presentasi Aktif. Gunakan tombol Panah Kiri/Kanan untuk berganti bab.", "info");
    } else {
      document.body.classList.remove("presentation-mode");
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
    window.slideManager.renderCurrentSlide();
  }

  if (btnTogglePresentation) {
    btnTogglePresentation.addEventListener("click", () => togglePresentationMode(true));
  }

  if (hudExitBtn) {
    hudExitBtn.addEventListener("click", () => togglePresentationMode(false));
  }

  // 4. Keyboard Navigation (Arrows, Space, F, ESC)
  window.addEventListener("keydown", (e) => {
    // Avoid triggering navigation when typing in editable elements
    const isTyping = ["INPUT", "TEXTAREA"].includes(e.target.tagName) || e.target.isContentEditable;
    
    // Always allow Escape to exit presentation or close modals
    if (e.key === "Escape") {
      togglePresentationMode(false);
      window.tokenExtractor.closeModal();
      closeSaweriaModal();
      return;
    }

    if (isTyping) return;

    if (e.key === "ArrowRight" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
      e.preventDefault();
      window.slideManager.nextSlide();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      window.slideManager.prevSlide();
    } else if (e.key.toLowerCase() === "f") {
      e.preventDefault();
      togglePresentationMode();
    }
  });

  // 5. Export JSON
  const btnExport = document.getElementById("btn-export-json");
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      StorageManager.exportToJSON(window.slideManager.slides, projectTitleInput.value);
      window.showToast("File materi presentasi berhasil diunduh!", "success");
    });
  }

  // 6. Import JSON
  const btnImportTrigger = document.getElementById("btn-import-json-trigger");
  const fileImportInput = document.getElementById("file-import-input");

  if (btnImportTrigger && fileImportInput) {
    btnImportTrigger.addEventListener("click", () => {
      if (window.authManager && !window.authManager.isGuru()) {
        window.showToast("Hanya Guru yang dapat mengimpor file materi!", "error");
        return;
      }
      fileImportInput.click();
    });
    fileImportInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        StorageManager.importFromJSON(file, (err, importedData) => {
          if (err) {
            window.showToast("Gagal mengimpor file: " + err.message, "error");
          } else {
            window.slideManager.slides = importedData.slides;
            window.slideManager.currentIndex = 0;
            if (importedData.title && projectTitleInput) {
              projectTitleInput.value = importedData.title;
              StorageManager.setProjectTitle(importedData.title);
            }
            window.slideManager.renderThumbnails();
            window.slideManager.renderCurrentSlide();
            window.slideManager.triggerAutoSave();
            window.showToast("Materi presentasi berhasil dimuat!", "success");
          }
        });
      }
    });
  }

  // 7. Reset to Default Preset
  const btnReset = document.getElementById("btn-reset-default");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (window.authManager && !window.authManager.isGuru()) {
        window.showToast("Hanya Guru yang dapat mereset materi!", "error");
        return;
      }
      if (confirm("Apakah Anda yakin ingin mereset semua bab kembali ke materi bawaan Wokwi & Blynk?")) {
        window.slideManager.slides = StorageManager.resetToDefault();
        window.slideManager.currentIndex = 0;
        if (projectTitleInput) {
          projectTitleInput.value = "Tutorial Wokwi & Blynk IoT 2.0";
          StorageManager.setProjectTitle(projectTitleInput.value);
        }
        window.slideManager.renderThumbnails();
        window.slideManager.renderCurrentSlide();
        window.showToast("Materi telah direset ke preset Wokwi & Blynk.", "info");
      }
    });
  }

  // 8. Saweria Support Modal
  const saweriaModal = document.getElementById("saweria-support-modal");
  const btnOpenSaweria = document.getElementById("btn-open-saweria");

  function openSaweriaModal() {
    if (saweriaModal) saweriaModal.classList.add("active");
  }

  function closeSaweriaModal() {
    if (saweriaModal) saweriaModal.classList.remove("active");
  }

  if (btnOpenSaweria) {
    btnOpenSaweria.addEventListener("click", openSaweriaModal);
  }

  // Saweria nominal buttons
  document.querySelectorAll(".nominal-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nominal-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      window.showToast(`Nominal dipilih: ${btn.textContent}`, "info");
    });
  });

  const btnSimulateDonation = document.getElementById("btn-simulate-donation");
  if (btnSimulateDonation) {
    btnSimulateDonation.addEventListener("click", () => {
      closeSaweriaModal();
      window.showToast("🎉 Terima kasih atas dukungannya untuk Sentral Robotika!", "success");
    });
  }
});
