# Moodmap Product Requirements Document

## 1. Overview

Moodmap is a web application that allows travelers to create interactive maps to record and journal their trips. Users can document their journeys, add multimedia content, and share their experiences with a community of fellow travelers.

## 2. Target Audience

*   **Primary:** Avid travelers, backpackers, and digital nomads who want to document their experiences in a creative and interactive way.
*   **Secondary:** Casual vacationers who want a simple tool to remember and share their trips with friends and family.

## 3. User Flow and Page Structure

This document outlines the main pages and their components.

### 3.1. Homepage

The landing page for all users, designed to be visually appealing and informative.

*   **Navigation Bar:**
    *   Logo (links to Homepage)
    *   Features
    *   Community
    *   Pricing
    *   Log In / Sign Up
*   **Hero Section:**
    *   Compelling headline (e.g., "Map Your Memories, Tell Your Story")
    *   Brief introductory text
    *   Primary Call-to-Action (CTA): "Create Your First Map"
*   **Global Map Showcase:**
    *   An interactive globe or map displaying anonymized, public trips.
    *   Hovering over a point could show a snippet of a trip.
*   **Functions Columns:**
    *   **Interactive Mapping:** Detail how users can add locations, draw routes, and customize their map's appearance.
    *   **Rich Journaling:** Explain the multimedia capabilities (photos, videos, text).
    *   **Community & Sharing:** Describe how users can share their trips or make them public.
*   **Call to Actions:**
    *   Another "Sign Up for Free" button.
    *   A section for testimonials or featured trips.

### 3.2. Library (User Dashboard)

A user's personal space, accessible after logging in.

*   **Trip Cards:**
    *   A grid or list of the user's created trips.
    *   Each card shows the trip name, dates, a small map preview, and number of locations.
    *   Options on the card: Edit, Share, Delete.
*   **Trip Creation Button:**
    *   A prominent "+" or "Create New Trip" button.
    *   This will trigger a modal or a new page to start the trip creation process (naming the trip, setting dates).

### 3.3. Trip View

The detailed view of a single trip. This is the core of the application.

*   **Interactive Map:**
    *   A large, pannable, and zoomable map.
    *   Numbered or iconic pins for each location.
    *   The route can be drawn as a line connecting the locations.
    *   Map style options (e.g., satellite, terrain, minimalist).
*   **Location Timeline:**
    *   A scrollable vertical or horizontal timeline.
    *   Each point on the timeline corresponds to a location on the map.
    *   Clicking a point on the timeline pans the map to that location and opens the location card.
*   **Location Card (Preview):**
    *   A summary card for each location on the timeline.
    *   Shows location name, date, and a thumbnail image.
    *   Clicking this expands to the full location journal view.

### 3.4. Location View (Journal)

The journal entry for a specific location within a trip.

*   **Location Journal Pages:**
    *   This could be a modal overlay or a new page.
    *   **Header:** Location name, date, and perhaps weather at the time.
    *   **Content:** A rich text editor for journaling, a gallery for photos and videos, and maybe a section for "mood" or ratings.
    *   Users can add, edit, and delete content.

## 4. Page Structure Map and Layout

This section provides a visual and structural overview of the page hierarchy and layout.

### 4.1. Page Hierarchy

```
/ (Homepage)
├── /features
├── /community
├── /pricing
├── /login
├── /signup
└── /dashboard (or /library)
    └── /trip/{tripId}
        └── /location/{locationId}
```

### 4.2. Layout Wireframes (Text-based)

#### Homepage Layout

```
+------------------------------------------------------+
| Navigation Bar                                       |
+------------------------------------------------------+
|                                                      |
|                      Hero Section                    |
|                                                      |
+------------------------------------------------------+
|                                                      |
|                 Global Map Showcase                  |
|                                                      |
+------------------------------------------------------+
|      [Function 1] | [Function 2] | [Function 3]     |
+------------------------------------------------------+
|                                                      |
|                   Call to Action                     |
|                                                      |
+------------------------------------------------------+
| Footer                                               |
+------------------------------------------------------+
```

#### Library/Dashboard Layout

```
+------------------------------------------------------+
| Navigation Bar (User is logged in)                   |
+------------------------------------------------------+
|                                                      |
|  [Trip Card 1] [Trip Card 2] [Create New Trip +]     |
|                                                      |
|  [Trip Card 3] [Trip Card 4] ...                     |
|                                                      |
+------------------------------------------------------+
| Footer                                               |
+------------------------------------------------------+
```

#### Trip View Layout

```
+------------------------------------------------------+
| Navigation Bar (User is logged in)                   |
+------------------------------------------------------+
| [Interactive Map]      | [Location Timeline]         |
|                        |                             |
|                        | [Location Card Preview 1]   |
|                        | [Location Card Preview 2]   |
|                        | ...                         |
+------------------------------------------------------+
| Footer                                               |
+------------------------------------------------------+
```

#### Location View (Modal)

```
+----------------------------------------+
| Location Name & Date         [Close X] |
+----------------------------------------+
|                                        |
|         [Photo/Video Gallery]          |
|                                        |
+----------------------------------------+
|                                        |
|         [Journal Text Area]            |
|                                        |
+----------------------------------------+
| [Save] [Cancel]                        |
+----------------------------------------+
```


