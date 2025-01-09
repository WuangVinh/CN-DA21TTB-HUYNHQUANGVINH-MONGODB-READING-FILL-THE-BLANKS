import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  question: {
    marginBottom: 10,
  },
  answer: {
    marginLeft: 20,
  },
  score: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
});

const ResultPDF = ({ questions, userAnswers, totalScore }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Quiz Results</Text>
      
      <View style={styles.section}>
        <Text style={styles.score}>
          Final Score: {totalScore}/{questions.length}
        </Text>
        
        {questions.map((question, index) => (
          <View key={index} style={styles.question}>
            <Text>Question {index + 1}: {question.text}</Text>
            <Text style={styles.answer}>
              Your Answer: {userAnswers[index].join(', ')}
            </Text>
            <Text style={styles.answer}>
              Correct Answer: {question.blanks.map(b => b.correctAnswer).join(', ')}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ResultPDF;
