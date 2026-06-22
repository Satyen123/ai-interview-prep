import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

// Mock database validation log to emulate production server behavior
console.log('--- Speculative Propulsion Portal Launch Sequence ---');
console.log(`System Time: ${new Date().toISOString()}`);
console.log(`Target PORT Environment Variable: ${process.env.PORT ? process.env.PORT : 'Not specified (Defaulting to 8080)'}`);
console.log(`Production Mode (NODE_ENV): ${process.env.NODE_ENV || 'development'}`);

if (MONGO_URI) {
  // Obfuscate sensitive credentials for logs
    try {
        const maskedUri = MONGO_URI.replace(/:([^@]+)@/, ':******@');
            console.log(`MONGO_URI Verified: ${maskedUri}`);
              } catch (err) {
                  console.log('MONGO_URI is defined but could not be parsed.');
                    }
                    } else {
                      console.log('WARNING: MONGO_URI environment variable is missing.');
                      }

                      // Serve static assets from the React build directory
                      app.use(express.static(path.join(__dirname, 'dist')));

                      // SPA Fallback: Send index.html for all non-api routes to support client-side routing
                      app.get('*', (req, res) => {
                        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
                        });

                        app.listen(PORT, '0.0.0.0', () => {
                          console.log(`Propulsion Website is running on port ${PORT}`);
                            console.log('System Status: operational');
                              console.log('Metrics integration: connected');
                                console.log('----------------------------------------------------');
                                });
