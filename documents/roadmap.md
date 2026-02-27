# OnePass Project Roadmap

Tento dokument definuje budoucí kroky vývoje platformy OnePass na základě analýzy aktuálního stavu a stanovených cílů.

## Aktuální Stav (Audit)
- **Framework:** Next.js 15.5 (Guidelines vyžadovaly 14, ale 15 je aktuálnější a funkční).
- **Bezpečnost:** Používá se `proxy.ts` pro ochranu rout. Role jsou kontrolovány lokálně v API.
- **Validace:** Používají se základní podmínky, chybí robustní validace typu Zod.
- **Testování:** Žádné automatizované testy (Jest/Cypress).
- **Stripe:** Pouze placeholdery v kódu.
- **Vyhledávání:** Pouze klientské filtrování, chybí Full-text search v DB.
- **SEO:** Základní metadata v layoutu, chybí dynamické SEO pro události.

---

## Fáze 1: Základy a Bezpečnost (Must-Haves)

### 1.1 Bezpečnost a Proxy
- Implementace `proxy.ts` pro globální ochranu rout (Admin, Organizer, Authenticator).
- Sjednocení role-based přístupu napříč aplikací.

### 1.2 Robustní Validace a Testing
- Přechod na **Zod** pro validaci vstupů ve všech API routech.
- Nastavení **Jest** pro unit testy (logika ticketů, výpočty provizí).
- Nastavení **Cypress** nebo **Playwright** pro kritické E2E scénáře (nákup, skenování).

### 1.3 Stripe Integrace
- Implementace kompletního Checkout flow.
- Handling Webhooků pro potvrzení platby a změnu stavu ticketů.
- Logika pro vyplácení provizí organizátorům.

### 1.4 SEO Optimalizace
- Implementace `generateMetadata` pro dynamické stránky událostí.
- Přidání JSON-LD strukturovaných dat pro lepší indexaci událostí vyhledávači.
- Generování sitemapy a robots.txt.

---

## Fáze 2: Rozšířená Funkcionalita

### 2.1 Full-Text Search
- Implementace PostgreSQL Full-Text Search (FTS) pro události a lístky.
- Optimalizace dotazů pomocí indexů.

### 2.2 Vylepšený Ticket Scanner
- Optimalizace UI skeneru pro mobilní zařízení.
- Real-time zpětná vazba přes SSE při skenování (okamžité zobrazení stavu na jiných zařízeních admina).

### 2.3 SSE Standardizace
- Refaktorizace existujícího SSE hooku pro jednotné použití v celé aplikaci.
- Implementace notifikací pro uživatele (např. při prodeji lístku v resellingu).

---

## Fáze 3: Nástroje pro Organizátory a Adminy

### 3.1 Admin Dashboard
- Vizualizace dat (prodeje, návštěvnost, provize) pomocí grafů (např. Recharts).
- Audit logs pro sledování důležitých akcí v systému.

### 3.2 Seat Map Editor
- Vývoj nástroje pro vizuální návrh rozložení míst v sálech.
- Integrace do procesu nákupu ticketů.

---

## Fáze 4: Expanze a Optimalizace

### 4.1 Mobilní Aplikace
- Vývoj nativní aplikace v React Native.
- Využití existujícího backend API.

### 4.2 Výkon a Audit
- Optimalizace DB dotazů a Edge funkcí na Vercel.
- Finální bezpečnostní audit finančních transakcí.
