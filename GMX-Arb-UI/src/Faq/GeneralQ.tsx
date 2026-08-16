import { Box, Typography } from "@mui/material"
import theme from "../styledComponent/customTheme"

const GeneralQ: React.FC<{question: string, answer: string}> = ({question, answer}) => {
  return (
    <Box sx={{backgroundColor: theme.palette.background.paper, padding: 2}}>
        <Typography >{question}</Typography>
        <Typography>{answer}</Typography>
    </Box>
  )
}

export default GeneralQ