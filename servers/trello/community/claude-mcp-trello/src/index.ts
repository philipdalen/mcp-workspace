#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

// --------------------------------------------------
// Imports related to TrelloClient (provided classes and types)
// --------------------------------------------------
import { TrelloClient } from './trello-client.js'; // ←Change the path according to your own configuration

// --------------------------------------------------
// Define tools for Trello (Tool)
// --------------------------------------------------
interface GetCardsByListArgs {
  listId: string;
}

const trelloGetCardsByListTool: Tool = {
  name: 'trello_get_cards_by_list',
  description: 'Retrieves a list of cards contained in the specified list ID.',
  inputSchema: {
    type: 'object',
    properties: {
      listId: {
        type: 'string',
        description: 'Trello list ID',
      },
    },
    required: ['listId'],
  },
};

const trelloGetListsTool: Tool = {
  name: 'trello_get_lists',
  description: 'Retrieves all lists in the board.',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

interface GetRecentActivityArgs {
  limit?: number;
}

const trelloGetRecentActivityTool: Tool = {
  name: 'trello_get_recent_activity',
  description:
    "Retrieves the most recent board activity. The 'limit' argument can specify how many to retrieve.",
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'Number of activities to retrieve (default: 10)',
      },
    },
  },
};

interface AddCardArgs {
  listId: string;
  name: string;
  description?: string;
  dueDate?: string;
  labels?: string[];
  members?: string[];
}

const trelloAddCardTool: Tool = {
  name: 'trello_add_card',
  description: 'Adds a card to the specified list.',
  inputSchema: {
    type: 'object',
    properties: {
      listId: { type: 'string', description: 'The ID of the list to add to' },
      name: { type: 'string', description: 'The title of the card' },
      description: {
        type: 'string',
        description: 'Details of the card (optional)',
      },
      dueDate: {
        type: 'string',
        description: 'Due date (can be specified in ISO8601 format, etc. Optional)',
      },
      labels: {
        type: 'array',
        description: 'Array of label IDs (optional)',
        items: { type: 'string' },
      },
      members: {
        type: 'array',
        description: 'Array of member IDs to assign to the card (optional)',
        items: { type: 'string' },
      },
    },
    required: ['listId', 'name'],
  },
};

interface UpdateCardArgs {
  cardId: string;
  name?: string;
  description?: string;
  dueDate?: string;
  labels?: string[];
  members?: string[];
}

const trelloUpdateCardTool: Tool = {
  name: 'trello_update_card',
  description: 'Updates the content of a card.',
  inputSchema: {
    type: 'object',
    properties: {
      cardId: {
        type: 'string',
        description: 'The ID of the card to be updated',
      },
      name: {
        type: 'string',
        description: 'The title of the card (optional)',
      },
      description: {
        type: 'string',
        description: 'Details of the card (optional)',
      },
      dueDate: {
        type: 'string',
        description: 'Due date (can be specified in ISO8601 format, etc. Optional)',
      },
      labels: {
        type: 'array',
        description: 'An array of label IDs (optional)',
        items: { type: 'string' },
      },
      members: {
        type: 'array',
        description:
          'Array of member IDs to assign to the card (optional). This replaces all existing members.',
        items: { type: 'string' },
      },
    },
    required: ['cardId'],
  },
};

interface ArchiveCardArgs {
  cardId: string;
}

const trelloArchiveCardTool: Tool = {
  name: 'trello_archive_card',
  description: 'Archives (closes) the specified card.',
  inputSchema: {
    type: 'object',
    properties: {
      cardId: {
        type: 'string',
        description: 'The ID of the card to archive',
      },
    },
    required: ['cardId'],
  },
};

interface AddListArgs {
  name: string;
}

const trelloAddListTool: Tool = {
  name: 'trello_add_list',
  description: 'Adds a new list to the board.',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the list',
      },
    },
    required: ['name'],
  },
};

interface ArchiveListArgs {
  listId: string;
}

const trelloArchiveListTool: Tool = {
  name: 'trello_archive_list',
  description: 'Archives (closes) the specified list.',
  inputSchema: {
    type: 'object',
    properties: {
      listId: {
        type: 'string',
        description: 'The ID of the list to archive',
      },
    },
    required: ['listId'],
  },
};

