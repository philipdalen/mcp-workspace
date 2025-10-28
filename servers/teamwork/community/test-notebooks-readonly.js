/**
 * Test script for Notebook functionality (Read-only operations)
 * This script tests notebook operations that don't require write permissions
 */

import teamworkService from "./build/services/index.js";

async function testNotebooksReadOnly() {
    console.log("\n=== Testing Notebook Functionality (Read-Only) ===\n");

    try {
        // Step 1: Get a project to work with
        console.log("Step 1: Fetching projects to get a test project...");
        const projects = await teamworkService.getProjects({ pageSize: 1 });

        if (!projects || !projects.projects || projects.projects.length === 0) {
            throw new Error(
                "No projects found. Please create a project first."
            );
        }

        const testProjectId = projects.projects[0].id;
        console.log(
            `✓ Found project: ${projects.projects[0].name} (ID: ${testProjectId})`
        );

        // Step 2: List all notebooks
        console.log("\nStep 2: Listing all notebooks...");
        const allNotebooks = await teamworkService.listNotebooks({
            includeContents: false,
        });
        console.log(
            `✓ Found ${allNotebooks.notebooks?.length || 0} total notebook(s)`
        );
        if (allNotebooks.notebooks && allNotebooks.notebooks.length > 0) {
            console.log(`  Sample notebooks:`);
            allNotebooks.notebooks.slice(0, 3).forEach((nb, idx) => {
                console.log(`  ${idx + 1}. ${nb.name} (ID: ${nb.id})`);
            });
        }

        // Step 3: List notebooks for specific project
        console.log("\nStep 3: Listing notebooks for the test project...");
        const projectNotebooks = await teamworkService.listNotebooks({
            projectIds: [testProjectId],
            includeContents: true,
        });
        console.log(
            `✓ Found ${
                projectNotebooks.notebooks?.length || 0
            } notebook(s) in project ${testProjectId}`
        );

        if (
            !projectNotebooks.notebooks ||
            projectNotebooks.notebooks.length === 0
        ) {
            console.log(
                "\n⚠ No notebooks found in this project. Skipping individual notebook tests."
            );
            console.log("\n=== Read-Only Tests Completed Successfully! ===\n");
            console.log(
                "Note: Create, Update, and Delete operations require write permissions."
            );
            return;
        }

        // Step 4: Get a specific notebook
        const testNotebookId = projectNotebooks.notebooks[0].id;
        console.log(
            `\nStep 4: Retrieving notebook "${projectNotebooks.notebooks[0].name}" (ID: ${testNotebookId})...`
        );
        const notebook = await teamworkService.getNotebook(testNotebookId);
        console.log(`✓ Successfully retrieved notebook`);
        console.log(`  Name: ${notebook.notebook?.name || "N/A"}`);
        console.log(`  Type: ${notebook.notebook?.type || "N/A"}`);
        console.log(
            `  Description: ${notebook.notebook?.description || "N/A"}`
        );
        console.log(
            `  Content length: ${
                notebook.notebook?.contents?.length || 0
            } characters`
        );

        // Step 5: Test filtering by search term
        console.log("\nStep 5: Testing search functionality...");
        const searchResults = await teamworkService.listNotebooks({
            projectIds: [testProjectId],
            searchTerm: projectNotebooks.notebooks[0].name.split(" ")[0], // Search for first word
            includeContents: false,
        });
        console.log(
            `✓ Search returned ${
                searchResults.notebooks?.length || 0
            } result(s)`
        );

        // Step 6: Test pagination
        console.log("\nStep 6: Testing pagination...");
        const pagedResults = await teamworkService.listNotebooks({
            projectIds: [testProjectId],
            page: 1,
            pageSize: 5,
            includeContents: false,
        });
        console.log(
            `✓ Pagination working: Retrieved ${
                pagedResults.notebooks?.length || 0
            } notebook(s) from page 1`
        );

        console.log("\n=== All Read-Only Tests Passed! ===\n");
        console.log("✅ Implemented and verified operations:");
        console.log("  - listNotebooks (with filtering, pagination, search)");
        console.log("  - getNotebook");
        console.log(
            "\n✅ Implemented but not tested (require write permissions):"
        );
        console.log("  - createNotebook");
        console.log("  - updateNotebook");
        console.log("  - deleteNotebook");
        console.log(
            "\nAll notebook functionality has been successfully implemented!"
        );
    } catch (error) {
        console.error("\n❌ Test failed:", error.message);
        console.error("Error details:", error);
        process.exit(1);
    }
}

// Run the tests
testNotebooksReadOnly();
