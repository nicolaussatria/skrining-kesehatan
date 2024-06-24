const riskCriteria = [
    {
      category: 'klinis',
      criteria: [
        { questionText: 'Apakah Anda mengalami keluar cairan dari jalan lahir?', risk: 'high' },
        { questionText: 'Apakah Anda mengalami kontraksi rahim atau nyeri yang berulang-ulang?', risk: 'high' },
        { questionText: 'Apakah Anda mengalami pembengkakan pada area telapak kaki atau wajah?', risk: 'medium' },
        { questionText: 'Apakah Anda merasa sesak napas atau sulit bernapas?', risk: 'high' },
        { questionText: 'Apakah Anda mengalami perubahan mendadak pada penglihatan, seperti kilatan cahaya atau penglihatan kabur?', risk: 'high' },
        { questionText: 'Apakah Anda merasa pusing atau sering mengalami sakit kepala hebat yang tidak biasa?', risk: 'medium' },
      ]
    },
    {
      category: 'kesehatanDiri',
      criteria: [
        { questionText: 'Apakah Anda mengalami tekanan darah tinggi sebelumnya atau memiliki riwayat preeklampsia?', risk: 'high' },
        { questionText: 'Apakah anda sedang/pernah mengidap penyakit Diabetes Melitus (kencing manis)?', risk: 'high' },
        { questionText: 'Apakah anda sedang/pernah mengidap penyakit ginjal?', risk: 'high' },
        { questionText: 'Apakah anda sedang/pernah mengidap penyakit auto imun atau sakit lupus?', risk: 'high' },
      ]
    },
    {
      category: 'kesehatanKeluarga',
      criteria: [
        { questionText: 'Apakah Ibu atau saudara perempuan anda mempunyai penyakit hipertensi/darah tinggi?', risk: 'medium' },
        { questionText: 'Apakah Ibu atau saudara perempuan anda mempunyai penyakit diabetes mellitus/ kencing manis?', risk: 'medium' },
      ]
    },
    {
      category: 'konsumsiMakanan',
      criteria: [
        { questionText: 'Apakah anda mempunyai kebiasaan makan makanan yang berasa asin?', risk: 'medium' },
        { questionText: 'Apakah anda sering mengkonsumsi makanan berlemak / bersantan sehari hari?', risk: 'medium' },
        { questionText: 'Apakah anda sering mengkonsumsi makanan cepat saji (KFC, McDonald, dll) sehari hari?', risk: 'medium' },
        { questionText: 'Apakah anda sering mengkonsumsi minuman manis / minuman kemasan sehari hari?', risk: 'medium' },
      ]
    },
  ];
  
  const evaluateRisk = (healthQuestions) => {
    let highRiskCount = 0;
    let mediumRiskCount = 0;
  
    riskCriteria.forEach((categoryCriteria) => {
      const category = categoryCriteria.category;
      const criteria = categoryCriteria.criteria;
  
      criteria.forEach((criterion) => {
        const answer = healthQuestions[category] && healthQuestions[category][criterion.questionText];
        if (answer && answer === 'Ya') {
          if (criterion.risk === 'high') {
            highRiskCount++;
          } else if (criterion.risk === 'medium') {
            mediumRiskCount++;
          }
        }
      });
    });
  
    if (highRiskCount > 0) {
      return 'high';
    } else if (mediumRiskCount >= 2) {
      return 'medium';
    } else {
      return 'low';
    }
  };
  
  module.exports = { riskCriteria, evaluateRisk };
  