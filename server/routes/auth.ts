import { RequestHandler } from "express";
import mysql from "mysql2/promise";
import { getConfig } from "../config";

export const validateToken: RequestHandler = async (req, res) => {
  const { token } = req.body;

  if (!token || typeof token !== 'string') {
    res.status(400).json({ error: 'Token é obrigatório' });
    return;
  }

  try {
    const config = getConfig();

    // Check if database is configured
    if (!config.mysqlDbName || !config.mysqlHost) {
      res.status(500).json({ error: 'Banco de dados não configurado. Contate o administrador.' });
      return;
    }

    // Create connection using admin config
    const connection = await mysql.createConnection({
      host: config.mysqlHost,
      port: parseInt(config.mysqlPort),
      user: config.mysqlUsername || 'root',
      password: config.mysqlPassword,
      database: config.mysqlDbName,
    });

    try {
      // Query the geral table for the token
      const [rows] = await connection.execute(
        'SELECT * FROM geral WHERE TOKEN = ?',
        [token]
      );

      await connection.end();

      if (Array.isArray(rows) && rows.length > 0) {
        // Token found - login successful
        res.json({ success: true, message: 'Token válido' });
      } else {
        // Token not found
        res.status(401).json({ error: 'Token inválido' });
      }
    } catch (dbError) {
      await connection.end();
      throw dbError;
    }
  } catch (err: any) {
    console.error('Erro ao validar token:', err);
    
    // Provide specific error messages
    if (err.code === 'ER_ACCESS_DENIED_FOR_USER') {
      res.status(500).json({ error: 'Erro de conexão: credenciais MySQL inválidas' });
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      res.status(500).json({ error: 'Erro de conexão: banco de dados não encontrado' });
    } else if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      res.status(500).json({ error: 'Erro de conexão: conexão perdida' });
    } else {
      res.status(500).json({ error: 'Erro ao validar token. Tente novamente.' });
    }
  }
};
