# Bug Fix: Array Parameter Handling in Teamwork MCP Server

## Date: October 27, 2025

## Problem

The Teamwork API requires array parameters in GET requests to be formatted as **comma-separated values** (e.g., `projectIds=123,456,789`), but the MCP server was sending them in axios's default format, which uses either:

- Repeated parameters: `projectIds=123&projectIds=456&projectIds=789`
- Bracket notation: `projectIds[]=123&projectIds[]=456&projectIds[]=789`

This caused filtering by multiple values (e.g., multiple project IDs, task list IDs, or tags) to fail or behave unexpectedly.

## Root Cause

The tool handlers were passing array parameters directly to the service layer without converting them to comma-separated strings. Axios, by default, does not convert arrays to comma-separated values when serializing query parameters.

## Solution

Added array-to-comma-separated-string conversion logic in the tool handlers for all affected GET endpoints:

### 1. getTasks (src/tools/tasks/getTasks.ts)

**Array parameters fixed:**

- `tasksSelectedColumns`
- `tasklistIds`
- `taskgroupIds`
- `taskIncludedSet`
- `tags`
- `tagIds`
- `status`
- `skipCRMDealIds`
- `selectedColumns`
- `responsiblePartyIds`
- `projectTagIds`
- `projectStatuses`
- `projectOwnerIds`
- `projectIds`
- `projectHealths`
- `projectFeaturesEnabled`
- `projectCompanyIds`
- `projectCategoryIds`
- `includeCustomFieldIds`
- `include`
- `ids`
- `followedByUserIds`
- `filterBoardColumnIds`
- `expandedIds`
- `excludeTagIds`
- `crmDealIds`
- `createdByUserIds`
- `assigneeTeamIds`
- `assigneeCompanyIds`
- `CustomFields`
- All `fields[...]` parameters (e.g., `fields[users]`, `fields[tasks]`, etc.)

### 2. getPeople (src/tools/people/getPeople.ts)

**Array parameters fixed:**

- `teamIds`
- `projectIds`
- `companyIds`

### 3. getCompanies (src/tools/companies/getCompanies.ts)

**Array parameters fixed:**

- `tagIds`

## Implementation Details

The fix converts arrays to comma-separated strings before passing them to the service layer:

```typescript
// Convert array parameters to comma-separated strings as required by Teamwork API
const arrayParameters = ['param1', 'param2', ...];

for (const param of arrayParameters) {
  if (Array.isArray(apiInput[param])) {
    apiInput[param] = apiInput[param].join(',');
  }
}
```

## Impact

This fix affects all users of the following MCP tools when filtering by multiple values:

- `getTasks` - filtering by multiple projects, task lists, tags, etc.
- `getPeople` - filtering by multiple teams, projects, or companies
- `getCompanies` - filtering by multiple tags

## Testing Recommendations

To verify the fix works correctly, test the following scenarios:

1. **getTasks with multiple project IDs:**

   ```json
   {
     "projectIds": [123456, 789012]
   }
   ```

2. **getPeople with multiple team IDs:**

   ```json
   {
     "teamIds": [111, 222, 333]
   }
   ```

3. **getCompanies with multiple tag IDs:**

   ```json
   {
     "tagIds": ["tag1", "tag2"]
   }
   ```

4. **getTasks with fields parameter:**
   ```json
   {
     "fieldsUsers": ["id", "firstName", "lastName"]
   }
   ```

## Notes

- POST/PUT/PATCH endpoints (like `createTask`, `updateTask`, `addPeopleToProject`) were not affected because they send arrays in the request body as JSON, not as query parameters.
- This was a systematic bug affecting multiple GET endpoints that accept array parameters.
- The fix maintains backward compatibility - single values and non-array parameters continue to work as before.

## References

- Teamwork API Documentation: https://apidocs.teamwork.com/docs/teamwork/endpoints-by-object/tasks/get-projects-api-v3-tasks-json
- API documentation explicitly states: "Format: Comma separated values" for array parameters


