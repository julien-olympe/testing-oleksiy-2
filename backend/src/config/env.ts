// This file must be imported FIRST before any other imports
// to ensure environment variables are loaded before modules use them
import { config } from 'dotenv';

// Load .env from workspace root
config({ path: '/workspace/.env' });
