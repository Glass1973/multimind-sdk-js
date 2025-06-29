import { py } from './bridge/multimind-bridge';

export interface AgentConfig {
  name: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  memoryCapacity?: number;
  tools?: Tool[];
  workflow?: WorkflowStep[];
}

export interface Tool {
  name: string;
  description: string;
  function: (...args: any[]) => Promise<any>;
  parameters?: Record<string, any>;
}

export interface WorkflowStep {
  id: string;
  name: string;
  action: string;
  dependencies?: string[];
  condition?: string;
  retryCount?: number;
}

export interface MemoryEntry {
  id: string;
  timestamp: string;
  type: 'short_term' | 'long_term';
  content: any;
  metadata?: Record<string, any>;
}

export interface AgentResponse {
  response: string;
  toolsUsed: string[];
  memoryAccessed: string[];
  confidence: number;
  reasoning?: string;
}

export class AdvancedAgent {
  private agent: any;
  private config: AgentConfig;
  private memory: MemoryEntry[] = [];
  private tools: Map<string, Tool> = new Map();

  constructor(config: AgentConfig) {
    this.config = config;
    if (config.tools) {
      config.tools.forEach(tool => this.tools.set(tool.name, tool));
    }
  }

  async initialize() {
    try {
      this.agent = await py`AgentClient(
        name=${this.config.name},
        model=${this.config.model},
        temperature=${this.config.temperature || 0.7},
        max_tokens=${this.config.maxTokens || 1000},
        memory_capacity=${this.config.memoryCapacity || 100}
      )`;

      // Add tools to the agent
      for (const [name, tool] of this.tools) {
        await this.addTool(name, tool);
      }

      // Set up workflow if provided
      if (this.config.workflow) {
        await this.setupWorkflow(this.config.workflow);
      }

      return { success: true, message: 'Advanced agent initialized' };
    } catch (error) {
      console.error('Error initializing advanced agent:', error);
      throw error;
    }
  }

  async addTool(name: string, tool: Tool) {
    try {
      // Register tool with Python agent
      await py`self.agent.add_tool(${name}, ${tool.description}, ${tool.parameters || {}})`;
      
      // Store tool reference
      this.tools.set(name, tool);
      
      return { success: true, message: `Tool ${name} added successfully` };
    } catch (error) {
      console.error('Error adding tool:', error);
      throw error;
    }
  }

  async removeTool(name: string) {
    try {
      await py`self.agent.remove_tool(${name})`;
      this.tools.delete(name);
      return { success: true, message: `Tool ${name} removed successfully` };
    } catch (error) {
      console.error('Error removing tool:', error);
      throw error;
    }
  }

  async addMemory(entry: Omit<MemoryEntry, 'id' | 'timestamp'>) {
    try {
      const memoryEntry: MemoryEntry = {
        ...entry,
        id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };

      this.memory.push(memoryEntry);

      // Add to Python agent memory
      await py`self.agent.add_memory(
        memory_id=${memoryEntry.id},
        content=${memoryEntry.content},
        memory_type=${memoryEntry.type},
        metadata=${memoryEntry.metadata || {}}
      )`;

      return { success: true, message: 'Memory entry added', id: memoryEntry.id };
    } catch (error) {
      console.error('Error adding memory:', error);
      throw error;
    }
  }

  async getMemory(query?: string, type?: 'short_term' | 'long_term', limit?: number) {
    try {
      let filteredMemory = this.memory;

      if (type) {
        filteredMemory = filteredMemory.filter(entry => entry.type === type);
      }

      if (query) {
        // Simple text-based filtering - in production, you'd use semantic search
        filteredMemory = filteredMemory.filter(entry => 
          JSON.stringify(entry.content).toLowerCase().includes(query.toLowerCase())
        );
      }

      if (limit) {
        filteredMemory = filteredMemory.slice(-limit);
      }

      return filteredMemory;
    } catch (error) {
      console.error('Error getting memory:', error);
      throw error;
    }
  }

