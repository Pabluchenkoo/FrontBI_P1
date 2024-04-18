import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Papa from "papaparse";
import * as React from "react";
import { useState } from "react";

export default function Hero() {
  const [isFileInput, setIsFileInput] = useState(false);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleReviewChange = (event) => {
    // console.log('Review:', event.target.value);
    setReview(event.target.value);
  };
  const handleFileUpload = async (event) => {
    setIsLoading(true);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    Papa.parse(file, {
      complete: async function (results) {
        try {
          const response = await axios.post(
            "http://localhost:8000/upload-csv",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          const predictions = response.data.predictions;
          const newReviews = predictions.map((stars, i) => ({
            text: results.data[i + 1][0],
            stars: stars,
          }));
          setReviews([...reviews, ...newReviews]);
          setIsLoading(false);
        } catch (error) {
          console.error("Error predicting review:", error);
        }
      },
    });
    
  };
  const handlePredictClick = async () => {
    if (review === "") {
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/predict", {
        Review: review,
      });

      const stars = response.data.result[0];
      const newReview = { text: review, stars: stars };
      setReviews([...reviews, newReview]); // Add the new review to the list
      setReview("");
      console.log("Predicted review:", response.data.result[0]);
    } catch (error) {
      console.error("Error predicting review:", error);
    }
  };

  const handleInputTypeChange = (event, newValue) => {
    setIsFileInput(newValue === 'file');
  };

  const renderStars = (stars) => {
    return Array(stars)
      .fill()
      .map((_, i) => "⭐")
      .join("");
  };

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundImage:
          theme.palette.mode === "light"
            ? "linear-gradient(180deg, #CEE5FD, #FFF)"
            : `linear-gradient(#02294F, ${alpha("#090E10", 0.0)})`,
        backgroundSize: "100% 100px",
        backgroundRepeat: "no-repeat",
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <ToggleButtonGroup
          value={isFileInput ? "file" : "text"}
          exclusive
          onChange={handleInputTypeChange}
          aria-label="text alignment"
        >
          <ToggleButton value="text" aria-label="left aligned">
            Text
          </ToggleButton>
          <ToggleButton value="file" aria-label="centered">
            File
          </ToggleButton>
        </ToggleButtonGroup>
        <Stack spacing={2} useFlexGap sx={{ width: { xs: "100%", sm: "70%" } }}>
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignSelf: "center",
              textAlign: "center",
              fontSize: "clamp(3.5rem, 10vw, 4rem)",
            }}
          >
            Try our&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: "clamp(3rem, 10vw, 4rem)",
                color: (theme) =>
                  theme.palette.mode === "light"
                    ? "primary.main"
                    : "primary.light",
              }}
            >
              Pipeline
            </Typography>
          </Typography>

          {isFileInput  ? (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignSelf="center"
              spacing={1}
              useFlexGap
              sx={{ pt: 2, width: { xs: "100%", sm: "auto" } }}
            >
              <input
                accept="text/csv"
                id="contained-button-file"
                type="file"
                hidden
                onChange={handleFileUpload}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                  Upload CSV
                </Button>
              </label>
            </Stack>
          ) : (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignSelf="center"
              spacing={1}
              useFlexGap
              sx={{ pt: 2, width: { xs: "100%", sm: "auto" } }}
            >
              <TextField
                value={review}
                onChange={handleReviewChange}
                id="outlined-basic"
                hiddenLabel
                size="small"
                variant="outlined"
                aria-label="Enter a review"
                placeholder="Your review"
                inputProps={{
                  autocomplete: "off",
                  ariaLabel: "Enter your review",
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handlePredictClick}
              >
                Predict now
              </Button>
            </Stack>
          )}
        </Stack>
        {isLoading ? (
          <div style={{marginTop: 50}}>
          <CircularProgress />
          </div>
        ) : (
          <Box
            id="image"
            sx={(theme) => ({
              mt: { xs: 8, sm: 10 },
              alignSelf: "center",
              width: "100%",
              backgroundImage:
                theme.palette.mode === "light"
                  ? 'url("/static/images/templates/templates-images/hero-light.png")'
                  : 'url("/static/images/templates/templates-images/hero-dark.png")',
              backgroundSize: "cover",
              borderRadius: "10px",
              outline: "1px solid",
              outlineColor:
                theme.palette.mode === "light"
                  ? alpha("#BFCCD9", 0.5)
                  : alpha("#9CCCFC", 0.1),
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`
                  : `0 0 24px 12px ${alpha("#033363", 0.2)}`,
            })}
          >
            {reviews.map((review, index) => (
              <div
                key={index}
                style={{
                  fontSize: "24px",
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                {renderStars(review.stars)} - "{review.text}"
                <hr />
              </div>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
