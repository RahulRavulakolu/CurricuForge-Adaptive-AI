import { getDB } from '@/lib/mongodb';

class CurriculumService {
  // Create a new curriculum
  static async create(curriculumData) {
    try {
      const db = getDB();
      const collection = db.collection('curricula');
      
      const curriculum = {
        ...curriculumData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await collection.insertOne(curriculum);
      console.log('Curriculum created with ID:', result.insertedId);
      return { id: result.insertedId, ...curriculum };
    } catch (error) {
      console.error('Error creating curriculum:', error);
      throw error;
    }
  }

  // Get all curricula
  static async getAll() {
    try {
      const db = getDB();
      const collection = db.collection('curricula');
      
      const curricula = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return curricula;
    } catch (error) {
      console.error('Error fetching curricula:', error);
      throw error;
    }
  }

  // Get curriculum by ID
  static async getById(id) {
    try {
      const db = getDB();
      const collection = db.collection('curricula');
      
      const curriculum = await collection.findOne({ _id: id });
      return curriculum;
    } catch (error) {
      console.error('Error fetching curriculum:', error);
      throw error;
    }
  }

  // Update curriculum
  static async update(id, updateData) {
    try {
      const db = getDB();
      const collection = db.collection('curricula');
      
      const result = await collection.updateOne(
        { _id: id },
        { 
          $set: { 
            ...updateData, 
            updatedAt: new Date() 
          } 
        }
      );
      
      if (result.matchedCount === 0) {
        throw new Error('Curriculum not found');
      }
      
      return result;
    } catch (error) {
      console.error('Error updating curriculum:', error);
      throw error;
    }
  }

  // Delete curriculum
  static async delete(id) {
    try {
      const db = getDB();
      const collection = db.collection('curricula');
      
      const result = await collection.deleteOne({ _id: id });
      
      if (result.deletedCount === 0) {
        throw new Error('Curriculum not found');
      }
      
      return result;
    } catch (error) {
      console.error('Error deleting curriculum:', error);
      throw error;
    }
  }

  // Search curricula
  static async search(query) {
    try {
      const db = getDB();
      const collection = db.collection('curricula');
      
      const searchQuery = {
        $or: [
          { program_title: { $regex: query, $options: 'i' } },
          { skill: { $regex: query, $options: 'i' } },
          { level: { $regex: query, $options: 'i' } }
        ]
      };
      
      const curricula = await collection.find(searchQuery).sort({ createdAt: -1 }).toArray();
      return curricula;
    } catch (error) {
      console.error('Error searching curricula:', error);
      throw error;
    }
  }
}

export default CurriculumService;
