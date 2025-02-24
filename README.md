# hearts-and-paws
Development Workflow

Before implementing a new feature, follow these steps:

Create a New Branch

Always create a new branch from dev before starting any new feature.

Use the following command:

git checkout dev
git pull origin dev
git checkout -b feature-branch-name

Implement Your Changes

Work on your feature in the new branch.

Make sure to test your changes locally.

Commit and Push

Once done, commit your changes:

git add .
git commit -m "Implemented new feature"
git push origin feature-branch-name

Create a Pull Request (PR)

Open a PR to merge your changes into dev.

Add a meaningful description of the changes.

Request reviews from the team.

Local Development Setup

Follow these steps to set up the project locally:

Clone the Repository

git clone <repo-url>
cd hearts-and-paws

Install Dependencies

npm install

Run the Development Server

npm run dev

The project should now be running at http://localhost:3000.

Additional Notes

Always pull the latest changes from dev before starting a new feature.

Ensure all code follows the project's linting and formatting rules.

Write meaningful commit messages and PR descriptions.

