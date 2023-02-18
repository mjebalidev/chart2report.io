var ghpages = require("gh-pages");

ghpages.publish(
  "public", // path to public directory
  {
    branch: "gh-pages",
    repo: "https://github.com/mjebalidev/chart2report.io.git", // Update to point to your repository
    user: {
      name: "MJ", // update to use your name
      email: "mjebali.dev@gmail.com", // Update to use your email
    },
  },
  () => {
    console.log("Deploy Complete!");
  }
);
