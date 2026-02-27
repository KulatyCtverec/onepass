# Plán implementace Full-Text Search (FTS) - OnePass

Tento dokument popisuje kroky potřebné pro zavedení robustního a výkonného vyhledávání událostí pomocí PostgreSQL Full-Text Search.

## 1. Databázová vrstva (PostgreSQL & Prisma)

Pro efektivní vyhledávání v tisících událostech nestačí operátor `LIKE` nebo `contains`. PostgreSQL nabízí nativní FTS pomocí typů `tsvector` a `tsquery`.

### Kroky:
- **Aktivace Prisma Preview Feature**: Do `schema.prisma` přidat `previewFeatures = ["fullTextSearchPostgres"]`.
- **Vytvoření GIN Indexu**: Pro maximální výkon vytvoříme GIN index nad vyhledávacími poli (`name`, `description`, `location`).
  ```sql
  CREATE INDEX event_search_idx ON "Event" USING GIN (to_tsvector('czech', name || ' ' || description || ' ' || location));
  ```
- **Jazyková podpora**: Použijeme konfiguraci `'czech'` pro správné skloňování a stop-slova v češtině.

## 2. Backend API (Next.js API Routes)

Aktualizujeme endpoint `/api/events`, aby přijímal vyhledávací dotaz.

### Implementace:
- **Parametry**: `GET /api/events?q=koncert&category=music`.
- **Prisma Query**:
  ```typescript
  const events = await prisma.event.findMany({
    where: {
      AND: [
        search ? {
          OR: [
            { name: { search: search.split(' ').join(' & ') } },
            { description: { search: search.split(' ').join(' & ') } },
            { location: { search: search.split(' ').join(' & ') } },
          ]
        } : {},
        category ? { category } : {},
      ]
    },
    orderBy: search ? {
      _relevance: {
        fields: ['name', 'description'],
        search: search,
        sort: 'desc'
      }
    } : { date: 'asc' }
  });
  ```

## 3. Frontend a UX (React)

Vyhledávání musí být plynulé a nesmí přetěžovat server.

### Klíčové prvky:
- **Debouncing**: Použijeme hook (např. `useDebounce`), aby se API volalo až 300-500ms po dopsání uživatelem.
- **Synchronizace s URL**: Vyhledávací dotaz by se měl promítat do URL (`?search=...`), aby výsledky zůstaly i po refreshování stránky.
- **Stavy načítání**: Během čekání na výsledky zobrazíme skeleton loadingy.
- **Prázdné stavy**: Hezké UI pro případ, kdy nebylo nic nalezeno, s návrhem na vymazání filtrů.

## 4. Best Practices & Optimalizace

- **Sanitizace**: Ošetření speciálních znaků v dotazu, které by mohly rozbít FTS syntaxi Postgresu.
- **Váha polí**: Název události by měl mít při vyhledávání vyšší váhu než popis (např. shoda v názvu je relevantnější).
- **Fuzzy matching**: Zvážit rozšíření o `pg_trgm` pro ošetření překlepů (např. "koncert" vs "kocert").

## 5. Postup implementace (Checklist)

1. [ ] Upravit `schema.prisma` a spustit `prisma generate`.
2. [ ] Vytvořit SQL migraci pro GIN index.
3. [ ] Upravit `/api/events/route.ts` pro podporu `q` parametru.
4. [ ] Implementovat `useDebounce` hook v `lib/hooks`.
5. [ ] Propojit `SearchBox` se stavem v `HomepageEventsTable`.
6. [ ] Přidat loading indikátory.
7. [ ] Otestovat s větším množstvím dat.
