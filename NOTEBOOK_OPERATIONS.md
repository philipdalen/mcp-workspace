# Teamwork Notebooks - Quick Reference

## What are Teamwork Notebooks?

Notebooks in Teamwork.com are spaces where teams can create, share, and organize written content. They're perfect for:
- 📝 Meeting notes
- 📚 Documentation
- 🔬 Research and ideas
- 📋 Process documentation
- 💡 Knowledge base articles

## Available Operations

### 1. Create Notebook

**Tool**: `twprojects-create_notebook`

**Required Parameters**:
- `name` - The notebook name
- `project_id` - The project ID
- `contents` - The notebook content
- `type` - Either "MARKDOWN" or "HTML"

**Optional Parameters**:
- `description` - A description
- `tag_ids` - Array of tag IDs

**Example Cascade Prompt**:
```
Create a notebook in project 12345 called "Sprint Planning Notes" 
with markdown content about our Q1 goals
```

---

### 2. Update Notebook

**Tool**: `twprojects-update_notebook`

**Required Parameters**:
- `id` - The notebook ID

**Optional Parameters**:
- `name` - New name
- `description` - New description
- `contents` - New content
- `type` - "MARKDOWN" or "HTML"
- `tag_ids` - Array of tag IDs

**Example Cascade Prompt**:
```
Update notebook 789 to add a section about the new feature launch
```

---

### 3. Get Notebook

**Tool**: `twprojects-get_notebook`

**Required Parameters**:
- `id` - The notebook ID

**Example Cascade Prompt**:
```
Show me the contents of notebook 789
```

---

### 4. List Notebooks

**Tool**: `twprojects-list_notebooks`

**Optional Parameters**:
- `project_ids` - Filter by project IDs (array)
- `search_term` - Search by name or description
- `tag_ids` - Filter by tag IDs (array)
- `match_all_tags` - Require all tags (boolean)
- `include_contents` - Include full content (boolean, default: true)
- `page` - Page number for pagination
- `page_size` - Results per page

**Example Cascade Prompts**:
```
List all notebooks in project 12345

Find notebooks tagged with "documentation" in projects 100 and 200

Search for notebooks containing "API" in the name or description
```

---

### 5. Delete Notebook

**Tool**: `twprojects-delete_notebook`

**Required Parameters**:
- `id` - The notebook ID

**Example Cascade Prompt**:
```
Delete notebook 789
```

---

## Content Types

### Markdown
Use `"type": "MARKDOWN"` for:
- Simple formatting
- Code blocks
- Lists and tables
- Headings

### HTML
Use `"type": "HTML"` for:
- Rich formatting
- Custom styling
- Complex layouts
- Embedded media

---

## Workflow Examples

### Daily Standup Notes
```
Create a markdown notebook in project 12345 called "Daily Standup - Jan 22, 2025"
with sections for: What we did yesterday, What we're doing today, Blockers
```

### Technical Documentation
```
Create an HTML notebook in project 12345 called "API Integration Guide"
with detailed steps for integrating our REST API
```

### Meeting Minutes
```
List all notebooks in project 12345 with "meeting" in the name,
then update the most recent one with today's action items
```

### Knowledge Base Search
```
Search all notebooks for "deployment process" and show me the top 3 results
```

---

## Tips & Best Practices

### Organization
- ✅ Use consistent naming conventions (e.g., "Meeting - YYYY-MM-DD")
- ✅ Tag notebooks by category (e.g., "documentation", "meetings", "planning")
- ✅ Keep project-specific notebooks in their respective projects

### Content
- ✅ Use Markdown for simple, version-controllable content
- ✅ Use HTML when you need rich formatting or custom styling
- ✅ Include dates and authors in notebook titles or descriptions
- ✅ Link related notebooks using Teamwork URLs

### Maintenance
- ✅ Regularly review and update outdated notebooks
- ✅ Archive or delete obsolete notebooks
- ✅ Use search terms to find and consolidate duplicate content

---

## Integration with Other Tools

### With Tasks
```
Get notebook 789, then create tasks based on the action items listed in it
```

### With Comments
```
List notebooks in project 12345, then add a comment to notebook 789 
asking for review
```

### With Tags
```
Create a notebook and tag it with tags 10, 11, and 12 for easy categorization
```

---

## Common Patterns

### Weekly Reports
1. Create a notebook template
2. Clone it weekly with updated dates
3. Fill in progress, blockers, and next steps
4. Tag with "weekly-report"

### Documentation Hub
1. Create a main "Documentation Index" notebook
2. Link to other notebooks by topic
3. Keep it updated as new docs are added
4. Tag all docs with "documentation"

### Project Retrospectives
1. Create a notebook at project end
2. Include: What went well, What didn't, Action items
3. Tag with "retrospective" and project name
4. Reference in future planning

---

## Quick Command Reference

| Action | Cascade Prompt Example |
|--------|------------------------|
| Create | "Create a markdown notebook in project X called Y" |
| Read | "Show me notebook 123" |
| Update | "Update notebook 123 with new content" |
| List | "List all notebooks in project X" |
| Search | "Find notebooks about deployment" |
| Delete | "Delete notebook 123" |
| Filter | "Show notebooks tagged with documentation" |

---

## Need Help?

- Check the full setup guide: `TEAMWORK_MCP_SETUP.md`
- View the Teamwork API docs: https://apidocs.teamwork.com/
- Official MCP repo: https://github.com/Teamwork/mcp
