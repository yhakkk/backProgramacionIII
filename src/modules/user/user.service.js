const userModel = require("../../models/user");
const pager = require("../../utils/pager");

async function createIfNotExists(decoded, response) {
    let user = await findOne(decoded.email)
    if(!user){
        user = {firtname:decoded.given_name, lastname: decoded.family_name ,email:decoded.email}
        await save(user)
    }
    return user   

}
async function findOneById(_id){
  return await userModel.findById(_id).exec()
}
async function findOne(email){
    return await userModel.findOne({email:email}).exec()
}

async function save(user){
    let _user = new userModel(user)  
    return await _user.save()
}

async function paginated(params) {
    let perPage = params.perPage?params.perPage:10, page = Math.max(0, params.page)
    let filter = params.filter?params.filter:{}
    let sort = params.sort?params.sort:{}
  
    let count = await userModel.countDocuments(filter)
    let data = await userModel.find(filter)
      .limit(perPage)
      .skip(perPage * page)
      .sort(sort)

      .exec();
  
    return pager.createPager(page,data,count,perPage)
  }
  
async function update(id, updatedUser) {
    return await userModel.findByIdAndUpdate(id, updatedUser, { new: true }).exec();
  }
  
async function remove(id) {
      return await userModel.findOneAndDelete({ _id: id }).exec();
  }
  

  async function addTaskToUser(taskId, userId) {
    try {   
      // Busca al usuario por su ID
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
    
      // Agrega el taskId al arreglo de tareas del usuario (suponiendo que user.tasks es un arreglo de IDs de tareas)
      user.tasks.push(taskId);
      
      // Guarda los cambios en el usuario
      await user.save();
      
      return user;
    } catch (error) {
      console.error('Error al agregar la tarea al usuario:', error);
      throw new Error('Error al agregar la tarea al usuario');
    }
  }


module.exports = { createIfNotExists,findOneById, findOne, save, paginated, update, remove, addTaskToUser };