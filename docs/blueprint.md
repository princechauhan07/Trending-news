# **App Name**: Bharat Trends

## Core Features:

- Trending List Display: Render a scrollable list of 10-15 trending topics from the backend API, each with rank, hashtag, category, description, post count, time, and heat score, matching the reference UI.
- Trend Detail Page with AI Summary: Display detailed information for a selected trend, including its hashtag, category, full description, heat score, source, and an AI-generated summary of related content in Hindi.
- Search and Category Filtering: Enable users to search for trends by keywords and filter the trending list by predefined categories ('All', 'Elections', 'Entertainment', 'Policy', 'Sports') via horizontally scrollable pills.
- Language Toggle: Provide a header-level toggle button (EN / हिंदी) to switch basic UI labels between English and Hindi, demonstrating foundational internationalization.
- Backend Trending API Integration: Integrate with the '/api/trending' endpoint to fetch India-relevant trend data in Hindi, ensuring data mixing, categorization, and sorting by heat score.
- Mobile-First UX & Navigation: Implement mobile-first design principles, ensuring a smooth, sticky header experience, persistent scroll position on back navigation, and clean, polished spacing throughout.
- Interactive Trend Cards: Ensure each trend card is fully clickable, navigates to the detail page, and provides smooth tap/press feedback animations for a highly responsive feel.

## Style Guidelines:

- Dark color scheme for a sophisticated and modern feel. Primary content color: A deep, authoritative indigo (#323E73) for headings and key information. Background color: A very dark, desaturated blue-grey (#1A1A1E) for a subtle and immersive backdrop. Accent color: A vibrant electric purple (#A06AFF) to highlight interactive elements and secondary details. A prominent, contrasting red (#FF0000) will be used specifically for 'LIVE' indicators and heat scores as per design reference.
- Headline font: 'Space Grotesk' (sans-serif) for its modern, slightly technical and bold presence in titles and hashtags. Body text font: 'Inter' (sans-serif) for clean, objective readability in descriptions, metadata, and AI-generated summaries.
- Use clear, concise iconography. Employ a distinct red dot for 'LIVE' indicators and a prominent '🔥' icon for heat scores, matching the provided visual reference. All functional icons should be intuitively recognizable and consistent in style.
- Strictly mobile-first, ensuring all elements are optimized for small screens. Implement a sticky header for consistent navigation, generous clean spacing to prevent clutter, and visual distinction between sections as seen in the reference design.
- Incorporate subtle tap animations on clickable elements like trend cards and filter pills. Implement a skeleton loader pattern for content fetching states. Ensure smooth scrolling performance throughout the application, and consider pull-to-refresh for the trend list.