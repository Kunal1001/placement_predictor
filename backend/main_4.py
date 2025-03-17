from flask import Flask, request, jsonify
import pandas as pd
import joblib


lr = joblib.load('logistic_regression_model.pkl')
dt = joblib.load('decision_tree_model.pkl')
rf = joblib.load('random_forest_model.pkl')
svm = joblib.load('svm_model.pkl')
knn = joblib.load('knn_model.pkl')
nb = joblib.load('naive_bayes_model.pkl')
xgb = joblib.load('xgboost_model.pkl')
gb = joblib.load('gradient_boosting_model.pkl')


expected_columns = [
    'Overall GPA/CGPA', 'Numbers of Backlogs', 'Attendance Percentage', 
    'Number of Internships Completed', 'Internship Duration', 'Type of Internship',
    'Major Projects Completed', 'Leadership Skill', 'Participation in Competitions', 
    'Volunteer Experiences', 'Self-Rated Communication Skill', 'Teamwork Ability',
    'Problem Solving Ability', 'Number of Job Applications Sent', 
    'Number of Interviews Attended', 'Participation in Career Counseling Session', 
    'Mock Interviews', 'Gender_Male', 'Stream Type_Technical'
]

app = Flask(__name__)

def predict_employability(input_data):

    input_df = pd.DataFrame([input_data])[expected_columns]

    predictions = {
        "Logistic Regression": [int(lr.predict(input_df)[0]), lr.predict_proba(input_df)[0][1]],
        "Decision Tree": [int(dt.predict(input_df)[0]), dt.predict_proba(input_df)[0][1]],
        "Random Forest": [int(rf.predict(input_df)[0]), rf.predict_proba(input_df)[0][1]],
        "SVM": [int(svm.predict(input_df)[0]),int(svm.predict(input_df)[0])],
        "KNN": [int(knn.predict(input_df)[0]), knn.predict_proba(input_df)[0][1]],
        "Naive Bayes": [int(nb.predict(input_df)[0]), nb.predict_proba(input_df)[0][1]],
        "XGBoost": [int(xgb.predict(input_df)[0]), xgb.predict_proba(input_df)[0][1]],
        "Gradient Boosting": [int(gb.predict(input_df)[0]), gb.predict_proba(input_df)[0][1]],
    }

    predictions = {k: [int(v[0]), float(v[1])] for k, v in predictions.items()}

    return predictions


@app.route('/predict', methods=['POST'])
def predict_endpoint():
    try:
        data = request.get_json()
        print(request)
        print(data)

        input_data = {
            'Gender_Male': 1 if data['gender'] == 'Male' else 0,
            'Stream Type_Technical': 1 if data['stream_type'] == 'Technical' else 0,
            'Overall GPA/CGPA': data['gpa'],
            'Numbers of Backlogs': data['backlogs'],
            'Attendance Percentage': data['attendance'],
            'Number of Internships Completed': data['internships'],
            'Internship Duration': data['internship_duration'],
            'Type of Internship': 1 if data['stream_type'] == 'Technical' else 0,
            'Major Projects Completed': data['major_projects_completed'],  
            'Leadership Skill': data['leadership_skill'],
            'Participation in Competitions': data['competitions'],
            'Volunteer Experiences': data['volunteer_experience'],
            'Self-Rated Communication Skill': data['communication_skill'],
            'Teamwork Ability': data['teamwork_ability'],
            'Problem Solving Ability': data['problem_solving_ability'],
            'Number of Job Applications Sent': data['job_applications_sent'],
            'Number of Interviews Attended': data['interviews_attended'],
            'Participation in Career Counseling Session': data['career_counseling'],
            'Mock Interviews': data['mock_interviews']
        }

        predictions = predict_employability(input_data)
        return jsonify(predictions), 200

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
