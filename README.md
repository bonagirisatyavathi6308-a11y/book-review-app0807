# Book review

Build a responsive, modern web application named "Book Review" designed with a soft pastel purple and pale yellow color palette. The site must integrate the Google Books API to dynamically fetch and display book details (titles, authors, cover images, publication dates) in real-time. It requires smooth micro-interactions, state management (saving onboarding details, browsing history, and reviews locally or via a backend), and active state highlighting for navigation elements.

1. Branding & Visual Layout Guidelines

 * Palette: Backgrounds and accents must blend pastel purple and pale yellow for high readability and a clean visual aesthetic.

 * Bottom App Navigation Bar: Fixed bottom bar featuring icons for:

   * Home

   * Search

   * Upload-Review

   * Promo (Features AI-generated video book promos and promotional content)

   * User Profile

   * Behavior: The currently active icon must be clearly highlighted and visually distinct from inactive icons.

2. User Flow & Core Features

 * Landing Page (/):

   * Displays the full "Book Review" mascot logo upon load.

   * Redirect: Instantly routes first-time users to the Onboarding Process and returning users to the Homepage.

 * Onboarding Process (Multi-Step):

   * Step 1 (User Info): Inputs for Name, Age, Gender, and Email ID with form validation.

   * Step 2 (Preferences): Multi-select grid to pick favorite Book Categories and Preferred Authors.

   * Step 3 (Localization): Language selection interface.

   * Action: Saves stored details and redirects to the Homepage.

 * Homepage:

   * Header Bar: Prominent center search bar. Left: Hamburger menu icon. Right: Small mascot logo + profile shortcut avatar.

   * Side Drawer Menu: Displays user details, Settings (Change Language, Logout, Edit Profile).

   * Content Sections:

     * Favorite Authors horizontal carousel at the top.

     * Selected book categories.

     * Horizontal swipe carousels for browsing other books.

   * Footer: "About Us" section containing contact information (Email ID).

 * Search Page & Live Querying:

   * Real-time search bar querying the Google Books API as the user types.

   * Filters and displays results dynamically by Book Title or Author Name, showing cover images, book titles, and author details.

 * Promo Page (/promo):

   * Displays AI-generated video promos and promotional clips for selected books to boost user engagement.

 * Author Profile Page:

   * Displays author bio, cover images of their famous books, and recent works.

 * Book Details & Reviews Page:

   * Displays book cover image, title, author name (clickable), synopsis, and community reviews.

 * Interactive Review Submission System (/upload-review):

   * Text Reviews:

     * Sliding poll to rate understandability, interest, and suggestibility (1–5 scale).

     * Target Audience Recommendation options: Kids, Youth, or Adults.

     * Personal experience comment field capped at 100 words or less.

   * Audio Reviews: Voice recorder component allowing up to 1 minute (60 seconds) of recording with a visible countdown timer and playback option.

 * User Profile & Activity Page:

   * Displays stored user details, enables editing profile info, provides language settings in the menu, and tracks user Browsing History and Submitted Reviews.


@secret:GOOGLE_API_KEY

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/23746cf5-10ff-4d97-a880-1478ce5796d3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