  async clearMemory(type?: 'short_term' | 'long_term') {
    try {
      if (type) {
        this.memory = this.memory.filter(entry => entry.type !== type);
        await py`self.agent.clear_memory(memory_type=${type})`;
      } else {
        this.memory = [];
        await py`self.agent.clear_memory()`;
      }

      return { success: true, message: `Memory cleared${type ? ` (${type})` : ''}` };
    } catch (error) {
      console.error('Error clearing memory:', error);
      throw error;
    }
  }

  async run(input: string, context?: any): Promise<AgentResponse> {
    try {
      const result = await py`self.agent.run(
        input=${input},
        context=${context || {}},
        tools=${Array.from(this.tools.keys())}
      )`;

      return {
        response: result.response,
        toolsUsed: result.tools_used || [],
        memoryAccessed: result.memory_accessed || [],
        confidence: result.confidence || 0.5,
        reasoning: result.reasoning
      };
    } catch (error) {
      console.error('Error running agent:', error);
      throw error;
    }
  }

  async executeWorkflow(workflowId: string, input: any) {
    try {
      const result = await py`self.agent.execute_workflow(
        workflow_id=${workflowId},
        input=${input}
      )`;
      return result;
    } catch (error) {
      console.error('Error executing workflow:', error);
      throw error;
    }
  }

  async setupWorkflow(steps: WorkflowStep[]) {
    try {
      await py`self.agent.setup_workflow(${steps})`;
      return { success: true, message: 'Workflow setup successfully' };
    } catch (error) {
      console.error('Error setting up workflow:', error);
      throw error;
    }
  }

  async addWorkflowStep(step: WorkflowStep) {
    try {
      await py`self.agent.add_workflow_step(${step})`;
      return { success: true, message: 'Workflow step added' };
    } catch (error) {
      console.error('Error adding workflow step:', error);
      throw error;
    }
  }

  async getWorkflowStatus(workflowId: string) {
    try {
      const status = await py`self.agent.get_workflow_status(${workflowId})`;
      return status;
    } catch (error) {
      console.error('Error getting workflow status:', error);
      throw error;
    }
  }

  async chainModels(models: string[], input: string, strategy: 'sequential' | 'parallel' | 'ensemble' = 'sequential') {
    try {
      const result = await py`self.agent.chain_models(
        models=${models},
        input=${input},
        strategy=${strategy}
      )`;
      return result;
    } catch (error) {
      console.error('Error chaining models:', error);
      throw error;
    }
  }

  async getAgentStats() {
    try {
      const stats = await py`self.agent.get_stats()`;
      return {
        ...stats,
        memorySize: this.memory.length,
        toolsCount: this.tools.size
      };
    } catch (error) {
      console.error('Error getting agent stats:', error);
      throw error;
    }
  }

  async updateConfig(updates: Partial<AgentConfig>) {
    try {
      await py`self.agent.update_config(${updates})`;
      this.config = { ...this.config, ...updates };
      return { success: true, message: 'Agent config updated' };
    } catch (error) {
      console.error('Error updating agent config:', error);
      throw error;
    }
  }
}

// Pre-built tools
export const builtInTools = {
  search: {
    name: 'search',
    description: 'Search the web for information',
    function: async (query: string) => {
      // Implementation would connect to a search API
      return `Search results for: ${query}`;
    }
  },
  calculator: {
    name: 'calculator',
    description: 'Perform mathematical calculations',
    function: async (expression: string) => {
      try {
        return eval(expression);
      } catch (error) {
        return 'Invalid expression';
      }
    }
  },
  weather: {
    name: 'weather',
    description: 'Get weather information for a location',
    function: async (location: string) => {
      // Implementation would connect to a weather API
      return `Weather for ${location}: Sunny, 25°C`;
    }
  }
}; 