const trelloGetMyCardsTool: Tool = {
  name: 'trello_get_my_cards',
  description: 'Retrieves all cards related to your account.',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

interface TrelloSearchAllBoardsArgs {
  query: string;
  limit?: number;
}

const trelloSearchAllBoardsTool: Tool = {
  name: 'trello_search_all_boards',
  description:
    'Performs a cross-board search across all boards in the workspace (organization) (depending on plan/permissions).',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search keyword' },
      limit: {
        type: 'number',
        description: 'Maximum number of results to retrieve (default: 10)',
      },
    },
    required: ['query'],
  },
};

// Checklist tools
interface GetChecklistsOnCardArgs {
  cardId: string;
}

const trelloGetChecklistsOnCardTool: Tool = {
  name: 'trello_get_checklists_on_card',
  description: 'Retrieves all checklists on a specific card.',
  inputSchema: {
    type: 'object',
    properties: {
      cardId: {
        type: 'string',
        description: 'The ID of the card',
      },
    },
    required: ['cardId'],
  },
};

interface CreateChecklistArgs {
  cardId: string;
  name: string;
  pos?: number | string;
}

const trelloCreateChecklistTool: Tool = {
  name: 'trello_create_checklist',
  description: 'Creates a new checklist on a card.',
  inputSchema: {
    type: 'object',
    properties: {
      cardId: {
        type: 'string',
        description: 'The ID of the card to add the checklist to',
      },
      name: {
        type: 'string',
        description: 'The name of the checklist',
      },
      pos: {
        type: ['number', 'string'],
        description: 'The position of the checklist (optional)',
      },
    },
    required: ['cardId', 'name'],
  },
};

interface DeleteChecklistArgs {
  checklistId: string;
}

const trelloDeleteChecklistTool: Tool = {
  name: 'trello_delete_checklist',
  description: 'Deletes a checklist from a card.',
  inputSchema: {
    type: 'object',
    properties: {
      checklistId: {
        type: 'string',
        description: 'The ID of the checklist to delete',
      },
    },
    required: ['checklistId'],
  },
};

interface UpdateChecklistArgs {
  checklistId: string;
  name?: string;
  pos?: number | string;
}

const trelloUpdateChecklistTool: Tool = {
  name: 'trello_update_checklist',
  description: 'Updates a checklist (name or position).',
  inputSchema: {
    type: 'object',
    properties: {
      checklistId: {
        type: 'string',
        description: 'The ID of the checklist to update',
      },
      name: {
        type: 'string',
        description: 'The new name for the checklist (optional)',
      },
      pos: {
        type: ['number', 'string'],
        description: 'The new position for the checklist (optional)',
      },
    },
    required: ['checklistId'],
  },
};

interface CreateCheckItemArgs {
  checklistId: string;
  name: string;
  pos?: number | string;
  checked?: boolean;
}

const trelloCreateCheckItemTool: Tool = {
  name: 'trello_create_check_item',
  description: 'Creates a new item in a checklist.',
  inputSchema: {
    type: 'object',
    properties: {
      checklistId: {
        type: 'string',
        description: 'The ID of the checklist to add the item to',
      },
      name: {
        type: 'string',
        description: 'The name of the check item',
      },
      pos: {
        type: ['number', 'string'],
        description: 'The position of the item (optional)',
      },
      checked: {
        type: 'boolean',
        description: 'Whether the item is checked (optional, default: false)',
      },
    },
    required: ['checklistId', 'name'],
  },
};

interface UpdateCheckItemArgs {
  cardId: string;
  checkItemId: string;
  name?: string;
  state?: 'complete' | 'incomplete';
  pos?: number | string;
}

const trelloUpdateCheckItemTool: Tool = {
  name: 'trello_update_check_item',
  description: 'Updates a check item (name, state, or position).',
  inputSchema: {
    type: 'object',
    properties: {
      cardId: {
        type: 'string',
        description: 'The ID of the card containing the check item',
      },
      checkItemId: {
        type: 'string',
        description: 'The ID of the check item to update',
      },
      name: {
        type: 'string',
        description: 'The new name for the check item (optional)',
      },
      state: {
        type: 'string',
        enum: ['complete', 'incomplete'],
        description: 'The state of the check item (optional)',
      },
      pos: {
        type: ['number', 'string'],
        description: 'The new position for the check item (optional)',
      },
    },
    required: ['cardId', 'checkItemId'],
  },
};

