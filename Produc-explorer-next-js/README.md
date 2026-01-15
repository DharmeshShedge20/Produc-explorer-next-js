Tech Stack

Framework: Next.js (App Router)
Language: TypeScript
Styling: Tailwind CSS
Icons: Material UI Icons
State Management: React Hooks + localStorage

 Features Implemented
1. Product Listing Page
Fetches products from Fake Store API
Displays products in a responsive grid
Each card shows:
Image Title Price Category
Handles: Loading state Error state Empty state

Search & Filtering
Client-side search by product title
Category-based filtering
Combined filters (search + category + favorites)
Sorting by price:
Low → High
High → Low

Product Details Page
Dynamic routing using /products/[id]
Displays:
Large product image
Title Description Price Category
Navigation back to product list
Fully responsive layout

Users can mark/unmark products as favorites
Dark Mode (Bonus)
Responsive Design

To stat application
clone the repository and install dependencies (npm i)
npm run dev   

it will start app