/**
 * SLIDE & CHAPTER MANAGER (CANVA-LIKE WORKSPACE)
 * Handles slide navigation, chapter additions, inline editing, image uploads, and rendering
 */

class SlideManager {
  constructor() {
    this.slides = StorageManager.loadSlides();
    this.currentIndex = 0;
    this.saveTimeout = null;

    this.initElements();
    this.bindEvents();
    this.renderThumbnails();
    this.renderCurrentSlide();
  }

  initElements() {
    this.thumbnailsList = document.getElementById("slide-thumbnails-list");
    this.btnAddSlide = document.getElementById("btn-add-slide");
    this.slideFrame = document.getElementById("current-slide-frame");

    // Editable Slide Elements
    this.slideTag = document.getElementById("slide-tag");
    this.slideTitle = document.getElementById("slide-title");
    this.slideSubtitle = document.getElementById("slide-subtitle");
    this.slidePointsList = document.getElementById("slide-points-list");
    this.slideImage = document.getElementById("slide-image");
    this.slideCode = document.getElementById("slide-code");

    // Image Upload Inputs
    this.imageUploadInput = document.getElementById("slide-image-input");
    this.btnUploadImage = document.getElementById("btn-upload-image");
    this.btnResetImage = document.getElementById("btn-reset-image");

    // Code Action Buttons
    this.btnCopyCode = document.getElementById("btn-copy-code");
    this.btnOpenWokwi = document.getElementById("btn-open-wokwi");

    // Navigation & Counters
    this.slideCounter = document.getElementById("slide-counter");
    this.hudCounter = document.getElementById("hud-counter");
    this.btnPrev = document.getElementById("btn-prev-slide");
    this.btnNext = document.getElementById("btn-next-slide");
    this.hudPrev = document.getElementById("hud-prev-slide");
    this.hudNext = document.getElementById("hud-next-slide");
  }

  bindEvents() {
    // Add Chapter Button
    if (this.btnAddSlide) {
      this.btnAddSlide.addEventListener("click", () => this.addNewSlide());
    }

    // Prev / Next Navigation
    [this.btnPrev, this.hudPrev].forEach(btn => {
      if (btn) btn.addEventListener("click", () => this.prevSlide());
    });

    [this.btnNext, this.hudNext].forEach(btn => {
      if (btn) btn.addEventListener("click", () => this.nextSlide());
    });

    // Image Upload Handlers
    if (this.btnUploadImage && this.imageUploadInput) {
      this.btnUploadImage.addEventListener("click", () => this.imageUploadInput.click());
      this.imageUploadInput.addEventListener("change", (e) => this.handleImageUpload(e));
    }

    if (this.btnResetImage) {
      this.btnResetImage.addEventListener("click", () => {
        const slide = this.getCurrentSlide();
        if (slide) {
          slide.image = "assets/default-diagram.svg";
          this.slideImage.src = slide.image;
          this.renderThumbnails();
          this.triggerAutoSave();
          window.showToast("Gambar skema dikembalikan ke diagram awal.", "info");
        }
      });
    }

    // Copy Code Handler
    if (this.btnCopyCode) {
      this.btnCopyCode.addEventListener("click", () => {
        const slide = this.getCurrentSlide();
        if (slide && slide.code) {
          navigator.clipboard.writeText(slide.code).then(() => {
            window.showToast("Kode program berhasil disalin!", "success");
          });
        }
      });
    }

    // Open Wokwi Simulator
    if (this.btnOpenWokwi) {
      this.btnOpenWokwi.addEventListener("click", () => {
        window.open("https://wokwi.com/projects/new/esp32", "_blank");
      });
    }

    // Inline Content Editable Event Listeners (Auto Save)
    this.bindInlineEditable(this.slideTag, (val) => {
      const slide = this.getCurrentSlide();
      if (slide) slide.tag = val;
    });

    this.bindInlineEditable(this.slideTitle, (val) => {
      const slide = this.getCurrentSlide();
      if (slide) {
        slide.title = val;
        this.renderThumbnails();
      }
    });

    this.bindInlineEditable(this.slideSubtitle, (val) => {
      const slide = this.getCurrentSlide();
      if (slide) slide.subtitle = val;
    });

    if (this.slideCode) {
      this.slideCode.addEventListener("input", () => {
        const slide = this.getCurrentSlide();
        if (slide) {
          slide.code = this.slideCode.innerText;
          this.triggerAutoSave();
        }
      });
    }
  }

  bindInlineEditable(element, onUpdate) {
    if (!element) return;
    element.addEventListener("input", () => {
      onUpdate(element.innerText.trim());
      this.triggerAutoSave();
    });
  }

