
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Questions Service
const QuestionsService = {
  async getAllQuestions() {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('category', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getQuestionsByCategory(category) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('category', category);
    
    if (error) throw error;
    return data;
  }
};

// Risk Criteria Service
const RiskCriteriaService = {
  async evaluateRisk(healthQuestions) {
    try {
      // Get all risk criteria from the database
      const { data: riskCriteria, error } = await supabase
        .from('risk_criteria')
        .select('*');
      
      if (error) throw error;

      let highRiskCount = 0;
      let mediumRiskCount = 0;

      // Evaluate each category
      const categories = ['klinis', 'kesehatanDiri', 'kesehatanKeluarga', 'konsumsiMakanan'];
      
      categories.forEach(category => {
        const categoryAnswers = healthQuestions[category] || {};
        
        Object.entries(categoryAnswers).forEach(([question, answer]) => {
          const criterion = riskCriteria.find(c => 
            c.category === category && 
            c.question_text === question
          );

          if (criterion && answer === 'Ya') {
            if (criterion.risk_level === 'high') highRiskCount++;
            if (criterion.risk_level === 'medium') mediumRiskCount++;
          }
        });
      });

      // Special handling for blood pressure
      if (healthQuestions.klinis && healthQuestions.klinis['Berapakah hasil tekanan darah ibu terakhir yang di ukur oleh petugas RS atau Puskesmas ?']) {
        const bp = healthQuestions.klinis['Berapakah hasil tekanan darah ibu terakhir yang di ukur oleh petugas RS atau Puskesmas ?'];
        if (bp.systolic >= 140 || bp.diastolic >= 90) {
          highRiskCount++;
        }
      }

      // Determine final risk level
      if (highRiskCount > 0) return 'high';
      if (mediumRiskCount >= 2) return 'medium';
      return 'low';
    } catch (error) {
      console.error('Error evaluating risk:', error);
      throw error;
    }
  }
};

// User Service (Health Screenings)
const UserService = {
  async createUser(userData) {
    try {
      const riskLevel = await RiskCriteriaService.evaluateRisk(userData.healthQuestions);
      
      const { data, error } = await supabase
        .from('health_screenings')
        .insert([{
          weight: Number(userData.weight),
          height: Number(userData.height),
          education: userData.education,
          family_contact: userData.familyContact,
          health_questions: userData.healthQuestions,
          risk_level: riskLevel
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getUser(userId) {
    try {
      const { data, error } = await supabase
        .from('health_screenings')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('health_screenings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }
};

module.exports = {
  QuestionsService,
  RiskCriteriaService,
  UserService
};