interface DeleteCheckItemArgs {
  checklistId: string;
  checkItemId: string;
}

const trelloDeleteCheckItemTool: Tool = {
  name: 'trello_delete_check_item',
  description: 'Deletes a check item from a checklist.',
  inputSchema: {
    type: 'object',
    properties: {
      checklistId: {
        type: 'string',
        description: 'The ID of the checklist containing the item',
      },
      checkItemId: {
        type: 'string',
        description: 'The ID of the check item to delete',
      },
    },
    required: ['checklistId', 'checkItemId'],
  },
};

// Member management tools
interface AddMemberToCardArgs {
  cardId: string;
  memberId: string;
}

const trelloAddMemberToCardTool: Tool = {
  name: 'trello_add_member_to_card',
  description: 'Adds a member to a card.',
  inputSchema: {
    type: 'object',
    properties: {
      cardId: {
        type: 'string',
        description: 'The ID of the card',
      },
      memberId: {
        type: 'string',
        description: 'The ID of the member to add',
      },
    },
    required: ['cardId', 'memberId'],
  },
};

interface RemoveMemberFromCardArgs {
  cardId: string;
  memberId: string;
}

const trelloRemoveMemberFromCardTool: Tool = {
  name: 'trello_remove_member_from_card',
  description: 'Removes a member from a card.',
  inputSchema: {
    type: 'object',
    properties: {
      cardId: {
        type: 'string',
        description: 'The ID of the card',
      },
      memberId: {
        type: 'string',
        description: 'The ID of the member to remove',
      },
    },
    required: ['cardId', 'memberId'],
  },
};

