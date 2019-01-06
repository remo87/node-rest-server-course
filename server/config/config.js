process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

process.env.URLDB = process.env.NODE_ENV === 'dev' ? 
    'mongodb://localhost:27017/cafe' 
    : 'mongodb://cafe-user:abc123456@ds245755.mlab.com:45755/cafe';