  getCurrentSlide() {
    return this.slides[this.currentIndex] || null;
  }

  goToSlide(index) {
    if (index >= 0 && index < this.slides.length) {
      this.currentIndex = index;
      this.renderThumbnails();
      this.renderCurrentSlide();
    }
  }

  nextSlide() {
    if (this.currentIndex < this.slides.length - 1) {
      this.goToSlide(this.currentIndex + 1);
    } else {
      window.showToast("Ini adalah bab terakhir!", "info");
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1);
    } else {
      window.showToast("Ini adalah bab pertama!", "info");
    }
  }

  addNewSlide() {
    if (window.authManager && !window.authManager.isGuru()) {
      window.showToast("Hanya akun Guru yang dapat menambahkan bab baru!", "error");
      return;
    }

    const newSlideNumber = this.slides.length + 1;
    const newSlide = {
      id: `bab-${Date.now()}`,
      tag: `BAB ${newSlideNumber} • MATERI BARU`,
      title: `Judul Bab ${newSlideNumber}: Topik Baru`,
      subtitle: "Klik di sini untuk menulis deskripsi ringkas mengenai bab materi ini...",
      points: [
        "Poin 1: Penjelasan konsep utama langkah demi langkah.",
        "Poin 2: Panduan instruksi atau konfigurasi teknis.",
        "Poin 3: Catatan penting atau tips penyelesaian masalah."
      ],
      image: "assets/default-diagram.svg",
      code: `// Sentral Robotika - Skrip Bab ${newSlideNumber}\nvoid setup() {\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  // Tulis logika Anda di sini\n}`
    };

    this.slides.push(newSlide);
    this.currentIndex = this.slides.length - 1;
    this.renderThumbnails();
    this.renderCurrentSlide();
    this.triggerAutoSave();
    window.showToast(`Bab ${newSlideNumber} berhasil ditambahkan!`, "success");
  }

  duplicateSlide(index) {
    if (window.authManager && !window.authManager.isGuru()) {
      window.showToast("Hanya akun Guru yang dapat menduplikasi bab!", "error");
      return;
    }

    const source = this.slides[index];
    if (!source) return;

    const copy = JSON.parse(JSON.stringify(source));
    copy.id = `bab-${Date.now()}`;
    copy.title = `${copy.title} (Salinan)`;
    copy.tag = `${copy.tag} • SALINAN`;

    this.slides.splice(index + 1, 0, copy);
    this.currentIndex = index + 1;
    this.renderThumbnails();
    this.renderCurrentSlide();
    this.triggerAutoSave();
    window.showToast("Bab berhasil diduplikasi!", "success");
  }

  deleteSlide(index) {
    if (window.authManager && !window.authManager.isGuru()) {
      window.showToast("Hanya akun Guru yang dapat menghapus bab!", "error");
      return;
    }

    if (this.slides.length <= 1) {
      window.showToast("Minimal harus ada 1 bab tutorial!", "error");
      return;
    }

    const slideTitle = this.slides[index].title;
    if (confirm(`Yakin ingin menghapus bab "${slideTitle}"?`)) {
      this.slides.splice(index, 1);
      if (this.currentIndex >= this.slides.length) {
        this.currentIndex = this.slides.length - 1;
      }
      this.renderThumbnails();
      this.renderCurrentSlide();
      this.triggerAutoSave();
      window.showToast("Bab berhasil dihapus.", "info");
    }
  }

  handleImageUpload(e) {
    if (window.authManager && !window.authManager.isGuru()) {
      window.showToast("Hanya akun Guru yang dapat mengunggah gambar skema!", "error");
      return;
    }
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.showToast("Harap pilih file gambar yang valid!", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target.result;
      const slide = this.getCurrentSlide();
      if (slide) {
        slide.image = dataUrl;
        this.slideImage.src = dataUrl;
        this.renderThumbnails();
        this.triggerAutoSave();
        window.showToast("Gambar skema bab berhasil diperbarui!", "success");
      }
    };
    reader.readAsDataURL(file);
  }

  renderThumbnails() {
    if (!this.thumbnailsList) return;
    this.thumbnailsList.innerHTML = "";

    this.slides.forEach((slide, idx) => {
      const card = document.createElement("div");
      card.className = `thumb-card ${idx === this.currentIndex ? "active" : ""}`;

      card.innerHTML = `
        <div class="thumb-header">
          <span class="thumb-number">Bab ${idx + 1}</span>
          <div class="thumb-actions">
            <button class="thumb-btn duplicate-btn" title="Duplikasi Bab">📋</button>
            <button class="thumb-btn delete-btn" title="Hapus Bab">🗑️</button>
          </div>
        </div>
        <div class="thumb-title">${slide.title || "Tanpa Judul"}</div>
        <div class="thumb-preview-mini">
          <span>${slide.image ? "🖼️ Diagram Skema" : "📄 Konten Slide"}</span>
        </div>
      `;

      // Select Slide
      card.addEventListener("click", (e) => {
        if (!e.target.closest(".thumb-actions")) {
          this.goToSlide(idx);
        }
      });

      // Actions
      const dupBtn = card.querySelector(".duplicate-btn");
      if (dupBtn) {
        dupBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.duplicateSlide(idx);
        });
      }

      const delBtn = card.querySelector(".delete-btn");
      if (delBtn) {
        delBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.deleteSlide(idx);
        });
      }

      this.thumbnailsList.appendChild(card);
    });

    // Auto scroll active thumbnail into view
    const activeThumb = this.thumbnailsList.querySelector(".thumb-card.active");
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  renderCurrentSlide() {
    const slide = this.getCurrentSlide();
    if (!slide) return;

    const isGuru = !window.authManager || window.authManager.isGuru();

    // Apply smooth fade-in animation
    if (this.slideFrame) {
      this.slideFrame.classList.remove("slide-fade-in");
      void this.slideFrame.offsetWidth; // Trigger reflow
      this.slideFrame.classList.add("slide-fade-in");
    }

    // Populate Headers with permission
    if (this.slideTag) {
      this.slideTag.innerText = slide.tag || `BAB ${this.currentIndex + 1}`;
      this.slideTag.contentEditable = isGuru ? "true" : "false";
    }
    if (this.slideTitle) {
      this.slideTitle.innerText = slide.title || "Judul Bab";
      this.slideTitle.contentEditable = isGuru ? "true" : "false";
    }
    if (this.slideSubtitle) {
      this.slideSubtitle.innerText = slide.subtitle || "";
      this.slideSubtitle.contentEditable = isGuru ? "true" : "false";
    }

    // Populate Points with permission
    if (this.slidePointsList) {
      this.slidePointsList.innerHTML = "";
      (slide.points || []).forEach((pt, pIdx) => {
        const li = document.createElement("li");
        li.className = "point-item";
        li.innerHTML = `
          <div class="point-dot"></div>
          <div class="point-text editable" contenteditable="${isGuru ? "true" : "false"}">${pt}</div>
          ${isGuru ? '<button class="btn-icon delete-point-btn" title="Hapus Poin" style="padding:2px 4px; font-size:10px; opacity:0.6;">✕</button>' : ''}
        `;

        const pointEditable = li.querySelector(".point-text");
        if (isGuru) {
          pointEditable.addEventListener("input", () => {
            slide.points[pIdx] = pointEditable.innerText;
            this.triggerAutoSave();
          });

          const delPoint = li.querySelector(".delete-point-btn");
          if (delPoint) {
            delPoint.addEventListener("click", () => {
              slide.points.splice(pIdx, 1);
              this.renderCurrentSlide();
              this.triggerAutoSave();
            });
          }
        }

        this.slidePointsList.appendChild(li);
      });

      // Add "Tambah Poin Materi" Button only for Guru
      if (isGuru) {
        const addPtLi = document.createElement("li");
        addPtLi.style.listStyle = "none";
        addPtLi.style.marginTop = "8px";
        addPtLi.innerHTML = `
          <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 11px;">
            <span>+ Tambah Poin Materi</span>
          </button>
        `;
        addPtLi.querySelector("button").addEventListener("click", () => {
          slide.points.push("Poin penjelasan materi baru...");
          this.renderCurrentSlide();
          this.triggerAutoSave();
        });
        this.slidePointsList.appendChild(addPtLi);
      }
    }

    // Populate Diagram Image
    if (this.slideImage) {
      this.slideImage.src = slide.image || "assets/default-diagram.svg";
    }

    // Populate Code with permission
    if (this.slideCode) {
      this.slideCode.innerText = slide.code || "// Belum ada kode untuk bab ini";
      
      // Pastikan status editable sinkron dengan peran Guru
      if (isGuru) {
        this.slideCode.setAttribute("contenteditable", "true");
        this.slideCode.classList.add("editable-active");
      } else {
        this.slideCode.setAttribute("contenteditable", "false");
        this.slideCode.classList.remove("editable-active");
      }
    }

    // Update Counters
    const counterText = `Bab ${this.currentIndex + 1} / ${this.slides.length}`;
    if (this.slideCounter) this.slideCounter.textContent = counterText;
    if (this.hudCounter) this.hudCounter.textContent = counterText;
  }

  triggerAutoSave() {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      StorageManager.saveSlides(this.slides);
      console.log("Materi tutorial otomatis tersimpan.");
    }, 600);
  }
}
