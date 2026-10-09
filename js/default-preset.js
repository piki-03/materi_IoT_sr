/**
 * DEFAULT PRESET MATERIAL
 * Sentral Robotika - Tutorial Wokwi & Blynk IoT 2.0
 */

const DEFAULT_SLIDES = [
  {
    id: "bab-1",
    tag: "BAB 1 • PENGENALAN DASAR",
    title: "Pengenalan Wokwi Simulator & Blynk IoT 2.0",
    subtitle: "Membangun prototipe Internet of Things (IoT) berbasis ESP32 tanpa memerlukan perangkat keras fisik",
    points: [
      "Wokwi adalah simulator perangkat keras online canggih untuk ESP32, ESP8266, dan Arduino dengan dukungan simulasi WiFi nyata (Wokwi-GUEST).",
      "Blynk IoT 2.0 merupakan platform cloud komprehensif untuk memonitor data sensor dan mengendalikan aktuator secara remote via Web Dashboard & Mobile App.",
      "Arsitektur Sistem: Wokwi ESP32 terhubung ke gateway virtual Wokwi-GUEST ➔ Mengirim data terenkripsi ke blynk.cloud ➔ Ditampilkan di widget dashboard pengguna.",
      "Kelebihan utama: Aman dari risiko korsleting, hemat biaya pengadaan modul, dan dapat dipraktikkan langsung di kelas/lab komputer sekolah & kampus."
    ],
    image: "assets/default-diagram.svg",
    code: `// Sentral Robotika - Template Wokwi & Blynk IoT 2.0
#define BLYNK_TEMPLATE_ID "TMPL62U0xhnR2"
#define BLYNK_TEMPLATE_NAME "Kontrol Led dgn Blynk"
#define BLYNK_AUTH_TOKEN "mbbOARWNhGvXh5uQBztvb5DFvA15m_9I"

#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>

// Konfigurasi WiFi Virtual Wokwi
char ssid[] = "Wokwi-GUEST";
char pass[] = ""; // Tanpa password pada Wokwi`
  },
  {
    id: "bab-2",
    tag: "BAB 2 • SETUP CLOUD",
    title: "Konfigurasi Template & Datastream di Blynk.Cloud",
    subtitle: "Menyiapkan antarmuka dashboard, alamat pin virtual, dan mengambil kredensial autentikasi",
    points: [
      "Buka browser ke https://blynk.cloud dan buat akun gratis. Navigasikan ke menu 'Developer Zone' ➔ 'Templates'.",
      "Buat Template Baru: Beri nama 'Kontrol Led dgn Blynk', pilih Hardware 'ESP32', dan Connection Type 'WiFi'.",
      "Membuat Datastream (Jalur Data Virtual):",
      "• V0 (Switch Kontrol LED): Data Type Integer, Min: 0, Max: 1 (Push/Toggle switch).",
      "• V1 (Sensor Suhu): Data Type Double, Min: 0, Max: 100, Unit: °C.",
      "• V2 (Sensor Kelembapan): Data Type Integer, Min: 0, Max: 100, Unit: %.",
      "Salin 3 Baris Kredensial Wajib (BLYNK_TEMPLATE_ID, BLYNK_TEMPLATE_NAME, BLYNK_AUTH_TOKEN) untuk ditempelkan ke kode program."
    ],
    image: "assets/default-diagram.svg",
    code: `/* KREDENSIAL RESMI DARI BLYNK.CLOUD (WAJIB DI ATAS SEMUA INCLUDE) */
#define BLYNK_TEMPLATE_ID "TMPL62U0xhnR2"
#define BLYNK_TEMPLATE_NAME "Kontrol Led dgn Blynk"
#define BLYNK_AUTH_TOKEN "mbbOARWNhGvXh5uQBztvb5DFvA15m_9I"

#define BLYNK_PRINT Serial
#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>`
  },
  {
    id: "bab-3",
    tag: "BAB 3 • RANGKAIAN HARDWARE",
    title: "Skema Rangkaian Wokwi ESP32 + LED & DHT22",
    subtitle: "Menyusun skema pengkabelan pin digital dan sensor virtual pada lembar kerja simulator",
    points: [
      "Aktuator LED Indikator:",
      "• Kaki Anoda (+) LED dihubungkan ke GPIO 2 (D2) melalui Resistor 220 Ohm untuk proteksi arus.",
      "• Kaki Katoda (-) LED dihubungkan ke pin GND (Ground) ESP32.",
      "Sensor Lingkungan DHT22:",
      "• Pin VCC (Power) dihubungkan ke pin 3V3 ESP32.",
      "• Pin SDA (Data) dihubungkan ke pin GPIO 15 (D15) ESP32.",
      "• Pin GND dihubungkan ke Ground bersama.",
      "Tips Praktis: Di Wokwi, Anda dapat mengklik titik pin komponen untuk menarik kabel berwarna secara instan."
    ],
    image: "assets/default-diagram.svg",
    code: `// Pin Mapping ESP32 Sentral Robotika
#define LED_PIN   2   // Pin GPIO untuk LED Aktuator
#define DHT_PIN   15  // Pin GPIO untuk Data Sensor DHT22
#define DHT_TYPE  DHT22

#include "DHT.h"
DHT dht(DHT_PIN, DHT_TYPE);

void setupPins() {
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW); // Matikan LED saat awal
  dht.begin();
}`
  },
  {
    id: "bab-4",
    tag: "BAB 4 • PENULISAN KODE",
    title: "Program Lengkap ESP32 Blynk 2.0 (C++)",
    subtitle: "Integrasi fungsi callback virtual pin dan pengiriman data berkala dengan BlynkTimer",
    points: [
      "BLYNK_WRITE(V0): Fungsi penangkap event ketika pengguna menekan tombol Switch V0 pada aplikasi Blynk.",
      "BlynkTimer: Digunakan untuk memanggil pembacaan sensor setiap 2000ms (2 detik). Hindari penggunaan delay() karena akan memutus koneksi server!",
      "Blynk.virtualWrite(V1, suhu): Perintah untuk mengirim data suhu aktual ke widget Gauge V1 di cloud.",
      "Blynk.virtualWrite(V2, kelembapan): Perintah untuk mengirim data kelembapan aktual ke widget V2 di cloud."
    ],
    image: "assets/default-diagram.svg",
    code: `// KODE LENGKAP ESP32 WOKWI + BLYNK 2.0
#define BLYNK_TEMPLATE_ID "TMPL62U0xhnR2"
#define BLYNK_TEMPLATE_NAME "Kontrol Led dgn Blynk"
#define BLYNK_AUTH_TOKEN "mbbOARWNhGvXh5uQBztvb5DFvA15m_9I"

#define BLYNK_PRINT Serial
#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>
#include "DHT.h"

#define LED_PIN 2
#define DHT_PIN 15
#define DHT_TYPE DHT22

char ssid[] = "Wokwi-GUEST";
char pass[] = "";

DHT dht(DHT_PIN, DHT_TYPE);
BlynkTimer timer;

// Event Handler saat tombol V0 di Blynk ditekan
BLYNK_WRITE(V0) {
  int saklarStatus = param.asInt();
  digitalWrite(LED_PIN, saklarStatus);
  Serial.print("Status LED diubah ke: ");
  Serial.println(saklarStatus ? "MENYALA" : "MATI");
}

// Fungsi membaca sensor secara non-blocking
void kirimDataSensor() {
  float suhu = dht.readTemperature();
  float kelembapan = dht.readHumidity();

  if (isnan(suhu) || isnan(kelembapan)) {
    Serial.println("Gagal membaca dari sensor DHT22!");
    return;
  }

  // Kirim data ke Datastream V1 & V2 di Blynk
  Blynk.virtualWrite(V1, suhu);
  Blynk.virtualWrite(V2, kelembapan);
  
  Serial.printf("Suhu: %.1f C | Kelembapan: %.1f %%\n", suhu, kelembapan);
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  dht.begin();

  // Koneksi ke Blynk Cloud via WiFi Wokwi-GUEST
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);

  // Jadwalkan pembacaan sensor setiap 2 detik
  timer.setInterval(2000L, kirimDataSensor);
}

void loop() {
  Blynk.run();
  timer.run();
}`
  },
  {
    id: "bab-5",
    tag: "BAB 5 • PENGUJIAN & DEMO",
    title: "Uji Coba Simulasi Real-Time & Troubleshooting",
    subtitle: "Menjalankan simulasi di Wokwi dan berinteraksi langsung melalui Blynk Web/Mobile Dashboard",
    points: [
      "1. Di simulator Wokwi, klik tombol PLAY (ikon segitiga hijau di pojok kiri atas).",
      "2. Pantau Serial Monitor: Pastikan muncul teks 'WiFi connected' disusul pesan sukses 'Ready (ping: xx ms)'.",
      "3. Buka tab Blynk.Cloud: Periksa status Device, indikator status harus berubah dari 'Offline' menjadi 'Online' (hijau).",
      "4. Uji Kontrol Aktuator: Klik Switch V0 di Blynk Dashboard. Amati LED merah di simulator Wokwi menyala seketika!",
      "5. Uji Sensor Lingkungan: Klik sensor DHT22 di Wokwi, geser slider suhu dan kelembapan. Nilai pada widget Blynk akan langsung berubah secara real-time!"
    ],
    image: "assets/default-diagram.svg",
    code: `/* LOG SERIAL MONITOR KONEKSI BERHASIL:
[18] Connecting to Wokwi-GUEST
[1450] Connected to WiFi
[1450] IP: 10.0.1.15
[1450] 
    ___  __          __
   / _ )/ /_ _____  / /__
  / _  / / // / _ \\/  '_/
 /____/_/\\_, /_//_/_/\\_\\
        /___/ v1.3.2 on ESP32

[1459] Connecting to blynk.cloud:80
[1780] Ready (ping: 32ms).
Status LED diubah ke: MENYALA
Suhu: 29.4 C | Kelembapan: 68.0 %
*/`
  }
];
