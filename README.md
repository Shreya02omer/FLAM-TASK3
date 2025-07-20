# Event Calendar App – FLAM Task 3

This is a complete **Event Calendar** project made with **ReactJS**, featuring full CRUD operations, drag-and-drop functionality, and persistent storage using `localStorage`. Users can create, move, and delete events easily on a dynamic calendar view.

---

## Tech Stack

- React JS (with Create React App)
- react-beautiful-dnd (for drag-and-drop)
- date-fns (for date manipulation)
- uuid (for generating unique IDs)
- gh-pages (for deployment)

---

## 📦 Installation & Setup

1. **Create React App:**

```bash
npx create-react-app flam-task3
cd flam-task3

2.**Install Dependencies**

```bash
npm install react-beautiful-dnd date-fns uuid
npm install gh-pages --save-dev

---

## Tasks Completed
✅ Calendar layout created
The calendar dynamically renders the days of the selected month using date-fns. Each day is clickable and interactive.

✅ Events can be created
A form pops up when a day is clicked, allowing the user to add an event with a title and description. Each event is saved with a unique ID.

✅ Events can be deleted
Every event card includes a delete button. Clicking it removes the event from the calendar and updates the localStorage.

✅ Events can be moved using drag-and-drop
Using react-beautiful-dnd, users can drag events from one day and drop them onto another. The UI updates in real-time and reflects the new date.

✅ Data saved in localStorage
All created events are stored in the browser’s localStorage. Even if the user refreshes or closes the tab, the events remain.

✅ App deployed to GitHub Pages
The final build was deployed using gh-pages, making the project live and accessible via a public URL.

---

## Github integration
git init
git remote add origin https://github.com/Shreya02omer/FLAM-TASK3.git
git add .
git commit -m "Initial commit"
git push -u origin main

---

## Update package.json
"homepage": "https://Shreya02omer.github.io/FLAM-TASK3",
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

---

 ## Deployment on GitHub Pages
 npm run build
 npm run deploy


📍Live Project URL: https://Shreya02omer.github.io/FLAM-TASK3

