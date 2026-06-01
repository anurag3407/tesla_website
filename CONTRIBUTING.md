# Contributing to TESLA Technical Club Website

First off, thank you for considering contributing to the TESLA Technical Club website! It's people like you that make our community and club great. 

## 🚀 Getting Started

To contribute to this project, please follow a standard Fork & Pull Request workflow:

### 1. Fork the Repository
Click the **Fork** button at the top right corner of this repository to create your own copy of the project.

### 2. Clone your Fork
Clone the repository to your local machine:
```bash
git clone https://github.com/<your-username>/tesla_website.git
cd tesla_website
```

### 3. Add the Upstream Remote
Keep your fork synced with the original repository by adding it as an upstream remote:
```bash
git remote add upstream https://github.com/anurag3407/tesla_website.git
```

### 4. Create a Branch
Always create a new branch for your feature or bug fix:
```bash
git checkout -b feature/your-feature-name
```
*(Use prefixes like `feature/`, `bugfix/`, or `docs/`)*

### 5. Make your Changes
Write your code, ensuring it follows the project's existing style and architecture (Next.js App Router, Tailwind CSS).

### 6. Commit and Push
Write clear, descriptive commit messages:
```bash
git commit -m "feat: Add dark mode toggle in navbar"
git push origin feature/your-feature-name
```

## 📸 Pull Request Guidelines

When you are ready, open a Pull Request (PR) from your fork to the `main` branch of this original repository.

**CRITICAL GUIDELINES FOR PRs:**
1. **Descriptive Title**: Clearly state what the PR does.
2. **Add Screenshots/Videos**: If your PR includes ANY UI/Frontend changes, you **MUST** attach screenshots or a screen recording showing the before and after (or the new feature). PRs with UI changes lacking screenshots may be delayed or rejected.
3. **Reference Issues**: If your PR fixes an open issue, link it in the description (e.g., `Fixes #12`).
4. **Clean Code**: Ensure there are no TypeScript or ESLint errors (`npm run build` should pass).

## 💻 Tech Stack Refresher
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, Vanilla CSS (`globals.css`), Framer Motion
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT & Custom Middleware
- **Icons**: Lucide React

We look forward to reviewing your contributions! Let's build something amazing together. 🚀
