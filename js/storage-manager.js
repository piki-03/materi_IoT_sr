/**
 * STORAGE MANAGER
 * Manages LocalStorage, File Export/Import (JSON), and Image persistence
 */

const STORAGE_KEY = "sentral_robotika_slides_v1";
const TITLE_STORAGE_KEY = "sentral_robotika_title_v1";

class StorageManager {
  static getProjectTitle() {
    return localStorage.getItem(TITLE_STORAGE_KEY) || "Tutorial Wokwi & Blynk IoT 2.0";
  }

  static setProjectTitle(title) {
    localStorage.setItem(TITLE_STORAGE_KEY, title);
  }

  static loadSlides() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Gagal membaca LocalStorage, memuat preset default:", e);
    }
    // Return deep copy of default slides
    return JSON.parse(JSON.stringify(DEFAULT_SLIDES));
  }

  static saveSlides(slides) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
      return true;
    } catch (e) {
      console.error("Gagal menyimpan ke LocalStorage:", e);
      // Quota exceeded possible with very large images
      return false;
    }
  }

  static resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TITLE_STORAGE_KEY);
    return JSON.parse(JSON.stringify(DEFAULT_SLIDES));
  }

  static exportToJSON(slides, projectTitle) {
    const data = {
      title: projectTitle || StorageManager.getProjectTitle(),
      exportedAt: new Date().toISOString(),
      author: "Sentral Robotika Studio",
      slides: slides
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    const safeTitle = (projectTitle || "Sentral_Robotika_Tutorial").replace(/[^a-zA-Z0-9_-]/g, "_");
    a.href = url;
    a.download = `${safeTitle}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static importFromJSON(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.slides && Array.isArray(parsed.slides)) {
          callback(null, parsed);
        } else if (Array.isArray(parsed)) {
          callback(null, { title: "Tutorial Impor", slides: parsed });
        } else {
          callback(new Error("Format file JSON tidak valid atau tidak memiliki daftar slides"));
        }
      } catch (err) {
        callback(err);
      }
    };
    reader.readAsText(file);
  }
}
