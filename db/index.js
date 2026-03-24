

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres.amwllgnaxaxshdjkjhwt",
  host: "aws-0-us-west-2.pooler.supabase.com",
  database: "postgres",
  password: "050620052113200",
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }

});

export default pool;