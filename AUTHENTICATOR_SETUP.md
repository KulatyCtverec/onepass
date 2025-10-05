# Nastavení ověřovatele QR kódů

## Přehled

Tato funkce umožňuje určitým uživatelům ověřovat vstupenky pomocí QR kódů skenovaných kamerou zařízení.

## Nové funkce

### 1. Nový typ uživatele

- Přidáno pole `AUTHETICATOR` do tabulky `users`
- Ověřovatelé mohou přistupovat ke stránce `/authenticator`

### 2. Komponenta QRCodeScanner

- Používá kameru zařízení pro skenování QR kódů
- Automaticky ověřuje vstupenky přes API
- Zobrazuje výsledky ověření

### 3. Stránka pro ověřovatele

- `/authenticator` - stránka s kamerou pro skenování
- Chráněná middleware - pouze pro ověřovatele

## Instalace

### 1. Spuštění migrace

```bash
npx prisma migrate dev --name add_authenticator_role
```

### 2. Regenerace Prisma client

```bash
npx prisma generate
```

### 3. Nastavení ověřovatele

```bash
node scripts/make-authenticator.mjs user@example.com
```

## Použití

### Pro ověřovatele:

1. Přihlásit se do systému
2. Kliknout na "📱 Ověřit vstupenky" v navigaci
3. Spustit kameru
4. Naskenovat QR kód vstupenky
5. Zobrazí se výsledek ověření

### Pro administrátory:

1. Spustit skript pro nastavení ověřovatele
2. Ověřovatel se objeví v navigaci

## Technické detaily

### API

- `/api/auth/check-authenticator` - kontrola oprávnění
- `/api/tickets/verify` - ověření vstupenky

### Bezpečnost

- Middleware chrání stránku `/authenticator`
- Ověřování přes NextAuth session

## Poznámky

- Pro reálné použití je potřeba implementovat detekci QR kódů (např. pomocí knihovny `jsqr`)
- Kamera vyžaduje HTTPS v produkci
- Ověřovatelé nemají přístup k administraci