const trelloGetBoardMembersTool: Tool = {
  name: 'trello_get_board_members',
  description: 'Retrieves all members of the board.',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

const trelloGetCurrentUserTool: Tool = {
  name: 'trello_get_current_user',
  description: 'Retrieves information about the current authenticated user.',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

// --------------------------------------------------
// Main server implementation
// --------------------------------------------------
async function main() {
  const trelloApiKey = process.env.TRELLO_API_KEY;
  const trelloToken = process.env.TRELLO_TOKEN;
  const trelloBoardId = process.env.TRELLO_BOARD_ID;

  if (!trelloApiKey || !trelloToken || !trelloBoardId) {
    console.error('TRELLO_API_KEY / TRELLO_TOKEN / TRELLO_BOARD_ID are not set.');
    process.exit(1);
  }

  console.error('Starting Trello MCP Server...');

  // Initialize MCP Server
  const server = new Server(
    {
      name: 'Trello MCP Server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Create Trello client
  const trelloClient = new TrelloClient({
    apiKey: trelloApiKey,
    token: trelloToken,
    boardId: trelloBoardId,
  });

  // --------------------------------------------------
  // Handle CallToolRequest
  // --------------------------------------------------
  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    console.error('Received CallToolRequest:', request);
    try {
      if (!request.params.arguments) {
        throw new Error('No arguments provided');
      }

      switch (request.params.name) {
        // --------------------------------------------------
        // Retrieve the list of cards by specifying the listId
        // --------------------------------------------------
        case 'trello_get_cards_by_list': {
          const args = request.params.arguments as unknown as GetCardsByListArgs;
          if (!args.listId) {
            throw new Error('Missing required argument: listId');
          }
          const response = await trelloClient.getCardsByList(args.listId);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // --------------------------------------------------
        // Retrieve all lists in the board
        // --------------------------------------------------
        case 'trello_get_lists': {
          // No arguments
          const response = await trelloClient.getLists();
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // --------------------------------------------------
        // Recent activity on the board
        // --------------------------------------------------
        case 'trello_get_recent_activity': {
          const args = request.params.arguments as unknown as GetRecentActivityArgs;
          const limit = args.limit ?? 10; // Default 10
          const response = await trelloClient.getRecentActivity(limit);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // --------------------------------------------------
        // Create a new card
        // --------------------------------------------------
        case 'trello_add_card': {
          const args = request.params.arguments as unknown as AddCardArgs;
          if (!args.listId || !args.name) {
            throw new Error('Missing required arguments: listId, name');
          }
          const response = await trelloClient.addCard({
            listId: args.listId,
            name: args.name,
            description: args.description,
            dueDate: args.dueDate,
            labels: args.labels,
            members: args.members,
          });
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // --------------------------------------------------
        // Update card
        // --------------------------------------------------
        case 'trello_update_card': {
          const args = request.params.arguments as unknown as UpdateCardArgs;
          if (!args.cardId) {
            throw new Error('Missing required argument: cardId');
          }
          const response = await trelloClient.updateCard({
            cardId: args.cardId,
            name: args.name,
            description: args.description,
            dueDate: args.dueDate,
            labels: args.labels,
            members: args.members,
          });
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // --------------------------------------------------
        // Archive card
        // --------------------------------------------------
        case 'trello_archive_card': {
          const args = request.params.arguments as unknown as ArchiveCardArgs;
          if (!args.cardId) {
            throw new Error('Missing required argument: cardId');
          }
          const response = await trelloClient.archiveCard(args.cardId);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // --------------------------------------------------
        // Create a new list
        // --------------------------------------------------
        case 'trello_add_list': {
          const args = request.params.arguments as unknown as AddListArgs;
          if (!args.name) {
            throw new Error('Missing required argument: name');
          }
          const response = await trelloClient.addList(args.name);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // --------------------------------------------------
        // Archive list
        // --------------------------------------------------
        case 'trello_archive_list': {
          const args = request.params.arguments as unknown as ArchiveListArgs;
          if (!args.listId) {
            throw new Error('Missing required argument: listId');
          }
          const response = await trelloClient.archiveList(args.listId);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // --------------------------------------------------
        // Retrieve all cards related to yourself
        // --------------------------------------------------
        case 'trello_get_my_cards': {
          const response = await trelloClient.getMyCards();
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        case 'trello_search_all_boards': {
          const args = request.params.arguments as unknown as TrelloSearchAllBoardsArgs;
          const limit = args.limit ?? 10;
          const response = await trelloClient.searchAllBoards(args.query, limit);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // --------------------------------------------------
        // Get checklists on a card
        // --------------------------------------------------
        case 'trello_get_checklists_on_card': {
          const args = request.params.arguments as unknown as GetChecklistsOnCardArgs;
          if (!args.cardId) {
            throw new Error('Missing required argument: cardId');
          }
          const response = await trelloClient.getChecklistsOnCard(args.cardId);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // --------------------------------------------------
        // Create a checklist
        // --------------------------------------------------
        case 'trello_create_checklist': {
          const args = request.params.arguments as unknown as CreateChecklistArgs;
          if (!args.cardId || !args.name) {
            throw new Error('Missing required arguments: cardId, name');
          }
          const response = await trelloClient.createChecklist({
            cardId: args.cardId,
            name: args.name,
            pos: args.pos,
          });
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // --------------------------------------------------
        // Delete a checklist
        // --------------------------------------------------
        case 'trello_delete_checklist': {
          const args = request.params.arguments as unknown as DeleteChecklistArgs;
          if (!args.checklistId) {
            throw new Error('Missing required argument: checklistId');
          }
          await trelloClient.deleteChecklist(args.checklistId);
          return {
            content: [{ type: 'text', text: JSON.stringify({ success: true }) }],
          };
        }

        // --------------------------------------------------
        // Update a checklist
        // --------------------------------------------------
        case 'trello_update_checklist': {
          const args = request.params.arguments as unknown as UpdateChecklistArgs;
          if (!args.checklistId) {
            throw new Error('Missing required argument: checklistId');
          }
          const response = await trelloClient.updateChecklist({
            checklistId: args.checklistId,
            name: args.name,
            pos: args.pos,
          });
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // --------------------------------------------------
        // Create a check item
        // --------------------------------------------------
        case 'trello_create_check_item': {
          const args = request.params.arguments as unknown as CreateCheckItemArgs;
          if (!args.checklistId || !args.name) {
            throw new Error('Missing required arguments: checklistId, name');
          }
          const response = await trelloClient.createCheckItem({
            checklistId: args.checklistId,
            name: args.name,
            pos: args.pos,
            checked: args.checked,
          });
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // --------------------------------------------------
        // Update a check item
        // --------------------------------------------------
        case 'trello_update_check_item': {
          const args = request.params.arguments as unknown as UpdateCheckItemArgs;
          if (!args.cardId || !args.checkItemId) {
            throw new Error('Missing required arguments: cardId, checkItemId');
          }
          const response = await trelloClient.updateCheckItem({
            cardId: args.cardId,
            checkItemId: args.checkItemId,
            name: args.name,
            state: args.state,
            pos: args.pos,
          });
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // --------------------------------------------------
        // Delete a check item
        // --------------------------------------------------
        case 'trello_delete_check_item': {
          const args = request.params.arguments as unknown as DeleteCheckItemArgs;
          if (!args.checklistId || !args.checkItemId) {
            throw new Error('Missing required arguments: checklistId, checkItemId');
          }
          await trelloClient.deleteCheckItem({
            checklistId: args.checklistId,
            checkItemId: args.checkItemId,
          });
          return {
            content: [{ type: 'text', text: JSON.stringify({ success: true }) }],
          };
        }

        // --------------------------------------------------
        // Add member to card
        // --------------------------------------------------
        case 'trello_add_member_to_card': {
          const args = request.params.arguments as unknown as AddMemberToCardArgs;
          if (!args.cardId || !args.memberId) {
            throw new Error('Missing required arguments: cardId, memberId');
          }
          const response = await trelloClient.addMemberToCard(args.cardId, args.memberId);
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // --------------------------------------------------
        // Remove member from card
        // --------------------------------------------------
        case 'trello_remove_member_from_card': {
          const args = request.params.arguments as unknown as RemoveMemberFromCardArgs;
          if (!args.cardId || !args.memberId) {
            throw new Error('Missing required arguments: cardId, memberId');
          }
          await trelloClient.removeMemberFromCard(args.cardId, args.memberId);
          return {
            content: [{ type: 'text', text: JSON.stringify({ success: true }) }],
          };
        }

        // --------------------------------------------------
        // Get board members
        // --------------------------------------------------
        case 'trello_get_board_members': {
          const response = await trelloClient.getBoardMembers();
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        // --------------------------------------------------
        // Get current user
        // --------------------------------------------------
        case 'trello_get_current_user': {
          const response = await trelloClient.getCurrentUser();
          return {
            content: [{ type: 'text', text: JSON.stringify(response) }],
          };
        }

        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    } catch (error) {
      console.error('Error executing tool:', error);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
            }),
          },
        ],
      };
    }
  });

  // --------------------------------------------------
  // Handle ListToolsRequest (return the list of registered tools)
  // --------------------------------------------------
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error('Received ListToolsRequest');
    return {
      tools: [
        trelloGetCardsByListTool,
        trelloGetListsTool,
        trelloGetRecentActivityTool,
        trelloAddCardTool,
        trelloUpdateCardTool,
        trelloArchiveCardTool,
        trelloAddListTool,
        trelloArchiveListTool,
        trelloGetMyCardsTool,
        trelloSearchAllBoardsTool,
        trelloGetChecklistsOnCardTool,
        trelloCreateChecklistTool,
        trelloDeleteChecklistTool,
        trelloUpdateChecklistTool,
        trelloCreateCheckItemTool,
        trelloUpdateCheckItemTool,
        trelloDeleteCheckItemTool,
        trelloAddMemberToCardTool,
        trelloRemoveMemberFromCardTool,
        trelloGetBoardMembersTool,
        trelloGetCurrentUserTool,
      ],
    };
  });

  // --------------------------------------------------
  // Start the MCP server
  // --------------------------------------------------
  const transport = new StdioServerTransport();
  console.error('Connecting server to transport...');
  await server.connect(transport);

  console.error('Trello MCP Server running on stdio');
}

main().catch(error => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
