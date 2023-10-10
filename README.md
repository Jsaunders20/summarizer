# Meeting Document Extractor, Summarizer, and Email Generator

## Overview

This script efficiently processes and summarizes the content of various file types within a specified Google Drive folder. It supports both PDFs and certain audio file formats (e.g., MP3, MP4, MPEG). Summaries and follow-up emails are generated based on the extracted content using the GPT-4 model. 

## 🌟 Features

- Extract content from PDFs and audio files within a Google Drive folder.
- Generate a concise 2-page summary divided into:
  - General Discussion
  - Action Items
- Draft a follow-up email based on the meeting's content.
- Create Google Docs for both the summary and the email, which are then placed in the original folder.

## 📋 Prerequisites

1. Google Apps Script permissions to access Google Drive, DocumentApp, and UrlFetchApp services.
2. Correct setup of the `GPT_API_URL` and `GPT_API_KEY` constants for your GPT-4 API endpoint and key.

## 🚀 Usage

1. Replace `specificFolderId` in the `runExtractionAndDocumentGeneration` function with your desired Google Drive folder's ID.
2. Execute the `runExtractionAndDocumentGeneration()` function.
3. Summaries and emails will be generated and stored as separate Google Docs within the original folder.

## 🔍 Functions Breakdown

- `extractAndGenerateDocuments(folderId)`: Orchestrates the extraction, summarization, and document creation processes.
- `extractContentFromFiles(folderId)`: Handles the extraction of content from both PDFs and audio files.
- `generateSummaryWithGPT4(content)`: Produces a structured summary based on the extracted content.
- `generateEmailWithGPT4(content)`: Crafts a follow-up email using the summarized content.
- `generateWithGPT4(prompt)`: Communicates with the GPT-4 API to generate content based on a given prompt.
- `createDocumentInFolder(folderId, title, content)`: Establishes a Google Doc in the specified folder.
- `moveFiles(fileId, folderID)`: Transfers a file to a designated folder.
- `runExtractionAndDocumentGeneration()`: Initiates the extraction and summarization process.

## ⚠️ Notes

- Always monitor the cost implications and potential rate limits associated with frequent GPT-4 API requests.
- Ensure the API key remains confidential to prevent unauthorized access.
- It's assumed that audio files are in English for transcription. Adjust the `WHISPER` function (not provided in this code) if needed.

## 👤 Author

[Your Name or GitHub Username]
