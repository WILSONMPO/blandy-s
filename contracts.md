# Mind Over Matter — API Contracts & Integration Plan

## Goals
1. Replace mocked posts / editor's picks / featured essay with MongoDB-backed data.
2. Persist newsletter subscriptions on the server.
3. Persist contact messages (optional simple form).
4. Keep the frontend look/feel identical — only swap the data source.

## Data Currently Mocked in `/app/frontend/src/mock.js`
- `FEATURED` — hero featured essay
- `POSTS` — array of essays (grid + hero-of-latest)
- `EDITORS_PICKS` — sidebar list
- `CATEGORIES` — nav categories (kept in frontend, static)
- `VIDEOS` — kept in frontend (uses direct MP4 URLs)
- `AUTHOR` — kept in frontend (static bio)

After integration, `FEATURED`, `POSTS`, `EDITORS_PICKS` come from API.
Newsletter form will `POST /api/subscribe` instead of only localStorage.

## MongoDB Collections
### `posts`
```
{
  id: str (uuid),
  slug: str (unique),
  title: str,
  category: str,
  dek: str | null,           # long deck for featured
  excerpt: str,
  cover: str,                # image url
  date: str,                 # human readable (e.g. "July 12, 2025")
  read_time: str,            # "7 min read"
  featured: bool,            # only 1 featured=true; used as hero
  editors_pick: bool,        # marks Editor's Picks sidebar
  body: str | null,          # markdown/plain (future)
  created_at: iso datetime,
  order: int                 # for sorting
}
```

### `subscriptions`
```
{
  id: str (uuid),
  email: str,                # unique
  source: str,               # "newsletter"
  created_at: iso datetime
}
```

### `contacts`
```
{
  id: str (uuid),
  name: str,
  email: str | null,
  message: str,
  created_at: iso datetime
}
```

## REST Endpoints (all prefixed with `/api`)
| Method | Path | Purpose |
|---|---|---|
| GET | `/posts` | List posts. Query: `?category=`, `?limit=`, `?featured=true`, `?editors_pick=true` |
| GET | `/posts/featured` | The single featured hero essay |
| GET | `/posts/{slug}` | Single post detail |
| POST | `/posts` | Create post (CMS) |
| PUT | `/posts/{id}` | Update post (CMS) |
| DELETE | `/posts/{id}` | Delete post (CMS) |
| POST | `/subscribe` | Newsletter subscribe `{ email }` |
| GET | `/subscribers` | List all subscribers (admin/debug) |
| POST | `/contact` | Contact message |
| POST | `/seed` | Idempotent seed of mock posts into DB (dev helper) |

## Response Shapes
- Frontend expects camelCase fields: `readTime`, `editorsPick`. Backend stores snake_case; a small serializer maps to camelCase in responses.

## Frontend Integration Points
- `src/api.js` (new) — axios instance using `REACT_APP_BACKEND_URL`.
- `Hero.jsx` — fetch featured essay.
- `LatestPosts.jsx` — fetch posts list.
- `AuthorAndPicks.jsx` — fetch editor's picks.
- `Newsletter.jsx` — POST to `/api/subscribe`, keep localStorage as fallback.
- On first load app calls `/api/seed` once (idempotent) to guarantee data is present without a manual step.

## Error Handling
- All endpoints return `{ detail: "..." }` with proper 4xx/5xx codes.
- Frontend shows toast on failure, falls back to cached mock arrays (kept in `mock.js`) so the page is never empty.
