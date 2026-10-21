import { query } from '../config/db.js';

export const getMessages = async (limit = 100) => {
  const sql = `
    SELECT 
      m.id,
      m.user_id,
      m.sender_name,
      m.sender_avatar,
      m.text,
      m.file_url,
      m.file_name,
      m.file_type,
      m.created_at,
      u.email AS sender_email
    FROM messages m
    LEFT JOIN users u ON m.user_id = u.id
    ORDER BY m.created_at ASC
    LIMIT $1;
  `;
  const result = await query(sql, [limit]);
  return result.rows;
};

export const createMessage = async (user, messageData) => {
  const { text, fileUrl, fileName, fileType } = messageData;

  if (!text && !fileUrl) {
    const error = new Error('Message text or a file attachment is required');
    error.statusCode = 400;
    throw error;
  }

  const sql = `
    INSERT INTO messages (user_id, sender_name, sender_avatar, text, file_url, file_name, file_type)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const result = await query(sql, [
    user.id,
    user.name,
    user.avatar_color || '#2563eb',
    text ? text.trim() : null,
    fileUrl || null,
    fileName || null,
    fileType || null,
  ]);

  return result.rows[0];
};

export default {
  getMessages,
  createMessage,
};
