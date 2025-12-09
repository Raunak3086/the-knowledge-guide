This describes the code changes made to the application.

**Restructured UI:**
*   **`Home.jsx`:** Simplified to a landing page with an "Upload" button opening a modal.
*   **`Interact.jsx` (New):** Dedicated page for document summarization and querying, navigated to after upload.

**Enhanced Workflow:**
*   **`DocumentUpload.jsx`:** Modified to redirect to the new `Interact` page, passing uploaded file data.
*   **`DocumentUploadModal.jsx` (New):** Reintroduced to handle snippet-style uploads.

**Cleaned & Themed:**
*   **`App.jsx`:** Updated routing and removed obsolete navigation.
*   **`Home.css`, `Interact.css`, `DocumentUploadModal.css`:** Replaced/created with a consistent "Yellow Ranger" theme.
*   **`src/components` directory:** Deleted all previously created dashboard-related components for a cleaner codebase.