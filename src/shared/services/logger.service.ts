import * as fs from 'fs';

import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LoggerService {
  private readonly logFilePath: string = 'error.log';

  // ------------------ LOG ERROR ------------------
  logError(request: Request, description: any): void {
    console.log('☄️ ~ LoggerService ~ logError:', description.stack);

    const logMessage = `${new Date().toLocaleString()} - \n ${
      request.method
    } - ${request.originalUrl} \n ${
      description.stack
    } \n--------------------------------------------\n`;

    fs.appendFile(this.logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Error while writing to log file:', err);
      }
    });
  }
}
