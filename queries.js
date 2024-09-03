
const getAllQuestions = 'SELECT * FROM question_master';
const getAllQuestionOptions = 'SELECT * FROM question_options';
const getAllQuestionSets = 'SELECT * FROM question_set';
const getIdofTestResult = 'SELECT id FROM user_test_result ORDER BY id DESC LIMIT 1';
const getIdofTestResultDtl = 'SELECT id FROM user_test_result_dtl ORDER BY id DESC LIMIT 1';
const getIdofQuestionSet = 'SELECT id,question_set_id FROM question_set_questions ORDER BY id DESC LIMIT 1'
const getCategories = 'SELECT id,title FROM categories';
const questionSet1 = 'SELECT qsq.question_id, qm.question from testli.question_set_questions qsq, question_set qs , question_master qm where qs.id = 1 and qsq.question_set_id = qs.id  and qm.id = qsq.question_id';
const questionSet2  = 'SELECT qsq.question_id, qm.question from testli.question_set_questions qsq, question_set qs , question_master qm where qs.id = 2 and qsq.question_set_id = qs.id  and qm.id = qsq.question_id';
const usertestresult = 'SELECT * FROM user_test_result_dtl WHERE user_test_result_id = ${user_test_result_id}'
module.exports = {
  getAllQuestions,
  getAllQuestionOptions,
  getAllQuestionSets,
  getIdofTestResult,
  getIdofTestResultDtl,
  getIdofQuestionSet,
  getCategories,
  questionSet1,
  questionSet2,
  usertestresult

};
