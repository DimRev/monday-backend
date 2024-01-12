// import { ADMIN_PASSWORD } from '../globalVars.js'

export default {
  // dbURL: `mongodb+srv://Admin:${ADMIN_PASSWORD}@mistertoy.ku3ejxj.mongodb.net/`,
  // dbURL: 'mongodb://localhost:27017',
  dbURL: `mongodb+srv://admin:${process.env.ADMIN_PASSWOR0D}@cluster0.1prbfc9.mongodb.net//`,
  dbName: 'monday_db',
}
