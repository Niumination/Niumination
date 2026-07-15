# Gitiumination — DOX

**Lokasi:** `~/Desktop/Niumination/Niumination/`
**Repo:** `github.com/Niumination/Niumination`
**Role:** GitHub Profile README — gerbang utama ekosistem Niumination
**DOX Version:** 1.0

---

## Core Contract

1. **AGENTS.md** ini adalah DOX untuk repo profil GitHub Niumination
2. Isi README.md adalah representasi publik — harus mencerminkan ekosistem secara akurat
3. Setiap perubahan kode di ekosistem yang mengubah status/catalog WAJIB diikuti update README
4. File `profile.config.json` adalah source of truth konten profil — jangan edit README langsung untuk data terstruktur
5. Parent DOX: `~/Desktop/Niumination/AGENTS.md`

---

## 🧠 AI Agent Instructions

### Ponytail — Lazy Senior Dev Mindset (inherit from parent DOX)

Gunakan `/skill ponytail` atau jalankan decision ladder sebelum nulis kode apapun:
1. **Perlu ada?** → YAGNI, skip
2. **Udah ada di repo?** → Reuse existing
3. **Stdlib bisa?** → Pake stdlib dulu
4. **Platform native?** → Fitur OS/browser udah ada?
5. **Dependency terinstall?** → Baru pake
6. **Bisa satu baris?** → Jangan 27 baris kalo bisa 1 baris
7. **Baru: tulis kode minimal**

---

## Struktur Repo

```
Niumination/
├── AGENTS.md                  ← FILE INI — DOX repo profil
├── README.md                  ← GitHub Profile README (tampilan publik)
├── package.json               ← Node.js config (profile generator tooling)
├── profile.config.json        ← Source of truth data profil
├── profile.schema.json        ← JSON Schema untuk validasi config
├── PROMPT.md                  ← AI agent workflow (untuk personalisasi)
├── .git .github/workflows/
│   └── update-activity.yml    ← Auto-update recent activity (cron harian)
├── scripts/
 validate.mjs           ← Validasi config & referensi
│   ├── generate-readme.mjs    ← Generate README dari config
│   └── update-activity.mjs    ← Fetch aktivitas GitHub terbaru
└── docs/
    └── CUSTOMIZATION.md       ← Panduan kustomisasi
```

---

## Data Flow

```
profile.config.json  ──→  generate-readme.mjs  ──→  README.md
                              ↑
                    GitHub Actions (cron harian)
                              ↓
                    update-activity.mjs → update Recent Activity di README
```

---

## Maintenance Rules

1. **Ekosistem update** → Update `profile.config.json` → regenerate README
2. **Featured projects** → Maksimal 6, prioritas yang paling mature & deployed
3. **Tech stack** → Update saat stack baru digunakan di proyek utama
4. **Status** → Update `profile.status` jika role/posisi berubah
5. **Jangan edit README langsung** untuk data terstruktur — edit config dulu

---

> **Dibuat:** 15 Juli 2026
> **Oleh:** Jcode — untuk Niumination (Afrizal Munthe), Aceh Tengah
