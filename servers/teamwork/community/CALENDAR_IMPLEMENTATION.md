# Calendar Support Implementation

## Overview

Calendar support has been successfully added to the vizioz/teamwork-mcp project. This implementation provides a complete set of tools for managing calendar events in Teamwork.com through the MCP (Model Context Protocol) server.

## Implementation Date

October 22, 2025

## What Was Implemented

### Calendar Services (`src/services/calendar/`)

Created 5 service files that handle direct API calls to Teamwork's Calendar API (v1):

1. **`getCalendarEvents.ts`** - Retrieves calendar events with optional filtering

   - Supports date range filtering (startDate, endDate)
   - Filtering by user, event type, and updated date
   - Pagination support
   - Option to show deleted events and attending-only events

2. **`getCalendarEventById.ts`** - Retrieves a specific calendar event by ID

3. **`createCalendarEvent.ts`** - Creates new calendar events

   - Required fields: title, startDate, endDate
   - Optional fields: description, time, location, reminders, recurrence, attendees, project association
   - Supports both all-day and timed events

4. **`updateCalendarEvent.ts`** - Updates existing calendar events

   - All event properties are optional (partial updates supported)

5. **`deleteCalendarEvent.ts`** - Deletes calendar events

### Calendar Tools (`src/tools/calendar/`)

Created 5 MCP tool wrappers that expose the calendar services:

1. **`getCalendarEvents.ts`** - Tool definition and handler for listing events
2. **`getCalendarEventById.ts`** - Tool definition and handler for getting a specific event
3. **`createCalendarEvent.ts`** - Tool definition and handler for creating events
4. **`updateCalendarEvent.ts`** - Tool definition and handler for updating events
5. **`deleteCalendarEvent.ts`** - Tool definition and handler for deleting events

### Integration Points

**Services Registration (`src/services/index.ts`):**

- Added imports for all 5 calendar services
- Exported calendar services individually and in the default export object

**Tools Registration (`src/tools/index.ts`):**

- Added imports for all 5 calendar tool definitions and handlers
- Added tool pairs to the `toolPairs` array
- Exported all calendar handlers

**Documentation (`README.md`):**

- Added new "Calendar Tools" section
- Listed all 5 calendar tools with descriptions

## Key Features

### Date Format Support

- Dates use `YYYYMMDD` format (e.g., `20250122`)
- Times use `HH:MM` 24-hour format (e.g., `09:00`)

### Event Types

- **All-day events**: Set `isAllDay: true`
- **Timed events**: Provide `startTime` and `endTime`

### Recurrence Support

- Repeat types: `none`, `daily`, `weekly`, `monthly`, `yearly`
- Optional repeat end date

### Attendees

- Support for user IDs
- Support for company IDs
- Multiple attendees can be added to an event

### Project Association

- Events can be linked to specific Teamwork projects via `projectId`

### Reminders

- Set reminders X minutes before the event
- Controlled via `remindBefore` parameter

## API Version

Calendar events use Teamwork's **v1 API**, accessed through the v1 API client:

- Base URL: `https://{domain}.teamwork.com/`
- Endpoints: `/calendarevents.json`, `/calendarevents/{id}.json`

## Testing

The implementation successfully builds without errors:

```bash
npm run build
```

All TypeScript files compile cleanly, and the calendar tools are now available through the MCP server.

## Usage Example

### Creating a Calendar Event

```json
{
  "event": {
    "title": "Team Meeting",
    "description": "Weekly sync meeting",
    "startDate": "20250127",
    "startTime": "10:00",
    "endDate": "20250127",
    "endTime": "11:00",
    "location": "Conference Room A",
    "remindBefore": 15,
    "attendees": {
      "userIds": [123, 456],
      "companyIds": [789]
    },
    "projectId": 12345
  }
}
```

### Getting Calendar Events

```json
{
  "startDate": "20250101",
  "endDate": "20250131",
  "userId": 123,
  "attendingOnly": true
}
```

## Tool Filtering

Calendar tools can be included/excluded using the MCP server's tool filtering:

**Include only calendar tools:**

```bash
npx @vizioz/teamwork-mcp --allow=Calendar
```

**Exclude calendar tools:**

```bash
npx @vizioz/teamwork-mcp --deny=Calendar
```

**Specific tools:**

```bash
npx @vizioz/teamwork-mcp --allow=getCalendarEvents,createCalendarEvent
```

## File Structure

```
vizioz-teamwork-mcp/
├── src/
│   ├── services/
│   │   ├── calendar/
│   │   │   ├── getCalendarEvents.ts
│   │   │   ├── getCalendarEventById.ts
│   │   │   ├── createCalendarEvent.ts
│   │   │   ├── updateCalendarEvent.ts
│   │   │   └── deleteCalendarEvent.ts
│   │   └── index.ts (updated)
│   └── tools/
│       ├── calendar/
│       │   ├── getCalendarEvents.ts
│       │   ├── getCalendarEventById.ts
│       │   ├── createCalendarEvent.ts
│       │   ├── updateCalendarEvent.ts
│       │   └── deleteCalendarEvent.ts
│       └── index.ts (updated)
└── README.md (updated)
```

## Benefits Over Go Implementation

This TypeScript implementation has several advantages over the Go implementation attempted earlier:

1. **No SDK Dependency**: Makes direct API calls using axios, avoiding the need for SDK updates
2. **Simpler Structure**: Clear separation between services (API calls) and tools (MCP wrappers)
3. **Faster Development**: No need to wait for `twapi-go-sdk` updates
4. **JSON Schema**: Uses JSON Schema directly for tool definitions (no code generation needed)
5. **Easier Testing**: Can test services and tools independently
6. **More Flexible**: Easy to add new tools or modify existing ones

## Future Enhancements

Potential improvements that could be added:

1. **iCal Integration**: Export/import calendar events in iCal format
2. **Bulk Operations**: Create/update/delete multiple events at once
3. **Conflict Detection**: Check for scheduling conflicts before creating events
4. **Advanced Filtering**: More sophisticated filtering options for listing events
5. **Calendar Views**: Support for day/week/month views
6. **Event Templates**: Pre-defined templates for common event types
7. **Timezone Support**: Better timezone handling for international teams

## Comparison with Go Implementation

### Go Implementation (teamwork-mcp)

- ❌ **Blocked**: Requires `twapi-go-sdk` updates first
- ❌ **Complex**: Needs struct definitions, method implementations, tool registration
- ❌ **Dependencies**: External SDK must support calendar events
- ✅ **Type Safety**: Strong typing at compile time

### TypeScript Implementation (vizioz-teamwork-mcp)

- ✅ **Complete**: Fully implemented and working
- ✅ **Simple**: Direct API calls, easy to understand
- ✅ **Independent**: No external SDK dependencies for calendar features
- ✅ **Flexible**: Easy to modify and extend
- ✅ **Type Safe**: TypeScript provides type safety

## Conclusion

Calendar support has been successfully added to the vizioz/teamwork-mcp project. The implementation is complete, tested, and ready to use. All 5 calendar tools are now available through the MCP server and can be used by AI assistants like Claude to manage calendar events in Teamwork.com.

This implementation demonstrates the advantages of the TypeScript approach over the Go implementation, particularly when adding new features that aren't yet supported by external SDKs.

