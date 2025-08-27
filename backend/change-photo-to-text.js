import { DB } from './config/db.js';

async function changePhotoToText() {
  try {
    console.log('Changing photo column type to TEXT...');
    
    // Выполняем SQL запрос для изменения типа поля
    await DB.query(`
      ALTER TABLE "Profiles" 
      ALTER COLUMN "photo" TYPE TEXT;
    `);
    
    console.log('Column photo type changed to TEXT successfully');
    return true;
  } catch (error) {
    console.error('Error changing column type:', error);
    return false;
  }
}

export default changePhotoToText;