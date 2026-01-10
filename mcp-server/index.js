#!/usr/bin/env node

/**
 * Infinite Idol Marketing Team MCP Server
 *
 * Exposes agents, skills, and knowledge base for use from any Claude Code instance.
 *
 * Usage:
 *   1. Add to your Claude Code MCP settings
 *   2. Use tools like `summon_agent`, `get_skill`, `query_lore`
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..");

// Agent mapping
const AGENTS = {
  "00": { name: "Coordinator", file: "00-coordinator.md", role: "Marketing Director - Orchestration" },
  "01": { name: "Lore Architect", file: "01-lore-architect.md", role: "Worldbuilding - Canon integrity" },
  "02": { name: "Content Strategist", file: "02-content-strategist.md", role: "Social Media - Tweets, content" },
  "03": { name: "Community Manager", file: "03-community-manager.md", role: "Discord - Events, engagement" },
  "04": { name: "Gacha Designer", file: "04-gacha-designer.md", role: "Seasonal - Banners, cosmetics" },
  "05": { name: "Analytics Observer", file: "05-analytics-observer.md", role: "Performance - Metrics, analysis" },
  "06": { name: "Asset Coordinator", file: "06-asset-coordinator.md", role: "Creative - Prompts, visuals" },
  "07": { name: "Light Novel Writer", file: "07-light-novel-writer.md", role: "Narrative - Story content" },
  "08": { name: "Lore Guardian", file: "08-lore-guardian.md", role: "Canon Review - Compliance checking" },
  "09": { name: "Resident Degen", file: "09-resident-degen.md", role: "Cultural - Authenticity, trends" },
  "14": { name: "The Shield", file: "14-the-shield.md", role: "Crisis Management - Brand protection" },
  "15": { name: "Simp Whisperer", file: "15-simp-whisperer.md", role: "Fan Service PM - Emotional engagement" },
  "16": { name: "The NEET", file: "16-the-neet.md", role: "Community Tools - Technical infrastructure" },
  "17": { name: "The Architect", file: "17-the-architect.md", role: "Agent System - Meta-optimization" },
  "18": { name: "The Hypeman", file: "18-the-hypeman.md", role: "KOL/Influencer - Creator relationships" },
  "19": { name: "Information Architect", file: "19-information-architect.md", role: "Notion Intelligence - Data insights" },
};

// Skill mapping
const SKILLS = [
  "canon-validation",
  "content-creation",
  "cultural-review",
  "character-voices",
  "escalation",
  "templates",
  "permissions",
  "community-intel",
  "crisis-management",
  "agent-evaluation",
  "inter-agent-handoff",
  "kol-influencer",
];

function readFile(relativePath) {
  const fullPath = join(REPO_ROOT, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`File not found: ${relativePath}`);
  }
  return readFileSync(fullPath, "utf-8");
}

function listDirectory(relativePath) {
  const fullPath = join(REPO_ROOT, relativePath);
  if (!existsSync(fullPath)) {
    return [];
  }
  return readdirSync(fullPath, { withFileTypes: true });
}

// Create MCP server
const server = new Server(
  {
    name: "infinite-idol-agents",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "summon_agent",
        description: "Summon an Infinite Idol agent. Returns the agent persona, CLAUDE.md context, and relevant skills. Use this to activate an agent in your current session.",
        inputSchema: {
          type: "object",
          properties: {
            agent_id: {
              type: "string",
              description: "Agent number (00-19) or name (e.g., 'coordinator', 'content', 'degen')",
            },
            include_skills: {
              type: "array",
              items: { type: "string" },
              description: "Optional: specific skills to include (e.g., ['content-creation', 'cultural-review'])",
            },
          },
          required: ["agent_id"],
        },
      },
      {
        name: "get_skill",
        description: "Get a specific skill workflow from the Infinite Idol system",
        inputSchema: {
          type: "object",
          properties: {
            skill_name: {
              type: "string",
              description: "Skill name (e.g., 'content-creation', 'canon-validation', 'cultural-review')",
            },
          },
          required: ["skill_name"],
        },
      },
      {
        name: "query_lore",
        description: "Query the Infinite Idol knowledge base for lore, characters, mechanics, or brand info",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: ["lore", "characters", "game-mechanics", "brand", "crypto", "light-novels"],
              description: "Knowledge category to query",
            },
            topic: {
              type: "string",
              description: "Optional: specific topic within category",
            },
          },
          required: ["category"],
        },
      },
      {
        name: "get_inviolable_facts",
        description: "Get the 10 Inviolable Facts that can NEVER be violated in Infinite Idol content",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "list_agents",
        description: "List all available Infinite Idol agents with their roles",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_task_queue",
        description: "Get current task queue status",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "summon_agent": {
        let agentId = args.agent_id.toLowerCase().replace(/^0/, "");

        // Handle name lookups
        const nameToId = {
          coordinator: "00", lore: "01", "lore-architect": "01",
          content: "02", "content-strategist": "02",
          community: "03", gacha: "04", analytics: "05",
          asset: "06", novel: "07", "light-novel": "07",
          guardian: "08", degen: "09", shield: "14",
          simp: "15", neet: "16", architect: "17",
          hypeman: "18", "information-architect": "19",
        };

        if (nameToId[agentId]) {
          agentId = nameToId[agentId];
        }

        // Pad single digits
        if (agentId.length === 1) {
          agentId = "0" + agentId;
        }

        const agent = AGENTS[agentId];
        if (!agent) {
          return {
            content: [{ type: "text", text: `Unknown agent: ${args.agent_id}. Available: ${Object.keys(AGENTS).join(", ")}` }],
          };
        }

        // Build response
        const claudeMd = readFile("CLAUDE.md");
        const agentMd = readFile(`agents/${agent.file}`);

        let skills = "";
        const skillsToLoad = args.include_skills || [];
        for (const skill of skillsToLoad) {
          try {
            skills += `\n\n---\n## Skill: ${skill}\n\n${readFile(`skills/${skill}.md`)}`;
          } catch (e) {
            skills += `\n\n---\n## Skill: ${skill}\n\n[Not found]`;
          }
        }

        return {
          content: [{
            type: "text",
            text: `# Agent ${agentId}: ${agent.name} Activated

## Role
${agent.role}

---

# MASTER INSTRUCTIONS (CLAUDE.md)

${claudeMd}

---

# AGENT PERSONA

${agentMd}

${skills ? `---\n# LOADED SKILLS\n${skills}` : ""}

---

**You are now operating as Agent ${agentId} (${agent.name}).** Follow the persona and instructions above. Check the task queue if needed.`,
          }],
        };
      }

      case "get_skill": {
        const skillName = args.skill_name.toLowerCase().replace(/_/g, "-");
        try {
          const skillContent = readFile(`skills/${skillName}.md`);
          return {
            content: [{ type: "text", text: `# Skill: ${skillName}\n\n${skillContent}` }],
          };
        } catch (e) {
          return {
            content: [{ type: "text", text: `Skill not found: ${skillName}. Available: ${SKILLS.join(", ")}` }],
          };
        }
      }

      case "query_lore": {
        const category = args.category;
        const topic = args.topic;

        const categoryPaths = {
          lore: "knowledge-base/lore",
          characters: "knowledge-base/lore/characters",
          "game-mechanics": "knowledge-base/game-mechanics",
          brand: "knowledge-base/brand",
          crypto: "knowledge-base/crypto",
          "light-novels": "knowledge-base/light-novels",
        };

        const basePath = categoryPaths[category];
        if (!basePath) {
          return {
            content: [{ type: "text", text: `Unknown category: ${category}` }],
          };
        }

        if (topic) {
          // Try to find specific file
          const possibleFiles = [
            `${basePath}/${topic}.md`,
            `${basePath}/${topic.toLowerCase()}.md`,
            `${basePath}/${topic.replace(/\s+/g, "-").toLowerCase()}.md`,
          ];

          for (const file of possibleFiles) {
            try {
              const content = readFile(file);
              return {
                content: [{ type: "text", text: `# ${category}: ${topic}\n\n${content}` }],
              };
            } catch (e) {
              continue;
            }
          }

          // List available files
          const files = listDirectory(basePath);
          return {
            content: [{
              type: "text",
              text: `Topic "${topic}" not found in ${category}. Available files:\n${files.map(f => `- ${f.name}`).join("\n")}`,
            }],
          };
        } else {
          // List category contents
          const files = listDirectory(basePath);
          let result = `# ${category} Knowledge Base\n\nAvailable files:\n`;
          for (const file of files) {
            result += `- ${file.name}${file.isDirectory() ? "/" : ""}\n`;
          }
          return {
            content: [{ type: "text", text: result }],
          };
        }
      }

      case "get_inviolable_facts": {
        const claudeMd = readFile("CLAUDE.md");
        // Extract the 10 Inviolable Facts section
        const factsMatch = claudeMd.match(/## The 10 Inviolable Facts[\s\S]*?(?=### What's NOT Inviolable|---)/);
        if (factsMatch) {
          return {
            content: [{ type: "text", text: factsMatch[0] }],
          };
        }
        return {
          content: [{ type: "text", text: "Could not extract Inviolable Facts section" }],
        };
      }

      case "list_agents": {
        let result = "# Infinite Idol Agents\n\n| # | Agent | Role |\n|---|-------|------|\n";
        for (const [id, agent] of Object.entries(AGENTS)) {
          result += `| ${id} | ${agent.name} | ${agent.role} |\n`;
        }
        return {
          content: [{ type: "text", text: result }],
        };
      }

      case "get_task_queue": {
        try {
          const queue = readFile("automation/task-queue.md");
          return {
            content: [{ type: "text", text: queue }],
          };
        } catch (e) {
          return {
            content: [{ type: "text", text: "Task queue not found or empty" }],
          };
        }
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
        };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const resources = [
    {
      uri: "infinite-idol://claude.md",
      name: "CLAUDE.md",
      description: "Master instructions for Infinite Idol agents",
      mimeType: "text/markdown",
    },
  ];

  // Add agents as resources
  for (const [id, agent] of Object.entries(AGENTS)) {
    resources.push({
      uri: `infinite-idol://agents/${id}`,
      name: `Agent ${id}: ${agent.name}`,
      description: agent.role,
      mimeType: "text/markdown",
    });
  }

  // Add skills as resources
  for (const skill of SKILLS) {
    resources.push({
      uri: `infinite-idol://skills/${skill}`,
      name: `Skill: ${skill}`,
      description: `${skill} workflow`,
      mimeType: "text/markdown",
    });
  }

  return { resources };
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri === "infinite-idol://claude.md") {
    return {
      contents: [{
        uri,
        mimeType: "text/markdown",
        text: readFile("CLAUDE.md"),
      }],
    };
  }

  if (uri.startsWith("infinite-idol://agents/")) {
    const agentId = uri.replace("infinite-idol://agents/", "");
    const agent = AGENTS[agentId];
    if (agent) {
      return {
        contents: [{
          uri,
          mimeType: "text/markdown",
          text: readFile(`agents/${agent.file}`),
        }],
      };
    }
  }

  if (uri.startsWith("infinite-idol://skills/")) {
    const skill = uri.replace("infinite-idol://skills/", "");
    return {
      contents: [{
        uri,
        mimeType: "text/markdown",
        text: readFile(`skills/${skill}.md`),
      }],
    };
  }

  throw new Error(`Resource not found: ${uri}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Infinite Idol MCP Server running on stdio");
}

main().catch(console.error);
