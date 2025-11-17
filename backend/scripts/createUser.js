const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { connectDB } = require('../src/config/db');
const User = require('../src/models/user');

async function main() {
  const [, , email, password, name = ''] = process.argv;

  if (!email || !password) {
    console.error('Uso: node scripts/createUser.js <email> <password> [name]');
    process.exit(1);
  }

  try {
    await connectDB();

    const exists = await User.findOne({ email });
    if (exists) {
      console.error(`Usuário já existe: ${email}`);
      process.exit(1);
    }

    const user = new User({ email, password, name });
    await user.save();

    console.log('Usuário criado com sucesso:');
    console.log(`  id: ${user._id}`);
    console.log(`  email: ${user.email}`);
    console.log(`  name: ${user.name}`);
    process.exit(0);
  } catch (err) {
    console.error('Erro ao criar usuário:', err.message || err);
    process.exit(1);
  }
}

main();
