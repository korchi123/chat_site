import { DB } from './config/db.js';

async function addPhotoFileIdColumn() {
  try {
    console.log('Adding photoFileId column to Profiles table...');
    
    // Выполняем SQL запрос напрямую
    await DB.query(`
      ALTER TABLE "Profiles" 
      ADD COLUMN IF NOT EXISTS "photoFileId" VARCHAR(255) NULL;
    `);
    
    console.log('Column photoFileId added successfully');
    return true;
  } catch (error) {
    console.error('Error adding column:', error);
    return false;
  }
}

export default addPhotoFileIdColumn;