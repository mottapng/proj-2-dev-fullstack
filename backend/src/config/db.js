const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Conecta ao MongoDB usando Mongoose
 * Aceita um `uri` opcional; se não fornecido, usa `process.env.MONGO_URI`.
 */
const connectDB = async (uri) => {
  try {
    const mongoURI = uri || process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI não está definida nas variáveis de ambiente");
    }

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB conectado com sucesso!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);

    mongoose.connection.on("error", (err) => {
      console.error(`❌ Erro na conexão com MongoDB: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB desconectado");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconectado");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB desconectado devido ao encerramento da aplicação");
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`❌ Erro ao conectar ao MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = { connectDB };