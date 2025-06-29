import { py } from './bridge/multimind-bridge';

export interface GatewayConfig {
  host?: string;
  port?: number;
  enableMiddleware?: boolean;
  corsEnabled?: boolean;
  rateLimit?: number;
  authentication?: boolean;
}

export interface APIRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  handler: string;
  middleware?: string[];
}

export class MultiMindGateway {
  private gateway: any;
  private config: GatewayConfig;

  constructor(config: GatewayConfig = {}) {
    this.config = {
      host: '0.0.0.0',
      port: 8000,
      enableMiddleware: true,
      corsEnabled: true,
      rateLimit: 100,
      authentication: false,
      ...config
    };
  }

  async initialize() {
    try {
      this.gateway = await py`GatewayAPI(
        host=${this.config.host},
        port=${this.config.port},
        enable_middleware=${this.config.enableMiddleware},
        cors_enabled=${this.config.corsEnabled},
        rate_limit=${this.config.rateLimit},
        authentication=${this.config.authentication}
      )`;

      // Set up default routes
      await this.setupDefaultRoutes();

      return { success: true, message: 'MultiMind Gateway initialized' };
    } catch (error) {
      console.error('Error initializing MultiMind Gateway:', error);
      throw error;
    }
  }

  private async setupDefaultRoutes() {
    try {
      const defaultRoutes: APIRoute[] = [
        {
          path: '/health',
          method: 'GET',
          handler: 'health_check'
        },
        {
          path: '/generate',
          method: 'POST',
          handler: 'generate_text'
        },
        {
          path: '/rag/query',
          method: 'POST',
          handler: 'rag_query'
        },
        {
          path: '/rag/documents',
          method: 'POST',
          handler: 'add_documents'
        },
        {
          path: '/fine-tune',
          method: 'POST',
          handler: 'fine_tune_model'
        },
        {
          path: '/convert',
          method: 'POST',
          handler: 'convert_model'
        },
        {
          path: '/compliance/check',
          method: 'POST',
          handler: 'check_compliance'
        },
        {
          path: '/agent/run',
          method: 'POST',
          handler: 'run_agent'
        }
      ];

      for (const route of defaultRoutes) {
        await this.addRoute(route);
      }
    } catch (error) {
      console.error('Error setting up default routes:', error);
      throw error;
    }
  }

  async addRoute(route: APIRoute) {
    try {
      await py`self.gateway.add_route(
        path=${route.path},
        method=${route.method},
        handler=${route.handler},
        middleware=${route.middleware || []}
      )`;
      return { success: true, message: `Route ${route.method} ${route.path} added` };
    } catch (error) {
      console.error('Error adding route:', error);
      throw error;
    }
  }

  async removeRoute(path: string, method: string) {
    try {
      await py`self.gateway.remove_route(${path}, ${method})`;
      return { success: true, message: `Route ${method} ${path} removed` };
    } catch (error) {
      console.error('Error removing route:', error);
      throw error;
    }
  }

  async start() {
    try {
      await py`self.gateway.start()`;
      return { 
        success: true, 
        message: `Gateway started on ${this.config.host}:${this.config.port}`,
        url: `http://${this.config.host}:${this.config.port}`
      };
    } catch (error) {
      console.error('Error starting gateway:', error);
      throw error;
    }
  }

  async stop() {
    try {
      await py`self.gateway.stop()`;
      return { success: true, message: 'Gateway stopped' };
    } catch (error) {
      console.error('Error stopping gateway:', error);
      throw error;
    }
  }

  async getStatus() {
    try {
      const status = await py`self.gateway.get_status()`;
      return status;
    } catch (error) {
      console.error('Error getting gateway status:', error);
      throw error;
    }
  }

  async getRoutes() {
    try {
      const routes = await py`self.gateway.get_routes()`;
      return routes;
    } catch (error) {
      console.error('Error getting routes:', error);
      throw error;
    }
  }

  async addMiddleware(middleware: string, position: 'before' | 'after' = 'before') {
    try {
      await py`self.gateway.add_middleware(${middleware}, ${position})`;
      return { success: true, message: `Middleware ${middleware} added` };
    } catch (error) {
      console.error('Error adding middleware:', error);
      throw error;
    }
  }

  async removeMiddleware(middleware: string) {
    try {
      await py`self.gateway.remove_middleware(${middleware})`;
      return { success: true, message: `Middleware ${middleware} removed` };
    } catch (error) {
      console.error('Error removing middleware:', error);
      throw error;
    }
  }

  async updateConfig(updates: Partial<GatewayConfig>) {
    try {
      await py`self.gateway.update_config(${updates})`;
      this.config = { ...this.config, ...updates };
      return { success: true, message: 'Gateway config updated' };
    } catch (error) {
      console.error('Error updating gateway config:', error);
      throw error;
    }
  }
}

// Middleware utilities
export class RequestMiddleware {
  static async logRequest(request: any) {
    try {
      await py`RequestMiddleware.log_request(${request})`;
    } catch (error) {
      console.error('Error logging request:', error);
    }
  }

  static async validateRequest(request: any, schema: any) {
    try {
      const isValid = await py`RequestMiddleware.validate_request(${request}, ${schema})`;
      return isValid;
    } catch (error) {
      console.error('Error validating request:', error);
      return false;
    }
  }

  static async rateLimit(request: any, limit: number) {
    try {
      const allowed = await py`RequestMiddleware.rate_limit(${request}, ${limit})`;
      return allowed;
    } catch (error) {
      console.error('Error rate limiting:', error);
      return false;
    }
  }
}

export class ResponseMiddleware {
  static async logResponse(response: any) {
    try {
      await py`ResponseMiddleware.log_response(${response})`;
    } catch (error) {
      console.error('Error logging response:', error);
    }
  }

  static async formatResponse(response: any, format: 'json' | 'xml' | 'yaml') {
    try {
      const formatted = await py`ResponseMiddleware.format_response(${response}, ${format})`;
      return formatted;
    } catch (error) {
      console.error('Error formatting response:', error);
      return response;
    }
  }

  static async addHeaders(response: any, headers: Record<string, string>) {
    try {
      const modified = await py`ResponseMiddleware.add_headers(${response}, ${headers})`;
      return modified;
    } catch (error) {
      console.error('Error adding headers:', error);
      return response;
    }
  }
} 