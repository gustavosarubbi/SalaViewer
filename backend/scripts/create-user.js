const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database/salaviewer.db');

async function createDefaultUser() {
  const db = new sqlite3.Database(dbPath);
  
  try {
    // Verificar se já existe usuário
    const existingUser = await new Promise((resolve, reject) => {
      db.get("SELECT id FROM users WHERE email = ?", ['admin@salaviewer.com'], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingUser) {
      console.log('✅ Usuário admin já existe!');
      return;
    }

    // Criar usuário padrão
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users (email, password, username, role, isActive) VALUES (?, ?, ?, ?, ?)",
        ['admin@salaviewer.com', hashedPassword, 'admin', 'admin', true],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email: admin@salaviewer.com');
    console.log('🔑 Senha: admin123');
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
  } finally {
    db.close();
  }
}

createDefaultUser();

