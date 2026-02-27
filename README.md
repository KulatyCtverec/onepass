# OnePass - Event Ticket Management Platform

OnePass je moderní platforma pro správu a prodej vstupenek na události, postavená na Next.js 15 s TypeScript a Prisma ORM. 

## Hlavní myšlenky OnePass

OnePass má dvě hlavní myšlenky:
- **Zajistit 100% bezpečí při přeprodeji lístků** - Má myšlenka s touto aplikací je ve své podstatě jednoduchá. Když lístek nebude pouze PDFko s jedním QR-kódem, ale záznam v databázi, jsem jako admin aplikace schopný zajistit 100% bezpečný přeprodej mezi uživateli (prostě změním ownera záznamu v db).
- **Umožnění prodejci získat podíl z přeprodeje lístků** - Problém, se kterým by se aplikace mohla potýkat je ten, že lístky musím generovat já, jako admin OnePass. Abych motivoval organizátory generovat aplikace, napadlo mě, že bych mohl poskytnout organizátorům pár procent z každého přeprodeje, a tím odemknout organizátorům úplně nový příjem, ke kterému by se jinak nedostali. Zkrátka uživatel platí premium za bezpečnost, které dostane organizátor, a část samozřejmě i já, jako majitel aplikace.
 
## 🎨 Design

Cíl mého designu je, aby aplikace působila co nejjednodušeji a nejmoderněji, co to jde. Proto používám v mém UI následující:

- **Glass efekt** - Průhledné pozadí s backdrop-filter blur
- **Gradient pozadí** - Animované gradient pozadí s blur efektem
- **Neon glow** - Světelné efekty kolem prvků
- **Moderní typografie** - Používám jeden konkrétní font, nechci mít aplikaci přeplácanou.
- **Responsivní design** - Optimalizováno pro všechna zařízení

### Barvy

- **Primary**: Modrá (#3b82f6) - hlavní barva
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

- Ověřování vstupenek pomocí čtečky QR kódů integrované ve OnePass
- Možnost ověřovat lístky z každého mobilu 

## 🛠️ Technologie

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Komponenty**: shadcn/ui a velká část mých vlastních
- **Backend**: Next.js API Routes
- **Databáze**: PostgreSQL s Prisma ORM
- **Autentifikace**: Auth.js
- **Deployment**: Vercel

## 🎯 Instalace

1. **Klonování repozitáře**

```bash
git clone https://github.com/KulatyCtverec/onepass.git
cd onepass
```

2. **Instalace závislostí**

```bash
npm install
```

3. **Nastavení prostředí**

```bash
cp .env.example .env.local
# Upravte DATABASE_PRISMA_DATABASE_URL a další proměnné
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



## 📊 Struktura projektu

```
onepass/
├── app/                    # Next.js 15 app router
├── api/               # API endpoints
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

**OnePass** - Moderní platforma pro správu událostí s garancí bezpečných přeprodejů