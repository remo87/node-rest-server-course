process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

process.env.URLDB = process.env.NODE_ENV === 'dev' ? 
    'mongodb://localhost:27017/cafe' 
    : process.env.MONGO_URI;

process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'this-is-dev-seed';