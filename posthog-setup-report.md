<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DevEvent platform. Here's a summary of what was set up:

- **Client-side initialization** was updated in `instrumentation-client.ts` to use the correct EU PostHog host and the `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` environment variable.
- **Reverse proxy rewrites** in `next.config.ts` were updated to route to the EU PostHog ingestion endpoints, and the missing `/ingest/array/` route was added.
- **Environment variables** were written to `.env.local` with the PostHog project token and EU host.
- **Server-side PostHog client** was created at `lib/posthog-server.ts` using `posthog-node` for server-side event tracking.
- **Client-side events** were added to `ExploreBtn.tsx` and `EventCard.tsx` (converted to a client component to support click tracking).
- **Server-side event** was added to `app/api/events/route.ts` to track event creation.
- **User identification** was added to `BookEvent.tsx` — PostHog identifies the user by email when they successfully book a spot.

| Event | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the "Explore Events" CTA button on the homepage | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks an event card to view its detail page | `components/EventCard.tsx` |
| `event_created` | A new event is created via the POST /api/events API (server-side) | `app/api/events/route.ts` |
| `event_booked` | User successfully books a spot at an event (pre-existing) | `components/BookEvent.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/198069/dashboard/736107)
- [Event Booking Conversion Funnel](https://eu.posthog.com/project/198069/insights/q44lpQL9)
- [Event Bookings Over Time](https://eu.posthog.com/project/198069/insights/9NAlenQ1)
- [Event Discovery Engagement](https://eu.posthog.com/project/198069/insights/twIPATCq)
- [Events Created Over Time](https://eu.posthog.com/project/198069/insights/OCBen3e7)
- [Total Event Bookings (30d)](https://eu.posthog.com/project/198069/insights/6LgEcmim)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
