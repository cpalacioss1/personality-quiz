// App.jsx
import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Components
import Header from "./components/Header";
import UserForm from "./components/UserForm";
import Question from "./components/Question";
import Results from "./components/Results";

function App() {
  // ---------------------------
  // 1. Questions of the quiz
  // ---------------------------
  const questions = [
    {
      question: "Where do you feel most at peace?",
      options: ["Mountains", "Ocean", "Windy fields", "Volcanoes"],
    },
    {
      question: "Choose a color:",
      options: ["Green", "Blue", "White", "Red"],
    },
    {
      question: "Pick a personality trait:",
      options: ["Calm", "Emotional", "Free", "Strong"],
    },
  ];

  // ----------------------------------------
  // 2. States for quiz logic
  // ----------------------------------------
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [element, setElement] = useState(null);
  const [artwork, setArtwork] = useState(null);

  const navigate = useNavigate();

  // -----------------------------------------------------------
  // 3. Map each option to an element (Earth, Water, Air, Fire)
  // -----------------------------------------------------------
  const elementMap = {
    Mountains: "Earth",
    Green: "Earth",
    Calm: "Earth",

    Ocean: "Water",
    Blue: "Water",
    Emotional: "Water",

    "Windy fields": "Air",
    White: "Air",
    Free: "Air",

    Volcanoes: "Fire",
    Red: "Fire",
    Strong: "Fire",
  };

  // -----------------------------------------------------------
  // 4. Handle answering a question
  // -----------------------------------------------------------
  function handleAnswer(option) {
    const updatedAnswers = [...answers, option];
    setAnswers(updatedAnswers);

    const nextQuestion = currentQuestionIndex + 1;

    if (nextQuestion < questions.length) {
      // Go to next question
      setCurrentQuestionIndex(nextQuestion);
    } else {
      // Last question -> calculate result
      calculateResult(updatedAnswers);
    }
  }

  // -----------------------------------------------------------
  // 5. Determine the user's element based on answers
  // -----------------------------------------------------------
  function calculateResult(answerList) {
    const elementScores = { Earth: 0, Water: 0, Air: 0, Fire: 0 };

    answerList.forEach((answer) => {
      const category = elementMap[answer];
      elementScores[category]++;
    });

    // Find element with highest score
    const finalElement = Object.keys(elementScores).reduce((a, b) =>
      elementScores[a] > elementScores[b] ? a : b
    );

    setElement(finalElement);

    // After determining element -> fetch art
    fetchArtwork(finalElement);
  }

  // -----------------------------------------------------------
  // 6. Fetch an artwork from the MET Museum API
  // -----------------------------------------------------------
  async function fetchArtwork(finalElement) {
    try {
      const search = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${finalElement}`
      );
      const data = await search.json();

      if (data.objectIDs && data.objectIDs.length > 0) {
        const randomID =
          data.objectIDs[Math.floor(Math.random() * data.objectIDs.length)];

        const artFetch = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomID}`
        );
        const artData = await artFetch.json();

        setArtwork(artData);
      }
    } catch (error) {
      console.error("Error fetching artwork:", error);
    }

    // Navigate to results page
    navigate("/results");
  }

  // -----------------------------------------------------------
  // 7. Render
  // -----------------------------------------------------------
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<UserForm />} />

        <Route
          path="/quiz"
          element={
            <Question
              question={questions[currentQuestionIndex].question}
              options={questions[currentQuestionIndex].options}
              onAnswer={handleAnswer}
            />
          }
        />

        <Route path="/results" element={<Results element={element} artwork={artwork} />} />
      </Routes>
    </div>
  );
}

export default App;

