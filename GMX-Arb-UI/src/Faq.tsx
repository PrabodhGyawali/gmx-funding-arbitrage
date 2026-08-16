import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotRunning from './Faq/NotRunning';

const questions = [
  {
    section: 'Setup',
    question: 'What to do if the python bot is not running?',
    answer: <NotRunning />
  },
  {
    section: 'Setup',
    question: 'How to use my bot from where ever?',
    answer: <Typography>This can be done by setting up a server in the cloud or your machine with a static IP address and port forwarding. This is not recommended for security reasons as if your ip or dns is compromised anyone can control your bot using the front-end ui. We will fix this in the future by adding a login system with JWT based auth.</Typography>
  },
  {
    section: 'Setup',
    question: 'How to setup up multiple settings configurations for the bot?',
    answer: <Typography>We recommend using the onboarding process twice. First for test-net configuration where you understand the mechanics and then redo the onboarding for the main-net configurations rather than changing the settings manually.</Typography>
  },
  {
    section: 'Trade Mechanics', // TODO: Improve
    question: 'How does the bot make trades?',
    answer: <Typography>By executing trade algorithms based on the strategies configured by the user.</Typography>
  },
  {
    section: 'Other',
    question: 'What should I do if I encounter an error?',
    answer: <Typography>Check the logs for details and ensure your configurations are correct.</Typography>
  }
];

const FAQPage = () => {
  const sections = [...new Set(questions.map(q => q.section))];

  return (
    <Container maxWidth="md" sx={{ borderRadius: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">FAQ</Typography>
      
      {sections.map(section => (
        <Box key={section} sx={{ mt: 2, mb: 2 }}>
          <Typography variant="h5" gutterBottom>{section}</Typography>
          {questions
            .filter(q => q.section === section)
            .map((q, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{q.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {q.answer}
                </AccordionDetails>
              </Accordion>
            ))
          }
        </Box>
      ))}
    </Container>
  );
};

export default FAQPage;