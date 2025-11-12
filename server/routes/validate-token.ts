import { RequestHandler } from "express";
import { createConnection, Connection } from "mysql2/promise";
import {
  TokenValidationRequest,
  TokenValidationResponse,
} from "@shared/api";

export const handleValidateToken: RequestHandler = async (req, res) => {
  try {
    const request = req.body as TokenValidationRequest;

    // Validate required fields
    if (
      !request.token ||
      !request.host ||
      !request.user ||
      !request.database ||
      !request.table ||
      !request.tokenColumn
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      } as TokenValidationResponse);
    }

    // Create connection to MySQL
    const connection: Connection = await createConnection({
      host: request.host,
      port: request.port || 3306,
      user: request.user,
      password: request.password || "",
      database: request.database,
    });

    try {
      // Escape table and column names with backticks
      const escapedTable = `\`${request.table.replace(/`/g, "``")}\``;
      const escapedColumn = `\`${request.tokenColumn.replace(/`/g, "``")}\``;

      // Query to check if token exists in the database
      const query = `SELECT COUNT(*) as count FROM ${escapedTable} WHERE ${escapedColumn} = ?`;
      const [rows] = await connection.execute(query, [request.token]);

      const result = rows as Array<{ count: number }>;
      await connection.end();

      const tokenExists = result[0].count > 0;

      if (tokenExists) {
        return res.json({
          success: true,
          message: "Token validated successfully",
        } as TokenValidationResponse);
      } else {
        return res.status(401).json({
          success: false,
          error: "Invalid token",
        } as TokenValidationResponse);
      }
    } catch (dbError) {
      try {
        await connection.end();
      } catch {
        // Ignore connection close errors
      }
      throw dbError;
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    res.status(500).json({
      success: false,
      error: errorMessage,
    } as TokenValidationResponse);
  }
};
