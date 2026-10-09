/**
 * AUTHENTICATION & ROLE MANAGER
 * Mengelola akses masuk dan hak izin Guru vs Murid
 * Login Guru: guru_masuk
 * Login Murid: murid_go
 */

const AUTH_STORAGE_KEY = "sentral_robotika_auth_role";

class AuthManager {
  constructor() {
    this.currentRole = localStorage.getItem(AUTH_STORAGE_KEY) || null;
    this.initElements();
    this.bindEvents();
    this.checkInitialAuth();
  }

  initElements() {
    this.modal = document.getElementById("login-modal");
    this.loginInput = document.getElementById("login-code-input");
    this.btnLoginSubmit = document.getElementById("btn-submit-login");
    this.roleBadgeContainer = document.getElementById("topbar-role-badge");
    this.projectTitleDisplay = document.getElementById("project-title-display");
    this.projectTitleInput = document.getElementById("project-title-input");

    // Role Selection Cards in Login Modal
    this.cardGuru = document.getElementById("role-card-guru");
    this.cardMurid = document.getElementById("role-card-murid");
  }

  bindEvents() {
    // Submit Login on Button Click
    if (this.btnLoginSubmit && this.loginInput) {
      this.btnLoginSubmit.addEventListener("click", () => {
        this.attemptLogin(this.loginInput.value);
      });

      // Submit on Enter Key
      this.loginInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.attemptLogin(this.loginInput.value);
        }
      });
    }

    // Role Quick Select Cards
    if (this.cardGuru) {
      this.cardGuru.addEventListener("click", () => {
        this.selectRoleCard("guru");
      });
    }

    if (this.cardMurid) {
      this.cardMurid.addEventListener("click", () => {
        this.selectRoleCard("murid");
      });
    }

    // Delegate Logout / Switch Account clicks from Topbar
    document.addEventListener("click", (e) => {
      if (e.target && e.target.classList.contains("btn-switch-role")) {
        e.preventDefault();
        this.logout();
      }
    });
  }

  selectRoleCard(role) {
    if (role === "guru") {
      if (this.cardGuru) this.cardGuru.classList.add("active");
      if (this.cardMurid) this.cardMurid.classList.remove("active");
      if (this.loginInput) {
        this.loginInput.placeholder = "Masukkan kode akses Guru...";
        this.loginInput.value = "";
        this.loginInput.focus();
      }
    } else {
      if (this.cardMurid) this.cardMurid.classList.add("active");
      if (this.cardGuru) this.cardGuru.classList.remove("active");
      if (this.loginInput) {
        this.loginInput.placeholder = "Masukkan kode akses Murid...";
        this.loginInput.value = "";
        this.loginInput.focus();
      }
    }
  }

  checkInitialAuth() {
    if (this.currentRole === "guru" || this.currentRole === "murid") {
      this.applyRole(this.currentRole);
      this.closeModal();
    } else {
      // First time visitor or logged out: Show Login Modal
      this.openModal();
    }
  }

  attemptLogin(code) {
    const cleanCode = (code || "").trim().toLowerCase();

    if (cleanCode === "guru_masuk") {
      this.setRole("guru");
      this.closeModal();
      window.showToast("Selamat datang Guru! Mode edit tutorial & program aktif.", "success");
    } else if (cleanCode === "murid_go") {
      this.setRole("murid");
      this.closeModal();
      window.showToast("Selamat datang Murid! Selamat belajar & praktikum IoT.", "success");
    } else {
      window.showToast("Kode akses tidak valid. Silakan periksa kembali atau hubungi pengajar Anda.", "error");
      if (this.loginInput) {
        this.loginInput.focus();
        this.loginInput.select();
      }
    }
  }

  setRole(role) {
    this.currentRole = role;
    localStorage.setItem(AUTH_STORAGE_KEY, role);
    this.applyRole(role);
  }

  applyRole(role) {
    document.body.classList.remove("role-guru", "role-murid");
    document.body.classList.add(`role-${role}`);

    // Update Topbar Badge
    if (this.roleBadgeContainer) {
      if (role === "guru") {
        this.roleBadgeContainer.innerHTML = `
          <div class="user-role-badge badge-guru" title="Akses Penuh Guru (Edit Materi, Program, & Gambar)">
            <span style="margin-right: 4px;">👨‍🏫</span>
            <div>Guru</div>
            <button class="btn-switch-role" title="Ganti akun atau logout">Keluar</button>
          </div>
        `;
      } else {
        this.roleBadgeContainer.innerHTML = `
          <div class="user-role-badge badge-murid" title="Akses Murid (Hanya Baca & Praktik)">
            <span>🎓</span>
            <span>Mode Murid (Baca)</span>
            <button class="btn-switch-role" title="Login sebagai Guru untuk mengedit">Login Guru</button>
          </div>
        `;
      }
    }

    // Synchronize static project title for students
    if (this.projectTitleDisplay && this.projectTitleInput) {
      this.projectTitleDisplay.textContent = this.projectTitleInput.value || "Tutorial Wokwi & Blynk IoT 2.0";
    }

    // Apply ContentEditable permissions
    this.updateEditableElements(role === "guru");

    // Re-render current slide if slideManager exists
    if (window.slideManager) {
      window.slideManager.renderCurrentSlide();
      window.slideManager.renderThumbnails();
    }
  }

  updateEditableElements(isEditable) {
    const editables = document.querySelectorAll(".editable");
    editables.forEach(el => {
      el.contentEditable = isEditable ? "true" : "false";
    });

    const codeEditor = document.getElementById("slide-code");
    if (codeEditor) {
      codeEditor.contentEditable = isEditable ? "true" : "false";
    }
  }

  openModal() {
    if (this.modal) {
      this.modal.classList.add("active");
      if (this.loginInput) {
        this.loginInput.value = "";
        setTimeout(() => this.loginInput.focus(), 200);
      }
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.remove("active");
    }
  }

  logout() {
    this.currentRole = null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    document.body.classList.remove("role-guru", "role-murid");
    if (this.roleBadgeContainer) this.roleBadgeContainer.innerHTML = "";
    this.openModal();
    window.showToast("Anda telah keluar. Silakan masukkan kode login kembali.", "info");
  }

  isGuru() {
    return this.currentRole === "guru";
  }

  isMurid() {
    return this.currentRole === "murid";
  }
}
