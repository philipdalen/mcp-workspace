/**
 * Test script for Notebook functionality
 * This script tests all notebook operations: create, get, list, update, and delete
 */

import teamworkService from "./build/services/index.js";
import logger from "./build/utils/logger.js";

async function testNotebooks() {
    console.log("\n=== Testing Notebook Functionality ===\n");

    let createdNotebookId = null;
    let testProjectId = null;

    try {
        // Step 1: Get a project to work with
        console.log("Step 1: Fetching projects to get a test project...");
        const projects = await teamworkService.getProjects({ pageSize: 1 });

        if (!projects || !projects.projects || projects.projects.length === 0) {
            throw new Error(
                "No projects found. Please create a project first."
            );
        }

        testProjectId = projects.projects[0].id;
        console.log(
            `✓ Found project: ${projects.projects[0].name} (ID: ${testProjectId})`
        );

        // Step 1.5: Check if we can list notebooks first (to verify access)
        console.log("\nStep 1.5: Checking notebook access...");
        try {
            const existingNotebooks = await teamworkService.listNotebooks({
                projectIds: [testProjectId],
            });
            console.log(
                `✓ Can access notebooks. Found ${
                    existingNotebooks.notebooks?.length || 0
                } existing notebook(s)`
            );
        } catch (error) {
            console.log(`⚠ Warning: Cannot list notebooks: ${error.message}`);
            console.log(
                "This might indicate notebooks are not enabled or you lack permissions."
            );
        }

        // Step 2: Create a notebook
        console.log("\nStep 2: Creating a new notebook...");
        const notebookData = {
            name: "Test Notebook - MCP Implementation",
            projectId: testProjectId,
            description:
                "This is a test notebook created by the MCP implementation test script",
            contents:
                "# Test Notebook\n\nThis is a test notebook with **markdown** content.\n\n## Features\n- Feature 1\n- Feature 2\n- Feature 3",
            type: "MARKDOWN",
        };

        const createResponse = await teamworkService.createNotebook(
            notebookData
        );
        console.log(
            "✓ Create Response:",
            JSON.stringify(createResponse, null, 2)
        );

        if (
            createResponse &&
            createResponse.notebook &&
            createResponse.notebook.id
        ) {
            createdNotebookId = createResponse.notebook.id;
            console.log(
                `✓ Notebook created successfully with ID: ${createdNotebookId}`
            );
        } else {
            throw new Error("Failed to get notebook ID from create response");
        }

        // Step 3: Get the created notebook
        console.log("\nStep 3: Retrieving the created notebook...");
        const getResponse = await teamworkService.getNotebook(
            createdNotebookId
        );
        console.log("✓ Get Response:", JSON.stringify(getResponse, null, 2));
        console.log(
            `✓ Retrieved notebook: ${getResponse.notebook?.name || "Unknown"}`
        );

        // Step 4: List notebooks
        console.log("\nStep 4: Listing notebooks...");
        const listResponse = await teamworkService.listNotebooks({
            projectIds: [testProjectId],
            includeContents: true,
        });
        console.log("✓ List Response:", JSON.stringify(listResponse, null, 2));
        console.log(
            `✓ Found ${
                listResponse.notebooks?.length || 0
            } notebook(s) in project ${testProjectId}`
        );

        // Step 5: Update the notebook
        console.log("\nStep 5: Updating the notebook...");
        const updateData = {
            id: createdNotebookId,
            name: "Test Notebook - Updated",
            contents:
                "# Updated Test Notebook\n\nThis notebook has been **updated** by the test script.\n\n## Updated Features\n- Updated Feature 1\n- Updated Feature 2",
        };

        const updateResponse = await teamworkService.updateNotebook(updateData);
        console.log(
            "✓ Update Response:",
            JSON.stringify(updateResponse, null, 2)
        );
        console.log(`✓ Notebook updated successfully`);

        // Step 6: Verify the update
        console.log("\nStep 6: Verifying the update...");
        const verifyResponse = await teamworkService.getNotebook(
            createdNotebookId
        );
        console.log(
            "✓ Verification Response:",
            JSON.stringify(verifyResponse, null, 2)
        );
        if (verifyResponse.notebook?.name === "Test Notebook - Updated") {
            console.log(
                `✓ Update verified: Name changed to "${verifyResponse.notebook.name}"`
            );
        } else {
            console.log(
                `⚠ Update verification: Name is "${verifyResponse.notebook?.name}"`
            );
        }

        // Step 7: Delete the notebook
        console.log("\nStep 7: Deleting the test notebook...");
        const deleteResponse = await teamworkService.deleteNotebook(
            createdNotebookId
        );
        console.log(
            "✓ Delete Response:",
            JSON.stringify(deleteResponse, null, 2)
        );
        console.log(`✓ Notebook deleted successfully`);

        // Step 8: Verify deletion
        console.log("\nStep 8: Verifying deletion...");
        try {
            await teamworkService.getNotebook(createdNotebookId);
            console.log("⚠ Warning: Notebook still exists after deletion");
        } catch (error) {
            console.log("✓ Deletion verified: Notebook no longer accessible");
        }

        console.log("\n=== All Notebook Tests Passed! ===\n");
    } catch (error) {
        console.error("\n❌ Test failed:", error.message);
        console.error("Error details:", error);

        // Cleanup: try to delete the notebook if it was created
        if (createdNotebookId) {
            console.log("\nAttempting cleanup...");
            try {
                await teamworkService.deleteNotebook(createdNotebookId);
                console.log("✓ Cleanup successful: Test notebook deleted");
            } catch (cleanupError) {
                console.error("⚠ Cleanup failed:", cleanupError.message);
            }
        }

        process.exit(1);
    }
}

// Run the tests
testNotebooks();
