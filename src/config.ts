const ENGINE_URL = 'https://aa-engine.herokuapp.com';
const LOCAL_ENGINE_URL = 'http://localhost:3030';

const config = {
  engineUrl: process.env.NODE_ENV == 'debug' ? LOCAL_ENGINE_URL: ENGINE_URL
}

export = config;
