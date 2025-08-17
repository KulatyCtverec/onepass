# OnePass - Event Ticket Management Platform

OnePass je moderní platforma pro správu a prodej vstupenek na události, postavená na Next.js 14 s TypeScript a Prisma ORM.

## 🎨 Design System

Aplikace používá moderní design systém inspirovaný hyper-moderním dark theme s:

- **Glass efekty** - Průhledné pozadí s backdrop-filter blur
- **Gradient pozadí** - Animované gradient pozadí s blur efektem
- **Neon glow** - Světelné efekty kolem prvků
- **Moderní typografie** - Čisté fonty s optimální čitelností
- **Responsivní design** - Optimalizováno pro všechny zařízení

### Barvy

- **Primary**: Modrá (#3b82f6) - hlavní akční barva
- **Background**: Tmavé pozadí s gradientem
- **Foreground**: Světlý text pro maximální kontrast
- **Glass**: Průhledné prvky s blur efektem

## 🚀 Funkce

### Pro uživatele
- Procházení událostí
- Nákup vstupenek
- Správa vlastních vstupenek
- QR kódy pro vstup

### Pro organizátory
- Vytváření událostí
- Správa typů vstupenek
- Monitoring prodeje
- Admin dashboard

### Pro ověřovatele
- Ověřování vstupenek pomocí QR kódů
- Mobilní rozhraní pro terénní použití

## 🛠️ Technologie

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS s custom design systémem
- **UI Komponenty**: shadcn/ui
- **Backend**: Next.js API Routes
- **Databáze**: PostgreSQL s Prisma ORM
- **Autentifikace**: NextAuth.js
- **Deployment**: Vercel

## 📱 Komponenty

### Hlavní komponenty
- `Navbar` - Navigační lišta s glass efektem
- `EventCard` - Karty událostí s moderním designem
- `TicketCard` - Karty vstupenek s QR kódy
- `AdminDashboard` - Administrační rozhraní
- `CreateEventForm` - Formulář pro vytváření událostí

### UI komponenty
- Všechny shadcn/ui komponenty stylované podle design systému
- Glass efekty a gradient pozadí
- Responsivní grid layout
- Moderní animace a přechody

## 🎯 Instalace

1. **Klonování repozitáře**
```bash
git clone https://github.com/yourusername/onepass.git
cd onepass
```

2. **Instalace závislostí**
```bash
npm install
```

3. **Nastavení prostředí**
```bash
cp .env.example .env.local
# Upravte DATABASE_URL a další proměnné
```

4. **Spuštění databáze**
```bash
npx prisma db push
```

5. **Spuštění vývojového serveru**
```bash
npm run dev
```

## 🔧 Konfigurace

### Databáze
- PostgreSQL databáze
- Prisma schema s automatickými migracemi
- Seed data pro testování

### Autentifikace
- Google OAuth
- Credentials autentifikace
- Role-based access control (Admin, Authenticator)

### Design
- Dark mode jako výchozí
- Responsivní breakpointy
- Custom CSS proměnné pro konzistentní design

## 📊 Struktura projektu

```
onepass/
├── app/                    # Next.js 14 app router
│   ├── api/               # API endpoints
│   ├── admin/             # Admin rozhraní
│   ├── events/            # Stránky událostí
│   └── authenticator/     # Ověřování vstupenek
├── components/            # React komponenty
│   ├── ui/               # shadcn/ui komponenty
│   └── ...               # Vlastní komponenty
├── lib/                   # Utility funkce
├── prisma/                # Databázové schéma
└── public/                # Statické soubory
```

## 🎨 Design principy

1. **Glass morphism** - Průhledné prvky s blur efektem
2. **Gradient pozadí** - Animované pozadí pro dynamický vzhled
3. **Neon efekty** - Světelné obrysy pro zvýraznění
4. **Konzistentní spacing** - Jednotný systém mezer a padding
5. **Moderní typografie** - Čisté fonty s optimální čitelností

## 🚀 Deployment

Aplikace je optimalizována pro deployment na Vercel:

1. Push na GitHub
2. Propojení s Vercel
3. Automatické deployment při push
4. Environment variables v Vercel dashboard

## 🤝 Přispívání

1. Fork repozitáře
2. Vytvoření feature branch
3. Commit změn
4. Push na branch
5. Otevření Pull Request

## 📄 Licence

MIT License - viz LICENSE soubor

## 👨‍💻 Autor

Matěj Janeček

---

**OnePass** - Moderní platforma pro správu událostí s hyper-moderním designem 🎫✨
