import React, { useState, useEffect } from 'react';
import styles from './StudySpace.module.css';
import NavBar from '../../components/NavBar';
import QuestionCard from './QuestionCard';
import FilterItem from './FilterItem';
import { QuestionPropsAPI } from './Type';
import Button from '../../components/Button';

const baseUrl = 'http://localhost:8080/api/v1';

const StudySpace: React.FC = () => {
  const [questionsList, setQuestionsList] = useState([] as QuestionPropsAPI[]);
  const [filter, setFilter] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);

  const fetchQuestions = async (subject: string[], done: number) => {
    try {
      const response = await fetch(`${baseUrl}/questions/filter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('session_id') || '',
        },
        body: JSON.stringify({ subjects: subject, done: done }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setQuestionsList(data);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchQuestions(
      ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'English'],
      3
    );
  }, []);

  const filterQuestions = async () => {
    const subjects = [];
    for (let i = 0; i < 7; i++) {
      if (filter[i]) {
        subjects.push(['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'English'][i]);
      }
    }
    const done = filter[7] && filter[8] ? 3 : filter[7] ? 1 : filter[8] ? 2 : 0;
    try {
      const response = await fetch(`${baseUrl}/questions/filter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('session_id') || '',
        },
        body: JSON.stringify({ subjects: subjects, done: done }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setQuestionsList(data);
    } catch (error) {
      alert(error);
    }
  };

  const handleFilterChange = (index: number, checked: boolean) => {
    const newFilter = [...filter];
    newFilter[index] = checked;
    setFilter(newFilter);
  };

  return (
    <main className={styles.container}>
      <NavBar />
      <div className={styles.content}>
        <div className={styles.questionContainer}>
          <h1 className={styles.title}>Questions</h1>
          <section className={styles.questionCardContainer}>
            {questionsList === null || questionsList.length === 0 ? (
              <h2 style={{ color: 'black' }}>No questions found</h2>
            ) : (
              questionsList.map((question) => (
                <QuestionCard
                  key={question.question_id}
                  id={question.question_tag}
                  question={question.description}
                  all_answer={question.answers}
                  correct_answer={question.correct_answer}
                  isDone={true}
                />
              ))
            )}
          </section>
        </div>
        <aside className={styles.filterContainer}>
          <h1 className={styles.title}>Filter</h1>
          <div className={styles.allFilter}>
            <h2 className={styles.filterTitle}>Subject</h2>
            {['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'English'].map((subject, index) => (
              <FilterItem
                key={subject}
                label={subject}
                isChecked={filter[index]}
                onChange={(checked) => handleFilterChange(index, checked)}
              />
            ))}
            <h2 className={styles.filterTitle}>Status</h2>
            {['Done', 'Undone'].map((status, index) => (
              <FilterItem
                key={status}
                label={status}
                isChecked={filter[index + 7]}
                onChange={(checked) => handleFilterChange(index + 7, checked)}
              />
            ))}
            <Button label="Apply" onClick={filterQuestions} />
          </div>
        </aside>
      </div>
    </main>
  );
};

export default StudySpace;